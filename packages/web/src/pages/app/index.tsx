import { Heading,Link, Button } from '@chakra-ui/react';
import { NextPage } from 'next';
import { AppLayout } from '../../components/Layout';

const AppHome: NextPage = () => {
  return (
    <AppLayout>
      <Heading>App Home</Heading>
      <Link href="/api/auth/github/logout">
          <Button as="a" size="sm" colorScheme="blue">
            Logout
          </Button>
        </Link>
    </AppLayout>
  );
};

export default AppHome;
