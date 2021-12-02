import React from 'react';
import { NextPage } from 'next';
import { Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { AppLayout } from '../../components/Layout';
import { ContributionsBox } from '../../components/Contributions';

export interface Contribution {
  id: string;
  nodeID: string;
  type: string;
  score: number;
  contributedAt: Date;
  description: string | null;
  url: string;
}

const Contributions: NextPage = () => {
  const [contributions, setContributions] = React.useState<Contribution[]>([]);

  React.useEffect(() => {
    const fetchContributions = async () => {
      // Get all Contributions
      const res = await fetch('/api/contributions');
      const contributionsList = await res.json();

      // Set contribution list
      setContributions(contributionsList);
    };

    fetchContributions();
  }, []);

  return (
    <AppLayout>
      <VStack spacing={3}>
        <Heading>Contributions</Heading>
      </VStack>
      {contributions.length <= 0 ? (
        <Text>No Projects Found</Text>
      ) : (
        <SimpleGrid padding="4px" minChildWidth="250px" spacing="15px">
          {contributions.map((contribution) => (
            <ContributionsBox key={contribution.id} {...contribution} />
          ))}
        </SimpleGrid>
      )}
    </AppLayout>
  );
};

export default Contributions;
