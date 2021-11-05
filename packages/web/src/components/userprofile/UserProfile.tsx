import React from 'react';
import {
  Heading,
  HStack,
  Spacer,
  useTheme,
  VStack,
  Text,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { User } from '../../pages/user/[uid]';

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
  const formik = useFormik({
    initialValues: {
      name: props.user.name,
      pronouns: props.user.pronouns,
      schoolName: props.user.schoolName,
    },
    onSubmit: async (data) => {
      console.log(data);
      const res = await fetch(`/api/users/${props.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      props.setUser(await res.json());
      setEditToggle(!editToggle);
    },
  });

  const [editToggle, setEditToggle] = React.useState<boolean>(false);

  if (editToggle)
    return (
      <Box border="1px" borderColor="gray.200" boxShadow="base" p={3}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" isRequired>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </FormControl>
          <FormControl id="pronouns">
            <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
            <Input
              id="pronouns"
              name="pronouns"
              type="text"
              value={formik.values.pronouns}
              onChange={formik.handleChange}
            />
          </FormControl>
          <FormControl id="schoolName">
            <FormLabel htmlFor="schoolName">School Name</FormLabel>
            <Input
              id="schoolName"
              name="schoolName"
              type="text"
              value={formik.values.schoolName}
              onChange={formik.handleChange}
            />
          </FormControl>
          <ButtonGroup>
            <Button type="submit" colorScheme="green">
              Submit
            </Button>
            <Button
              type="reset"
              onClick={() => {
                formik.resetForm();
                setEditToggle(!editToggle);
              }}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      </Box>
    );
  else {
    const editButton = props.isCurrentUser ? (
      <Button colorScheme="blue" onClick={() => setEditToggle(!editToggle)}>
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
