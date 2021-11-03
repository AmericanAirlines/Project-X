import React from 'react';
import { NextPage } from 'next';
import { MarketingLayout } from '../../components/Layout';
import { useRouter } from 'next/router';
import { UserProfile } from '../../components/userprofile/UserProfile';
import { Alert, AlertIcon } from '@chakra-ui/alert';

export interface User {
  name: string;
  pronouns?: string;
  schoolName?: string;
}

const UserProfilePage: NextPage = () => {
  const router = useRouter();
  const { uid } = router.query;

  const [user, setUser] = React.useState<User>();
  const [errorMessage, setErrorMessage] = React.useState<string>('');

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
        <UserProfile {...user} />
        {/* Add "edit" button (Only if current profile page is currently logged in user's)
          - As stated in my comments in NavProfileMenu.tsx, may need to create new blank GET route on users api to get currently logged in user's info
          - When the edit button is clicked, go to a new EditUserProfile component (pass in user state to fill in current info)
            - 2 routes to emulate:
              - GitHub: change out "profile section" (place with name, bio, etc.) with the update form
              - Twitter: Have modal pop up on screen with form to change
            - EditUserProfile component will have: 
              - Form with current information filled in
              - Save / Submit button to send edited data to PATCH route
              - Cancel button
          - On submit, fetch PATCH request to /users/{currently logged in user's uid}
            - If error, make error popup appear describing the error
        */}
      </MarketingLayout>
    );
  }
};

export default UserProfilePage;
