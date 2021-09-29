// add tests to ensure videos are being returned properly
import express from 'express';
import { videos } from '../../src/api/videos';
import { testHandler } from '../testUtils/testHandler';

// Need to mock the database for testing

describe('videos', () => {
  it('/videos returns all videos', async () => {
    const { body } = await testHandler(videos.get('')).expect(200); // need to fix
  });
});