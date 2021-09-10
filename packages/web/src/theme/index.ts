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
    }),
  },
} as DeepPartial<Theme>);
