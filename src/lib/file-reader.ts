import mammoth from 'mammoth';

export async function readFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'txt') {
    return file.text();
  }

  if (ext === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  if (ext === 'doc') {
    // Try reading as text fallback
    const text = await file.text();
    if (text && !text.includes('\0')) return text;
    throw new Error('DOC_NOT_SUPPORTED');
  }

  throw new Error('UNSUPPORTED_FORMAT');
}
