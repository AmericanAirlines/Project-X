import React from 'react';

import { render, screen, waitFor } from '../../testUtils/testTools';
import { getMock } from '../../testUtils/getMock';
import { AppLayout } from '../../../src/components/Layout';
import Community from '../../../src/pages/app/community';

jest.mock('../../../src/components/Layout/AppLayout.tsx');
getMock(AppLayout).mockImplementation(({ children }) => <>{children}</>);

describe('community page', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('renders', async () => {
    expect(() => render(<Community />)).not.toThrow();

    expect(screen.getByText('Community')).toBeVisible();

    // Check that the Community Guidelines section is displayed by default
    await waitFor(() => expect(screen.getByText('Be respectful.')).toBeVisible());

    expect(
      screen.queryByText('Remember to follow the Community Guidelines listed above.'),
    ).not.toBeVisible();
    expect(screen.queryByText('Should I change my Discord profile avatar?')).not.toBeVisible();
    expect(screen.queryByText('Join our Discord')).toBeVisible();
    expect(screen.queryByText('Join our Discord')).toHaveAttribute('href', 'https://discord.gg');
    expect(screen.queryByText('here')).toHaveAttribute('href', '/api/auth/discord/login');
  });
});
