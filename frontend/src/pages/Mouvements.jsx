import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMovements } from "../api/clientApi";
import EntryForm from "../components/EntryForm";
import ExitForm from "../components/ExitForm";

export default function Mouvements() {
  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState("entree");
  
  // State global des mouvements
  const [mouvements, setMouvements] = useState([]);
  // Listes partitionnées
  const [entries, setEntries] = useState([]);
  const [exits, setExits] = useState([]);
  const [currentUser, setCurrentUser] = useState("utilisateur"); // TODO: récupérer de l'auth

  // Chargement initial
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getMovements();
      setMouvements(data);
      // Partitionner selon type
      setEntries(data.filter((m) => m.type === "entrée"));
      setExits(data.filter((m) => m.type === "sortie"));
    } catch (err) {
      console.error("Erreur fetch mouvements :", err);
    }
  };

  // Totaux
  const totalEntries = entries.reduce((sum, m) => sum + m.quantity, 0);
  const totalExits = exits.reduce((sum, m) => sum + m.quantity, 0);
  const totalReserved = exits
    .filter((m) => !m.returned)
    .reduce((sum, m) => sum + m.quantity, 0);
  const totalAvailable = totalEntries - totalExits;

  const onglets = [
    {
      id: "entree",
      label: "📥 Entrée",
      color: "from-emerald-500 to-teal-600",
      activeColor: "from-emerald-600 to-teal-700",
      bgGradient: "from-emerald-50 to-teal-50",
      icon: "🌱"
    },
    {
      id: "sortie",
      label: "📤 Sortie",
      color: "from-red-500 to-rose-600",
      activeColor: "from-red-600 to-rose-700",
      bgGradient: "from-red-50 to-rose-50",
      icon: "🚀"
    }
  ];

  const activeOnglet = onglets.find(t => t.id === activeTab);

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${activeOnglet?.bgGradient ? 
        activeOnglet.bgGradient.replace('from-', 'rgba(').replace(' to-', ', 0.05), rgba(').replace('50', '100, 0.02)') + ')' 
        : 'rgba(248,250,252,1), rgba(241,245,249,0.8)'})`,
      padding: '2rem'
    }}>
      {/* En-tête avec statistiques */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.95))',
          borderRadius: '24px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 8px 25px rgba(0,0,0,0.05)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            textShadow: '0 4px 20px rgba(59,130,246,0.3)'
          }}>
            📊 Gestion des Mouvements
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '1.2rem',
            fontWeight: '500',
            margin: 0
          }}>
            Suivez et gérez vos entrées et sorties de stock en temps réel
          </p>
        </div>

        {/* Statistiques */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            { label: "Total Entrées", value: totalEntries, color: "from-emerald-500 to-teal-600", icon: "📥" },
            { label: "Total Sorties", value: totalExits, color: "from-red-500 to-rose-600", icon: "📤" },
            { label: "Disponible", value: totalAvailable, color: "from-blue-500 to-indigo-600", icon: "📦" },
            { label: "Réservé", value: totalReserved, color: "from-amber-500 to-orange-600", icon: "⏰" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                background: `linear-gradient(135deg, ${stat.color})`,
                borderRadius: '20px',
                padding: '1.5rem',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                marginBottom: '0.5rem'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                opacity: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Navigation par onglets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem',
          gap: '1rem'
        }}
      >
        {onglets.map((onglet) => (
          <motion.button
            key={onglet.id}
            onClick={() => setActiveTab(onglet.id)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: activeTab === onglet.id 
                ? `linear-gradient(135deg, ${onglet.activeColor})`
                : `linear-gradient(135deg, ${onglet.color})`,
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: activeTab === onglet.id
                ? '0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1)'
                : '0 10px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              transform: activeTab === onglet.id ? 'translateY(-2px)' : 'translateY(0)',
              minWidth: '200px'
            }}
          >
            <span style={{ marginRight: '0.5rem' }}>{onglet.icon}</span>
            {onglet.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Contenu des onglets */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9))',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 8px 25px rgba(0,0,0,0.05)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {activeTab === "entree" && (
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '2rem' }}
              >
                <h2 style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem',
                  textAlign: 'center'
                }}>
                  🌱 Formulaire d'Entrée
                </h2>
                <p style={{
                  color: '#64748b',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  textAlign: 'center',
                  margin: 0
                }}>
                  Ajoutez de nouveaux articles à votre inventaire
                </p>
              </motion.div>

              {/* Formulaire d'entrée centré */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <div style={{ maxWidth: '800px', width: '100%' }}>
                  <EntryForm 
                    onSaved={fetchData} 
                    currentUser={currentUser}
                  />
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "sortie" && (
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '2rem' }}
              >
                <h2 style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem',
                  textAlign: 'center'
                }}>
                  🚀 Formulaires de Sortie
                </h2>
                <p style={{
                  color: '#64748b',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  textAlign: 'center',
                  margin: 0
                }}>
                  Gérez les sorties définitives et locatives de votre stock
                </p>
              </motion.div>

              {/* Sous-onglets pour définitive et locative */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                {[
                  { id: "definitive", label: "🗑️ Sortie Définitive", desc: "Suppression du stock" },
                  { id: "locative", label: "📤 Sortie Locative", desc: "Avec retour prévu" }
                ].map((variant) => (
                  <motion.div
                    key={variant.id}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(220,38,38,0.05))',
                      borderRadius: '16px',
                      padding: '1rem',
                      border: '2px solid rgba(239,68,68,0.2)',
                      textAlign: 'center',
                      minWidth: '200px'
                    }}
                  >
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#dc2626',
                      marginBottom: '0.25rem'
                    }}>
                      {variant.label}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#64748b',
                      fontWeight: '500'
                    }}>
                      {variant.desc}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Formulaires de sortie centrés */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <div style={{ 
                  maxWidth: '800px', 
                  width: '100%',
                  display: 'grid',
                  gap: '2rem'
                }}>
                  <ExitForm 
                    variant="definitive"
                    onSaved={fetchData} 
                    currentUser={currentUser}
                  />
                  <ExitForm 
                    variant="locative"
                    onSaved={fetchData} 
                    currentUser={currentUser}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}