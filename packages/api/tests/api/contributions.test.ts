import fetchMock from 'fetch-mock-jest';
import { contributions} from '../../src/api/contributions';
import { users } from '../../src/api/users';
import { Contribution } from '../../src/entities/Contribution';
import { Project } from '../../src/entities/Project';
import { User } from '../../src/entities/User';
import logger from '../../src/logger';
import { testHandler } from '../testUtils/testHandler';

jest.mock('../../src/api/contributions', () => ({
  ...(jest.requireActual('../../src/api/contributions')),
  buildDateQuery: jest.fn(),
  buildProjectsQuery: jest.fn(),
  buildQueryString: jest.fn(),
  buildUsersQuery: jest.fn()  
}));

const loggerSpy = jest.spyOn(logger, 'error').mockImplementation();

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
  nodeID: 'aosidnqown21'
};

const sampleProject2: Partial<Project> = {
  nodeID: '54343nt3ljn='
};

const repositoryRespons = {
  data: {
    nodes: [
      {
        id: '12wq',
        nameWithOwner: 'Gotham/PoliceScanner'
      },
      {
        id: '35ge',
        nameWithOwner: 'Gotham/JailCell'
      },
    ]
  }
}

const contributionResponse = {
  data: {
    search: {
      pageInfo: {
        hasNextPage: false,
        endCursor: '121'
      },
      nodes: [
        {
          id: '1asas',
          title: 'contribution1',
          permalink: 'www.con1.com',
          mergedAt: '10-10-2020',
          author: {
            login: 'BruceWayne',
          }
        },
        {
          id: '2dwdi',
          title: 'contribution2',
          permalink: 'www.con2.com',
          mergedAt: '10-11-2020',
          author: {
            login: 'BruceWayne',
          }
        },
        {
          id: '3pppp',
          title: 'contribution3',
          permalink: 'www.con3.com',
          mergedAt: '10-11-2020',
          author: {
            login: 'SalenaKyle',
          }
        },
      ]
    }
  }
}

describe('/contributions API GET route', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      fetchMock.reset();
    });
  
    it('successfully saves contributions', async () => {
        const handler = testHandler(contributions);
        
        
        handler.entityManager.find.mockResolvedValueOnce([sampleUser1, sampleUser2]);
        handler.entityManager.find.mockResolvedValueOnce([sampleProject1, sampleProject2]);

        // find contributions calls
        handler.entityManager.find.mockResolvedValueOnce([]); 
        handler.entityManager.find.mockResolvedValueOnce([]); 
        handler.entityManager.find.mockResolvedValueOnce([]); 

        // get users to update calls
        handler.entityManager.findOne.mockResolvedValueOnce(sampleUser1);
        handler.entityManager.findOne.mockResolvedValueOnce(sampleUser2);

        // get user ids calls
        handler.entityManager.findOne.mockResolvedValueOnce(sampleUser1);
        handler.entityManager.findOne.mockResolvedValueOnce(sampleUser1);
        handler.entityManager.findOne.mockResolvedValueOnce(sampleUser2);

        fetchMock.postOnce('https://api.github.com/graphql', repositoryRespons);
        fetchMock.postOnce('https://api.github.com/graphql', contributionResponse, {overwriteRoutes: false});
        
    
        await handler.get('').expect(200);
    
        expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, { githubUsername: {$eq: sampleUser1.name} });
        expect(handler.entityManager.findOne).toHaveBeenCalledWith(User, { githubUsername: {$eq: sampleUser2.name} });
        expect(handler.entityManager.persist).toBeCalledTimes(6);
        expect(handler.entityManager.flush).toBeCalledTimes(1);
      });
  });