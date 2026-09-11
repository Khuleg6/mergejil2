import type { User } from './types';

interface AuthResponse {
  token: string;
  user: User;
}

async function postAuth(path: string, body: unknown): Promise<AuthResponse> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error ?? 'Тодорхойгүй алдаа гарлаа.');
  }
  return data as AuthResponse;
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return postAuth('/api/auth/login', { email, password });
}

export function signup(
  fullName: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  return postAuth('/api/auth/signup', { fullName, email, password });
}

export async function requestPasswordReset(email: string): Promise<void> {
  const res = await fetch('/api/auth/password-reset/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error ?? 'Тодорхойгүй алдаа гарлаа.');
  }
}

export function confirmPasswordReset(
  email: string,
  code: string,
  newPassword: string,
): Promise<AuthResponse> {
  return postAuth('/api/auth/password-reset/confirm', {
    email,
    code,
    newPassword,
  });
}
