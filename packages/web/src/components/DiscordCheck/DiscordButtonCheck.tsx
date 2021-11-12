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
                <Button as="a" href="/api/auth/discord/login" bg="discord.400" textColor="white" leftIcon={<FaDiscord color="white"/>}>
                    {/* <Link _hover={{ textDecoration: 'none' }} href="/api/auth/discord/login"> */}
                      You are logged in, redirect to somewhere else
                     {/* </Link> */}
                </Button>
              <Spacer />
          </HStack>
        </>
      ) : (
        <>
         <HStack>
          <Spacer />
              <Button as="a" href="/api/auth/discord/login" bg="discord.400" textColor="white" leftIcon={<FaDiscord color="white"/>}>
                  {/* <Link _hover={{ textDecoration: 'none' }} href="/api/auth/discord/login"> */}
                   Join our Discord
                {/* </Link> */}
              </Button>
          <Spacer />
        </HStack>
        </>
      )}
    </Box>
  );
};