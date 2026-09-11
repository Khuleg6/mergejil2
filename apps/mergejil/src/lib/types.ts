// Public-facing user shape returned by the API — never includes passwordHash.
export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  isDemo: boolean;
  emailVerified: boolean;
  createdAt: string;
}
