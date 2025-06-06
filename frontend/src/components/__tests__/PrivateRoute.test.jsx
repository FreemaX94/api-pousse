import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

let mockGet;
vi.mock('../api/clientApi', () => {
  mockGet = vi.fn();
  const api = { get: mockGet };
  return { __esModule: true, default: api, api };
});

const TestComponent = () => <div data-testid="secret">Secret</div>;
const Login = () => <div data-testid="login">Login</div>;

import PrivateRoute from '../PrivateRoute';

describe('PrivateRoute', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it('renders children when authenticated', async () => {
    mockGet.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={["/secret"]}>
        <Routes>
          <Route path="/secret" element={<PrivateRoute><TestComponent /></PrivateRoute>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId('secret')).toBeInTheDocument());
  });

  it('redirects to login when unauthenticated', async () => {
    mockGet.mockRejectedValue(new Error('not auth'));

    render(
      <MemoryRouter initialEntries={["/secret"]}>
        <Routes>
          <Route path="/secret" element={<PrivateRoute><TestComponent /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId('login')).toBeInTheDocument());
  });
});