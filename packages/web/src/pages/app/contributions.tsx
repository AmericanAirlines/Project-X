import React from 'react';
import { NextPage } from 'next';
import { Heading, SimpleGrid, VStack } from '@chakra-ui/react';
import { AppLayout } from '../../components/Layout';

export interface ContributionsList {
  nodeID: string;
  type: string;
  score: number;
  contributedAt: Date;
  description: string | null;
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
      console.log(ContributionsList);
    };

    fetchContributions();
  }, []);

  return (
    <AppLayout>
      <VStack spacing={3}>
        <Heading>Contributions</Heading>
      </VStack>
    </AppLayout>
  );
};

export default Contributions;
