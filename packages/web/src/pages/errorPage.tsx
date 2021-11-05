import { NextPage } from 'next';
import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { MarketingLayout } from '../components/Layout';

const ErrorPage: NextPage = () => {
  return (
      <MarketingLayout>
      <VStack alignItems="center" paddingTop={8} w="100%" maxW="1200px" marginX="auto">
        <Heading size="2xl" color="red" textAlign="center" lineHeight="1.4">
          Error: Make sure you have a verified &quot;.edu&quot; email linked with your GitHub account!
        </Heading>
        <HStack spacing={5}>
        <Text textAlign="center" maxWidth="60ch" fontSize="2xl" lineHeight="2">
            Click this button if you want to login again:
        </Text>
        <Button as="a" size="lg" colorScheme="gray" href="/api/auth/github/login">
            Login with GitHub
          </Button>
        </HStack>
        <HStack spacing={5}>
        <Text textAlign="center" maxWidth="60ch" fontSize="2xl" lineHeight="2">
            Click this button if you want to go back to the homepage: 
        </Text>
          <Button as="a" size="lg" colorScheme="blue" href="/">
            Home Page
          </Button>
        </HStack>
      </VStack>
      </MarketingLayout>
  );
};

export default ErrorPage;
export { getServerSideProps } from '../components/Chakra';
