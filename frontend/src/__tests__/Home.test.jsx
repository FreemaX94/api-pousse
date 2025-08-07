import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

import Home from '../Home';

describe('Home page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders home page with all sections', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Check if main heading is present
    expect(screen.getByText(/✨ Pousse/i)).toBeInTheDocument();
    expect(screen.getByText(/🌱 Espace/i)).toBeInTheDocument();
    expect(screen.getByText(/Votre plateforme de gestion complète/i)).toBeInTheDocument();

    // Check if all sections are rendered
    expect(screen.getByText('Événements')).toBeInTheDocument();
    expect(screen.getByText('Création')).toBeInTheDocument();
    expect(screen.getByText('Entretien')).toBeInTheDocument();
    expect(screen.getByText('Dépôt')).toBeInTheDocument();
    expect(screen.getByText('Livraisons')).toBeInTheDocument();
    expect(screen.getByText('Véhicules')).toBeInTheDocument();
    expect(screen.getByText('Nieuwkoop')).toBeInTheDocument();
    expect(screen.getByText('Statistiques')).toBeInTheDocument();
    expect(screen.getByText('Paramètres')).toBeInTheDocument();
    expect(screen.getByText('Comptabilité')).toBeInTheDocument();
  });

  it('navigates to correct paths when sections are clicked', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Test navigation for a few sections
    fireEvent.click(screen.getByText('Événements'));
    expect(mockNavigate).toHaveBeenCalledWith('/evenements');

    fireEvent.click(screen.getByText('Nieuwkoop'));
    expect(mockNavigate).toHaveBeenCalledWith('/nieuwkoop');

    fireEvent.click(screen.getByText('Statistiques'));
    expect(mockNavigate).toHaveBeenCalledWith('/statistiques');
  });

  it('displays section descriptions', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Check if descriptions are present
    expect(screen.getByText('Gérez vos événements et planifications')).toBeInTheDocument();
    expect(screen.getByText('Interface fournisseur Nieuwkoop')).toBeInTheDocument();
    expect(screen.getByText('Gestion financière et facturation')).toBeInTheDocument();
  });

  it('renders all section cards with proper structure', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Check that we have exactly 10 clickable section buttons
    const sectionButtons = screen.getAllByRole('button');
    expect(sectionButtons).toHaveLength(10);

    // Each button should be clickable and contain text
    sectionButtons.forEach(button => {
      expect(button).toBeEnabled();
      expect(button.textContent).toBeTruthy();
    });
  });
});