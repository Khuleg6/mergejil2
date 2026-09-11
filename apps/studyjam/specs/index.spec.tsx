import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '../src/lib/auth';
import Page from '../src/app/page';

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
