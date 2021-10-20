import { Router } from 'express';
import { Repository } from '../entities/Repository';
import logger from '../logger';

export const repository = Router();

// GET request
//  - If using REST api, use GET req to "/repos/{owner name}/{repo name}" (https://docs.github.com/en/rest/reference/repos#get-a-repository)
//  - In GraphQL, can either search for a repository using the owner and repository name (https://docs.github.com/en/graphql/reference/queries#repository)
//      - or can search for a node (a repository in this case) using its ID (a Base64 encoded String) (https://docs.github.com/en/graphql/reference/queries#node)
//
//  - Fields obtainable from returned Repository object: https://docs.github.com/en/graphql/reference/objects#repository
//      - Current Fields:
//          - name (name of repo)
//          - url (the url of the repo)
//          - stargazerCount (number of users who have starred the project)
//
//  - If using GraphQL: Use fetch to send a post request to https://api.github.com/graphql and pass in the query for ^ fields using the ID of the repo

repository.get('/', async (req, res) => {
    try {
      // const repositoryList = await req.entityManager.find(Repository, {});

      // Make new array with just the node id's of each repo since ^ gives the entire entity which we don't need
        // I guess just for each loop and store into new array?

        // Just testing a sample for now (this is the node is for the project-x repo)
        const idArray = ["MDEwOlJlcG9zaXRvcnk0MDQ0OTAyNDA="];

      // Use fetch and pass in the node id of each item in repository list
        const fetchRes = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application-json',
          },
          body: JSON.stringify({
            query: `
            query {
                node(id:"MDEwOlJlcG9zaXRvcnk0MDQ0OTAyNDA=") {
                 ... on repository {
                    name
                  }
                }
              }
            `
          }),
      })

      res.send(fetchRes.json);
    //   if(fetchRes.status === 200)
    //   {
    //       // send it back to res
    //       res.status(200).send(fetchRes.body);
    //   }
      
    }
    catch(error) {
        logger.error(`There was an issue getting the repositories`, error);
        res.status(500).send(`There was an issue getting the repositories`);
    }  

    });
    