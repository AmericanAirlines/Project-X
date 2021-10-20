import { Router } from 'express';

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