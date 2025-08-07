import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

var mockPost;
vi.mock('../../api/clientApi', () => {
  mockPost = vi.fn();
  const api = { post: mockPost };
  return { __esModule: true, default: api, api };
});

vi.mock('react-google-recaptcha', async () => {
  const React = await import('react');
  return {
    __esModule: true,
    default: ({ onChange }) => (
      <button data-testid="recaptcha" onClick={() => onChange('mock-token')}>reCAPTCHA</button>
    ),
  };
});

import ForgotPassword from '../ForgotPassword';

describe('ForgotPassword page', () => {
  beforeEach(() => {
    mockPost.mockReset();
    mockPost.mockResolvedValue({ data: {} });
  });

  it('sends email to reset endpoint', async () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Adresse e-mail/i), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByTestId('recaptcha'));
    fireEvent.click(screen.getByRole('button', { name: /Envoyer le lien/i }));

    await waitFor(() => expect(mockPost).toHaveBeenCalledWith('/auth/forgot-password', {
      email: 'john@example.com',
      recaptcha: 'mock-token',
    }));
  });
});
