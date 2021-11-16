import React from 'react';
import { EditUserForm } from './EditUserForm';
import { useRouter } from 'next/router';
import { Heading, HStack, Spacer, useTheme, VStack, Text, Box, Button } from '@chakra-ui/react';

interface User {
  id: string;
  name: string;
  pronouns?: string;
  schoolName?: string;
  discordId?: string;
}

export interface UserProfileProps {
  user: User;
  setUser(user: User): void;
  isCurrentUser: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  setUser,
  isCurrentUser,
}: UserProfileProps) => {
  const [editToggle, setEditToggle] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  //function makes patch call for discord = undefined
  const router = useRouter();
  const { uid } = router.query;

  const unlinkDiscordId = async () => {
    setErrorMessage('');
    const res = await fetch(`/api/users/${uid}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        discordId: undefined,
      }),
    });
    if (!res.ok) {
      setErrorMessage('Unable to unlink Discord Account');
      return;
    }
    const newUser = await res.json();
    setUser(newUser);
  };

  if (editToggle)
    return (
      <Box border="1px" borderColor="gray.200" boxShadow="base" p={3}>
        <EditUserForm setEditToggle={setEditToggle} setUser={setUser} user={user} />
      </Box>
    );
  else {
    const editButton = isCurrentUser ? (
      <Button colorScheme="blue" onClick={() => setEditToggle(true)}>
        Edit
      </Button>
    ) : null;

    return (
      <Box border="1px" borderColor="gray.200" boxShadow="base" p={3}>
        {user.discordId ? (
          <>
            <Text fontSize="xl"> Your discord account is linked with: {user.discordId} </Text>
            <Button size="md" colorScheme="blue" onClick={unlinkDiscordId}>
              Unlink Discord Account
            </Button>
            <Text>{errorMessage}</Text>
          </>
        ) : (
          <>
            <Text fontSize="xl">
              {' '}
              After linking you&apos;ll be able to join our community and talk with others from
              Project X on a variety of topics.{' '}
            </Text>
            <Button as="a" size="sm" colorScheme="blue" href="/api/auth/discord/login">
              Login with Discord
            </Button>
          </>
        )}
        <Text fontSize="6xl">{user.name}</Text>
        <Text fontSize="xl">{user.pronouns}</Text>
        <Text fontSize="xl">{user.schoolName}</Text>
        {editButton}
      </Box>
    );
  }
};
