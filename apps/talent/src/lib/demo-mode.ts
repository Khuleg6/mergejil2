export type DemoRole = 'teacher' | 'student';

const roleKey = 'talent-demo-role';

export const isDemoMode = () => process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const getDemoRole = (): DemoRole | null => {
  if (!isDemoMode() || typeof window === 'undefined') return null;
  const role = window.localStorage.getItem(roleKey);
  return role === 'teacher' || role === 'student' ? role : null;
};

export const setDemoRole = (role: DemoRole) => {
  if (isDemoMode() && typeof window !== 'undefined')
    window.localStorage.setItem(roleKey, role);
};

export const clearDemoRole = () => {
  if (typeof window !== 'undefined') window.localStorage.removeItem(roleKey);
};
