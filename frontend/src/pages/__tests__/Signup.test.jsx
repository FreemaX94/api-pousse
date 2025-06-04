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

vi.mock('react-google-recaptcha', async () => {
  const React = await import('react');
  return {
    __esModule: true,
    default: React.forwardRef(({ onChange }, ref) => {
      React.useImperativeHandle(ref, () => ({
        executeAsync: async () => {
          onChange && onChange('mock-token');
          return 'mock-token';
        },
      }));
      return <button data-testid="recaptcha" onClick={() => onChange && onChange('mock-token')}>reCAPTCHA</button>;
    }),
  };
});

import Signup from '../Signup';

describe('Signup page', () => {
  beforeEach(() => {
    mockPost.mockReset();
    mockNavigate.mockClear();
    mockPost.mockResolvedValue({ data: {} });
  });

  it('submits registration data', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nom complet/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Adresse e-mail/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Nom d’utilisateur/i), { target: { value: 'johnd' } });
    fireEvent.change(screen.getByLabelText(/^Mot de passe$/i), { target: { value: 'Secret123!' } });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), { target: { value: 'Secret123!' } });
    fireEvent.click(screen.getByLabelText(/conditions générales/i));
    fireEvent.click(screen.getByRole('button', { name: /s’inscrire/i }));

    await waitFor(() => expect(mockPost).toHaveBeenCalledWith('/auth/register', {
      username: 'johnd',
      password: 'Secret123!',
      email: 'john@example.com',
      fullname: 'John Doe',
      recaptcha: 'mock-token',
    }));
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});
