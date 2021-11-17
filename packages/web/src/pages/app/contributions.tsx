import React from 'react';
import { NextPage } from 'next';
import { Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { AppLayout } from '../../components/Layout';
import { ContributionsBox } from '../../components/Contributions';

export interface ContributionsList {
  id: string;
  nodeID: string;
  type: string;
  score: number;
  contributedAt: Date;
  description: string | null;
  url: string;
}

const Contributions: NextPage = () => {
  const [Contributions, setContributions] = React.useState<ContributionsList[]>([]);

  React.useEffect(() => {
    const fetchContributions = async () => {
      // Get all Contributions
      const res = await fetch('/api/contributions');
      const ContributionsList = await res.json();

      // Set contribution list
      setContributions(ContributionsList);
    };

    fetchContributions();
  }, []);

  return (
    <AppLayout>
      <VStack spacing={3}>
        <Heading>Contributions</Heading>
      </VStack>
      {Contributions.length <= 0 ? (
        <Text>No Projects Found</Text>
      ) : (
        <SimpleGrid padding="4px" minChildWidth="250px" spacing="15px">
          {Contributions.map((contribute) => (
            <ContributionsBox key={contribute.id} cbox={contribute} />
          ))}
        </SimpleGrid>
      )}
    </AppLayout>
  );
};

export default Contributions;
