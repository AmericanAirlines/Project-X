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

export const NavProfileMenu: React.FC = () => {
  const [currentUserId, setCurrentUserId] = React.useState<string>('');

  React.useEffect(() => {
    const fetchCurrentUserID = async () => {
      const res = await fetch(`/api/users/me`);

      if (res.status == 200) {
        const data = await res.json();
        setCurrentUserId(data.id);
      }
    };

    fetchCurrentUserID();
  }, []);

  return (
    <Menu variant="navbar">
      <MenuButton as={Button}>
        <Avatar size={'sm'} />
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Link variant="navbarMenuItem" href={`/user/${String(currentUserId)}`}>
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
};
