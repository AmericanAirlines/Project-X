import express, { Router } from 'express';
import { env } from '../env';
import { Contribution } from '../entities/Contribution';
import { User } from '../entities/User';
import logger from '../logger';
import { type } from 'os';

export const contributions = Router();
contributions.use(express.json());

export interface PullRequestContribution {
  id: string;
  title: string;
  permalink: string;
  mergedAt: string;
  author: {
    login: string;
  }
}

interface ContributionResponse {
  data: {
    search: {
      nodes: PullRequestContribution[];
    }
  } 
}


contributions.get('', async (req, res) => {
  try {
      // Find a way to persist this instead of recalculating it
      // const lastRun = Date.now() as unknown as Date;
      // lastRun.setHours(lastRun.getDate() - 1);

      // const usersList = await req.entityManager.find(User, {
      //   contributionsLastCheckedAt: {
      //       $lt: lastRun
      //     },
      // });

      // Call GraphQL query for each user in userList at once
        
        const fetchRes = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${env.githubToken}`,
          },
          body: JSON.stringify({
            query: `
            {
              search(first: 100, query: "repo:AmericanAirlines/Project-X repo:AmericanAirlines/simple-env is:pr is:merged merged:2020-01-01..2021-11-01 author:TevinBeckwith author:SpencerKeisen", type:ISSUE)
              {
                nodes{
                  ... on PullRequest {
                    id
                    title
                    permalink
                    mergedAt
                    author {
                      login
                    }
                  }           
                }
              }
            }
                `,
          }),
        });
  
        const {data: responseData} : ContributionResponse = await fetchRes.json();

        for (const pr of responseData.search.nodes.entries()) {
          const newContribution = new Contribution({
            nodeID: pr[1].id,
            type: 'Pull Request',
            description: pr[1].title,
            contributedAt: new Date(Date.parse(pr[1].mergedAt)),
            score: 100,
          })
          
          req.entityManager.persist(newContribution);
        }

        void req.entityManager.flush();

        res.send('done');
        
      } catch (error) {
        const errorMessage = 'There was an issue saving contribution data to the database';
        logger.error(errorMessage, error);
        res.status(500).send(errorMessage);
      }
      // Persist new info in the db
  });