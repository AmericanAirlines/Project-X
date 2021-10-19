import { NextPage } from 'next';
import { Button, Spacer, Link, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { GiCrossFlare } from 'react-icons/gi';
import { AppLayout } from '../../components/Layout';

const Home: NextPage = () => {
  return (
    <AppLayout>

        <Text textAlign="left" maxWidth="60ch" fontSize="2xl" lineHeight="2">
          Signed in!
        </Text>

    </AppLayout>

    
  );
};

export default Home;
export { getServerSideProps } from '../../components/Chakra';
