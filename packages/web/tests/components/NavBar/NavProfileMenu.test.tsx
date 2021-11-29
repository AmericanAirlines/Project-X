import React from 'react';
import { render, screen, waitFor } from '../../testUtils/testTools';
import { NavProfileMenu } from '../../../src/components/NavBar/NavProfileMenu';
import fetchMock from 'fetch-mock-jest';

const mockCurrentUser = {
  id: 123,
};

describe('NavLink Components', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.resetHistory();
  });

  it('renders correctly without logged in user', async () => {
    fetchMock.get('/api/users/me', 401);
    render(<NavProfileMenu />);

    await waitFor(() => {
      expect(screen.getByText('Log In')).toHaveAttribute('href', '/api/auth/github/login');
      expect(fetchMock).toHaveFetchedTimes(1);
    });
  });

  it('renders correctly with logged in user', async () => {
    fetchMock.get('/api/users/me', mockCurrentUser);
    render(<NavProfileMenu />);

    await waitFor(() => {
      expect(screen.getByText('View Profile')).toHaveAttribute(
        'href',
        `/user/${mockCurrentUser.id}`,
      );
      expect(screen.getByText('View Contributions')).toHaveAttribute('href', '/app/contributions');
      expect(screen.getByText('Log Out')).toHaveAttribute('href', '/api/auth/github/logout');
      expect(fetchMock).toHaveFetchedTimes(1);
    });
  });
});
