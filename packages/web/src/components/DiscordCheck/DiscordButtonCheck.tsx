import React from 'react';
// import { useRouter } from 'next/router';
import { Button, HStack, Spacer, Box } from '@chakra-ui/react';
import { FaDiscord } from 'react-icons/fa';

interface User {
  name: string;
  pronouns?: string;
  schoolName?: string;
  discordId?: string;
}

export interface UserProfileProps {
  user: User;
}

export const DiscordButtonCheck: React.FC<UserProfileProps> = ({ user }: UserProfileProps) => {
  return (
    <Box border="1px" borderColor="gray.200" boxShadow="base" p={3}>
      {user.discordId ? (
        <>
          <HStack>
            <Spacer />
            <Button
              as="a"
              href="https://discord.com/"
              bg="discord.400"
              textColor="white"
              leftIcon={<FaDiscord color="white" />}
            >
              Go to Discord
            </Button>
            <Spacer />
          </HStack>
        </>
      ) : (
        <>
          <HStack>
            <Spacer />
            <Button
              as="a"
              href="/api/auth/discord/login"
              bg="discord.400"
              textColor="white"
              leftIcon={<FaDiscord color="white" />}
            >
              Join our Discord
            </Button>
            <Spacer />
          </HStack>
        </>
      )}
    </Box>
  );
};
