import React from 'react';
import { render, screen } from '../../testUtils/testTools';
import { AppLayout } from '../../../src/components/Layout';

describe('AppLayout', () => {
  it('renders children', async () => {
    const text = 'Hello World';

    render(
      <AppLayout>
        <div>{text}</div>
      </AppLayout>,
    );

    expect(screen.getByText(text)).toBeVisible();
  });
});
