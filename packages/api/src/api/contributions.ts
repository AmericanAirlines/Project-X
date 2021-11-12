import { Router } from 'express';
import { Contribution } from '../entities/Contribution';
import logger from '../logger';

export const contributions = Router();

contributions.get('', async (req, res) => {
  if (req.user) {
    try {
      const allContributionsList = await req.entityManager.find(Contribution, {});
      const contributionNodeIds = allContributionsList.map((contribution) => contribution.nodeID);

      const fetchAllContributionsRes = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${req.user.githubToken}`,
        },
        body: JSON.stringify({
          query: `
                query ($contributionArray: [ID!]!){
                    nodes(ids: $contributionArray){
                    ...on PullRequest{
                        id
                        viewerDidAuthor
                    }
                    }
                }
                `,
          variables: {
            contributionArray: contributionNodeIds,
          },
        }),
      });

      const allContributions = await fetchAllContributionsRes.json();

      const curUserContributionsJSON = allContributions.data.nodes.filter(
        (contribution: { viewerDidAuthor: boolean }) => contribution.viewerDidAuthor === true,
      );
      const curUserContributionsNodeIds: string[] = curUserContributionsJSON.map(
        (contribution: { id: string }) => contribution.id,
      );

      const allCurUserContributionsList = await req.entityManager.find(Contribution, {
        nodeID: curUserContributionsNodeIds,
      });

      res.send(allCurUserContributionsList);
    } catch (error) {
      const errorMessage = 'There was an issue returning the contributions.';
      logger.error(errorMessage, error);
      res.status(500).send(errorMessage);
    }
  } else {
    res.status(401).send('You must be logged in to view your contributions.');
  }
});
