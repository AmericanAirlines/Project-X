import { Router } from 'express';
import { Project } from '../entities/Project';
import logger from '../logger';

export const project = Router();

project.post('', async (req, res) => {
  if (req.user) {
    const { owner, repo } = req.body;
    try {
      const fetchRes = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${req.user.githubToken}`,
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
            repoName: repo,
          },
        }),
      });

      const responseData = await fetchRes.json();

      if (responseData.errors !== undefined) {
        res.status(404).send('The repository could not be found');
      } else {
        const existingProject = await req.entityManager.findOne(Project, {
          nodeID: responseData.data.repository.id,
        });
        if (!existingProject) {
          const newProject = new Project({ nodeID: responseData.data.repository.id });
          await req.entityManager.persistAndFlush(newProject);
        }

        res.send(responseData);
      }
    } catch (error) {
      const errorMessage = 'There was an issue adding the project to the database';
      logger.error(errorMessage, error);
      res.status(500).send(errorMessage);
    }
  } else {
    res.sendStatus(401);
  }
});

project.get('', async (req, res) => {
  if (req.user) {
    try {
      const projectList = await req.entityManager.find(Project, {});
      const repoNodeIds = projectList.map((repo) => repo.nodeID);

      const fetchRes = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${req.user.githubToken}`,
        },
        body: JSON.stringify({
          query: `
            query ($id: [ID!]!){
              nodes(ids: $id){
                ...on Repository{
                  name
                  url
                  stargazerCount
                  primaryLanguage {
                    name
                  }
                  description
                }
              }
            }
            `,
          variables: {
            id: repoNodeIds,
          },
        }),
      });
      res.status(fetchRes.status).send((await fetchRes.json()).data.nodes);
    } catch (error) {
      const errorMessage = 'There was an issue getting the projects';
      logger.error(errorMessage, error);
      res.status(500).send(errorMessage);
    }
  } else {
    res.sendStatus(401);
  }
});
