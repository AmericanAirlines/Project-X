import { sample } from 'lodash';
import React from 'react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock-jest';
import { useRouter } from 'next/router';
import { UserProfile } from '../../../src/components/userprofile';
import { UserProfileProps } from '../../../src/components/userprofile/UserProfile';
import { render, screen, waitFor } from '../../testUtils/testTools';
import { getMock } from '../../testUtils/getMock';


jest.mock('next/router');
getMock(useRouter).mockReturnValue({
  query:{
    uid: '1',
  }
} as any); 

const sampleUser: UserProfileProps = {
  name: 'Steve Job',
  pronouns: 'he/him',
  schoolName: 'Apple University',
};

describe('Mock UserProfileLayout component', () => {
  it('renders sampleUser', () => {
    render(<UserProfile {...sampleUser} />);

    expect(screen.getByText('Steve Job')).toBeVisible();
    expect(screen.getByText('he/him')).toBeVisible();
    expect(screen.getByText('Apple University')).toBeVisible();
  });
});

describe('Discord Login Button Functionality', () => {

  it('renders login button when user has no discord id', () => {
    render(<UserProfile {...sampleUser} />);

    expect(screen.queryByText('Login with Discord')).toBeVisible();
    expect(screen.queryByText('Login with Discord')?.getAttribute('href')).toEqual('/api/auth/discord/login');
  });

  it('renders unlink button when user has discord id and unlinks account when clicked', async () => {
    fetchMock.patch('/api/users/1', sampleUser);
    
    render(<UserProfile {...sampleUser} discordId="12345" />);

    expect(screen.queryByText('Unlink Discord Account')).toBeVisible();
    
    const unlinkDiscordButton = screen.getByText('Unlink Discord Account');
    userEvent.click(unlinkDiscordButton);

    await waitFor(()=>{
      expect(fetchMock).toHaveFetched('/api/users/1');
    })
    
  });

  it('renders error when unlink call fails', async () => {
    fetchMock.patch('/api/users/1', 500);
    
    render(<UserProfile {...sampleUser} discordId="12345" />);

    expect(screen.queryByText('Unlink Discord Account')).toBeVisible();
    
    const unlinkDiscordButton = screen.getByText('Unlink Discord Account');
    userEvent.click(unlinkDiscordButton);

    await waitFor(()=>{
      expect(screen.queryByText('Unable to unlink Discord Account')).toBeVisible();
    })
    
  });

  it('adds discord id', () => {
    const sampleDiscordUser: UserProfileProps = {
      name: 'Steve Job',
      pronouns: 'he/him',
      schoolName: 'Apple University',

    };    

    render(<UserProfile {...sampleDiscordUser} />);


    
  })
});
