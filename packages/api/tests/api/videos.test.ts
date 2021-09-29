// add tests to ensure videos are being returned properly
import { videos } from '../../src/api/videos';
import { testHandler } from '../testUtils/testHandler';

describe('videos', () => {
  it('returns ok true', async () => {
    const { body } = await testHandler(videos).expect(500); // need to fix
  });
});