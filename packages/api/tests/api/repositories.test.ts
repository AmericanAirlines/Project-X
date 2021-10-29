// add tests to ensure videos are being returned properly
import { repos } from '../../src/api/repositories';
import { RepoList } from '../../src/entities/Repositories';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

// Repo object mocks
interface MockRepo {
  id: string;
  name: string;
  stargazers_count: number;
  html_url: string;
  language: string;
  description: string;
}

const repo1: MockRepo = {
  id: '1',
  name: 'repo1',
  stargazers_count: 102,
  html_url: 'www.test.org',
  language: 'HTML',
  description: 'To do app',
};

const repo2: MockRepo = {
  id: '2',
  name: 'repo2',
  stargazers_count: 1109,
  html_url: 'www.test2.org',
  language: 'Java',
  description: 'Simple java',
};

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

describe('/repositories', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('returns all repos', async () => {
    const expectedVideos = [repo1, repo2];
    const handler = testHandler(repos);
    handler.entityManager.find.mockResolvedValue(expectedVideos);

    // result responds with 200 Status
    const { body } = await handler.get('/').expect(200);

    // result contains all videos
    expect(body).toEqual(expect.arrayContaining(expectedVideos));
  });

  it('propererly errors with a 500 and logs', async () => {
    const handler = testHandler(repos);
    handler.entityManager.find.mockRejectedValue(new Error('Something is broken'));

    // result responds with 500 Status
    const { text } = await handler.get('/').expect(500);

    // result contains all videos
    expect(text).toEqual('There was an issue geting all repo');

    // logger should be called
    expect(loggerSpy).toBeCalledTimes(1);
  });
});

describe('/repositories/:repoId', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  it('returns a specific video', async () => {
    const handler = testHandler(repos);
    handler.entityManager.findOne.mockResolvedValueOnce(repo1);

    const { body } = await handler.get('/1').expect(200);

    expect(body).toEqual(repo1);
    expect(handler.entityManager.findOne).toHaveBeenCalledWith(RepoList, { id: '1' });
  });

  it('propererly returns with a 400 when a video ID not a number', async () => {
    const handler = testHandler(repos);
    handler.entityManager.findOne.mockResolvedValueOnce(repo1);

    await handler.get('/one').expect(400);
  });

  it('propererly returns with a 404 when a video is not found', async () => {
    const handler = testHandler(repos);
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    await handler.get('/1').expect(404);
  });

  it('propererly errors with a 500 and logs', async () => {
    const handler = testHandler(repos);
    handler.entityManager.findOne.mockRejectedValueOnce(new Error('Something is broken'));

    const { text } = await handler.get('/1').expect(500);

    expect(text).toEqual('There was an issue geting repo "1"');

    expect(loggerSpy).toBeCalledTimes(1);
  });
});
