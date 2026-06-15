import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppShell } from '@/app/layouts/AppShell';
import { appRoutes } from '@/app/router';

function renderShell() {
  const router = createMemoryRouter([
    {
      path: '/',
      element: <AppShell />,
      children: [{ index: true, element: <div>Dashboard screen</div> }],
    },
  ]);

  render(<RouterProvider router={router} />);
}

describe('AppShell navigation', () => {
  it('only renders navigation links that target registered routes', () => {
    renderShell();

    const routeSet = new Set<string>(appRoutes);
    const links = screen.getAllByRole('link');

    for (const link of links) {
      const path = new URL(link.getAttribute('href') ?? '', 'https://movio.test').pathname;
      expect(routeSet.has(path)).toBe(true);
    }
  });

  it('turns the sidebar call to action into a real learning link', () => {
    renderShell();

    expect(screen.getByRole('link', { name: /let’s go/i })).toHaveAttribute('href', '/learn');
  });
});
