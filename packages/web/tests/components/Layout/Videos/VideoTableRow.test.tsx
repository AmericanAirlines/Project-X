import React from 'react';
import { render, screen } from '../../../testUtils/testTools';
import { VideoTableRow } from '../../../../src/components/Layout/Videos/VideoTableRow';
import { Video } from '../../../../src/pages/app/videos';

// Mock video objects
const video1: Video = {
  id: '1',
  title: 'Test Video #1',
  durationInSeconds: 0,
  url: 'https://test1.com',
};
const video2: Video = {
  id: '2',
  title: 'Another Test Video',
  durationInSeconds: 848,
  url: 'https://test2.com',
};
const video3: Video = {
  id: '3',
  title: 'More Videos for Testing',
  durationInSeconds: 362730,
  url: 'https://test3.com',
};

describe('VideoTableRow', () => {
  it('renders', async () => {
    render(<VideoTableRow video={video1} />);

    expect(screen.getByText('Test Video #1')).toBeVisible();

    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://test1.com');
  });

  it('correctly formats video duration with no duration', async () => {
    render(<VideoTableRow video={video1} />);

    expect(screen.getByText('Test Video #1')).toBeVisible();

    expect(screen.getByText('00:00:00')).toBeVisible();
  });

  it('correctly formats video duration with medium duration', async () => {
    render(<VideoTableRow video={video2} />);

    expect(screen.getByText('Another Test Video')).toBeVisible();

    expect(screen.getByText('00:14:08')).toBeVisible();
  });

  it('correctly formats video duration with long duration', async () => {
    render(<VideoTableRow video={video3} />);

    expect(screen.getByText('More Videos for Testing')).toBeVisible();

    expect(screen.getByText('100:45:30')).toBeVisible();
  });
});
