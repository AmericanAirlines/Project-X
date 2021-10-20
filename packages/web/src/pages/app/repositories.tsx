import React, { useState } from 'react';
import { NextPage } from 'next';
import {
  Input,
  Button,
  Link,
  Heading,
  HStack,
  Spacer,
  useTheme,
  VStack,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import { RepoList } from '../../components/RepoList';
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
      <VStack>
        <Heading>Repo Search</Heading>
        <Input placeholder="input username" value={searchInput} onChange={handleChange} />

        <Button onClick={handleClick}>Search</Button>

        <RepoList repos={repos} />
      </VStack>
    </AppLayout>
  );
};
export default SearchBar;
