import React from 'react';
import { Link, useTheme, VStack, ListItem, UnorderedList } from '@chakra-ui/react';

export const RepoList = (props: { repos: any }) => {
  const theme = useTheme();

  const { repos } = props;

  console.log('Repos is: ', repos);

  const listRepos =
    repos.lenth !== 0 ? (
      repos.map(
        (item: {
          id: React.Key | null | undefined;
          name: string;
          html_url: string;
          stargazers_count: string;
        }) => (
          <ListItem key={item.id}>
            {' '}
            <Link href={item.html_url} isExternal>
              {item.name}
            </Link>{' '}
            <br />☆ {item.stargazers_count}
          </ListItem>
        ),
      )
    ) : (
      <ListItem>No repos found</ListItem>
    );

  return (
    <VStack>
      <UnorderedList spacing={3}>{listRepos}</UnorderedList>
    </VStack>
  );
};
