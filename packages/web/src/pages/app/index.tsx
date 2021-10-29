import { NextPage } from 'next';
import { Heading } from '@chakra-ui/react';
import { AppLayout } from '../../components/Layout';

const AppHome: NextPage = () => {
  return (
    <AppLayout>
      <Text textAlign="left" maxWidth="60ch" fontSize="2xl" lineHeight="2">
        Signed in!
      </Text>
    </AppLayout>
  );
};

export default AppHome;
export { getServerSideProps } from '../../components/Chakra';
