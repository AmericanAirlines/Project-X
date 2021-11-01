import React from 'react';
import { Heading, HStack, Spacer, useTheme, VStack, Text, Box, Button } from '@chakra-ui/react';

export interface UserProfileProps {
  name: string;
  pronouns?: string;
  schoolName?: string;
  discordId?:string;
}

export const UserProfile: React.FC<UserProfileProps> = (user: UserProfileProps) => {
  if(user.discordId===undefined){
    return (
      <Box border="1px" borderColor="gray.200" boxShadow="base" p={3}>
        <Text fontSize="xl"> After linking you'll be able to join our community and talk with others from Project X on a variety of topics. </Text>
        <Button as="a" size="sm" colorScheme="blue" href="/api/auth/discord}">
          Login with Discord
        </Button>
        <Text fontSize="6xl">{user.name}</Text>
        <Text fontSize="xl">{user.pronouns}</Text>
        <Text fontSize="xl">{user.schoolName}</Text>
      </Box>
    );
  }
  else{
    return (
      <Box border="1px" borderColor="gray.200" boxShadow="base" p={3}>
        <Text fontSize="xl"> Your discord account is linked with: {user.discordId} </Text>
        <Button as="a" size="md" colorScheme="blue" href="">
          Unlink Discord Account 
        </Button>
        <Text fontSize="6xl">{user.name}</Text>
        <Text fontSize="xl">{user.pronouns}</Text>
        <Text fontSize="xl">{user.schoolName}</Text>
      </Box>
    );  
  }
};
