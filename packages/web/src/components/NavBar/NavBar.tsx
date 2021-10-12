import React from 'react';
import { Box, HStack, Spacer } from '@chakra-ui/react';
import { NavLink } from './NavLink';
import { NavProfileMenu } from './NavProfileMenu';

export const NavBar: React.FC = () => {
  return (
    <>
      <Box className="navbar" px={4}>
        <HStack h={12} spacing={8} alignItems={'center'}>
          <NavLink label="Home" url="/app" />
          <NavLink label="Community" url="" />
          <NavLink label="Videos" url="/app/videos" />
          <Spacer />
          <NavProfileMenu />
        </HStack>
      </Box>
    </>
  );
};
