import React from 'react';
import { Text, Box, Button } from '@chakra-ui/react';
import { User } from '../../pages/user/[uid]';
import { EditUserForm } from './EditUserForm';

export interface UserProfileProps {
  isCurrentUser: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  user: {
    id: string;
    name: string;
    pronouns?: string;
    schoolName?: string;
  };
}

export const UserProfile: React.FC<UserProfileProps> = (props: UserProfileProps) => {
  const [editToggle, setEditToggle] = React.useState<boolean>(false);

  if (editToggle)
    return (
      <Box border="1px" borderColor="gray.200" boxShadow="base" p={3}>
        <EditUserForm setEditToggle={setEditToggle} setUser={props.setUser} user={props.user} />
      </Box>
    );
  else {
    const editButton = props.isCurrentUser ? (
      <Button colorScheme="blue" onClick={() => setEditToggle(true)}>
        Edit
      </Button>
    ) : null;
    return (
      <Box border="1px" borderColor="gray.200" boxShadow="base" p={3}>
        <Text fontSize="6xl">{props.user.name}</Text>
        <Text fontSize="xl">{props.user.pronouns}</Text>
        <Text fontSize="xl">{props.user.schoolName}</Text>
        {editButton}
      </Box>
    );
  }
};
