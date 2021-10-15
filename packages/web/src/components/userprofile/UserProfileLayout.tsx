import React from 'react';
import { Heading, HStack, Spacer, useTheme, VStack, Text, Box } from '@chakra-ui/react';

export interface UserProfileData {
  name: string;
  pronouns?: string;
  location?: string;
  hireable: boolean;
  purpose: string;
  schoolName?: string;
  major?: string;
  graduationDate?: Date;
}

export const UserProfileLayout: React.FC<UserProfileData> = (user: UserProfileData) => {
  const theme = useTheme();

  // Currently only showing the "non-sensitive fields" (see users API)
  return (
    <Box border="1px" borderColor="gray.200" boxShadow="base" p={3}>
      <Text fontSize="6xl">{user.name}</Text>
      <Text fontSize="xl">{user.pronouns}</Text>
      <Text fontSize="xl">{user.schoolName}</Text>
    </Box>
  );
};
