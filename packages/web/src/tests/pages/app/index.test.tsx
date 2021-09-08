import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import AppHome from '../../../pages/app';

describe('web /app', () => {
  it('renders', async () => {
    render(<AppHome />);

    expect(screen.getByText('App Home')).toBeVisible();
  });
});
