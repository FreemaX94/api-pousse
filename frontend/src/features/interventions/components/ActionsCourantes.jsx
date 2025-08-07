import React, { useState } from 'react';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import InterventionCategoryModal from './InterventionCategoryModal';
import { useInterventionCategoryModal } from '../hooks/useInterventionCategoryModal';

const ActionsCourantes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  const {
    isOpen,
    mode,
    formData,
    loading,
    errors,
    openAddModal,
    openEditModal,
    closeModal,
    updateFormData,
    saveCategory
  } = useInterventionCategoryModal();

  // Données mock des catégories d'intervention
  const [categories] = useState([
    {
      id: 1,
      nom: 'Entretien régulier',
      couleur: '#10B981',
      tauxHoraire: 35.00,
      dureeStandard: '02:00',
      commentaire: 'Entretien standard des espaces verts',
      interventionsCount: 45
    },
    {
      id: 2,
      nom: 'Taille',
      couleur: '#F59E0B',
      tauxHoraire: 40.00,
      dureeStandard: '03:00',
      commentaire: 'Taille des arbustes et haies',
      interventionsCount: 23
    },
    {
      id: 3,
      nom: 'Nettoyage',
      couleur: '#3B82F6',
      tauxHoraire: 32.00,
      dureeStandard: '01:30',
      commentaire: 'Nettoyage des bacs et jardinières',
      interventionsCount: 67
    },
    {
      id: 4,
      nom: 'Fertilisation',
      couleur: '#8B5CF6',
      tauxHoraire: 38.00,
      dureeStandard: '01:00',
      commentaire: 'Application d\'engrais et amendements',
      interventionsCount: 12
    },
    {
      id: 5,
      nom: 'Rempotage',
      couleur: '#EC4899',
      tauxHoraire: 42.00,
      dureeStandard: '02:30',
      commentaire: 'Rempotage des plantes d\'intérieur',
      interventionsCount: 8
    },
    {
      id: 6,
      nom: 'Arrosage',
      couleur: '#14B8A6',
      tauxHoraire: 30.00,
      dureeStandard: '01:00',
      commentaire: 'Arrosage manuel ou automatique',
      interventionsCount: 89
    },
    {
      id: 7,
      nom: 'Installation',
      couleur: '#EF4444',
      tauxHoraire: 45.00,
      dureeStandard: '04:00',
      commentaire: 'Installation de nouvelles plantes',
      interventionsCount: 15
    },
    {
      id: 8,
      nom: 'Diagnostic',
      couleur: '#6B7280',
      tauxHoraire: 50.00,
      dureeStandard: '00:45',
      commentaire: 'Diagnostic phytosanitaire',
      interventionsCount: 5
    }
  ]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const filteredCategories = categories.filter(cat =>
    cat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.commentaire.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCategories = getSortedData(filteredCategories);

  const SortButton = ({ column, children }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center space-x-1 text-left w-full hover:text-blue-600 transition-colors"
    >
      <span>{children}</span>
      {sortConfig.key === column && (
        sortConfig.direction === 'asc' ? 
          <ChevronUpIcon className="w-4 h-4" /> : 
          <ChevronDownIcon className="w-4 h-4" />
      )}
    </button>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleDelete = (category) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.nom}" ?`)) {
      // Appel API pour supprimer
      console.log('Suppression de:', category);
    }
  };

  const handleRefresh = () => {
    // Rafraîchir la liste après ajout/modification
    console.log('Rafraîchissement de la liste');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Catégories d'intervention</h2>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <button
            onClick={openAddModal}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Ajouter une catégorie d'intervention</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton column="nom">Nom</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Couleur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton column="tauxHoraire">Taux horaire</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton column="dureeStandard">Durée standard</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commentaire
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <SortButton column="interventionsCount">Interventions</SortButton>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: category.couleur + '20' }}
                      >
                        <TagIcon 
                          className="w-4 h-4"
                          style={{ color: category.couleur }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{category.nom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: category.couleur }}
                      />
                      <span className="text-sm text-gray-500">{category.couleur}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(category.tauxHoraire)}/h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.dureeStandard}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {category.commentaire}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category.interventionsCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                        title="Modifier"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedCategories.length === 0 && (
          <div className="text-center py-12">
            <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune catégorie trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Aucun résultat pour votre recherche' : 'Commencez par créer une nouvelle catégorie'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <InterventionCategoryModal
        isOpen={isOpen}
        mode={mode}
        formData={formData}
        errors={errors}
        loading={loading}
        onClose={closeModal}
        onUpdateField={updateFormData}
        onSave={() => saveCategory(handleRefresh)}
      />
    </div>
  );
};

export default ActionsCourantes;