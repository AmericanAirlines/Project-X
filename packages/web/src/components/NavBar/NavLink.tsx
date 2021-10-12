import React from 'react';
import { Link, useColorModeValue } from '@chakra-ui/react';

export interface NavLinkProps {
  label: string;
  url: string;
}
export const NavLink: React.FC<NavLinkProps> = ({ label, url }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={url}
  >
    {label}
  </Link>
);
