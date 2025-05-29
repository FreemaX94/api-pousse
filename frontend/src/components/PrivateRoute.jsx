// frontend/src/components/PrivateRoute.jsx

import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../api/clientApi";


export default function PrivateRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth]     = useState(false);
  const location                = useLocation();

  useEffect(() => {
    api
      .get("/auth/me")              // ← baseURL + /auth/me
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return null;       // ou un spinner
  if (!isAuth)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
