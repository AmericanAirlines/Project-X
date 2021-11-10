import fetchMock from 'fetch-mock-jest';
import { project } from '../../src/api/project';
import { Project } from '../../src/entities/Project';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

const mockBody = {
  owner: 'AmericanWaterlines',
  repo: 'NiceBoat',
};

const mockValidResponse = {
  data: {
    repository: {
      id: 'VeryGreatRepo',
    },
  },
};

describe('Project POST route', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.reset();
  });

  it('404 error when given invalid owner and/or repo name', async () => {
    const handler = testHandler(project, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });

    fetchMock.post('https://api.github.com/graphql', { errors: { status: 404 } });

    const { text } = await handler.post('').send(mockBody).expect(404);
    expect(text).toEqual('The repository could not be found');

    expect(fetchMock).toHaveFetchedTimes(1);

    expect(fetchMock).toHaveFetched('https://api.github.com/graphql');
  });

  it('500 error when error occurs during persistAndFlush', async () => {
    const handler = testHandler(project, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });

    fetchMock.post('https://api.github.com/graphql', { data: { repository: mockValidResponse } });

    handler.entityManager.persistAndFlush.mockRejectedValueOnce(
      new Error('An error has occurred during persistAndFlush'),
    );

    const { text } = await handler.post('').send(mockBody).expect(500);
    expect(text).toEqual('There was an issue adding the project to the database');

    expect(handler.entityManager.findOne).toBeCalledTimes(1);
    expect(handler.entityManager.persistAndFlush).toBeCalledTimes(1);

    expect(loggerSpy).toBeCalledTimes(1);

    expect(fetchMock).toHaveFetchedTimes(1);
  });

  it('Successful fetch and project not already in database', async () => {
    const handler = testHandler(project, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });

    fetchMock.post('https://api.github.com/graphql', mockValidResponse);

    handler.entityManager.findOne.mockResolvedValueOnce(null);

    const { body } = await handler.post('').send(mockBody).expect(200);

    expect(body).toEqual(mockValidResponse);

    expect(handler.entityManager.findOne).toBeCalledTimes(1);
    expect(handler.entityManager.persistAndFlush).toBeCalledTimes(1);

    expect(fetchMock).toHaveFetchedTimes(1);
  });

  it('Successful fetch and project is already in database', async () => {
    const handler = testHandler(project, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });

    fetchMock.post('https://api.github.com/graphql', mockValidResponse);

    handler.entityManager.findOne.mockResolvedValueOnce(
      new Project({ nodeID: mockValidResponse.data.repository.id }),
    );

    const { body } = await handler.post('').send(mockBody).expect(200);

    expect(body).toEqual(mockValidResponse);

    expect(handler.entityManager.findOne).toBeCalledTimes(1);
    expect(handler.entityManager.persistAndFlush).toBeCalledTimes(0);

    expect(fetchMock).toHaveFetchedTimes(1);
  });

  it('401 Unauthorized Access', async () => {
    const handler = testHandler(project);

    fetchMock.post('https://api.github.com/graphql', mockValidResponse);
    await handler.post('').expect(401);
    expect(fetchMock).toHaveFetchedTimes(0);
  });
});

interface MockProjectEntity {
  nodeID: string;
}

interface MockProjectDetails {
  url: string;
  name: string;
  stargazer_count: number;
  primaryLanguage: {
    name: string;
  };
  description: string;
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
    description: 'large plane',
    primaryLanguage: {
      name: 'HTML',
    },
  },
  {
    url: 'www.github.com/AmericanAirlines/EvenBiggerPlane',
    name: 'EvenBiggerPlane',
    stargazer_count: 54321,
    primaryLanguage: {
      name: 'CSS',
    },
    description: 'bigger plane',
  },
];

describe('Project GET route', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.mockReset();
  });

  it('error on find returns 500 status code', async () => {
    const handler = testHandler(project, (req, _res, next) => {
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
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
      req.user = { githubToken: 'abcd123', profile: { id: 'aaa' } };
      next();
    });

    handler.entityManager.find.mockResolvedValueOnce(MockProjectList);

    fetchMock.post('https://api.github.com/graphql', { data: { nodes: MockProjectResults } });

    const { body } = await handler.get('/').expect(200);

    expect(body).toEqual(MockProjectResults);
    expect(fetchMock).toHaveLastFetched('https://api.github.com/graphql', 'post');
    expect(fetchMock).toHaveFetchedTimes(1);
  });
});
