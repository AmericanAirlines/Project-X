import { NextPage } from 'next';
import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { MarketingLayout } from '../components/Layout';

const Home: NextPage = () => {
  return (
    <MarketingLayout>
      <VStack alignItems="center" paddingY={32} spacing={8}>
        <Heading size="4xl" textAlign="center" lineHeight="1.4">
          The Web App Template of the Emerging Tech EOA Team
        </Heading>
        <Text textAlign="center" maxWidth="60ch" fontSize="2xl" lineHeight="2">
          You&apos;ve got a production ready React.js frontend (with Dark Mode) and Express.js
          backend. It is written in Typescript and has 100% test coverage.
          <br />
          Now go build something cool!
        </Text>
        <HStack spacing={8}>
          <Button size="lg" colorScheme="blue">
            Primary
          </Button>
          <Button size="lg" colorScheme="gray">
            Secondary
          </Button>
        </HStack>
      </VStack>
    </MarketingLayout>
  );
};

export default Home;
