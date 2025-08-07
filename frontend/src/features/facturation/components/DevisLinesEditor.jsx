import React from 'react';
import { 
  PlusIcon,
  TrashIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';

const DevisLinesEditor = ({ 
  lignes, 
  onAddLigne, 
  onRemoveLigne, 
  onUpdateLigne,
  errors 
}) => {
  const tvaOptions = [0, 5.5, 10, 20];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  const calculateTotals = () => {
    const totalHT = lignes.reduce((sum, ligne) => {
      return sum + (ligne.quantite * ligne.prixUnitaire);
    }, 0);
    
    const totalTVA = lignes.reduce((sum, ligne) => {
      const ligneHT = ligne.quantite * ligne.prixUnitaire;
      const ligneTVA = ligneHT * (ligne.tva / 100);
      return sum + ligneTVA;
    }, 0);
    
    const totalTTC = totalHT + totalTVA;
    
    return {
      totalHT,
      totalTVA,
      totalTTC
    };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Lignes du devis</h3>
        <button
          type="button"
          onClick={onAddLigne}
          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Ajouter une ligne</span>
        </button>
      </div>

      {errors && (
        <p className="text-sm text-red-600">{errors}</p>
      )}

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Libellé
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Quantité
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Prix unitaire
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                TVA (%)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Total TTC
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lignes.map((ligne, index) => (
              <tr key={ligne.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={ligne.libelle}
                    onChange={(e) => onUpdateLigne(ligne.id, 'libelle', e.target.value)}
                    className="w-full border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description de la prestation..."
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={ligne.quantite}
                    onChange={(e) => onUpdateLigne(ligne.id, 'quantite', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full text-center border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={ligne.prixUnitaire}
                    onChange={(e) => onUpdateLigne(ligne.id, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full text-right border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={ligne.tva}
                    onChange={(e) => onUpdateLigne(ligne.id, 'tva', parseFloat(e.target.value))}
                    className="w-full text-center border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {tvaOptions.map(tva => (
                      <option key={tva} value={tva}>{tva}%</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {formatCurrency(ligne.total)}
                </td>
                <td className="px-4 py-3 text-center">
                  {lignes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveLigne(ligne.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan="4" className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                Total HT
              </td>
              <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                {formatCurrency(totals.totalHT)}
              </td>
              <td></td>
            </tr>
            <tr>
              <td colSpan="4" className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                Total TVA
              </td>
              <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                {formatCurrency(totals.totalTVA)}
              </td>
              <td></td>
            </tr>
            <tr className="border-t-2 border-gray-300">
              <td colSpan="4" className="px-4 py-3 text-right text-base font-bold text-gray-900">
                Total TTC
              </td>
              <td className="px-4 py-3 text-right text-base font-bold text-blue-600">
                {formatCurrency(totals.totalTTC)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <CalculatorIcon className="w-4 h-4" />
        <span>Les totaux sont calculés automatiquement</span>
      </div>
    </div>
  );
};

export default DevisLinesEditor;