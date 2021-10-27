import fetchMock from 'fetch-mock-jest';
import { project } from '../../src/api/project';
import { Project } from '../../src/entities/Project';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

interface MockProjectDetails {
  node_id: string;
  url: string;
  name: string;
  stargazer_count: number;
}

const MockProjectResults: MockProjectDetails[] = [
  {
    node_id: 'VeryGreatRepo',
    url: 'www.github.com/AmericanAirlines/VeryLargePlane',
    name: 'VeryLargePlane',
    stargazer_count: 12345,
  },
  {
    node_id: 'EvenBetterRepo',
    url: 'www.github.com/AmericanAirlines/EvenBiggerPlane',
    name: 'EvenBiggerPlane',
    stargazer_count: 54321,
  },
];

describe('Project POST route', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.reset();
  });

  it('throw 500 error when error during findOne', async () => {
    const handler = testHandler(project);

    fetchMock.get('https://api.github.com/orgs/AmericanAirlines/repos', {});

    handler.entityManager.flush.mockRejectedValueOnce(new Error(''));

    const { text } = await handler.post('/').expect(500);
    expect(text).toEqual('There was an issue adding the project(s) to the database');

    expect(loggerSpy).toBeCalledTimes(1);

    expect(fetchMock).toHaveFetchedTimes(1);
  });

  it('Successful fetch', async () => {
    const handler = testHandler(project);

    fetchMock.get('https://api.github.com/orgs/AmericanAirlines/repos', MockProjectResults);

    // First iteration: Project already exists in db so no persist
    handler.entityManager.findOne.mockResolvedValueOnce(
      new Project({ nodeID: MockProjectResults[0].node_id }),
    );
    // Iterations after first: Project does not exist in db so persist
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    const { body } = await handler.post('/').expect(201);

    expect(handler.entityManager.findOne).toHaveBeenCalledWith(Project, {
      nodeID: MockProjectResults[0].node_id,
    });

    expect(handler.entityManager.findOne).toHaveBeenCalledWith(Project, {
      nodeID: MockProjectResults[1].node_id,
    });
    expect(handler.entityManager.persist).toHaveBeenCalledWith(
      new Project({ nodeID: MockProjectResults[1].node_id }),
    );

    expect(handler.entityManager.findOne).toHaveBeenCalledTimes(2);
    expect(handler.entityManager.persist).toHaveBeenCalledTimes(1);

    expect(handler.entityManager.flush).toHaveBeenCalledTimes(1);

    expect(body).toEqual(MockProjectResults);

    expect(fetchMock).toHaveFetchedTimes(1);
  });
});
