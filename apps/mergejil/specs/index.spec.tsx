import React from 'react';
import { render } from '@testing-library/react';
import Page from '../src/app/page';
import { AuthProvider } from '../src/lib/auth';

// Хуудас app router-ийн hook-уудыг ашигладаг тул jsdom дээр орлуулна.
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AuthProvider>
        <Page />
      </AuthProvider>,
    );
    expect(baseElement).toBeTruthy();
  });
});
