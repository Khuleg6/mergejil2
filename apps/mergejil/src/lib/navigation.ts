export const ASSESSMENT_PATH = '/career-assessment';
export const LOGIN_PATH = '/Login';

/** Where Google OAuth stores the page the user was heading to. */
export const NEXT_KEY = 'mergejil.next';

/**
 * Login/бүртгэлийн хуудасны href. Нэвтэрсний дараа `next` рүү буцаана.
 * `tab` нь бүртгүүлэх/нэвтрэх аль табыг нээхийг заана.
 */
export function buildLoginHref(
  next: string = ASSESSMENT_PATH,
  tab: 'login' | 'register' = 'register',
) {
  return `${LOGIN_PATH}?tab=${tab}&next=${encodeURIComponent(next)}`;
}

/**
 * `next` query параметрийг цэвэрлэнэ — зөвхөн энэ сайт доторх зам зөвшөөрнө,
 * ингэснээр гадны сайт руу дамжуулах (open redirect) боломжгүй болно.
 */
export function safeNext(
  value: string | null | undefined,
  fallback = ASSESSMENT_PATH,
) {
  if (!value) return fallback;
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  return value;
}
