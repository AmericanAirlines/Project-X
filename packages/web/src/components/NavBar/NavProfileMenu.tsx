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
      <MenuItem>
        {/*Change to /user/{uid}*/}
        <Link variant="navbarMenuItem" href="/app/profile">
          View Profile
        </Link>
      </MenuItem>
      <MenuItem>
        <Link variant="navbarMenuItem" href="/app/contributions">
          View Contributions
        </Link>
      </MenuItem>
      <MenuDivider />
      <MenuItem>
        <Link variant="navbarMenuItem" href="/api/auth/github/logout">
          Log Out
        </Link>
      </MenuItem>
    </MenuList>
  </Menu>
);
