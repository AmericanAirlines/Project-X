import React from 'react';
import { render, screen } from '../testUtils/testTools';
import { VideoTableRow } from '../../src/components/VideoTableRow';
import { Video } from '../../../api/src/entities/Video';

// Mock video object
const video : Video = {
  id: '1',
  title: 'React Basics',
  durationInSeconds: 123,
  url: 'https://test.com',
  createdAt: new Date(),
  updatedAt: new Date(),
} as Video

describe('VideoTableRow render', () => {
  // Test component render
  it('renders', async () => {
    // Need to get this call working
    render(VideoTableRow(video));

    expect(screen.getByText('React Basics')).toBeVisible();
  });

  // Test time conversion

});
