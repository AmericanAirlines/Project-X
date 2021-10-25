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
import { RepoBox } from '../../components/Repos';

export interface RepoList {
  id: React.Key | undefined;
  name: string;
  html_url: string;
  stargazers_count: Number;
  language: string;
  description: string | null;
}

const SearchBar: NextPage = () => {
  const theme = useTheme();

  const [searchInput, setSearchInput] = useState('');
  //const [repos, setRepos] = useState([]);
  const [repos, setRepos] = React.useState<RepoList[]>([]);

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
          repos.map((repolist) => (
              <RepoBox key={repolist.id} repolist={repolist} />
            ))
        ) : (
          <Box fontSize="large">No repos found</Box>
        )}
      </SimpleGrid>
    </AppLayout>
  );
};
export default SearchBar;
