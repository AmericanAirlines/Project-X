import { extendTheme, Theme, ThemeConfig, DeepPartial } from '@chakra-ui/react';
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config,
  colors: {
    discord: {
      [400]: '#7289da',
    },
  },
  components: {
    Link: {
      variants: {
        navbar: (props: StyleFunctionProps) => ({
          backgroundColor: mode('gray.100', 'gray.900')(props),
          px: 2,
          py: 4,
          rounded: 'md',
          _hover: {
            textDecoration: 'none',
            backgroundColor: mode('gray.200', 'gray.700')(props),
          },
        }),
        navbarMenuItem: {
          _hover: {
            textDecoration: 'none',
          },
        },
      },
    },
    Menu: {
      parts: ['button'],
      variants: {
        navbar: (props: StyleFunctionProps) => ({
          backgroundColor: mode('gray.100', 'gray.900')(props),
          _hover: {
            textDecoration: 'none',
            backgroundColor: mode('gray.200', 'gray.700')(props),
          },
        }),
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        color: mode('blue.800', 'gray.50')(props),
        backgroundColor: mode('gray.50', 'gray.800')(props),
      },
    }),
  },
} as DeepPartial<Theme>);
