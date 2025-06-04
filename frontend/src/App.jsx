// frontend/src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import NavBar from './components/NavBar';

import Login          from './pages/Login';
import Signup         from './pages/Signup';
import Home           from './Home';
import Evenements     from './pages/Evenements';
import Creation       from './pages/Creation';
import Entretien      from './pages/Entretien';
import AddContract    from './pages/AddContract';
import Depot          from './pages/Depot';
import Vehicules      from './pages/Vehicules';
import Statistiques   from './pages/Statistiques';
import Parametres     from './pages/Parametres';
import Comptabilite   from './pages/Comptabilite';
import LivraisonList  from './pages/LivraisonList';
import ActivationPage from './pages/ActivationPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';

import PrivateRoute  from './components/PrivateRoute';
import TestSanitize  from './components/TestSanitize';

export default function App() {
  return (
    <>
      <NavBar />
      <Toaster position="top-center" />
      <div className="bg-white min-h-[calc(100vh-4rem)]">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth routes */}
          <Route path="/login"           element={<Login />} />
          <Route path="/signup"          element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/activate/:token" element={<ActivationPage />} />

          {/* Protected routes */}
          <Route path="/home"         element={<PrivateRoute><Home/></PrivateRoute>} />
          <Route path="/evenements"   element={<PrivateRoute><Evenements/></PrivateRoute>} />
          <Route path="/creation"     element={<PrivateRoute><Creation/></PrivateRoute>} />
          <Route path="/entretien"    element={<PrivateRoute><Entretien/></PrivateRoute>} />
          <Route path="/entretien/add" element={<PrivateRoute><AddContract/></PrivateRoute>} />
          <Route path="/depot"        element={<PrivateRoute><Depot/></PrivateRoute>} />
          <Route path="/vehicules"    element={<PrivateRoute><Vehicules/></PrivateRoute>} />
          <Route path="/statistiques" element={<PrivateRoute><Statistiques/></PrivateRoute>} />
          <Route path="/parametres"   element={<PrivateRoute><Parametres/></PrivateRoute>} />
          <Route path="/comptabilite" element={<PrivateRoute><Comptabilite/></PrivateRoute>} />
          <Route path="/livraisons"   element={<PrivateRoute><LivraisonList/></PrivateRoute>} />
          <Route path="/security-test" element={<PrivateRoute><TestSanitize/></PrivateRoute>} />
          <Route path="/livraison"    element={<Navigate to="/livraisons" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}


