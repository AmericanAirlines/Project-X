import { Router } from 'express';
import { Repository } from '../entities/Repository';

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