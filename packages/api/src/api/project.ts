import { Router } from 'express';
import { Project } from '../entities/Project';
import logger from '../logger';
import { env } from '../env'

export const project = Router();

project.post('/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;

  try {
    const fetchRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${env.githubGraphQLPAT}`,
      },
      body: JSON.stringify({
        query: `
          query ($ownerName: String!, $repoName: String!) {
            repository(owner:$ownerName, name:$repoName) {
              id
            }
          }
          `,
          variables: {
            ownerName: owner,
            repoName: repo
          }
        }),
    });

    const responseData = await fetchRes.json();

    if(responseData.errors !== undefined)
    {
      res.status(404).send("The repository could not be found");
    }
    else
    {      
      if (!(await req.entityManager.findOne(Project, { nodeID: responseData.data.repository.id }))) 
      {
        const newProject = new Project({ nodeID: responseData.data.repository.id });
        await req.entityManager.persistAndFlush(newProject);
      }

      res.send(responseData);
    }
  }
  catch (error) {
    const errorMessage = 'There was an issue adding the project to the database'
    logger.error(errorMessage, error);
    res.status(500).send(errorMessage);
  }
});