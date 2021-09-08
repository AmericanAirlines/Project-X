import { NextPage } from 'next';
import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { MarketingLayout } from '../components/Layout';

const Home: NextPage = () => {
  return (
    <MarketingLayout>
      <VStack alignItems="center" paddingY={32} spacing={8}>
        <Heading size="4xl" textAlign="center" lineHeight="1.4">
          Hands On Enterprise Experience with American Airlines
        </Heading>
        <Text textAlign="center" maxWidth="60ch" fontSize="2xl" lineHeight="2">
          Come work with us on Open Source projects, get mentorship from industry professionals, and
          work towards an interview to join us full time!
        </Text>
        <HStack spacing={8}>
          <Button
            size="lg"
            backgroundColor="blue.800"
            color="gray.50"
            _hover={{ backgroundColor: 'blue.900' }}
          >
            Get Access
          </Button>
          <Button size="lg" colorScheme="gray">
            Join our Discord
          </Button>
        </HStack>
      </VStack>
    </MarketingLayout>
  );
};

export default Home;
