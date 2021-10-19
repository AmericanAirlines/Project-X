import React from 'react';
import { Input, List, Button, Link, Heading, HStack, Spacer, useTheme, VStack, ListItem, ListIcon, UnorderedList } from '@chakra-ui/react';
import { GiCrossFlare } from 'react-icons/gi';

export const RepoList = (props: { repos: any; }) => {
  const theme = useTheme();

  const { repos } = props;

  console.log('Repos is: ', repos);

  const listRepos = repos.lenth !== 0 ? 
  repos.map((item: { id: React.Key | null | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => 
  <ListItem key={item.id}> <Link href={item.html_url} isExternal>{item.name}</Link> </ListItem>
  ) : (
  <ListItem>No repos found</ListItem>);

  return (
    <VStack>
        <UnorderedList spacing={3}>
        {listRepos}
            
        </UnorderedList>
        
    </VStack>
    
      
    
  );
};
