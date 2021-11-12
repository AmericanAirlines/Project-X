import React from 'react';
import { Box, Link } from '@chakra-ui/react';

export interface RepoBoxProps {
  repolist: {
    id: string;
    name: string;
    url: string;
    stargazerCount: Number;
    primaryLanguage: {
      name: string;
    };
    description: string | null;
  };
}

export const RepoBox: React.FC<RepoBoxProps> = ({ repolist }) => {
  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" key={repolist.id}>
      <Box p="6">
        <Box
          color="gray.500"
          fontWeight="semibold"
          letterSpacing="wide"
          fontSize="xs"
          textTransform="uppercase"
        >
          {repolist.primaryLanguage.name}
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
          <Link href={repolist.url} isExternal>
            {repolist.name}
          </Link>
        </Box>
        <Box mt="1">☆ {repolist.stargazerCount}</Box>
        <Box mt="1" color="gray" fontSize="xs">
          {repolist.description}
        </Box>
      </Box>
    </Box>
  );
};
