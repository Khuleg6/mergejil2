import { NextResponse } from 'next/server';
import { fetchGoogleProfile } from '@/lib/auth/google';
import { createSession, findUserForGoogleLogin } from '@/lib/auth/session';

const STATE_COOKIE = 'g_oauth_state';

function appUrl(path: string): string {
  const base = process.env.APP_URL ?? 'http://localhost:3000';
  return new URL(path, base).toString();
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expectedState = request.headers
    .get('cookie')
    ?.match(new RegExp(`${STATE_COOKIE}=([^;]+)`))?.[1];

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(
      appUrl('/Login?error=' + encodeURIComponent('Google нэвтрэлт амжилтгүй боллоо.')),
    );
  }

  try {
    const profile = await fetchGoogleProfile(code);
    const user = await findUserForGoogleLogin(profile);
    if (!user) {
      return NextResponse.redirect(
        appUrl(
          '/Login?error=' +
            encodeURIComponent(
              'Энэ и-мэйл хаягаар бүртгэл байхгүй байна. Эхлээд бүртгүүлнэ үү.',
            ),
        ),
      );
    }

    const token = await createSession(user.id);

    // The token rides in the URL fragment (not a query param) so it never
    // reaches server access logs or gets sent in a Referer header.
    const res = NextResponse.redirect(
      appUrl(`/auth/callback#token=${encodeURIComponent(token)}`),
    );
    res.cookies.delete(STATE_COOKIE);
    return res;
  } catch (err) {
    console.error('Google OAuth callback failed:', err);
    return NextResponse.redirect(
      appUrl('/Login?error=' + encodeURIComponent('Google нэвтрэлт амжилтгүй боллоо.')),
    );
  }
}
