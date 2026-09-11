export const normalizeEmail = (value: unknown) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

export const normalizePhoneNumber = (value: unknown) => {
  if (typeof value !== 'string') return '';
  const compact = value.trim().replace(/[\s()-]/g, '');
  const normalized = /^\d{8}$/.test(compact) ? `+976${compact}` : compact;
  return /^\+[1-9]\d{7,14}$/.test(normalized) ? normalized : '';
};

export const readClassName = (value: unknown) =>
  typeof value === 'string' && value.trim().length >= 1 && value.trim().length <= 80
    ? value.trim()
    : '';

export const readName = (value: unknown) =>
  typeof value === 'string' && value.trim().length >= 2 && value.trim().length <= 100
    ? value.trim()
    : '';

export const readPassword = (value: unknown) =>
  typeof value === 'string' && value.length >= 8 && value.length <= 128 ? value : '';

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
