// frontend/src/features/auth/components/PrivateRoute.jsx

import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkAuth, setupAutoLogout, keepSessionAlive } from "../../../utils/auth";

export default function PrivateRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth]     = useState(false);
  const location                = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      console.log('PrivateRoute: Vérification de l\'authentification...');
      const { isAuth: authenticated, user } = await checkAuth();
      
      if (authenticated) {
        console.log('PrivateRoute: Utilisateur authentifié', user);
        setIsAuth(true);
        setupAutoLogout();
        keepSessionAlive();
      } else {
        console.log('PrivateRoute: Utilisateur non authentifié');
        setIsAuth(false);
      }
      setChecking(false);
    };

    verifyAuth();
  }, []);

  if (checking) {
    // Affiche un spinner pendant la vérification
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
  
  if (!isAuth)
    return <Navigate to="/app/login" state={{ from: location }} replace />;
  return children;
}
