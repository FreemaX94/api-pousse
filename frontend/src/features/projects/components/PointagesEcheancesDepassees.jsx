import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  EyeIcon,
  PencilIcon,
  InformationCircleIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

const PointagesEcheancesDepassees = () => {
  const [debutToggle, setDebutToggle] = useState(false);
  const [finToggle1, setFinToggle1] = useState(false);
  const [finToggle2, setFinToggle2] = useState(false);

  // Données de démonstration pour les collaborateurs
  const collaborateurs = [
    {
      nom: 'Aymeric Tireau',
      restriction: 'Normal',
      metier: '—',
      telephone: '06 87 79 52 41',
      email: 'aymeric.tireau1@outlook.fr'
    },
    {
      nom: 'David Celeste',
      restriction: 'Normal',
      metier: '—',
      telephone: '06 07 89 04 69',
      email: 'milan.celeste@gmail.com'
    },
    {
      nom: 'Elodie Treveten',
      restriction: 'Normal',
      metier: '—',
      telephone: '07 68 28 17 92',
      email: 'elodie.treveten@outlook.fr'
    },
    {
      nom: 'Estelle Delapierre',
      restriction: 'Administrateur',
      metier: '—',
      telephone: '06 33 33 07 71',
      email: 'estelle@pousse.fr'
    },
    {
      nom: 'Florence ROGER',
      restriction: 'Administrateur',
      metier: '—',
      telephone: '07 81 44 59 76',
      email: 'comptabilite@pousse.fr'
    },
    {
      nom: 'Lucie Garcia',
      restriction: 'Administrateur',
      metier: '—',
      telephone: '06 37 71 72 63',
      email: 'lucie@pousse.fr'
    },
    {
      nom: 'Marine Sandoz',
      restriction: 'Normal',
      metier: '—',
      telephone: '06 65 01 48 92',
      email: 'marinesandoz8@gmail.com'
    },
    {
      nom: 'Simon Henry',
      restriction: 'Modérateur',
      metier: '—',
      telephone: '06 59 25 10 32',
      email: 'simonhenry@hotmail.fr'
    }
  ];

  const getRestrictionBadgeColor = (restriction) => {
    switch (restriction) {
      case 'Administrateur':
        return 'bg-red-100 text-red-800';
      case 'Modérateur':
        return 'bg-orange-100 text-orange-800';
      case 'Normal':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderToggle = (isOn, setIsOn, label, id) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <label htmlFor={id} className="text-sm text-gray-700 cursor-pointer">
        {label}
      </label>
      <button
        id={id}
        onClick={() => setIsOn(!isOn)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2170E3] focus:ring-offset-2 ${
          isOn ? 'bg-[#2170E3]' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={isOn}
        aria-label={label}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const renderTable = (title) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collaborateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Restriction d'accès
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Métier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {collaborateurs.map((collaborateur, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{collaborateur.nom}</span>
                    <div className="relative group">
                      <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        <div className="font-medium">{collaborateur.nom}</div>
                        <div className="text-xs text-gray-300 mt-1">
                          Informations détaillées du collaborateur
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRestrictionBadgeColor(collaborateur.restriction)}`}>
                    {collaborateur.restriction}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {collaborateur.metier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <a 
                    href={`tel:${collaborateur.telephone.replace(/\s/g, '')}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {collaborateur.telephone}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <a 
                    href={`mailto:${collaborateur.email}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {collaborateur.email}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      title="Voir le collaborateur"
                      aria-label={`Voir ${collaborateur.nom}`}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
                      title="Modifier le collaborateur"
                      aria-label={`Modifier ${collaborateur.nom}`}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSuperAssistant = (title, toggles) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">😊</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-4">
            <span className="font-medium text-gray-900">Super assistant</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#F0AB00] text-white">
              Fonctionnalité du labo
            </span>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
            {toggles}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFooter = () => (
    <footer className="bg-white border-t border-gray-200 py-6 px-6 mt-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-sm text-gray-500">
          © 2025 Organilog · 
          <button className="text-blue-600 hover:text-blue-800 mx-1 focus:outline-none focus:underline">
            CGU
          </button>
          ·
          <button className="text-blue-600 hover:text-blue-800 mx-1 focus:outline-none focus:underline">
            Mentions légales
          </button>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm focus:outline-none focus:underline"
        >
          <ArrowUpIcon className="w-4 h-4" />
          <span>Retour en haut</span>
        </button>
      </div>
    </footer>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section A : Pointages du jour (début de journée) non reçu */}
      {renderTable("Pointages du jour (début de journée) non reçu")}
      
      {/* Super assistant - Début de journée */}
      {renderSuperAssistant(
        "Pointages du jour (début de journée)",
        renderToggle(
          debutToggle, 
          setDebutToggle, 
          "Recevoir un rappel automatique (email de l'entreprise)",
          "debut-toggle"
        )
      )}
      
      {/* Section B : Pointages du jour (fin de journée) non reçu */}
      {renderTable("Pointages du jour (fin de journée) non reçu")}
      
      {/* Super assistant - Fin de journée */}
      {renderSuperAssistant(
        "Pointages du jour (fin de journée)",
        <div>
          {renderToggle(
            finToggle1, 
            setFinToggle1, 
            "Recevoir un rappel automatique (email de l'entreprise)",
            "fin-toggle-1"
          )}
          {renderToggle(
            finToggle2, 
            setFinToggle2, 
            "Recevoir un rappel automatique (email du type d'activité)",
            "fin-toggle-2"
          )}
        </div>
      )}
      
      {/* Footer */}
      {renderFooter()}
    </div>
  );
};

export default PointagesEcheancesDepassees;