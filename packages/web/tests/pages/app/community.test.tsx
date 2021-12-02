import React from 'react';
import { render, screen, waitFor } from '../../testUtils/testTools';
import { getMock } from '../../testUtils/getMock';
import { AppLayout } from '../../../src/components/Layout';
import Community from '../../../src/pages/app/community';
import { DiscordButton } from '../../../src/components/DiscordCheck/DiscordButton';

jest.mock('../../../src/components/Layout/AppLayout.tsx');
getMock(AppLayout).mockImplementation(({ children }) => <>{children}</>);

jest.mock('../../../src/components/DiscordCheck/DiscordButton.tsx');
const discordText = 'discordButton';
getMock(DiscordButton).mockImplementation(() => <p>{discordText}</p>);

describe('community page', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('renders', async () => {
    expect(() => render(<Community />)).not.toThrow();

    expect(screen.getByText('Community')).toBeVisible();

    // Check that the Community Guidelines section is displayed by default
    await waitFor(() => expect(screen.getByText('Be respectful.')).toBeVisible());

    expect(
      screen.queryByText('Remember to follow the Community Guidelines listed above.'),
    ).not.toBeVisible();
    expect(screen.queryByText('Should I change my Discord profile avatar?')).not.toBeVisible();
    expect(screen.queryByText(discordText)).toBeVisible();
  });
});
