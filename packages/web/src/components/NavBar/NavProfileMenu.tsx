import React from 'react';
import {
  Button,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
} from '@chakra-ui/react';

export const NavProfileMenu: React.FC = () => (
  <Menu variant="navbar">
    <MenuButton as={Button}>
      <Avatar size={'sm'} />
    </MenuButton>
    <MenuList>
      <Link variant="navbarMenuItem" href="/app/profile">
        <MenuItem>Edit Profile</MenuItem>
      </Link>
      <Link variant="navbarMenuItem" href="/app/contributions">
        <MenuItem>View Contributions</MenuItem>
      </Link>
      <MenuDivider />
      <Link variant="navbarMenuItem" href="/api/auth/github/logout">
        <MenuItem>Log Out</MenuItem>
      </Link>
    </MenuList>
  </Menu>
);
