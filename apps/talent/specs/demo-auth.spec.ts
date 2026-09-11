/** @jest-environment node */

const originalDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE;

jest.mock('../src/components/TeacherDashboard', () => ({ TeacherDashboard: () => null }));
jest.mock('../src/components/StudentAssignments', () => ({ StudentAssignments: () => null }));
jest.mock('../src/components/DemoRoleGuard', () => ({ DemoRoleGuard: () => null }));
jest.mock('../src/components/DemoRoleSwitcher', () => ({ DemoRoleSwitcher: () => null }));
jest.mock('../src/components/LogoutButton', () => ({ LogoutButton: () => null }));
jest.mock('next/navigation', () => ({ redirect: (url: string) => { throw new Error(`redirect:${url}`); } }));

afterEach(() => {
  if (originalDemoMode === undefined) delete process.env.NEXT_PUBLIC_DEMO_MODE;
  else process.env.NEXT_PUBLIC_DEMO_MODE = originalDemoMode;
});

for (const role of ['teacher', 'student'] as const) {
  const loadPage = () => role === 'teacher'
    ? import('../src/app/teacher/page')
    : import('../src/app/student/page');

  it(`${role} demo does not evaluate the session module`, async () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true';
    await jest.isolateModulesAsync(async () => {
      jest.doMock('../src/lib/session', () => { throw new Error('Real session loaded'); });
      const { default: Page } = await loadPage();
      await expect(Page()).resolves.toBeTruthy();
    });
  });

  it.each([null, { role: role === 'teacher' ? 'STUDENT' : 'TEACHER' }])(
    `${role} real mode rejects an absent or wrong-role user (%j)`, async (user) => {
      process.env.NEXT_PUBLIC_DEMO_MODE = 'false';
      await jest.isolateModulesAsync(async () => {
        const getCurrentUser = jest.fn().mockResolvedValue(user);
        jest.doMock('../src/lib/session', () => ({ getCurrentUser }));
        const { default: Page } = await loadPage();
        await expect(Page()).rejects.toThrow('redirect:/login');
        expect(getCurrentUser).toHaveBeenCalledTimes(1);
      });
    },
  );
}
