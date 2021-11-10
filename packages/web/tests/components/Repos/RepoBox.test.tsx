import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { RepoBox } from '../../../src/components/Repos';
import { RepoList } from '../../../src/pages/app/projects';
// Mock repo objects
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

describe('RepoBox', () => {
  it('renders', async () => {
    render(<RepoBox repolist={repo1} />);

    expect(screen.getByText('repo1')).toBeVisible();
  });
});
