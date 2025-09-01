import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import QueryProvider from './shared/providers/QueryProvider';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Force deployment - JS 404 fix

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
