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
  DollarSign
} from 'lucide-react'

const sections = [
  { label: 'Événements',   icon: Calendar,   path: '/evenements'   },
  { label: 'Création',     icon: PlusSquare, path: '/creation'     },
  { label: 'Entretien',    icon: Wrench,     path: '/entretien'    },
  { label: 'Dépôt',        icon: Archive,    path: '/depot'        },
  { label: 'Livraisons',   icon: Truck,      path: '/livraisons'   },
  { label: 'Véhicules',    icon: Truck,      path: '/vehicules'    },
  { label: 'Statistiques', icon: BarChart2,  path: '/statistiques' },
  { label: 'Paramètres',   icon: Settings2,  path: '/parametres'   },
  { label: 'Comptabilité', icon: DollarSign, path: '/comptabilite' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* On supprime ici tout header “Pousse” + bouton déconnexion :contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3} */}

      {/* Titre de bienvenue */}
      <section className="text-center mt-12 mb-8">
        <h2 className="text-2xl font-heading">Bienvenue sur votre espace Pousse</h2>
      </section>

      {/* Grille responsive de cartes */}
      <main className="flex-1 container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sections.map(({ label, icon: Icon, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="
                bg-white
                border border-gray-200
                rounded-2xl
                shadow-sm hover:shadow-md
                transition transform hover:scale-105 duration-200
                p-6
                flex flex-col items-center justify-center
              "
            >
              <Icon className="text-green-600 mb-4" size={48} />
              <span className="text-lg font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
