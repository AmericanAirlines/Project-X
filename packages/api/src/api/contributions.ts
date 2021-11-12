import express, { Router } from 'express';
import { env } from 'process';
import { Contribution } from '../entities/Contribution';
import { User } from '../entities/User';
import logger from '../logger';

export const contributions = Router();
contributions.use(express.json());


contributions.get('', async (req, res) => {
  try {
      // Find a way to persist this instead of recalculating it
      //const lastRun = Date.now() as unknown as Date;
      //lastRun.setHours(lastRun.getDate() - 1);

      // const usersList = await req.entityManager.find(User, {
      //   contributionsLastCheckedAt: {
      //       $lt: lastRun
      //     },
      // });

      // Call GraphQL query for each user in userList at once
        console.log(req.user)
        const fetchRes = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${env.githubToken}`,
          },
          body: JSON.stringify({
            query: `
            query { 
              node(id: "MDEwOlJlcG9zaXRvcnk0MDQ0OTAyNDA=") {
                ... on Repository {
                  id
                  name
                  pullRequests (last: 100, states: [MERGED], ) {
                    edges {
                      node{
                        ... on PullRequest {
                          id
                          title
                          state
                          closedAt
                          author {
                            login
                          }
                        }           
                      }
                    }
                  }
                }   
              }	
            }
                `,
          }),
        });
  
        const responseData = await fetchRes.json();
    
        res.send(responseData);
        
      } catch (error) {
        const errorMessage = 'There was an issue saving contribution data to the database';
        logger.error(errorMessage, error);
        res.status(500).send(errorMessage);
      }
      // Persist new info in the db

      // use setTimeout to cause infinit loop of calling this endpoint every hour
  });