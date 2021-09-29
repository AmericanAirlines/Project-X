// add tests to ensure videos are being returned properly
import supertest from 'supertest';
import { videos } from '../../src/api/videos';
import { testHandler } from '../testUtils/testHandler';
import {app} from '../../src/index'

// Need to mock the database for testing?

describe('videos', () => {
  it("/videos returns all videos", async () => {

    const { body } = await testHandler(videos).expect(200); //Actual API works, but this test fails?  Possible problem with how test is set up? Note: Testhandler appears to only call '/', check if it is calling all endpoints?

  });
});