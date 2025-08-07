import React, { useState } from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';

const SuiviClientsTabSimple = () => {
  console.log('🔍 SuiviClientsTabSimple - Composant rendu');
  const [activeSubTab, setActiveSubTab] = useState('Clients');

  const subTabs = ['Clients', 'Adresses', 'Équipements', 'Contrats', 'Affaires', 'Contacts', 'Fichiers'];

  return (
    <div className="w-full h-full bg-white">
      {/* Test de base */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <UsersIcon className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Suivi clients - Test</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            {activeSubTab}
          </span>
        </div>
      </div>

      {/* Sous-onglets simples */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex space-x-4 px-4">
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                console.log('🔍 Changement d\'onglet vers:', tab);
                setActiveSubTab(tab);
              }}
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeSubTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {/* Contenu de test */}
      <div className="p-6">
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Onglet actif: {activeSubTab}
          </h3>
          <p className="text-gray-600">
            Ce composant de test s'affiche correctement. 
            Cliquez sur les onglets ci-dessus pour tester la navigation.
          </p>
          <div className="mt-4 p-4 bg-white rounded border">
            <p className="text-sm text-gray-500">
              Si vous voyez ce message, le composant SuiviClients fonctionne !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuiviClientsTabSimple;