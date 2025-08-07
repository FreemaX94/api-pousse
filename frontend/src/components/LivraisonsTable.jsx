// src/components/LivraisonsTable.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Livraison.css';

export default function LivraisonsTable({ deliveries, onToggleFait }) {
  if (!Array.isArray(deliveries)) return null;

  const columns = [
    { key: 'Horaire de livraison',    label: 'Horaire de livraison'    },
    { key: 'Qui fait la demande',     label: 'Qui fait la demande'     },
    { key: 'NB Colis',                label: 'NB Colis'                },
    { key: 'Référence devis',         label: 'Réf. devis'              },
    { key: 'Nom du client',           label: 'Client'                  },
    { key: 'Entreprise',              label: 'Entreprise'              },
    { key: 'Adresse',                 label: 'Adresse'                 },
    { key: 'CP',                      label: 'CP'                      },
    { key: 'Ville',                   label: 'Ville'                   },
    { key: 'Accès livraison',         label: 'Accès livraison'         },
    { key: 'Infos diverses',          label: 'Infos diverses'          },
    { key: 'Téléphone',               label: 'Téléphone'               },
    { key: 'Client(e) prévenu(e)',    label: 'Prévenu(e)'              },
    { key: 'A facturer',              label: 'A facturer'              },
    {
      key: 'Fait (case à cocher pour LIVA lorsque la livraison/récupération a été effectué)',
      label: 'Fait'
    }
  ];

  return (
    <div className="table-wrapper">
      <table className="table-livraison-styled">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.length > 0 ? (
            deliveries.map((d, i) => (
              <tr key={i}>
                {columns.map(col => (
                  <td key={col.key} className="infos-cell">
                    {col.key.startsWith('Fait (case')
                      ? (
                        <input
                          type="checkbox"
                          checked={!!d[col.key]}
                          onChange={() => onToggleFait(d._id, !d[col.key])}
                        />
                      )
                      : d[col.key] ?? '—'
                    }
                  </td>
                ))}
                <td>
                  <button
                    className="btn-action"
                    onClick={() => {/* TODO: afficher les détails */}}
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="no-data">
                Aucune livraison
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

LivraisonsTable.propTypes = {
  deliveries: PropTypes.array.isRequired,
  onToggleFait: PropTypes.func.isRequired
};
