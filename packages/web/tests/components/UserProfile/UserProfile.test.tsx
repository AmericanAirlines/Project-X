import React from 'react';
import { UserProfile } from '../../../src/components/userprofile';
import { EditUserForm } from '../../../src/components/userprofile/EditUserForm';
import { UserProfileProps } from '../../../src/components/userprofile/UserProfile';
import { render, screen, waitFor } from '../../testUtils/testTools';
import userEvent from '@testing-library/user-event';
import { getMock } from '../../testUtils/getMock';

const sampleDifferentUser: UserProfileProps = {
  isCurrentUser: false,
  setUser: jest.fn(React.useState).mockImplementation(),
  user: {
    id: '123',
    name: 'Steve Job',
    pronouns: 'he/him',
    schoolName: 'Apple University',
  },
};

const sampleSameUser: UserProfileProps = {
  isCurrentUser: true,
  setUser: jest.fn(React.useState).mockImplementation(),
  user: {
    id: '123',
    name: 'Steve Job',
    pronouns: 'he/him',
    schoolName: 'Apple University',
  },
};

jest.mock('../../../src/components/userprofile/EditUserForm');
getMock(EditUserForm).mockImplementation(({ ...EditFormProps }) => (
  <div>This is a form</div>
));

describe('Mock UserProfileLayout component', () => {
  it('renders sampleUser (is not current user) and do not show Edit button', async () => {
    render(<UserProfile {...sampleDifferentUser} />);

    expect(screen.getByText('Steve Job')).toBeVisible();
    expect(screen.getByText('he/him')).toBeVisible();
    expect(screen.getByText('Apple University')).toBeVisible();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('renders sampleUser (is current user) with edit button and click on edit button to show form', async () => {
    render(<UserProfile {...sampleSameUser} />);

    expect(screen.getByText('Steve Job')).toBeVisible();
    expect(screen.getByText('he/him')).toBeVisible();
    expect(screen.getByText('Apple University')).toBeVisible();
    expect(screen.queryByText('Edit')).toBeInTheDocument();

    const editButton = screen.getByText('Edit');
    userEvent.click(editButton);

    await waitFor(() => expect(screen.queryByText('This is a form')).toBeVisible());
  });
});
