import React from 'react';
import { render, screen } from '../testUtils/testTools';
import { getMock } from '../testUtils/getMock';
import { MarketingLayout } from '../../src/components/Layout';
import InvalidEmail from '../../src/pages/invalidEmail';

jest.mock('../../src/components/Layout/MarketingLayout.tsx');
getMock(MarketingLayout).mockImplementation(({ children }) => <>{children}</>);

describe('web /invalidEmail', () => {
  it('renders', async () => {
    expect(() => render(<InvalidEmail />)).not.toThrow();

    expect(screen.queryByText('Error: Make sure you have a verified ".edu" email linked with your GitHub account!')).toBeVisible();
    expect(screen.queryByText("Try again once you've verified your student email address 👇")).toBeVisible();
    expect(screen.queryByText('Login with GitHub')).toBeVisible();
    expect(screen.queryByText('Login with GitHub')).toHaveAttribute('href', '/api/auth/github/login');
    expect(screen.queryByText('Click this button if you want to go back to the homepage 👇')).toBeVisible();
    expect(screen.queryByText('Home Page')).toBeVisible();
    expect(screen.queryByText('Home Page')).toHaveAttribute('href', '/');

  });


});
