import React from 'react';
import { NextPage } from 'next';
import { AppLayout } from '../../components/Layout';
import { useRouter } from 'next/router';
import { UserProfile } from '../../components/userprofile/UserProfile';
import { Alert, AlertIcon } from '@chakra-ui/alert';

export interface User {
  id: string;
  name: string;
  pronouns?: string;
  schoolName?: string;
  discordId?: string;
}

const UserProfilePage: NextPage = () => {
  const router = useRouter();
  const { uid } = router.query;

  const [user, setUser] = React.useState<User>();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isCurrentUser, setIsCurrentUser] = React.useState(false);
  const [didCheckCurrentUser, setDidCheckCurrentUser] = React.useState(false);

  React.useEffect(() => {
    const fetchUser = async () => {
      if (!Number.isNaN(Number(uid))) {
        try {
          const res = await fetch(`/api/users/${uid}`);
          const data = await res.json();

          setUser(data);
        } catch {
          setErrorMessage('User could not be found');
        }
      } else {
        setErrorMessage('User id malformed');
      }
    };

    fetchUser();
  }, [uid]);

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/users/me');

        if (res.ok) {
          const data = await res.json();

          if (user && data.id == user.id) {
            setIsCurrentUser(true);
          }
        }
        setDidCheckCurrentUser(true);
      } catch {}
    };

    checkUser();
  }, [user]);

  if (user === undefined) {
    if (errorMessage == '') return null;
    else
      return (
        <AppLayout>
          <Alert status="error">
            <AlertIcon />
            {errorMessage}
          </Alert>
        </AppLayout>
      );
  } else {
    return (
      <AppLayout>
        {!didCheckCurrentUser ? (
          <Alert status="error">
            <AlertIcon />
            An error has occurred checking the currently logged in user. Please try again later.
          </Alert>
        ) : undefined}
        <UserProfile isCurrentUser={isCurrentUser} setUser={setUser} user={user} />
      </AppLayout>
    );
  }
};

export default UserProfilePage;
