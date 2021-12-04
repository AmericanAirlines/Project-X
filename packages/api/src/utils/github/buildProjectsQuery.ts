import { Project } from '../../entities/Project';
import { env } from '../../env';
import logger from '../../logger';

interface Repository {
  id: string;
  nameWithOwner: string;
}

interface RepositoryResponse {
  data: {
    nodes: Repository[];
  };
}

export const buildProjectsQuery = async (projects: Project[]) => {
  const repoNodeIds = projects.map((project) => project.nodeID);

  const findReposQuery = JSON.stringify({
    query: `
      query FindRepositories($repoIds: [ID!]!) { 
        nodes(ids: $repoIds){
          ... on Repository {
            id
            nameWithOwner
          }    
        }
      }
    `,
    variables: {
      repoIds: repoNodeIds,
    },
  });

  try {
    const fetchRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${env.githubToken}`,
      },
      body: findReposQuery,
    });

    if (!fetchRes.ok) {
      logger.error('The repository query to GitHub has failed');
      throw new Error(await fetchRes.text());
    }

    const { data: responseData }: RepositoryResponse = await fetchRes.json();

    const projectsQuery = responseData.nodes.map((repo) => `repo:${repo.nameWithOwner}`).join(' ');

    return projectsQuery;
  } catch (error) {
    const errorMessage = 'There was an issue getting repository info from graphql';
    logger.error(errorMessage, error);
    return null;
  }
};
