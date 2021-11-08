import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../testUtils/testTools';
import { getMock } from '../testUtils/getMock';
import { getServerSideProps } from '../../src/pages/invalidEmail';
import { MarketingLayout } from '../../src/components/Layout';
import { getServerSideProps as chakraGetServerSideProps } from '../../src/components/Chakra';
import InvalidEmail from '../../src/pages/invalidEmail';

jest.mock('../../src/components/Layout/MarketingLayout.tsx');
getMock(MarketingLayout).mockImplementation(({ children }) => <>{children}</>);

describe('web /', () => {
  it('renders', async () => {
    expect(() => render(<InvalidEmail />)).not.toThrow();
  });

  it('exports chakra getServerSideProps for dark mode cookies', () => {
    expect(getServerSideProps).toBe(chakraGetServerSideProps);
  });
});
