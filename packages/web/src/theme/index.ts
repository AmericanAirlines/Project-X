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
      'a.navbar': {
        backgroundColor: mode('gray.100', 'gray.900')(props),
        px: 2,
        py: 1,
        rounded: 'md',
      },
      'a.navbar:hover': {
        textDecoration: 'none',
        backgroundColor: mode('gray.200', 'gray.700')(props),
      },
      'button.navbarProfileButton': {
        cursor: 'pointer',
        rounded: 'md',
        px: 1,
      },
      'button.navbarProfileButton:hover': {
        textDecoration: 'none',
        backgroundColor: mode('gray.200', 'gray.700')(props),
      },
      'a.navbarMenuItem:hover': {
        textDecoration: 'none',
      },
    }),
  },
} as DeepPartial<Theme>);
