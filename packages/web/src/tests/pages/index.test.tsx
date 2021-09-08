import React from 'react';
import { render, screen } from '../testUtils/testTools';
import Home from '../../pages';

describe('web /', () => {
  it('renders', async () => {
    render(<Home />);

    expect(screen.getByText('Get Access')).toBeVisible();
  });
});
