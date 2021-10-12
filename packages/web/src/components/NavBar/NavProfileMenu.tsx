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
  <Menu>
    <MenuButton className="navbarProfileButton" as={Button} variant={'link'}>
      <Avatar size={'sm'} />
    </MenuButton>
    <MenuList>
      <MenuItem>
        <Link className="navbarMenuItem" href="/app/profile">
          Edit Profile
        </Link>
      </MenuItem>
      <MenuItem>
        <Link className="navbarMenuItem" href="/app/contributions">
          View Contributions
        </Link>
      </MenuItem>
      <MenuDivider />
      <MenuItem>
        <Link className="navbarMenuItem" href="/app/logout">
          Log Out
        </Link>
      </MenuItem>
    </MenuList>
  </Menu>
);
