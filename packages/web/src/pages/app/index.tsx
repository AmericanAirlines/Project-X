import { NextPage } from 'next';
import { Heading } from '@chakra-ui/react';
import { AppLayout } from '../../components/Layout';

const AppHome: NextPage = () => {
  return (
    <AppLayout>
      <Heading>App Home</Heading>
    </AppLayout>
  );
};

export default AppHome;
