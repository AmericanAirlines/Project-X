import React from 'react';
import { Box, HStack, Spacer, useColorModeValue } from '@chakra-ui/react';
import { NavLink } from './NavLink';
import { NavProfileMenu } from './NavProfileMenu';

export const NavBar: React.FC = () => {
  return (
    <HStack bg={useColorModeValue('gray.100', 'gray.900')}>
      <NavLink label="Home" href="/app" />
      <NavLink label="Community" href="/app/community" />
      <NavLink label="Videos" href="/app/videos" />
      <NavLink label="Projects" href="/app/projects" />
      <Spacer />
      <NavProfileMenu />
    </HStack>
  );
};
