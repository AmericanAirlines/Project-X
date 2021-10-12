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
    <MenuButton as={Button} variant={'link'}>
      <Avatar size={'sm'} />
    </MenuButton>
    <MenuList>
      <MenuItem>
        <Link href="/app/profile" style={{ textDecoration: 'none' }}>
          Edit Profile
        </Link>
      </MenuItem>
      <MenuItem>
        <Link href="/app/contributions" style={{ textDecoration: 'none' }}>
          View Contributions
        </Link>
      </MenuItem>
      <MenuDivider />
      <MenuItem>
        <Link href="/app/logout" style={{ textDecoration: 'none' }}>
          Log Out
        </Link>
      </MenuItem>
    </MenuList>
  </Menu>
);
