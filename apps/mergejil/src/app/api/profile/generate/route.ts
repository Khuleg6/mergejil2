import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireUser } from '@/lib/auth/requireUser';
import { GeminiError } from '@/lib/gemini';
import { MODULE_CODES } from '@/lib/careerProfile';
import {
  generateCareerProfile,
  loadLatestResults,
  loadStoredProfile,
  saveProfile,
} from '@/lib/careerProfileService';

// Хоёр дараалсан Gemini дуудалт (тус бүр ихдээ ~1 удаа, ~10 сек дотор дахин
// оролддог) ердийн тохиолдолд 90 секундэд багтдаг. Vercel-ийн план 120
// секундийг дэмжихгүй бол автоматаар өөрийн дээд хязгаараа ашиглана.
export const maxDuration = 120;

/**
 * Гурван тестийн үр дүнд тулгуурлан Gemini-ээр карьерийн профайл үүсгэж
 * хадгална. `force` тугтай бол хадгалагдсан профайлыг дахин үүсгэнэ.
 */
export async function POST(request: Request) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  const force = body?.force === true;

  const db = getDb();
  const { sessionId, results } = await loadLatestResults(db, auth.user.id);
  const missing = MODULE_CODES.filter((code) => !results[code]);

  if (!sessionId || missing.length) {
    return NextResponse.json(
      {
        error: 'Профайл үүсгэхийн тулд гурван тестийг бүрэн дуусгах шаардлагатай.',
        missingModules: missing,
      },
      { status: 409 },
    );
  }

  if (!force) {
    const existing = await loadStoredProfile(db, sessionId);
    if (existing) return NextResponse.json({ profile: existing, cached: true });
  }

  try {
    const profile = await generateCareerProfile({
      results,
      userName: auth.user.fullName ?? auth.user.email,
    });
    await saveProfile(db, sessionId, profile);
    return NextResponse.json({ profile, cached: false });
  } catch (error) {
    if (error instanceof GeminiError) {
      console.error('Gemini profile generation failed:', error.message);
      return NextResponse.json(
        { error: `AI профайл үүсгэхэд алдаа гарлаа: ${error.message}` },
        // 4xx-ыг клиентэд дамжуулж, бусдыг 502 болгоно.
        { status: error.status >= 400 && error.status < 500 ? error.status : 502 },
      );
    }
    console.error('Profile generation failed:', error);
    return NextResponse.json(
      { error: 'AI профайл үүсгэхэд алдаа гарлаа.' },
      { status: 500 },
    );
  }
}
