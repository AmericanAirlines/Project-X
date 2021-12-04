import fetchMock from 'fetch-mock';
import { DateTime } from 'luxon';
import { searchForContributions } from '../../../../src/utils/github/searchForContributions';
import * as buildProjectsQueryModule from '../../../../src/utils/github/buildProjectsQuery';
import logger from '../../../../src/logger';
import { User } from '../../../../src/entities/User';
import { Project } from '../../../../src/entities/Project';

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();
const projectQuerySpy = jest
  .spyOn(buildProjectsQueryModule, 'buildProjectsQuery')
  .mockResolvedValue('projects query');

const sampleUser1: Partial<User> = {
  name: 'BruceWayne',
  pronouns: 'he/him',
  schoolName: 'Gotham Private',
  assign: jest.fn(),
  githubUsername: 'BatMan',
  githubId: '123454',
};

const sampleUser2: Partial<User> = {
  name: 'SalenaKyle',
  pronouns: 'she/her',
  schoolName: 'School of Gifted Cats',
  assign: jest.fn(),
  githubUsername: 'CatWoman',
  githubId: '323444',
};

const sampleProject1: Partial<Project> = {
  nodeID: 'aosidnqown21',
};

const sampleProject2: Partial<Project> = {
  nodeID: '54343nt3ljn=',
};

const contributionMultiPageResponse1 = {
  data: {
    search: {
      pageInfo: {
        hasNextPage: true,
        endCursor: '121',
      },
      nodes: [
        {
          id: '1asas',
          title: 'contribution1',
          permalink: 'www.con1.com',
          mergedAt: '10-10-2020',
          author: {
            login: 'BruceWayne',
          },
        },
        {
          id: '2dwdi',
          title: 'contribution2',
          permalink: 'www.con2.com',
          mergedAt: '10-11-2020',
          author: {
            login: 'BruceWayne',
          },
        },
      ],
    },
  },
};

const contributionMultiPageResponse2 = {
  data: {
    search: {
      pageInfo: {
        hasNextPage: false,
        endCursor: '10p',
      },
      nodes: [
        {
          id: '3pppp',
          title: 'contribution3',
          permalink: 'www.con3.com',
          mergedAt: '10-11-2020',
          author: {
            login: 'SalenaKyle',
          },
        },
      ],
    },
  },
};

const emptyContributionResponse = {
  data: {
    search: {
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
      nodes: [],
    },
  },
};
describe('searcForContributions', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.reset();
  });

  it('returns the expected contributions when there is multiple pages with contributions', async () => {
    fetchMock.postOnce('https://api.github.com/graphql', contributionMultiPageResponse1);
    fetchMock.postOnce('https://api.github.com/graphql', contributionMultiPageResponse2, {
      overwriteRoutes: false,
    });

    const users = [sampleUser1, sampleUser2] as User[];
    const projects = [sampleProject1, sampleProject2] as Project[];
    const highDate = DateTime.now();
    const lowDate = highDate.minus({ days: 1 });
    const returnedContributions = await searchForContributions(projects, lowDate, highDate, users);

    const expectedContributions = [
      contributionMultiPageResponse1.data.search.nodes[0],
      contributionMultiPageResponse1.data.search.nodes[1],
      contributionMultiPageResponse2.data.search.nodes[0],
    ];

    expect(projectQuerySpy).toHaveBeenCalledTimes(1);
    expect(returnedContributions).toEqual(expectedContributions);
  });

  it('returns the expected contributions when there is one page with contributions', async () => {
    fetchMock.postOnce('https://api.github.com/graphql', contributionMultiPageResponse2);

    const users = [sampleUser1, sampleUser2] as User[];
    const projects = [sampleProject1, sampleProject2] as Project[];
    const highDate = DateTime.now();
    const lowDate = highDate.minus({ days: 1 });
    const returnedContributions = await searchForContributions(projects, lowDate, highDate, users);

    const expectedContributions = [contributionMultiPageResponse2.data.search.nodes[0]];

    expect(projectQuerySpy).toHaveBeenCalledTimes(1);
    expect(returnedContributions).toEqual(expectedContributions);
  });

  it('returns the expected contributions when there is one page with no contributions', async () => {
    fetchMock.postOnce('https://api.github.com/graphql', emptyContributionResponse);

    const users = [sampleUser1, sampleUser2] as User[];
    const projects = [sampleProject1, sampleProject2] as Project[];
    const highDate = DateTime.now();
    const lowDate = highDate.minus({ days: 1 });
    const returnedContributions = await searchForContributions(projects, lowDate, highDate, users);

    expect(projectQuerySpy).toHaveBeenCalledTimes(1);
    expect(returnedContributions.length).toEqual(0);
  });

  it('returns the expected contributions when there are no projects to search through', async () => {
    fetchMock.postOnce('https://api.github.com/graphql', contributionMultiPageResponse2);
    jest.spyOn(buildProjectsQueryModule, 'buildProjectsQuery').mockResolvedValueOnce(null);

    const users = [sampleUser1, sampleUser2] as User[];
    const projects = [sampleProject1, sampleProject2] as Project[];
    const highDate = DateTime.now();
    const lowDate = highDate.minus({ days: 1 });
    const returnedContributions = await searchForContributions(projects, lowDate, highDate, users);

    expect(projectQuerySpy).toHaveBeenCalledTimes(1);
    expect(returnedContributions.length).toEqual(0);
  });

  it('handles a non 200 OK fetch result', async () => {
    fetchMock.postOnce('https://api.github.com/graphql', 500);

    const users = [sampleUser1, sampleUser2] as User[];
    const projects = [sampleProject1, sampleProject2] as Project[];
    const highDate = DateTime.now();
    const lowDate = highDate.minus({ days: 1 });
    await searchForContributions(projects, lowDate, highDate, users);

    expect(projectQuerySpy).toHaveBeenCalledTimes(1);
    expect(loggerSpy).toHaveBeenCalledWith('The contibution query to GitHub has failed');
    expect(loggerSpy).toHaveBeenCalledTimes(2);
  });

  it('handles a thrown error properly', async () => {
    const error = new Error('test Error');
    fetchMock.postOnce('https://api.github.com/graphql', () => {
      throw error;
    });

    const users = [sampleUser1, sampleUser2] as User[];
    const projects = [sampleProject1, sampleProject2] as Project[];
    const highDate = DateTime.now();
    const lowDate = highDate.minus({ days: 1 });
    await searchForContributions(projects, lowDate, highDate, users);

    expect(projectQuerySpy).toHaveBeenCalledTimes(1);
    expect(loggerSpy).toHaveBeenCalledWith('There was an issue getting contribution data', error);
    expect(loggerSpy).toHaveBeenCalledTimes(1);
  });
});
