import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TestNavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return null;
}