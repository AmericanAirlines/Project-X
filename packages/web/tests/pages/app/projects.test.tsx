import React from 'react';
import fetchMock from 'fetch-mock-jest';
import { render, screen, act } from '../../testUtils/testTools';
import { getMock } from '../../testUtils/getMock';
import { AppLayout } from '../../../src/components/Layout';
import Projects from '../../../src/pages/app/projects';
import { RepoBox } from '../../../src/components/Repos';
import { RepoList } from '../../../src/pages/app/projects';

jest.mock('../../../src/components/Layout/AppLayout.tsx');
getMock(AppLayout).mockImplementation(({ children }) => <>{children}</>);

jest.mock('../../../src/components/Repos/RepoBox.tsx');
getMock(RepoBox).mockImplementation(({ repolist }) => <p>Box Row</p>);

const repo1: RepoList = {
  id: '1',
  name: 'repo1',
  url: 'github.com/test1',
  stargazerCount: 123,
  primaryLanguage: {
    name: 'HTML',
  },
  description: 'simple app',
};

const repo2: RepoList = {
  id: '2',
  name: 'repo2',
  url: 'github.com/test2',
  stargazerCount: 456,
  primaryLanguage: {
    name: 'CSS',
  },
  description: 'simple css file',
};

// Wait utility
const wait = () => new Promise<void>((resolve) => setTimeout(() => resolve(), 0));

describe('repo page', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    fetchMock.reset();
  });

  it('renders the table properly when no repo are returned', async () => {
    fetchMock.get(`/api/project`, []);

    expect(() => render(<Projects />)).not.toThrow();

    // Wait for fetch
    await act(wait);

    expect(RepoBox).toBeCalledTimes(0);
    expect(screen.getByText('No Projects Found')).toBeVisible();
  });

  it('renders the table properly when repo are returned', async () => {
    fetchMock.mock().getOnce(`/api/project`, [repo1, repo2]);
    expect(() => render(<Projects />)).not.toThrow();

    // Wait for fetch
    await act(wait);

    expect(screen.getAllByText('Box Row').length).toEqual(2);
  });
});
