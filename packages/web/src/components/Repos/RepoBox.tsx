import React from 'react';
import { Box, useTheme, Link } from '@chakra-ui/react';

export interface RepoBoxProps {
  repolist: {
    id: React.Key | undefined;
    name: string;
    html_url: string;
    stargazers_count: Number;
    language: string;
    description: string | null;
  };
}

export const RepoBox: React.FC<RepoBoxProps> = ({ repolist }) => {
  const theme = useTheme();
  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" key={repolist.id}>
                {' '}
                <Box p="6">
                  <Box
                    color="gray.500"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    fontSize="xs"
                    textTransform="uppercase"
                  >
                    {repolist.language}
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
                    <Link href={repolist.html_url} isExternal>
                      {repolist.name}
                    </Link>{' '}
                  </Box>
                  <Box mt="1">☆ {repolist.stargazers_count}</Box>
                  <Box mt="1" color="gray" fontSize="xs">
                    {repolist.description}
                  </Box>
                </Box>
              </Box>
  );
};
