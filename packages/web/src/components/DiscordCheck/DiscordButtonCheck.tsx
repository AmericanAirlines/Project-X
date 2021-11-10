import React from 'react';
import { Button, Heading, HStack, Spacer, VStack } from '@chakra-ui/react';
import { FaDiscord } from 'react-icons/fa';

export const DiscordButtonCheck: React.FC = ({ children }) => {
  return (
        <HStack>
            <Spacer />
            <Button as="a" href="/api/auth/discord/login" bg="discord.400" textColor="white" leftIcon={<FaDiscord color="white"/>}>
              {/* <Link _hover={{ textDecoration: 'none' }} href="/api/auth/discord/login"> */}
                Join our Discord
              {/* </Link> */}
            </Button>
            <Spacer />
      </HStack>
  );
};
