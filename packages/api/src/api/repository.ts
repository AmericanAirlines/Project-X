import { Router } from 'express';
import { Repository } from '../entities/Repository';
import logger from '../logger';

// POST request (add repository to database)
// Inputs: Repository owner's name, Repository name
//      - If using REST api, use GET req to "/repos/{owner name}/{repo name}" (https://docs.github.com/en/rest/reference/repos#get-a-repository)
//          - Would then have to store the owner and repo's name in db instead of just the id
//      - In GraphQL, search for a repository using the owner and repository name (https://docs.github.com/en/graphql/reference/queries#repository)
//
//      - Could use REST api just to store Node ID of the repo into the db and then use GraphQL to search using said ID (https://docs.github.com/en/graphql/guides/using-global-node-ids) 
//      - Note if doing ^: in the REST API, there is both an "id" field and a "node" id field. We need the node id to search for repo using GraphQL
//
//
//      - After getting the repository (successfully), create a new Repository object in the db using the (node) id of the repository

export const repository = Router();

repository.post('/', async (req, res) => {
    try {
      const fetchRes = await fetch('https://api.github.com/orgs/AmericanAirlines/repos');
      
      const repos = await fetchRes.json();

    // This does add to the database
      // console.log(typeof repos[0].node_id);
      // const holdthatid = `${repos[0].node_id}`;
      // const newRepo = new Repository({nodeID: repos[0].node_id});
      // await req.entityManager.persist(newRepo);
      // await req.entityManager.flush();
  
    // This doesn't
      repos.forEach( async (repo: { name: any; node_id: any;}) => {
        // Check if user is in database
        const repoNode = new Repository({
          nodeID: repo.node_id
        });
      const currentrepo = req.entityManager.findOne(Repository, {nodeID: repo.node_id});
      if(!currentrepo)
      {
       await req.entityManager.persistAndFlush(repoNode);
      }
       
  
      });
      // await req.entityManager.flush();    
  
      res.status(201).send();
    }
    catch(error) {
      logger.error(`There was an issue`, error);
      res.status(500).send(`There was an issue`);
  }
  
  
  
  
  
  });
      