import React from 'react';
import { fireEvent, render, screen } from '../../testUtils/testTools';
import { MenuItem } from '@chakra-ui/react';
import { NavProfileMenu } from '../../../src/components/NavBar/NavProfileMenu';
import { click } from '@testing-library/user-event/dist/click';

describe('NavLink Components', () => {
  it('renders correctly', async () => {
    render(<NavProfileMenu />);

    expect(screen.getByRole('img')).toBeVisible();

    expect(screen.getByText('Edit Profile').closest('a')).toHaveAttribute('href', '/app/profile');
    expect(screen.getByText('View Contributions').closest('a')).toHaveAttribute(
      'href',
      '/app/contributions',
    );
    expect(screen.getByText('Log Out').closest('a')).toHaveAttribute(
      'href',
      '/api/auth/github/logout',
    );
  });
});
