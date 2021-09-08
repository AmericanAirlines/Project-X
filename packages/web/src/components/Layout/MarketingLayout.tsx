import React from 'react';
import { Button, Heading, HStack, Spacer, useTheme, VStack } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { GiCrossFlare } from 'react-icons/gi';

export const MarketingLayout: React.FC = ({ children }) => {
  const theme = useTheme();

  return (
    <>
      <Global
        styles={{
          body: {
            background: theme.colors.gray[50],
          },
        }}
      />

      <VStack
        color="blue.800"
        alignItems="stretch"
        paddingTop={8}
        w="100%"
        maxW="1200px"
        marginX="auto"
      >
        <HStack paddingX={4}>
          <GiCrossFlare size="36px" />
          <Heading>Project X</Heading>
          <Spacer />
          <Button
            size="sm"
            backgroundColor="blue.700"
            color="gray.50"
            _hover={{ backgroundColor: 'blue.800' }}
            _active={{ backgroundColor: 'blue.900' }}
          >
            Sign In
          </Button>
        </HStack>
        {children}
      </VStack>
    </>
  );
};
