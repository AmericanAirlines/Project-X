import { Router } from 'express';
import { Project } from '../entities/Project';
import logger from '../logger';
import { env } from '../env';

export const project = Router();

project.get('/', async (req, res) => {
    try {
      const projectList = await req.entityManager.find(Project, {});
      
      const repoNodeIds: string[] = [];

      projectList.forEach(repo => repoNodeIds.push(repo.nodeID));

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
        const errorMessage = "There was an issue getting the projects";
        logger.error(errorMessage, error);
        res.status(500).send(errorMessage);
    }  
});