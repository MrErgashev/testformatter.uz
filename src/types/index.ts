export interface ParsedAnswer {
  letter: string;
  text: string;
  isCorrect: boolean;
}

export interface ParsedQuestion {
  number: number;
  text: string;
  answers: ParsedAnswer[];
}

export interface ParseError {
  line: number;
  message: string;
}

export interface ParseResult {
  questions: ParsedQuestion[];
  errors: ParseError[];
}

export interface ConversionRecord {
  id: string;
  fileName: string;
  questionCount: number;
  outputFormat: OutputFormat;
  timestamp: number;
}

export type OutputFormat = 'hemis' | 'kahoot';
export type Language = 'uz' | 'ru' | 'en';
export type Theme = 'light' | 'dark';
