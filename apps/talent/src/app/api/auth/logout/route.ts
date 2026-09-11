import { jsonSuccess } from '@/lib/http';

export async function POST() {
  const { clearSession } = await import('@/lib/session');
  await clearSession();
  return jsonSuccess({ loggedOut: true });
}
