import { Router } from 'express';
import { RepoList } from '../entities/Repositories';
import logger from '../logger';

export const repos = Router();

repos.get('', async (req, res) => {
  try {
    const repoList = await req.entityManager.find(RepoList, {});

    res.status(200).send(repoList);
  } catch (error) {
    logger.error('There was an issue geting all repo: ', error);
    res.status(500).send('There was an issue geting all repo');
  }
});

repos.get('/:repoId', async (req, res) => {
  const { repoId } = req.params;

  try {
    // Check if repoId is in the expected format
    if (Number.isNaN(Number(repoId))) {
      res.status(400).send(`"${repoId}" is not a valid id, it must be a number.`);
      return;
    }

    const repo = await req.entityManager.findOne(RepoList, { id: repoId });

    if (!repo) {
      res.sendStatus(404);
      return;
    }

    res.status(200).send(repo);
  } catch (error) {
    logger.error(`There was an issue geting repo "${repoId}"`, error);
    res.status(500).send(`There was an issue geting repo "${repoId}"`);
  }
});
