import React from 'react';
import { Link, useColorModeValue } from '@chakra-ui/react';

export interface NavLinkProps {
  label: string;
  url: string;
}
export const NavLink: React.FC<NavLinkProps> = ({ label, url }) => (
  <Link className="navbar" href={url}>
    {label}
  </Link>
);
