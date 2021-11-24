import React from 'react';
import fetchMock from 'fetch-mock-jest';
import { DiscordButton } from '../../../src/components/DiscordCheck';
import { render, screen, waitFor } from '../../testUtils/testTools';

interface User {
  discordId?: string;
}

const sampleUser: User = {
  discordId: undefined,
};

const sampleUser2: User = {
  discordId: '34523452345',
};

describe('DiscordButton component', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('shows an error message when the user is not found', async () => {
    fetchMock.get('/api/users/me', 500);

    render(<DiscordButton />);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/users/me');
      expect(screen.getByText('User could not be found')).toBeVisible();
    });
  });

  it('renders the Join Discord button when user has no discord id', async () => {
    fetchMock.get('/api/users/me', sampleUser);

    render(<DiscordButton />);

    await waitFor(() => {
      const JoinDiscord = screen.queryByText('Join our Discord');
      expect(fetchMock).toHaveFetched('/api/users/me');

      expect(JoinDiscord).toBeVisible();
      expect(JoinDiscord).toHaveAttribute('href', '/api/auth/discord/login');
    });
  });

  it('renders Go to Discord button when user has a discordId', async () => {
    fetchMock.get('/api/users/me', sampleUser2);

    render(<DiscordButton />);

    await waitFor(() => {
      const GoToDiscord = screen.queryByText('Go to Discord');
      expect(fetchMock).toHaveFetched('/api/users/me');

      expect(GoToDiscord).toBeVisible();
      expect(GoToDiscord).toHaveAttribute('href', 'https://discord.com/');
    });
  });
});
