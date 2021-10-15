import React from 'react';
import { render, screen, act } from '../../../testUtils/testTools';
import UserProfile from '../../../../src/pages/user/[[...uid]]';
import fetchMock from 'fetch-mock-jest';
import {
  UserProfileLayout,
  UserProfileData,
} from '../../../../src/components/UserProfile/UserProfileLayout';
import { getMock } from '../../../testUtils/getMock';

jest.mock('../../../../src/components/UserProfile/UserProfileLayout');
getMock(UserProfileLayout).mockImplementation(({ ...UserProfileData }) => (
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

const sampleUser: UserProfileData = {
  name: 'Steve Job',
  hireable: true,
  purpose: 'need 2 jobs',
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
    expect(() => render(<UserProfile />)).not.toThrow();
    await act(wait);
    expect(screen.getByText('Login not setup yet'));
  });

  it('outputs error given non-numeric uid', async () => {
    useRouter.mockImplementation(() => ({
      query: { uid: 'abc' },
    }));
    expect(() => render(<UserProfile />)).not.toThrow();

    await act(wait);
    expect(screen.getByText('id must be an integer'));
  });

  it('outputs error given non-existant user id', async () => {
    useRouter.mockImplementation(() => ({
      query: { uid: '0' },
    }));
    expect(() => render(<UserProfile />)).not.toThrow();

    await act(wait);
    expect(screen.getByText('User could not be found'));
  });

  it('outputs user profile info given valid user id', async () => {
    useRouter.mockImplementation(() => ({
      query: { uid: '0' },
    }));

    fetchMock.get('/api/users/0', sampleUser);

    expect(() => render(<UserProfile />)).not.toThrow();

    await act(wait);

    expect(UserProfileLayout).toBeCalledTimes(1);
    expect(screen.getByText('Steve Job')).toBeVisible();
  });
});
