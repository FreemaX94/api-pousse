import React from 'react';
import DevisListPage from './DevisListPage';
import { Toaster } from 'react-hot-toast';

export default {
  title: 'Facturation/DevisListPage',
  component: DevisListPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <>
        <Toaster position="top-right" />
        <Story />
      </>
    ),
  ],
};

// Template de base
const Template = (args) => <DevisListPage {...args} />;

// Story : État par défaut avec des devis
export const Default = Template.bind({});
Default.args = {};

// Story : Liste vide
export const EmptyList = () => {
  // Pour simuler une liste vide, on devrait normalement passer des props
  // mais ici on peut juste noter que le composant gère déjà ce cas
  return (
    <div className="p-6 space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-center py-12">
          <p className="text-gray-500">
            Pour tester la liste vide, utilisez les filtres pour ne correspondre à aucun devis
          </p>
        </div>
      </div>
    </div>
  );
};

// Story : Modal ouvert en mode ajout
export const WithAddModal = () => {
  const [showModal, setShowModal] = React.useState(true);
  
  return (
    <div className="relative">
      <DevisListPage />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg">
          <p className="text-center mb-4">
            Cliquez sur "Ajouter un devis" pour voir le modal
          </p>
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Fermer cette info
          </button>
        </div>
      </div>
    </div>
  );
};

// Story : Avec filtres actifs
export const WithActiveFilters = () => {
  return (
    <div>
      <div className="bg-yellow-50 border-b border-yellow-200 p-4">
        <p className="text-sm text-yellow-800">
          Essayez de filtrer par catégorie "Abonnement" ou recherchez "BNP" dans la barre de recherche
        </p>
      </div>
      <DevisListPage />
    </div>
  );
};

// Story : Mode responsive mobile
export const Mobile = Template.bind({});
Mobile.parameters = {
  viewport: {
    defaultViewport: 'mobile1',
  },
};

// Story : Mode responsive tablette
export const Tablet = Template.bind({});
Tablet.parameters = {
  viewport: {
    defaultViewport: 'ipad',
  },
};