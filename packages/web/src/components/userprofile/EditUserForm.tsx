import React from 'react';
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { User } from '../../pages/user/[uid]';

type EditFormValues = yup.InferType<typeof editFormSchema>;
const editFormSchema = yup.object({
  name: yup.string().trim().required('Name is required.'),
  pronouns: yup.string(),
  schoolName: yup.string(),
});

export interface EditUserProps {
  setEditToggle(editToggle: boolean): void;
  setUser(user: User): void;
  user: {
    id: string;
    name: string;
    pronouns?: string;
    schoolName?: string;
  };
}

export const EditUserForm: React.FC<EditUserProps> = (props: EditUserProps) => {
  const [errorMessage, setErrorMessage] = React.useState(false);

  const formik = useFormik<EditFormValues>({
    initialValues: {
      name: props.user.name,
      pronouns: props.user.pronouns,
      schoolName: props.user.schoolName,
    },
    validationSchema: editFormSchema,
    onSubmit: async (data) => {
      try {
        const res = await fetch(`/api/users/${props.user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          props.setUser(await res.json());
          props.setEditToggle(false);
        } else {
          setErrorMessage(true);
        }
      } catch {
        setErrorMessage(true);
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <FormControl id="name">
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input type="text" value={formik.values.name} onChange={formik.handleChange} />
          <FormHelperText color="red.500">{formik.errors.name}</FormHelperText>
        </FormControl>
        <FormControl id="pronouns">
          <FormLabel htmlFor="pronouns">Pronouns</FormLabel>
          <Input type="text" value={formik.values.pronouns} onChange={formik.handleChange} />
        </FormControl>
        <FormControl id="schoolName">
          <FormLabel htmlFor="schoolName">School Name</FormLabel>
          <Input type="text" value={formik.values.schoolName} onChange={formik.handleChange} />
        </FormControl>
        <ButtonGroup>
          <Button type="submit" colorScheme="green">
            Submit
          </Button>
          <Button
            type="reset"
            onClick={() => {
              formik.resetForm();
              props.setEditToggle(false);
            }}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </form>
      {errorMessage ? (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>An error has occurred. Please try again later.</AlertDescription>
          <CloseButton
            position="absolute"
            right="8px"
            onClick={() => setErrorMessage(false)}
          ></CloseButton>
        </Alert>
      ) : null}
    </div>
  );
};
