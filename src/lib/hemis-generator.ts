import type { ParsedQuestion } from '../types';

export function generateHemis(questions: ParsedQuestion[]): string {
  const blocks: string[] = [];

  for (const question of questions) {
    const lines: string[] = [];

    // Question text without the number
    lines.push(question.text);

    for (const answer of question.answers) {
      lines.push('=====');
      if (answer.isCorrect) {
        lines.push(`  #${answer.text}`);
      } else {
        lines.push(`  ${answer.text}`);
      }
    }

    lines.push('');
    lines.push('+++++');
    lines.push('');
    lines.push('');
    lines.push('');
    blocks.push(lines.join('\n'));
  }

  return blocks.join('');
}
