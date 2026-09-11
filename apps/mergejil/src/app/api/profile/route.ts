import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireUser } from '@/lib/auth/requireUser';
import { MODULE_CODES } from '@/lib/careerProfile';
import {
  loadLatestResults,
  loadStoredProfile,
} from '@/lib/careerProfileService';

/**
 * Хэрэглэгчийн хадгалагдсан AI карьерийн профайл болон ямар тест дууссаныг
 * буцаана. Профайл байхгүй бол `profile: null` — клиент талаас үүсгүүлнэ.
 */
export async function GET(request: Request) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;

  const db = getDb();
  const { sessionId, results } = await loadLatestResults(db, auth.user.id);
  const completed = MODULE_CODES.filter((code) => Boolean(results[code]));
  const profile = sessionId ? await loadStoredProfile(db, sessionId) : null;

  return NextResponse.json({
    sessionId,
    completedModules: completed,
    missingModules: MODULE_CODES.filter((code) => !completed.includes(code)),
    profile,
  });
}
