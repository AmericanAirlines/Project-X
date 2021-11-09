import { Heading, Table, Thead, Tr, Th, Tbody, Text, VStack, SimpleGrid } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';
import { AppLayout } from '../../components/Layout';
import { RepoBox } from '../../components/Repos';

export interface RepoList {
  id: string;
  name: string;
  url: string;
  stargazerCount: Number;
  primaryLanguage: {
    name: string;
  };
  description: string | null;
}

const Projects: NextPage = () => {
  const [projects, setProjects] = React.useState<RepoList[]>([]);

  React.useEffect(() => {
    const fetchProjects = async () => {
      // Get all projects
      const res = await fetch('/api/project');
      const projectsList = await res.json();

      // Set project list
      setProjects(projectsList);
    };

    fetchProjects();
  }, []);

  return (
    <AppLayout>
      <VStack spacing={3}>
        <Heading>Projects</Heading>
      </VStack>
      {projects.length <= 0 ? (
        <Text>No Projects Found</Text>
      ) : (
        <SimpleGrid padding="4px" minChildWidth="250px" spacing="15px">
          {projects.map((repo) => (
            <RepoBox key={repo.id} repolist={repo} />
          ))}
        </SimpleGrid>
      )}
    </AppLayout>
  );
};

export default Projects;
