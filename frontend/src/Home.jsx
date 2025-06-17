// frontend/src/pages/Home.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  PlusSquare,
  Wrench,
  Archive,
  Truck,
  BarChart2,
  Settings2,
  DollarSign,
  Leaf, // ✅ Nouvelle icône pour Nieuwkoop
} from 'lucide-react'

const sections = [
  { label: 'Événements',   icon: Calendar,   path: '/evenements'   },
  { label: 'Création',     icon: PlusSquare, path: '/creation'     },
  { label: 'Entretien',    icon: Wrench,     path: '/entretien'    },
  { label: 'Dépôt',        icon: Archive,    path: '/depot'        },
  { label: 'Livraisons',   icon: Truck,      path: '/livraisons'   },
  { label: 'Véhicules',    icon: Truck,      path: '/vehicules'    },
  { label: 'Nieuwkoop',    icon: Leaf,       path: '/nieuwkoop'    }, // ✅ Nouveau module
  { label: 'Statistiques', icon: BarChart2,  path: '/statistiques' },
  { label: 'Paramètres',   icon: Settings2,  path: '/parametres'   },
  { label: 'Comptabilité', icon: DollarSign, path: '/comptabilite' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen text-gray-800 bg-white">
      <section className="mt-12 mb-8 text-center">
        <h2 className="text-2xl font-heading">Bienvenue sur votre espace Pousse</h2>
      </section>

      <main className="container flex-1 px-4 pb-12 mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sections.map(({ label, icon: Icon, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex flex-col items-center justify-center p-6 transition duration-200 transform bg-white border border-gray-200 shadow-sm  rounded-2xl hover:shadow-md hover:scale-105"
            >
              <Icon className="mb-4 text-green-600" size={48} />
              <span className="text-lg font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
