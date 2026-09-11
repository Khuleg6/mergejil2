export type TextToken = { text: string; start: number; selectable: boolean };

const wordPattern = /[\p{L}\p{M}\p{N}]+(?:['’-][\p{L}\p{M}\p{N}]+)*/gu;

export const tokenizeText = (text: string): TextToken[] => {
  const tokens: TextToken[] = [];
  let cursor = 0;
  for (const match of text.matchAll(wordPattern)) {
    const start = match.index;
    if (start > cursor) tokens.push({ text: text.slice(cursor, start), start: cursor, selectable: false });
    tokens.push({ text: match[0], start, selectable: true });
    cursor = start + match[0].length;
  }
  if (cursor < text.length) tokens.push({ text: text.slice(cursor), start: cursor, selectable: false });
  return tokens;
};
