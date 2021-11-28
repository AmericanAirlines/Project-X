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
  const idArrayString: String[] = [];
  projects.map((project) => idArrayString.push(project.nodeID));

  const repoQueryBodyString = JSON.stringify({
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
      repoIds: idArrayString,
    },
  });

  try {
    const fetchRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${env.githubToken}`,
      },
      body: repoQueryBodyString,
    });

    const { data: responseData }: RepositoryResponse = await fetchRes.json();

    const queryString = responseData.nodes.map((repo) => `repo:${repo.nameWithOwner}`).join(' ');

    return queryString;
  } catch (error) {
    const errorMessage = 'There was an issue getting repository info from graphql';
    logger.error(errorMessage, error);
    return '';
  }
};
