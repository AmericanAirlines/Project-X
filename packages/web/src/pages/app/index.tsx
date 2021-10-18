import { NextPage } from 'next';
import { Button, Spacer, Link, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { GiCrossFlare } from 'react-icons/gi';

const Home: NextPage = () => {
  return (
    <VStack alignItems="stretch" paddingTop={8} w="100%" maxW="1200px" marginX="auto">
      <HStack paddingX={4}>
        <GiCrossFlare size="36px" />
        <Heading>Project X</Heading>
        <Spacer />
        <Link href="/api/auth/github/logout">
          <Button as="a" size="sm" colorScheme="blue">
            Logout
          </Button>
        </Link>
      </HStack>

        <Text textAlign="left" maxWidth="60ch" fontSize="2xl" lineHeight="2">
          Signed in!
        </Text>
        
    </VStack>

    
  );
};

export default Home;
export { getServerSideProps } from '../../components/Chakra';