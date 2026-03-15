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

export type ParseErrorType = 'few_answers' | 'no_correct' | 'unexpected_text';

export interface ParseError {
  questionNumber: number;
  type: ParseErrorType;
  message: string;
  count?: number;
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
