import { NextResponse } from 'next/server';
import { deleteSession, getBearerToken } from '@/lib/auth/session';

export async function POST(request: Request) {
  const token = getBearerToken(request);
  if (token) {
    await deleteSession(token);
  }
  return NextResponse.json({ ok: true });
}
