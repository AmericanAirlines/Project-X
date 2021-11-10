import express, { Router } from 'express';
import { Contribution, ContributionConstructorValues } from '../entities/Contribution';
import logger from '../logger';

export const contributions = Router();

contributions.get('', async (req, res) => {
    if(req.user)
    {
        try {
            /*
            * Plan: (fetch) search all contributions by the node id of all of the PRs in our DB, filter to only have the contributions with the current user's nodeID, and return the result
            */

    // GraphQL to see which of the contributions are by the currently logged in user:
    //
    //         const fetchRes = await fetch('https://api.github.com/graphql', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `bearer ${req.user.githubToken}`,
    //     },
    //     body: JSON.stringify({
    //         query: `
    //           query ($contributionArray: [ID!]!){
    //             nodes(ids: $contributionArray){
    //               ...on PullRequest{
    //                 id
    //                 viewerDidAuthor
    //               }
    //             }
    //           }
    //           `,
    //         variables: {
    //           contributionArray: listOfContributionIds,  <-- An array of all of the node ids from the contribution table in the DB
    //         },
    //       }),
    //   });

        }
        catch (error)
        {
            const errorMessage = 'There was in issue returning the contributions.';
            logger.error(errorMessage, error);
            res.status(500).send(errorMessage);
        }
    }
    else
        res.status(401).send("You must be logged in.");
});