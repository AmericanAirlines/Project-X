import React from 'react';
import { Button, Box, Alert, AlertIcon } from '@chakra-ui/react';
import { FaDiscord } from 'react-icons/fa';
import { User } from '../userprofile/UserProfile';

export const DiscordButton: React.FC = () => {
  const [user, setUser] = React.useState<User | undefined>();
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/me`);
        const data = await res.json();

        setUser(data);
      } catch {
        setErrorMessage('User could not be found');
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    if (errorMessage == '') return null;
    else
      return (
        <Alert status="error">
          <AlertIcon />
          {errorMessage}
        </Alert>
      );
  } else {
    return (
      <Box>
        {user.discordId ? (
          <Button
            as="a"
            href="https://discord.com/"
            bg="discord.400"
            textColor="white"
            leftIcon={<FaDiscord color="white" />}
          >
            Go to Discord
          </Button>
        ) : (
          <Button
            as="a"
            href="/api/auth/discord/login"
            bg="discord.400"
            textColor="white"
            leftIcon={<FaDiscord color="white" />}
          >
            Join our Discord
          </Button>
        )}
      </Box>
    );
  }
};
