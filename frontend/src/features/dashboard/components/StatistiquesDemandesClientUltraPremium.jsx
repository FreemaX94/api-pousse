import React from 'react';
import UltraPremiumContainer from './UltraPremiumContainer';
import { ChartPieIcon } from '@heroicons/react/24/outline';

const StatistiquesDemandesClientUltraPremium = () => {
  return (
    <UltraPremiumContainer
      title="Statistiques Demandes Ultra Premium"
      icon={ChartPieIcon}
    >
      <div className="flex items-center justify-center h-64 text-2xl text-gray-500">
        Composant StatistiquesDemandesClient Ultra Premium en cours de développement...
      </div>
    </UltraPremiumContainer>
  );
};

export default StatistiquesDemandesClientUltraPremium;