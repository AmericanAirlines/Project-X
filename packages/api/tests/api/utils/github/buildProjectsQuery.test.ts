import fetchMock from 'fetch-mock-jest';
import { Project } from '../../../../src/entities/Project';
import logger from '../../../../src/logger';
import { buildProjectsQuery } from '../../../../src/utils/github/buildProjectsQuery';

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

const project1: Partial<Project> = {
  nodeID: 'node1',
};

const project2: Partial<Project> = {
  nodeID: 'node2',
};

const repositoryResponse = {
  data: {
    nodes: [
      {
        id: project1.nodeID,
        nameWithOwner: 'Gotham/PoliceScanner',
      },
      {
        id: project2.nodeID,
        nameWithOwner: 'Gotham/JailCell',
      },
    ],
  },
};

describe('buildProjectQuery', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.reset();
  });

  it('returns the expect repository string', async () => {
    fetchMock.postOnce('https://api.github.com/graphql', repositoryResponse);

    const returnedText = await buildProjectsQuery([project1, project2] as Project[]);
    const expectedText = `repo:${repositoryResponse.data.nodes[0].nameWithOwner} repo:${repositoryResponse.data.nodes[1].nameWithOwner}`;

    expect(returnedText).toEqual(expectedText);
  });

  it('returns handles a bad fetch correctly', async () => {
    fetchMock.postOnce('https://api.github.com/graphql', new Error());

    const returnedText = await buildProjectsQuery([project1, project2] as Project[]);

    expect(returnedText).toEqual(null);
    expect(loggerSpy).toBeCalledTimes(1);
  });

  it('returns handles a non 200 OK fetch correctly', async () => {
    fetchMock.postOnce('https://api.github.com/graphql', 431);

    const returnedText = await buildProjectsQuery([project1, project2] as Project[]);

    expect(returnedText).toEqual(null);
    expect(loggerSpy).toBeCalledTimes(2);
  });
});
