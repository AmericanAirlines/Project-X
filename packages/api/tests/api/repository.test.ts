import fetchMock from 'fetch-mock-jest';
import { repository } from '../../src/api/repository';
import { Repository } from '../../src/entities/Repository';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

interface MockRepositoryDetails {
  node_id: string;
  url: string;
  name: string;
  stargazer_count: number;
}

const MockRepositoryResults: MockRepositoryDetails[] = [
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

describe('Repository POST route', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.reset();
  });

  it('throw 500 error when error during findOne', async () => {
    const handler = testHandler(repository);

    fetchMock.get('https://api.github.com/orgs/AmericanAirlines/repos', {});

    handler.entityManager.flush.mockRejectedValueOnce(new Error(''));

    const { text } = await handler.post('/').expect(500);
    expect(text).toEqual('There was an issue adding the repo(s) to the database');

    expect(loggerSpy).toBeCalledTimes(1);

    expect(fetchMock).toHaveFetchedTimes(1);
  });

  it('Successful fetch', async () => {
    const handler = testHandler(repository);

    fetchMock.get('https://api.github.com/orgs/AmericanAirlines/repos', MockRepositoryResults);

    // First iteration: Repository already exists in db so no persist
    handler.entityManager.findOne.mockResolvedValueOnce(
      new Repository({ nodeID: MockRepositoryResults[0].node_id }),
    );
    // Iterations after first: Repository does not exist in db so persist
    handler.entityManager.findOne.mockResolvedValueOnce(null);

    const { body } = await handler.post('/').expect(201);

    expect(handler.entityManager.findOne).toHaveBeenCalledWith(Repository, {
      nodeID: MockRepositoryResults[0].node_id,
    });

    expect(handler.entityManager.findOne).toHaveBeenCalledWith(Repository, {
      nodeID: MockRepositoryResults[1].node_id,
    });
    expect(handler.entityManager.persist).toHaveBeenCalledWith(
      new Repository({ nodeID: MockRepositoryResults[1].node_id }),
    );

    expect(handler.entityManager.findOne).toHaveBeenCalledTimes(2);
    expect(handler.entityManager.persist).toHaveBeenCalledTimes(1);

    expect(handler.entityManager.flush).toHaveBeenCalledTimes(1);

    expect(body).toEqual(MockRepositoryResults);

    expect(fetchMock).toHaveFetchedTimes(1);
  });
});
