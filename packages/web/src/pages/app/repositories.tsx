import React, { useState } from 'react';
import axios from 'axios';
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
import { GiCrossFlare } from 'react-icons/gi';
import { RepoList } from '../../components/RepoList';

const SearchBar: React.FC = ({ children }) => {
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
    <VStack>
      <Heading>Repo Search</Heading>
      <Input placeholder="input username" value={searchInput} onChange={handleChange} />

      <Button onClick={handleClick}>Search</Button>

      <RepoList repos={repos} />
    </VStack>
  );
};
export default SearchBar;
