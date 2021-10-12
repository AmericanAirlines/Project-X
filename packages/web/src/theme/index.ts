import { extendTheme, Theme, ThemeConfig, DeepPartial } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        color: mode('blue.800', 'gray.50')(props),
        backgroundColor: mode('gray.50', 'gray.800')(props),
      },
      'div.navbar': {
        backgroundColor: mode('gray.100', 'gray.900')(props),
      },
      // This is the profile navbar button
      '#menu-button-2': {
        cursor: 'pointer',
        rounded: 'md',
        px: '1',
      },
      '#menu-button-2:hover': {
        textDecoration: 'none',
        backgroundColor: mode('gray.200', 'gray.700')(props),
      },
    }),
  },
} as DeepPartial<Theme>);
