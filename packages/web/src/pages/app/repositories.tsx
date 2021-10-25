import React, { useState } from 'react';
import { NextPage } from 'next';
import {
  Input,
  Button,
  Link,
  Heading,
  useTheme,
  VStack,
  ListItem,
  Box,
  SimpleGrid,
  FormControl,
} from '@chakra-ui/react';
import { AppLayout } from '../../components/Layout';

const SearchBar: NextPage = () => {
  const theme = useTheme();

  const [searchInput, setSearchInput] = useState('');
  const [repos, setRepos] = useState([]);

  const handleChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setSearchInput(e.target.value);
  };

  const handleClick = async () => {
    console.log(searchInput);

    try {
      const result = await fetch(`https://api.github.com/users/${searchInput}/repos`);

      const resultJSON = await result.json();
      setRepos(resultJSON);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(repos);
  return (
    <AppLayout>
      <VStack spacing={3}>
        <Heading>Repo Search</Heading>

        <Input
          maxW={'lg'}
          placeholder="input username"
          value={searchInput}
          onChange={handleChange}
        />

        <Button onClick={handleClick}>Search</Button>
      </VStack>

      <SimpleGrid padding="4px" minChildWidth="250px" spacing="15px">
        {repos.length != 0 ? (
          repos.map(
            (item: {
              id: React.Key | undefined;
              name: string;
              html_url: string;
              stargazers_count: Number;
              language: string;
              description: string | null;
            }) => (
              <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" key={item.id}>
                {' '}
                <Box p="6">
                  <Box
                    color="gray.500"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    fontSize="xs"
                    textTransform="uppercase"
                  >
                    {item.language}
                  </Box>

                  <Box
                    letterSpacing="wide"
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated
                    color="cyan.500"
                  >
                    <Link href={item.html_url} isExternal>
                      {item.name}
                    </Link>{' '}
                  </Box>
                  <Box mt="1">☆ {item.stargazers_count}</Box>
                  <Box mt="1" color="gray" fontSize="xs">
                    {item.description}
                  </Box>
                </Box>
              </Box>
            ),
          )
        ) : (
          <Box fontSize="large">No repos found</Box>
        )}
      </SimpleGrid>
    </AppLayout>
  );
};
export default SearchBar;
