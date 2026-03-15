import type { ParsedAnswer, ParsedQuestion, ParseError, ParseResult } from '../types';

const QUESTION_REGEX = /^\s*(\d+)\s*[.)]\s*(.+)/;
const ANSWER_REGEX = /^\s*(\*?)\s*([a-zA-Z])\s*[.)]\s*(.+)/;

export function parseTestText(text: string): ParseResult {
  const lines = text.split(/\r?\n/);
  const questions: ParsedQuestion[] = [];
  const errors: ParseError[] = [];

  let currentQuestion: ParsedQuestion | null = null;
  let currentAnswers: ParsedAnswer[] = [];

  function finalizeQuestion() {
    if (!currentQuestion) return;

    currentQuestion.answers = currentAnswers;

    if (currentAnswers.length < 2) {
      errors.push({
        questionNumber: currentQuestion.number,
        type: 'few_answers',
        message: `Question ${currentQuestion.number}: needs at least 2 answers (found ${currentAnswers.length})`,
        count: currentAnswers.length,
      });
    }

    const hasCorrect = currentAnswers.some((a) => a.isCorrect);
    if (!hasCorrect) {
      errors.push({
        questionNumber: currentQuestion.number,
        type: 'no_correct',
        message: `Question ${currentQuestion.number}: no correct answer marked`,
      });
    }

    questions.push(currentQuestion);
    currentQuestion = null;
    currentAnswers = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const trimmed = line.trim();

    if (trimmed === '') continue;

    // Try matching answer first (so lines like "a) ..." inside a question are caught)
    const answerMatch = trimmed.match(ANSWER_REGEX);
    if (answerMatch && currentQuestion) {
      currentAnswers.push({
        letter: answerMatch[2].toLowerCase(),
        text: answerMatch[3].trim(),
        isCorrect: answerMatch[1] === '*',
      });
      continue;
    }

    // Try matching question
    const questionMatch = trimmed.match(QUESTION_REGEX);
    if (questionMatch) {
      // Check if this might actually be an answer line that matched the question regex
      // e.g. "1. something" could be a question, but we should prioritize answer pattern
      finalizeQuestion();

      currentQuestion = {
        number: parseInt(questionMatch[1], 10),
        text: questionMatch[2].trim(),
        answers: [],
      };
      currentAnswers = [];
      continue;
    }

    // If we have a current question and this line is neither a new question nor an answer,
    // append it to the current question text (multi-line question support)
    if (currentQuestion && currentAnswers.length === 0) {
      currentQuestion.text += ' ' + trimmed;
      continue;
    }

    // Line doesn't match anything meaningful
    if (!currentQuestion) {
      errors.push({
        questionNumber: 0,
        type: 'unexpected_text',
        message: `Unexpected text: "${trimmed.substring(0, 50)}"`,
      });
    }
  }

  // Finalize the last question
  finalizeQuestion();

  return { questions, errors };
}
