import { Router } from 'express';
import { Repository } from '../entities/Repository';
import logger from '../logger';
import { env } from '../env';

export const repository = Router();

repository.get('/', async (req, res) => {
    try {
      const repositoryList = await req.entityManager.find(Repository, {});
      
      const repoNodeIds: string[] = [];

      repositoryList.forEach(repo => repoNodeIds.push(repo.nodeID));

      // Put in a utility
      const fetchRes = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${env.gitHubGraphQLPAT}`, // Use user's token from session instead
        },
        body: JSON.stringify({
          query: `
            query ($id: [ID!]!){
              nodes(ids: $id){
                ...on Repository{
                  name
                  url
                  stargazerCount
                  description
                }
              }
            }
            `,
            variables: {
              id: repoNodeIds,
            }
        }),
    });
    
    res.status(fetchRes.status).send(await fetchRes.json());
      
    }
    catch(error) {
        logger.error(`There was an issue getting the repositories`, error);
        res.status(500).send(`There was an issue getting the repositories`);
    }  
});