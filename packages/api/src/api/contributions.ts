import express, { Router } from 'express';
import { env } from '../env';
import { Contribution } from '../entities/Contribution';
import { User } from '../entities/User';
import logger from '../logger';
import { Project } from '../entities/Project';


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

export interface Repository {
  id: string;
  nameWithOwner: string;
}

interface ContributionResponse {
  data: {
    search: {
      nodes: PullRequestContribution[];
    }
  } 
}

interface RepositoryResponse {
  data: {   
    nodes: Repository[];    
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
          results:search (first: 100, after: "Y3Vyc29yOjE=", query: ${buildProjectsQuery(projects)} is:pr is:merged merged:${buildDateQuery()} ${buildUsersQuery(users)}, type: ISSUE) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
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

    // Save new info in the db
    void req.entityManager.flush();

    res.send('done');
        
  } catch (error) {
    const errorMessage = 'There was an issue saving contribution data to the database';
    logger.error(errorMessage, error);
    res.status(500).send(errorMessage);
  }
      
});

const buildProjectsQuery = async (projects: Project[]) => {
  let idString = "";

  projects.forEach(p => {idString += (`"${p.nodeID}",`)});

  idString = idString.substring(0, idString.length - 1);

  const repoQueryString = `
    query { 
      nodes(ids: [${idString}]){
        ... on Repository {
          id
          nameWithOwner
        }    
      }
    }
  `
  const fetchRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${env.githubToken}`,
      },
      body: JSON.stringify({
        query: repoQueryString,
      }),
    });
  
  const {data: responseData} : RepositoryResponse = await fetchRes.json();

  let queryString = "";

  responseData.nodes.forEach(repo => {queryString += (`repo: ${repo.nameWithOwner} `)});

  return queryString;
}

const buildUsersQuery = (users: User[]) => {
  let queryString = ""

  users.forEach(u => {queryString += (`author: ${u.githubUsername} `)});
  return queryString;
}

const buildDateQuery = () => {
  let queryString = ""

  
  return queryString;
}

