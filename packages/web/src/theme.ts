import { extendTheme, Theme, ThemeConfig, DeepPartial } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config,
} as DeepPartial<Theme>);
