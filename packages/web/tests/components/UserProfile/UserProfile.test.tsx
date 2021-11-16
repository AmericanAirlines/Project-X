import { sample } from 'lodash';
import React from 'react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock-jest';
import { useRouter } from 'next/router';
import { UserProfile } from '../../../src/components/userprofile';
import { EditUserForm } from '../../../src/components/userprofile/EditUserForm';
import { UserProfileProps } from '../../../src/components/userprofile/UserProfile';
import { render, screen, waitFor } from '../../testUtils/testTools';
import { getMock } from '../../testUtils/getMock';

jest.mock('next/router');
getMock(useRouter).mockReturnValue({
  query: {
    uid: '1',
  },
} as any);

const sampleUser: UserProfileProps['user'] = {
  id: '123',
  name: 'Steve Job',
  pronouns: 'he/him',
  schoolName: 'Apple University',
};

jest.mock('../../../src/components/userprofile/EditUserForm');
getMock(EditUserForm).mockImplementation(({ ...EditFormProps }) => <div>This is a form</div>);

describe('Mock UserProfileLayout component', () => {
  it('renders sampleUser (is not current user) and do not show Edit button', async () => {
    render(<UserProfile user={sampleUser} setUser={jest.fn()} isCurrentUser={false} />);

    expect(screen.getByText('Steve Job')).toBeVisible();
    expect(screen.getByText('he/him')).toBeVisible();
    expect(screen.getByText('Apple University')).toBeVisible();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('allows the user to edit their profile', async () => {
    render(<UserProfile user={sampleUser} setUser={jest.fn()} isCurrentUser={true} />);

    expect(screen.getByText('Steve Job')).toBeVisible();
    expect(screen.getByText('he/him')).toBeVisible();
    expect(screen.getByText('Apple University')).toBeVisible();
    expect(screen.queryByText('Edit')).toBeInTheDocument();

    const editButton = screen.getByText('Edit');
    userEvent.click(editButton);

    await waitFor(() => expect(screen.queryByText('This is a form')).toBeVisible());
  });
});

describe('Discord Login Button Functionality', () => {
  it('renders login button when user has no discord id', () => {
    render(<UserProfile user={sampleUser} setUser={jest.fn()} isCurrentUser={false} />);

    expect(screen.queryByText('Login with Discord')).toBeVisible();
    expect(screen.queryByText('Login with Discord')?.getAttribute('href')).toEqual(
      '/api/auth/discord/login',
    );
  });

  it('renders unlink button when user has discord id and unlinks account when clicked', async () => {
    fetchMock.patch('/api/users/1', sampleUser);
    const mockSetUser = jest.fn();
    render(
      <UserProfile
        user={{ ...sampleUser, discordId: '12345' }}
        setUser={mockSetUser}
        isCurrentUser={false}
      />,
    );

    expect(screen.queryByText('Unlink Discord Account')).toBeVisible();

    const unlinkDiscordButton = screen.getByText('Unlink Discord Account');
    userEvent.click(unlinkDiscordButton);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('/api/users/1');
      expect(mockSetUser).toHaveBeenCalledWith(sampleUser);
    });
  });

  it('renders error when unlink call fails', async () => {
    fetchMock.patch('/api/users/1', 500);

    render(
      <UserProfile
        user={{ ...sampleUser, discordId: '12345' }}
        setUser={jest.fn()}
        isCurrentUser={false}
      />,
    );

    expect(screen.queryByText('Unlink Discord Account')).toBeVisible();

    const unlinkDiscordButton = screen.getByText('Unlink Discord Account');
    userEvent.click(unlinkDiscordButton);

    await waitFor(() => {
      expect(screen.queryByText('Unable to unlink Discord Account')).toBeVisible();
    });
  });
});
