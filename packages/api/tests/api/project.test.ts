import fetchMock from 'fetch-mock-jest';
import { project } from '../../src/api/project';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

interface MockProjectEntity {
  nodeID: string;
}

interface MockProjectDetails {
  url: string;
  name: string;
  stargazer_count: number;
}

const MockProjectList: MockProjectEntity[] = [
  { nodeID: 'VeryGreatRepo' },
  { nodeID: 'EvenBetterRepo' },
];

const MockProjectResults: MockProjectDetails[] = [
  {
    url: 'www.github.com/AmericanAirlines/VeryLargePlane',
    name: 'VeryLargePlane',
    stargazer_count: 12345,
  },
  {
    url: 'www.github.com/AmericanAirlines/EvenBiggerPlane',
    name: 'EvenBiggerPlane',
    stargazer_count: 54321,
  },
];

describe('Project GET route', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.reset();
  });

  it('error on find returns 500 status code', async () => {
    const handler = testHandler(project, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', id: 'aaa' };
      next();
    });

    handler.entityManager.find.mockRejectedValueOnce(
      new Error('here was an issue getting the projects'),
    );

    const { text } = await handler.get('/').expect(500);
    expect(text).toEqual('There was an issue getting the projects');
    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('401 Unauthorized Access', async () => {
    const handler = testHandler(project);

    fetchMock.post('https://api.github.com/graphql', MockProjectResults);
    await handler.get('/').expect(401);

    expect(fetchMock).toHaveFetchedTimes(0);
  });

  it('Successful fetch from GitHub', async () => {
    const handler = testHandler(project, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', id: 'aaa' };
      next();
    });

    handler.entityManager.find.mockResolvedValueOnce(MockProjectList);

    fetchMock.post('https://api.github.com/graphql', MockProjectResults);

    const { body } = await handler.get('/').expect(200);
    expect(body).toEqual(MockProjectResults);
    expect(fetchMock).toHaveLastFetched('https://api.github.com/graphql', 'post');
    expect(fetchMock).toHaveFetchedTimes(1);
  });
});
