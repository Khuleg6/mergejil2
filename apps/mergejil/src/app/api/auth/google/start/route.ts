import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/lib/auth/google';

const STATE_COOKIE = 'g_oauth_state';

export async function GET(request: Request) {
  const state = randomBytes(16).toString('hex');

  let authUrl: string;
  try {
    authUrl = getGoogleAuthUrl(state);
  } catch (err) {
    console.error('Google OAuth not configured:', err);
    const loginUrl = new URL('/Login', request.url);
    loginUrl.searchParams.set(
      'error',
      'Google нэвтрэлт тохируулагдаагүй байна.',
    );
    return NextResponse.redirect(loginUrl);
  }

  const res = NextResponse.redirect(authUrl);
  res.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 5 * 60,
    path: '/',
  });
  return res;
}
