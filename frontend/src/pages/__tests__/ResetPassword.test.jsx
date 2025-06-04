import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
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

import ResetPassword from '../ResetPassword';

describe('ResetPassword page', () => {
  beforeEach(() => {
    mockPost.mockReset();
    mockNavigate.mockClear();
    mockPost.mockResolvedValue({ data: {} });
  });

  it('posts new password with token', async () => {
    render(
      <MemoryRouter initialEntries={['/reset-password?token=abc']}>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nouveau mot de passe/i), {
      target: { value: 'NewPass123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Changer le mot de passe/i }));

    await waitFor(() => expect(mockPost).toHaveBeenCalledWith('/auth/reset-password', {
      token: 'abc',
      password: 'NewPass123!',
    }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
