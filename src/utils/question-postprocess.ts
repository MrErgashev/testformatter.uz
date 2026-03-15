import type { ParsedAnswer, ParsedQuestion, ParseError, ParseResult } from '../types';

export interface PostprocessResult {
  result: ParseResult;
  splitCount: number;
}

/**
 * Detects indices where answer letters reset (duplicate letter appears),
 * indicating merged questions.
 */
function findSplitPoints(answers: ParsedAnswer[]): number[] {
  const splits: number[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < answers.length; i++) {
    if (seen.has(answers[i].letter)) {
      splits.push(i);
      seen.clear();
    }
    seen.add(answers[i].letter);
  }

  return splits;
}

/**
 * Tries to extract an embedded question number+text from an answer's text.
 * E.g. "Albert M.101. Mehmonlar..." → { cleanedAnswer: "Albert M.", questionNumber: 101, questionText: "Mehmonlar..." }
 *
 * Only matches numbers in the expected range to avoid false positives
 * (e.g. "1991. yil" should not match).
 */
function extractEmbeddedQuestion(
  answerText: string,
  expectedMinNumber: number,
): { cleanedAnswerText: string; questionNumber: number; questionText: string } | null {
  const regex = /(\d+)\s*[.)]\s*/g;
  let match;

  while ((match = regex.exec(answerText)) !== null) {
    const num = parseInt(match[1], 10);
    // Only accept if the number is plausibly the next question (within +5 range)
    if (num >= expectedMinNumber && num <= expectedMinNumber + 5) {
      const cleanedAnswer = answerText.substring(0, match.index).trim();
      const questionText = answerText.substring(match.index + match[0].length).trim();
      return { cleanedAnswerText: cleanedAnswer, questionNumber: num, questionText };
    }
  }

  return null;
}

/**
 * Splits a single question with merged answers into multiple questions.
 * Returns the array of split questions.
 */
function splitQuestion(question: ParsedQuestion): ParsedQuestion[] {
  const splitPoints = findSplitPoints(question.answers);

  if (splitPoints.length === 0) {
    return [question];
  }

  const result: ParsedQuestion[] = [];
  let remainingAnswers = [...question.answers];
  let currentQ: ParsedQuestion = { ...question, answers: [] };

  // Process splits from first to last
  for (const splitIdx of splitPoints) {
    // Adjust index relative to remaining answers
    const relativeIdx = splitIdx - (question.answers.length - remainingAnswers.length);

    // Answers before the split belong to the current question
    const beforeSplit = remainingAnswers.slice(0, relativeIdx);
    const afterSplit = remainingAnswers.slice(relativeIdx);

    // Check last answer before split for embedded question number
    const lastAnswer = beforeSplit[beforeSplit.length - 1];
    const extracted = lastAnswer
      ? extractEmbeddedQuestion(lastAnswer.text, currentQ.number + 1)
      : null;

    if (extracted) {
      // Fix the last answer text (remove embedded question part)
      beforeSplit[beforeSplit.length - 1] = {
        ...lastAnswer,
        text: extracted.cleanedAnswerText || lastAnswer.text,
      };

      currentQ.answers = beforeSplit;
      result.push(currentQ);

      // Create new question from embedded text
      currentQ = {
        number: extracted.questionNumber,
        text: extracted.questionText,
        answers: [],
      };
    } else {
      // No embedded question found — still split, use inferred number
      currentQ.answers = beforeSplit;
      result.push(currentQ);

      currentQ = {
        number: currentQ.number + 1,
        text: '',
        answers: [],
      };
    }

    remainingAnswers = afterSplit;
  }

  // Assign remaining answers to the last question
  currentQ.answers = remainingAnswers;
  result.push(currentQ);

  return result;
}

/**
 * Re-validates questions after splitting, rebuilding parser-level errors.
 */
function revalidateErrors(
  questions: ParsedQuestion[],
  originalErrors: ParseError[],
  affectedNumbers: Set<number>,
  newQuestionNumbers: Set<number>,
): ParseError[] {
  // Keep errors for unaffected questions
  const kept = originalErrors.filter((e) => !affectedNumbers.has(e.questionNumber));

  // Re-validate all affected and new questions
  const numbersToValidate = new Set([...affectedNumbers, ...newQuestionNumbers]);

  for (const q of questions) {
    if (!numbersToValidate.has(q.number)) continue;

    if (q.answers.length < 2) {
      kept.push({
        questionNumber: q.number,
        type: 'few_answers',
        message: `Question ${q.number}: needs at least 2 answers (found ${q.answers.length})`,
        count: q.answers.length,
      });
    }

    if (!q.answers.some((a) => a.isCorrect)) {
      kept.push({
        questionNumber: q.number,
        type: 'no_correct',
        message: `Question ${q.number}: no correct answer marked`,
      });
    }
  }

  return kept;
}

/**
 * Post-processes the parse result to detect and split merged questions.
 * This handles cases where mammoth docx→text conversion loses line breaks
 * between answers and subsequent question numbers.
 */
export function postprocessParseResult(raw: ParseResult): PostprocessResult {
  const newQuestions: ParsedQuestion[] = [];
  const affectedNumbers = new Set<number>();
  const newQuestionNumbers = new Set<number>();
  let splitCount = 0;

  for (const question of raw.questions) {
    const splitResults = splitQuestion(question);

    if (splitResults.length > 1) {
      // Question was split
      splitCount += splitResults.length - 1;
      affectedNumbers.add(question.number);

      for (const sq of splitResults) {
        // Check for duplicate question number
        const exists = newQuestions.some((q) => q.number === sq.number);
        if (!exists) {
          newQuestions.push(sq);
          if (sq.number !== question.number) {
            newQuestionNumbers.add(sq.number);
          }
        }
      }
    } else {
      newQuestions.push(question);
    }
  }

  // Sort questions by number
  newQuestions.sort((a, b) => a.number - b.number);

  // Re-validate errors if any splits occurred
  const errors =
    splitCount > 0
      ? revalidateErrors(newQuestions, raw.errors, affectedNumbers, newQuestionNumbers)
      : [...raw.errors];

  return {
    result: { questions: newQuestions, errors },
    splitCount,
  };
}
