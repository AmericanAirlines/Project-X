import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import Videos from '../../../src/pages/app/videos';
import { getMock } from '../../testUtils/getMock';
import { AppLayout } from '../../../src/components/Layout';
import { VideoTableRow } from '../../../src/components/VideoTableRow';

jest.mock('../../../src/components/Layout/AppLayout.tsx');
getMock(AppLayout).mockImplementation(({ children }) => <>{children}</>);

// Mock api response for /api/videos

describe('web /app/videos', () => {
  // Test page render
  it('renders', async () => {
    render(<Videos />);

    expect(screen.getByText('Videos')).toBeVisible();
  });

  // Test that "api/videos" is called on page load

  // Test table with no videos returned

  // Test table with videos returned
  
});
