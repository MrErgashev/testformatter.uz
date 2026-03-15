const ANSWER_LINE_REGEX = /^\s*\*?\s*[a-zA-Z]\s*[.)]/;
const NUMBERED_QUESTION_REGEX = /^\s*\d+\s*[.)]\s*.+/;

/**
 * Detects whether the text contains unnumbered questions
 * (answer blocks exist but no numbered question lines).
 */
export function detectUnnumberedQuestions(text: string): boolean {
  const lines = text.split(/\r?\n/);

  // If any line already matches a numbered question, it's numbered
  if (lines.some((line) => NUMBERED_QUESTION_REGEX.test(line))) {
    return false;
  }

  // Check if there are answer-like lines (indicating test structure exists)
  const answerLineCount = lines.filter((line) =>
    ANSWER_LINE_REGEX.test(line.trim()),
  ).length;

  // Need at least 2 answer lines to consider it a test with unnumbered questions
  return answerLineCount >= 2;
}

/**
 * Auto-numbers unnumbered questions by detecting answer blocks
 * and walking backwards to find their question lines.
 */
export function autoNumberQuestions(text: string): string {
  const lines = text.split(/\r?\n/);

  // Step 1: If already numbered, return unchanged
  if (lines.some((line) => NUMBERED_QUESTION_REGEX.test(line))) {
    return text;
  }

  // Step 2: Classify each line
  const isAnswer = lines.map((line) => ANSWER_LINE_REGEX.test(line.trim()));
  const isBlank = lines.map((line) => line.trim() === '');

  // Step 3: Find question start lines by walking backwards from answer blocks
  const questionStartLines = new Set<number>();
  let i = 0;

  while (i < lines.length) {
    if (isAnswer[i]) {
      // Found start of an answer block — walk backward to find the question
      let j = i - 1;

      // Skip blank lines
      while (j >= 0 && isBlank[j]) j--;

      // Collect non-blank, non-answer lines (multi-line question support)
      let questionFirstLine = j;
      while (
        questionFirstLine > 0 &&
        !isBlank[questionFirstLine - 1] &&
        !isAnswer[questionFirstLine - 1]
      ) {
        questionFirstLine--;
      }

      if (
        questionFirstLine >= 0 &&
        !isAnswer[questionFirstLine] &&
        !isBlank[questionFirstLine]
      ) {
        questionStartLines.add(questionFirstLine);
      }

      // Skip past the entire answer block
      while (i < lines.length && isAnswer[i]) i++;
    } else {
      i++;
    }
  }

  // Step 4: If no questions found, return unchanged
  if (questionStartLines.size === 0) {
    return text;
  }

  // Step 5: Insert numbering in order
  const sortedIndices = Array.from(questionStartLines).sort((a, b) => a - b);
  const newLines = [...lines];
  let counter = 1;

  for (const idx of sortedIndices) {
    newLines[idx] = `${counter}. ${lines[idx].trimStart()}`;
    counter++;
  }

  return newLines.join('\n');
}
