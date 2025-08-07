import React from 'react';
import { motion } from 'framer-motion';

const TestEntretien = () => {
  const mockEntretien = {
    _id: '1',
    numeroEntretien: 'ENT-202501-0001',
    client: {
      nom: 'Test Client',
      typeClient: 'Professionnel'
    },
    typeContrat: 'Entretien',
    statut: 'planifie',
    priorite: 'normale',
    planification: {
      dateDebut: new Date().toISOString(),
      dateFin: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    },
    dureeEstimee: 120,
    progression: 0,
    montantTotal: 150,
    techniciens: [
      { nom: 'Jean Dupont' },
      { nom: 'Marie Martin' }
    ],
    estEnRetard: false
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test Page Entretien Moderne
        </h1>
        
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Entretien Test</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Informations générales</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><strong>Numéro:</strong> {mockEntretien.numeroEntretien}</li>
                <li><strong>Client:</strong> {mockEntretien.client.nom}</li>
                <li><strong>Type:</strong> {mockEntretien.typeContrat}</li>
                <li><strong>Statut:</strong> {mockEntretien.statut}</li>
                <li><strong>Priorité:</strong> {mockEntretien.priorite}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Planification</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><strong>Date début:</strong> {new Date(mockEntretien.planification.dateDebut).toLocaleString('fr-FR')}</li>
                <li><strong>Date fin:</strong> {new Date(mockEntretien.planification.dateFin).toLocaleString('fr-FR')}</li>
                <li><strong>Durée estimée:</strong> {mockEntretien.dureeEstimee} minutes</li>
                <li><strong>Montant:</strong> {mockEntretien.montantTotal} €</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-2">Techniciens</h3>
            <div className="flex space-x-2">
              {mockEntretien.techniciens.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tech.nom}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-2">Progression</h3>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${mockEntretien.progression}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 mt-1">{mockEntretien.progression}% complété</span>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Démarrer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Modifier
            </motion.button>
          </div>
        </div>
        
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            ✅ Technologies Implémentées
          </h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• React Query pour la gestion des données</li>
            <li>• Framer Motion pour les animations</li>
            <li>• React Hot Toast pour les notifications</li>
            <li>• Heroicons pour les icônes modernes</li>
            <li>• Tailwind CSS pour le styling</li>
            <li>• Date-fns pour la gestion des dates</li>
            <li>• Pagination et filtres avancés</li>
            <li>• Interface responsive et accessible</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default TestEntretien;