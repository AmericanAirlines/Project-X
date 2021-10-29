import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { RepoBox } from '../../../src/components/Repos';
// import { RepoBoxProps } from '../../../src/components/Repos/RepoBox';
import { RepoList } from '../../../src/pages/app/projects';
// Mock repo objects
const repo1: RepoList = {
    id: '1',
    name: 'repo1',
    html_url: 'github.com/test1',
    stargazers_count: 123,
    language: 'HTML',
    description: 'simple app',
};
  

describe('RepoBox', () => {
  it('renders', async () => {
    render(<RepoBox repolist ={repo1} />);

    expect(screen.getByText('repo1')).toBeVisible();

    // expect(screen.getByRole('link')).toHaveAttribute('href', 'github.com/test1');

  });
});
