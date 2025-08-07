// src/components/__tests__/PrivateRoute.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import api from '../../api/clientApi';
import PrivateRoute from '../PrivateRoute';

// On crée le spy **avant** les describe/it
const mockGet = vi.spyOn(api, 'get');

describe('PrivateRoute', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('renders children when authenticated', async () => {
    // Simule un appel réussi (then) => auth OK
    mockGet.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <div>Accessible</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // on attend que le composant apparaisse
    expect(await screen.findByText('Accessible')).toBeInTheDocument();
  });

  it('redirects to login when unauthenticated', async () => {
    // Simule une erreur (catch) => auth KO
    mockGet.mockRejectedValue(new Error('Unauthorized'));

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <div>Accessible</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // on attend que la redirection vers /login ait lieu
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });
});
