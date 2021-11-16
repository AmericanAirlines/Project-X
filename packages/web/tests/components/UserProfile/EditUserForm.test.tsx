import React from 'react';
import { render, screen, waitFor } from '../../testUtils/testTools';
import userEvent from '@testing-library/user-event';
import { EditUserForm, EditUserProps } from '../../../src/components/userprofile/EditUserForm';
import fetchMock from 'fetch-mock-jest';
import { User } from '../../../src/pages/user/[uid]';

const mockEditFormProps: EditUserProps = {
  setEditToggle: jest.fn(React.useState).mockImplementation(),
  setUser: jest.fn(React.useState).mockImplementation(),
  user: {
    id: '123',
    name: 'Bill Sigh',
    pronouns: 'he/him',
    schoolName: 'School of Bill',
  },
};

const mockReturnedUser = {
  id: '123',
  name: 'Bill High',
  pronouns: 'he/him',
  schoolName: 'School of Hill',
};

describe('', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('displays an error when the user tries to submit without a name', async () => {
    fetchMock.patch(`api/users/${mockEditFormProps.user.id}`, mockReturnedUser);
    render(<EditUserForm {...mockEditFormProps} />);

    const nameInput = screen.getByLabelText('Name');
    const name = 'Bill High';
    userEvent.clear(nameInput);

    const submitButton = screen.getByText('Submit');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('Name is required.')).toBeVisible();
    });
  });

  it('resets form values when the user clicks the reset button', async () => {
    render(<EditUserForm {...mockEditFormProps} />);

    const nameInput = screen.getByLabelText('Name');
    userEvent.clear(nameInput);

    const pronounsInput = screen.getByLabelText('Pronouns');
    userEvent.clear(pronounsInput);

    const schoolNameInput = screen.getByLabelText('School Name');
    userEvent.clear(schoolNameInput);

    const cancelButton = screen.getByText('Cancel');
    userEvent.click(cancelButton);

    await waitFor(() => {
      expect(nameInput.getAttribute('value')).toEqual('Bill Sigh');
      expect(pronounsInput.getAttribute('value')).toEqual('he/him');
      expect(schoolNameInput.getAttribute('value')).toEqual('School of Bill');
    });
  });

  it('shows an error modal on error which can be closed by the user', async () => {
    render(<EditUserForm {...mockEditFormProps} />);

    fetchMock.patch(`api/users/${mockEditFormProps.user.id}`, 404);

    const submitButton = screen.getByText('Submit');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('An error has occurred. Please try again later.')).toBeVisible();
    });

    const closeModalButton = screen.getByLabelText('Close');
    userEvent.click(closeModalButton);

    await waitFor(() => {
      expect(
        screen.queryByText('An error has occurred. Please try again later.'),
      ).not.toBeInTheDocument();
    });
  });

  it('Successful edit (clear all forms and enter values)', async () => {
    render(<EditUserForm {...mockEditFormProps} />);

    fetchMock.patch(`api/users/${mockEditFormProps.user.id}`, mockReturnedUser);

    const nameInput = screen.getByLabelText('Name');
    const name = 'Bill High';
    userEvent.clear(nameInput);
    userEvent.type(nameInput, name);

    const pronounsInput = screen.getByLabelText('Pronouns');
    const pronouns = 'he/him';
    userEvent.clear(pronounsInput);
    userEvent.type(pronounsInput, pronouns);

    const schoolNameInput = screen.getByLabelText('School Name');
    const schoolName = 'School of Hill';
    userEvent.clear(schoolNameInput);
    userEvent.type(schoolNameInput, schoolName);

    const submitButton = screen.getByText('Submit');
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(fetchMock).toHaveFetched('api/users/123', {
        body: {
          name,
          pronouns,
          schoolName,
        },
      });
    });

    expect(mockEditFormProps.setEditToggle).toHaveBeenCalledTimes(1);
    expect(mockEditFormProps.setUser).toHaveBeenCalledTimes(1);
  });
});
