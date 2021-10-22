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
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
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
      <VStack spacing={3}>
        <Heading>Repo Search</Heading>
        <Input
          maxW={'lg'}
          placeholder="input username"
          value={searchInput}
          onChange={handleChange}
        />

        <Button onClick={handleClick}>Search</Button>

        {/*<RepoList repos={repos} />*/}

        <Table size="md">
          <Thead>
            <Tr>
              <Th>Repository</Th>
              <Th>Star</Th>
            </Tr>
          </Thead>
          <Tbody>
            {repos.length !== 0 ? (
              repos.map(
                (item: {
                  id: React.Key | null | undefined;
                  name: string;
                  html_url: string;
                  stargazers_count: string;
                }) => (
                  <Tr key={item.id}>
                    {' '}
                    <Td>
                      <Link href={item.html_url} isExternal>
                        {item.name}
                      </Link>{' '}
                    </Td>
                    <Td>☆{item.stargazers_count}</Td>
                  </Tr>
                ),
              )
            ) : (
              <ListItem>No repos found</ListItem>
            )}
          </Tbody>
        </Table>
      </VStack>
    </AppLayout>
  );
};
export default SearchBar;
