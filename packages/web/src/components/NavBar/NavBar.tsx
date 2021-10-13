import React from 'react';
import { Box, HStack, Spacer } from '@chakra-ui/react';
import { NavLink } from './NavLink';
import { NavProfileMenu } from './NavProfileMenu';

export const NavBar: React.FC = () => {
  return (
    <HStack className="navbar">
      <NavLink label="Home" href="/app" />
      <NavLink label="Community" href="" />
      <NavLink label="Videos" href="/app/videos" />
      <Spacer />
      <NavProfileMenu />
    </HStack>
  );
};
