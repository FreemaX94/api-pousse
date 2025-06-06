import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Polyfill for framer-motion viewport features
beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// Mock child components to avoid heavy renders or network calls
vi.mock('../../components/FormulaireMain.jsx', () => ({
  __esModule: true,
  default: () => <div data-testid="FormulaireMain" />,
}));
vi.mock('../../components/FormulaireStock.jsx', () => ({
  __esModule: true,
  default: () => <div data-testid="FormulaireStock" />,
}));
vi.mock('../../components/EntreeInventaires.jsx', () => ({
  __esModule: true,
  default: () => <div data-testid="EntreeInventaires" />,
}));
vi.mock('../../components/EntreeInventairesForm.jsx', () => ({
  __esModule: true,
  default: () => <div data-testid="EntreeInventairesForm" />,
}));
vi.mock('../../components/StockViewer.jsx', () => ({
  __esModule: true,
  default: () => <div data-testid="StockViewer" />,
}));
vi.mock('../../components/StockViewerDrawer.jsx', () => ({
  __esModule: true,
  default: () => <div data-testid="StockViewerDrawer" />,
}));
vi.mock('../../components/Modal.jsx', () => ({
  __esModule: true,
  default: () => <div data-testid="Modal" />,
}));

import Evenements from '../Evenements.jsx';

describe('Evenements page', () => {
  const events = [
    { id: '1', summary: 'Event 1', start: { dateTime: '2024-01-01T10:00:00Z' } },
    { id: '2', summary: 'Event 2', start: { date: '2024-01-02' } },
  ];

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(events),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches events and displays them', async () => {
    render(<Evenements />);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/^\/api\/events\?from=/),
      { headers: { 'Cache-Control': 'no-cache' } }
    );

    expect(await screen.findByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  it('toggles dark mode', () => {
    const { container } = render(<Evenements />);
    const darkBtn = screen.getAllByRole('button')[1];

    expect(container.firstChild).not.toHaveClass('dark');
    fireEvent.click(darkBtn);
    expect(container.firstChild).toHaveClass('dark');
    fireEvent.click(darkBtn);
    expect(container.firstChild).not.toHaveClass('dark');
  });

  it('opens and closes the details drawer', async () => {
    render(<Evenements />);
    const openBtn = screen.getByRole('button', { name: '📋 Détails' });
    fireEvent.click(openBtn);

    const closeBtn = await screen.findByRole('button', { name: '✖' });
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: '✖' })).not.toBeInTheDocument();
    });
  });

  it('toggles the mobile menu sidebar', () => {
    render(<Evenements />);
    const menuBtn = screen.getAllByRole('button')[0];
    const sidebar = screen.getByRole('complementary');

    expect(sidebar).toHaveClass('-translate-x-full');
    fireEvent.click(menuBtn);
    expect(sidebar).toHaveClass('translate-x-0');
  });
});
