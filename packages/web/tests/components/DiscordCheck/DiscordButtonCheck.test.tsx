import React from 'react';
import userEvent from '@testing-library/user-event';
import { DiscordButtonCheck } from '../../../src/components/DiscordCheck';
import { UserProfileProps } from '../../../src/components/userprofile/UserProfile';
import { render, screen, waitFor } from '../../testUtils/testTools';

const sampleUser: UserProfileProps['user'] = {
  name: 'Steve Job',
  pronouns: 'he/him',
  schoolName: 'Apple University',
};

describe('Discord Login Button Functionality', () => {
  it('renders join discord button when user has no discord id', () => {
    render(<DiscordButtonCheck user={sampleUser} />);

    expect(screen.queryByText('Join our Discord')).toBeVisible();
    expect(screen.queryByText('Join our Discord')?.getAttribute('href')).toEqual(
      '/api/auth/discord/login',
    );
  });

  it('renders unlink button when user has discord id and unlinks account when clicked', async () => {
    render(<DiscordButtonCheck user={{ ...sampleUser, discordId: '12345' }} />);

    expect(screen.queryByText('Go to Discord')).toBeVisible();

    const unlinkDiscordButton = screen.getByText('Go to Discord');
    userEvent.click(unlinkDiscordButton);

    expect(screen.queryByText('Go to Discord')).toBeVisible();
    expect(screen.queryByText('Go to Discord')).toHaveAttribute('href', 'https://discord.com/');
  });
});
