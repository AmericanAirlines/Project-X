import React from 'react';
import { NextPage } from 'next';
import { MarketingLayout } from '../../components/Layout';
import { useRouter } from 'next/router';
import { UserProfileLayout, UserProfileData } from '../../components/UserProfile/UserProfileLayout';
import { Alert, AlertIcon } from '@chakra-ui/alert';
export { getServerSideProps } from '../../components/Chakra';

const UserProfile: NextPage = () => {
  const router = useRouter();
  const { uid } = router.query;

  const [user, setUser] = React.useState<UserProfileData>();
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  React.useEffect(() => {
    const fetchStatus = async () => {
      if (!Number.isNaN(Number(uid))) {
        const userAPIQuery: string = '/api/users/' + uid;

        // If uid doesn't exist in database, throw the 400 error from users API
        try {
          const res = await fetch(userAPIQuery);
          const data = await res.json();

          setUser(data);
        } catch {
          setErrorMessage('User could not be found');
        }
      }
      // If no uid parameter provided, when login is implemented, should use user id from session (if logged in)
      else {
        if (uid == null) {
          setErrorMessage('Login not setup yet');
        } // If uid parameter is not a number
        else {
          setErrorMessage('id must be an integer');
        }
      }
    };

    fetchStatus();
  }, [uid]);

  if (user === undefined) {
    if (errorMessage == '') return null;
    else
      return (
        <MarketingLayout>
          <Alert status="error">
            <AlertIcon />
            {errorMessage}
          </Alert>
        </MarketingLayout>
      );
  } else {
    return (
      <MarketingLayout>
        <UserProfileLayout {...user} />
      </MarketingLayout>
    );
  }
};

export default UserProfile;
