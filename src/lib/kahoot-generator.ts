import ExcelJS from 'exceljs';
import type { ParsedQuestion } from '../types';

export async function generateKahoot(questions: ParsedQuestion[]): Promise<Blob> {
  const response = await fetch('/templates/KahootQuizTemplate.xlsx');
  const templateBuffer = await response.arrayBuffer();

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(templateBuffer);

  const ws = wb.getWorksheet('Sheet1') ?? wb.worksheets[0];

  // Clear existing example data (rows 9+)
  const lastRow = ws.rowCount;
  for (let r = lastRow; r >= 9; r--) {
    ws.spliceRows(r, 1);
  }

  // Style references from the template
  const colAStyle: Partial<ExcelJS.Style> = {
    font: { name: 'Montserrat', size: 12, bold: false, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF461A8F' } },
  };

  const dataCellStyle: Partial<ExcelJS.Style> = {
    font: { name: 'Montserrat', size: 12, bold: false },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
    alignment: { wrapText: true },
  };

  // Fill in questions starting at row 9
  for (const question of questions) {
    const answers = question.answers;
    const correctIndices: number[] = [];
    answers.forEach((a, i) => {
      if (a.isCorrect) correctIndices.push(i + 1);
    });

    const row = ws.addRow([
      question.number,
      question.text.substring(0, 120),
      answers[0]?.text.substring(0, 75) ?? '',
      answers[1]?.text.substring(0, 75) ?? '',
      answers[2]?.text.substring(0, 75) ?? '',
      answers[3]?.text.substring(0, 75) ?? '',
      60,
      correctIndices.join(','),
    ]);

    // Apply column A style (purple bg, white text)
    const cellA = row.getCell(1);
    cellA.font = colAStyle.font!;
    cellA.fill = colAStyle.fill as ExcelJS.Fill;

    // Apply data cell style (columns B-H)
    for (let col = 2; col <= 8; col++) {
      const cell = row.getCell(col);
      cell.font = dataCellStyle.font!;
      cell.fill = dataCellStyle.fill as ExcelJS.Fill;
      cell.alignment = dataCellStyle.alignment!;
    }

    row.height = 32;
  }

  const buffer = await wb.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
