import React from 'react';
import { render, screen, act } from '../../../testUtils/testTools';
import UserProfilePage from '../../../../src/pages/user/[uid]';
import fetchMock from 'fetch-mock-jest';
import {
  UserProfile,
  UserProfileProps,
} from '../../../../src/components/userprofile/UserProfile';
import { getMock } from '../../../testUtils/getMock';

jest.mock('../../../../src/components/UserProfile/UserProfileLayout');
getMock(UserProfile).mockImplementation(({ ...UserProfileData }) => (
  <div>{UserProfileData.name}</div>
));

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: '',
    };
  },
}));

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

const sampleUser: UserProfileProps = {
  name: 'Steve Job',
  pronouns: 'he/him',
  schoolName: 'Apple University',
};

const wait = () => new Promise<void>((resolve) => setTimeout(() => resolve(), 0));

describe('web /user/', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  // Remove this test when login/session functionality is finished
  it('outputs error given no uid parameter', async () => {
    expect(() => render(<UserProfilePage />)).not.toThrow();
    await act(wait);
    expect(screen.getByText('Login not setup yet'));
  });

  it('outputs error given non-numeric uid', async () => {
    useRouter.mockImplementation(() => ({
      query: { uid: 'abc' },
    }));
    expect(() => render(<UserProfilePage />)).not.toThrow();

    await act(wait);
    expect(screen.getByText('id must be an integer'));
  });

  it('outputs error given non-existant user id', async () => {
    useRouter.mockImplementation(() => ({
      query: { uid: '0' },
    }));
    expect(() => render(<UserProfilePage />)).not.toThrow();

    await act(wait);
    expect(screen.getByText('User could not be found'));
  });

  it('outputs user profile info given valid user id', async () => {
    useRouter.mockImplementation(() => ({
      query: { uid: '0' },
    }));

    fetchMock.get('/api/users/0', sampleUser);

    expect(() => render(<UserProfilePage />)).not.toThrow();

    await act(wait);

    expect(UserProfile).toBeCalledTimes(1);
    expect(screen.getByText('Steve Job')).toBeVisible();
  });
});
