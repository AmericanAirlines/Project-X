import React from 'react';
import fetchMock from 'fetch-mock-jest';
import { render, screen, waitFor, act } from '../../testUtils/testTools';
import { getMock } from '../../testUtils/getMock';
import { UserProfileProps } from '../../../src/components/DiscordCheck/DiscordButtonCheck';
import { AppLayout } from '../../../src/components/Layout';
import Community from '../../../src/pages/app/community';

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
};

const sampleUser2: UserProfileProps['user'] = {
  name: 'Steve Job',
  pronouns: undefined,
  schoolName: undefined,
  discordId: undefined,
};

const wait = () => new Promise<void>((resolve) => setTimeout(() => resolve(), 0));

describe('community page', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  
  it('outputs error given non-existant user', async () => {
    useRouter.mockImplementation(() => ({
      query: undefined,
    }));

    expect(() => render(<Community />)).not.toThrow();

    await act(wait);
    expect(screen.getByText('User could not be found'));
  });

  it('Community page renders', async () => {
    useRouter.mockImplementation(() => ({
      query: { },
    }));

    fetchMock.get('/api/currentUser', sampleUser);

    expect(() => render(<Community />)).not.toThrow();

    await act(wait);

    expect(screen.getByText('Community')).toBeVisible();

    // Check that the Community Guidelines section is displayed by default
    await waitFor(() => expect(screen.getByText('Be respectful.')).toBeVisible());

    expect(
      screen.queryByText('Remember to follow the Community Guidelines listed above.'),
    ).not.toBeVisible();
    expect(screen.queryByText('Should I change my Discord profile avatar?')).not.toBeVisible();
    expect(screen.queryByText('Join our Discord')).toBeVisible();
    expect(screen.queryByText('Join our Discord')).toHaveAttribute('href', '/api/auth/discord/login');
    expect(screen.queryByText('here')).toHaveAttribute('href', '/api/auth/discord/login');
  });
});
