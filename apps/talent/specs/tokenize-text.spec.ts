import { tokenizeText } from '../src/lib/tokenize-text';

describe('tokenizeText', () => {
  it('preserves punctuation, whitespace, and line breaks exactly', () => {
    const text = 'Сайн байна уу?\nHello, world!';
    expect(tokenizeText(text).map((token) => token.text).join('')).toBe(text);
  });

  it('gives repeated occurrences distinct character positions', () => {
    const text = 'Нохой хурдан гүйв. Дараа нь нохой унтав.';
    const dogs = tokenizeText(text).filter((token) => token.text.toLocaleLowerCase() === 'нохой');
    expect(dogs).toHaveLength(2);
    expect(dogs[0].start).toBe(0);
    expect(dogs[1].start).toBe(text.lastIndexOf('нохой'));
  });
});
