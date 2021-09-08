import React from 'react';
import { useTheme, VStack } from '@chakra-ui/react';
import { Global } from '@emotion/react';

export const AppLayout: React.FC = ({ children }) => {
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

      <VStack color="blue.800" alignItems="stretch" w="100%" maxW="1200px" marginX="auto">
        {children}
      </VStack>
    </>
  );
};
