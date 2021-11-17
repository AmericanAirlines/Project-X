import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { ContributionsBox } from '../../../src/components/Contributions';
import { ContributionsList } from '../../../src/pages/app/contributions';
// Mock repo objects
const clist1: ContributionsList = {
    id: '1',
    nodeID: 'PR_00000',
    description: 'clist1',
    type: 'CLOSED',
    score: 1,
    contributedAt: new Date('1612-04-20'),
    url: 'abc.com',
};

describe('Contributions Box', () => {
  it('renders', async () => {
    render(<ContributionsBox cbox={clist1} />);

    expect(screen.getByText('clist1')).toBeVisible();
  });
});
