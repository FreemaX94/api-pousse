import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuth, setupAutoLogout, keepSessionAlive } from '../utils/auth';

const AuthRedirect = () => {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const { isAuth: authenticated } = await checkAuth();
      setIsAuth(authenticated);
      setChecking(false);
      
      // Configurer la gestion de session améliorée si connecté
      if (authenticated) {
        setupAutoLogout();
        keepSessionAlive();
      }
    };

    verifyAuth();
  }, []);

  if (checking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        ⏳ Vérification de l'authentification...
      </div>
    );
  }

  return isAuth ? <Navigate to="/app/home" replace /> : <Navigate to="/app/login" replace />;
};

export default AuthRedirect;