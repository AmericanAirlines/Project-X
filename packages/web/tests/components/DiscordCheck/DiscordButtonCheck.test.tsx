import React from 'react';
import fetchMock from 'fetch-mock-jest';
import userEvent from '@testing-library/user-event';
import { DiscordButtonCheck } from '../../../src/components/DiscordCheck';
import { UserProfileProps } from '../../../src/components/userprofile/UserProfile';
import { act, render, screen } from '../../testUtils/testTools';
import { AppLayout } from '../../../src/components/Layout';
import { getMock } from '../../testUtils/getMock';

jest.mock('../../../src/components/Layout/AppLayout.tsx');
getMock(AppLayout).mockImplementation(({ children }) => <>{children}</>);

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: '',
    };
  },
}));

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

const sampleUser: UserProfileProps['user'] = {
  name: 'Steve Job',
  pronouns: 'he/him',
  schoolName: 'Apple University',
  discordId: undefined,
};

const sampleUser2: UserProfileProps['user'] = {
  name: 'Steve Job',
  pronouns: undefined,
  schoolName: undefined,
  discordId: '34523452345',
};

const wait = () => new Promise<void>((resolve) => setTimeout(() => resolve(), 0));

describe('Discord Login Button Functionality', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('undefined user', async () => {
    useRouter.mockImplementation(() => ({
      query: undefined,
    }));

    expect(() => render(<DiscordButtonCheck />)).not.toThrow();

    await act(wait);
    expect(screen.getByText('User could not be found'));
  });

  it('renders join discord button when user has no discord id', async () => {
    useRouter.mockImplementation(() => ({
      query: {},
    }));

    fetchMock.get('/api/users/me', sampleUser);

    expect(() => render(<DiscordButtonCheck />)).not.toThrow();
    await act(wait);

    expect(screen.queryByText('Join our Discord')).toBeVisible();

    const goToDiscord = screen.getByText('Join our Discord');
    userEvent.click(goToDiscord);

    expect(screen.queryByText('Join our Discord')).toBeVisible();
    expect(screen.queryByText('Join our Discord')?.getAttribute('href')).toEqual(
      '/api/auth/discord/login',
    );
  });

  it('renders Go to Discord button when user has a discordId', async () => {
    useRouter.mockImplementation(() => ({
      query: {},
    }));

    fetchMock.get('/api/users/me', sampleUser2);

    expect(() => render(<DiscordButtonCheck />)).not.toThrow();
    await act(wait);

    expect(screen.queryByText('Go to Discord')).toBeVisible();

    const goToDiscord = screen.getByText('Go to Discord');
    userEvent.click(goToDiscord);

    expect(screen.queryByText('Go to Discord')).toBeVisible();
    expect(screen.queryByText('Go to Discord')).toHaveAttribute('href', 'https://discord.com/');
  });
});
