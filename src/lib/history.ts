import type { ConversionRecord, OutputFormat } from '../types';

const STORAGE_KEY = 'testformatter_history';

export function getHistory(): ConversionRecord[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addToHistory(
  fileName: string,
  questionCount: number,
  outputFormat: OutputFormat,
): ConversionRecord {
  const record: ConversionRecord = {
    id: crypto.randomUUID(),
    fileName,
    questionCount,
    outputFormat,
    timestamp: Date.now(),
  };
  const history = [record, ...getHistory()].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return record;
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
