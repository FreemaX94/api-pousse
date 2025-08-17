import React from 'react';
import DevisUltraPremium from './DevisUltraPremium';
import RappelsUltraPremium from './RappelsUltraPremium';

// DevisPremium redirige vers la version appropriée
const DevisPremium = ({ isRappelContext = false }) => {
  // Si on est dans le contexte des rappels, afficher le module de rappels
  if (isRappelContext) {
    return <RappelsUltraPremium />;
  }
  return <DevisUltraPremium />;
};

export default DevisPremium;