import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/session';
import { awardPlacementPoints, type PlacementInput } from '@/lib/points/placement';

interface RouteParams {
  params: Promise<{ id: string }>;
}

function parseResults(body: unknown): PlacementInput[] | null {
  if (!body || typeof body !== 'object' || !Array.isArray((body as { results?: unknown }).results)) {
    return null;
  }
  const results = (body as { results: unknown[] }).results;
  const parsed: PlacementInput[] = [];
  for (const entry of results) {
    if (
      !entry ||
      typeof entry !== 'object' ||
      typeof (entry as { userId?: unknown }).userId !== 'string' ||
      typeof (entry as { rank?: unknown }).rank !== 'number' ||
      typeof (entry as { score?: unknown }).score !== 'number'
    ) {
      return null;
    }
    const e = entry as { userId: string; rank: number; score: number };
    parsed.push({ userId: e.userId, rank: e.rank, score: e.score });
  }
  return parsed;
}

// NOTE: this only checks that *someone* is logged in — there is no
// game-session/host model yet to verify the caller actually ran this game.
// Once the live game server exists, restrict this to that host/service.
export async function POST(request: Request, { params }: RouteParams) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Нэвтрээгүй байна.' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const results = parseResults(body);
  if (!results) {
    return NextResponse.json(
      { error: 'results: [{ userId, rank, score }] шаардлагатай.' },
      { status: 400 },
    );
  }

  const payouts = await awardPlacementPoints(id, results);
  return NextResponse.json({ results: payouts });
}
