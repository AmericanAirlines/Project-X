import React from 'react';
import fetchMock from 'fetch-mock-jest';
import { render, screen, act } from '../../testUtils/testTools';
import { getMock } from '../../testUtils/getMock';
import { AppLayout } from '../../../src/components/Layout';
import Contributions from '../../../src/pages/app/contributions';
import { ContributionsBox } from '../../../src/components/Contributions';
import { ContributionsList } from '../../../src/pages/app/contributions';

jest.mock('../../../src/components/Layout/AppLayout.tsx');
getMock(AppLayout).mockImplementation(({ children }) => <>{children}</>);

jest.mock('../../../src/components/Contributions/ContributionsBox.tsx');
getMock(ContributionsBox).mockImplementation(({ cbox }) => <p>Box Row</p>);

const repo1: ContributionsList = {
  id: '1',
  nodeID: 'PR_00000',
  description: 'Pizza but a construct of the mind',
  type: 'CLOSED',
  score: 1,
  contributedAt: new Date('1612-04-20'),
  url: 'abc.com',
};

const repo2: ContributionsList = {
  id: '2',
  nodeID: 'PR_54321',
  description: 'Count 5 to 1',
  type: 'OPEN',
  score: 1,
  contributedAt: new Date('2022-09-12'),
  url: 'onetofive.com',
};

// Wait utility
const wait = () => new Promise<void>((resolve) => setTimeout(() => resolve(), 0));

describe('repo page', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.reset();
  });

  it('renders the table properly when no repo are returned', async () => {
    fetchMock.get(`/api/contributions`, []);

    expect(() => render(<Contributions />)).not.toThrow();

    // Wait for fetch
    await act(wait);

    expect(ContributionsBox).toBeCalledTimes(0);
    expect(screen.getByText('No Projects Found')).toBeVisible();
  });

  it('renders the table properly when repo are returned', async () => {
    fetchMock.mock().getOnce(`/api/contributions`, [repo1, repo2]);
    expect(() => render(<Contributions />)).not.toThrow();

    // Wait for fetch
    await act(wait);

    expect(screen.getAllByText('Box Row').length).toEqual(2);
  });
});
