import { NextResponse } from 'next/server';

export const jsonError = (message: string, status: number) =>
  NextResponse.json({ ok: false, error: { message } }, { status });

export const jsonSuccess = <T>(data: T, status = 200) =>
  NextResponse.json({ ok: true, data }, { status });

export const readJsonObject = async (request: Request) => {
  try {
    const value: unknown = await request.json();
    return value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
};
