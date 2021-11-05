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

export interface UserProfileProps {
  id: string;
  name: string;
  pronouns?: string;
  schoolName?: string;
}

export const UserProfile: React.FC<UserProfileProps> = (user: UserProfileProps) => {
  const formik = useFormik({
    initialValues: {
      name: user.name,
      pronouns: user.pronouns,
      schoolName: user.schoolName,
    },
    onSubmit: async (data) => {
      console.log(data);
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log(await res.json());
    },
  });

  const [editToggle, setEditToggle] = React.useState<boolean>(false);

  if (editToggle)
    return (
      <Box border="1px" borderColor="gray.200" boxShadow="base" p={3}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="editUser">
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
            />

            <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
            <Input
              id="pronouns"
              name="pronouns"
              type="text"
              value={formik.values.pronouns}
              onChange={formik.handleChange}
            />

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
  else
    return (
      <Box border="1px" borderColor="gray.200" boxShadow="base" p={3}>
        <Text fontSize="6xl">{user.name}</Text>
        <Text fontSize="xl">{user.pronouns}</Text>
        <Text fontSize="xl">{user.schoolName}</Text>
        <Button colorScheme="blue" onClick={() => setEditToggle(!editToggle)}>
          Edit
        </Button>
      </Box>
    );
};
