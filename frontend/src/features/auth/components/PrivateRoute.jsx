// frontend/src/features/auth/components/PrivateRoute.jsx

import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkAuth, setupAutoLogout, keepSessionAlive } from "../../../utils/auth";

export default function PrivateRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth]     = useState(false);
  const location                = useLocation();

  useEffect(() => {
    let isMounted = true; // Flag pour éviter les updates après unmount
    
    const verifyAuth = async () => {
      console.log('PrivateRoute: Vérification de l\'authentification...');
      
      try {
        const { isAuth: authenticated, user } = await checkAuth();
        
        if (!isMounted) return; // Éviter les updates si le composant est unmounted
        
        if (authenticated) {
          console.log('PrivateRoute: Utilisateur authentifié', user);
          setIsAuth(true);
          setupAutoLogout();
          keepSessionAlive();
        } else {
          console.log('PrivateRoute: Utilisateur non authentifié - redirection vers login');
          setIsAuth(false);
        }
      } catch (error) {
        if (!isMounted) return;
        console.log('PrivateRoute: Erreur vérification auth - redirection vers login', error.message);
        setIsAuth(false);
      } finally {
        if (isMounted) {
          setChecking(false);
        }
      }
    };

    // Petite attente pour éviter les doubles appels en dev mode
    const timeoutId = setTimeout(verifyAuth, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
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
  
  if (!isAuth) {
    console.log('PrivateRoute: Redirection immédiate vers /app/login');
    return <Navigate to="/app/login" state={{ from: location }} replace />;
  }
  
  return children;
}
