import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

var mockPost;
vi.mock('../../api/clientApi', () => {
  mockPost = vi.fn();
  const api = { post: mockPost };
  return { __esModule: true, default: api, api };
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

import Login from '../Login';

describe('Login page', () => {
  beforeEach(() => {
    mockPost.mockReset();
    mockNavigate.mockClear();
    mockPost.mockResolvedValue({ data: {} });
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders login form correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Nom d'utilisateur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Se souvenir de moi/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
    expect(screen.getByText(/Mot de passe oublié/i)).toBeInTheDocument();
    expect(screen.getByText(/S'inscrire maintenant/i)).toBeInTheDocument();
  });

  it('submits login data correctly', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), { 
      target: { value: 'testuser' } 
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

    await waitFor(() => expect(mockPost).toHaveBeenCalledWith(
      '/auth/login',
      { username: 'testuser', password: 'password123' },
      { withCredentials: true }
    ));
    expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
  });

  it('handles remember me functionality', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), { 
      target: { value: 'testuser' } 
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByLabelText(/Se souvenir de moi/i));
    fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

    await waitFor(() => expect(mockPost).toHaveBeenCalled());
    expect(localStorage.getItem('rememberedUser')).toBe('testuser');
  });

  it('prefills username from localStorage if remembered', () => {
    localStorage.setItem('rememberedUser', 'saveduser');
    
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByDisplayValue('saveduser')).toBeInTheDocument();
    expect(screen.getByLabelText(/Se souvenir de moi/i)).toBeChecked();
  });

  it('displays error message on login failure', async () => {
    mockPost.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), { 
      target: { value: 'wronguser' } 
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { 
      target: { value: 'wrongpass' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during login', async () => {
    mockPost.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), { 
      target: { value: 'testuser' } 
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

    expect(screen.getByText(/Connexion en cours/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Connexion en cours/i })).toBeDisabled();
  });
});