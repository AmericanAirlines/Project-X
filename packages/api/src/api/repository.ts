import { Router } from 'express';
import { Repository } from '../entities/Repository';
import logger from '../logger';

export const repository = Router();

repository.post('/', async (req, res) => {
    try {
      const fetchRes = await fetch('https://api.github.com/orgs/AmericanAirlines/repos');
      
      const repos = await fetchRes.json();
  
      for(let i = 0; i < repos.length; i += 1)
      {
        const currentrepo = await req.entityManager.findOne(Repository, {nodeID: repos[i].node_id});
        if(!currentrepo)
        {
          const newRepo = new Repository({nodeID: repos[i].node_id});
          await req.entityManager.persist(newRepo);
        }
      }
      
      await req.entityManager.flush();

      res.status(201).send(repos);
    }
    catch(error) {
      logger.error(`There was an issue adding the repo(s) to the database`, error);
      res.status(500).send(`There was an issue adding the repo(s) to the database`);
  }
  
  
  
  
  
  });
      