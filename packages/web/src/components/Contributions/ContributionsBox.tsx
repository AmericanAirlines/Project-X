import React from 'react';
import { Box, Link } from '@chakra-ui/react';

export interface ContributionsBoxProps {
  cbox: {
    id: string;
    nodeID: string;
    type: string;
    score: number;
    contributedAt: Date;
    description: string | null;
    url: string;
  };
}

export const ContributionsBox: React.FC<ContributionsBoxProps> = ({ cbox }) => {
  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" key={cbox.id}>
      <Box p="6">
        <Box
          color="gray.500"
          fontWeight="semibold"
          letterSpacing="wide"
          fontSize="xs"
          textTransform="uppercase"
        >
          {cbox.type}
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
          <Link href={cbox.url} isExternal>
            {cbox.description}
          </Link>
        </Box>
        <Box mt="1">Score: {cbox.score}</Box>
        <Box mt="1" color="gray" fontSize="xs">
          {cbox.contributedAt.toString().slice(0,10)}
        </Box>
      </Box>
    </Box>
  );
};
