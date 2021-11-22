import { NextPage } from 'next';
import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { MarketingLayout } from '../components/Layout';

const InvalidEmail: NextPage = () => {
  return (
    <MarketingLayout>
      <VStack alignItems="strech" paddingTop={8} w="100%" maxW="1200px" marginX="auto">
        <Heading size="lg" textAlign="center">
          Error: Make sure you have a verified &quot;.edu&quot; email linked with your GitHub
          account!
        </Heading>
        <Text textAlign="center" maxWidth="60ch" alignSelf="center" fontSize="2xl">
          Try again once you&apos;ve verified your student email address 👇
        </Text>
        <Button as="a" size="lg" colorScheme="gray" w="60%" alignSelf="center" href="/api/auth/github/login">
          Login with GitHub
        </Button>
        <Text textAlign="center" maxWidth="60ch" alignSelf="center" fontSize="2xl">
          Click this button if you want to go back to the homepage 👇
        </Text>
        <Button as="a" size="lg" colorScheme="blue" w="60%" alignSelf="center" href="/">
          Home Page
        </Button>
      </VStack>
    </MarketingLayout>
  );
};

export default InvalidEmail;
