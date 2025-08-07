import React, { useState } from "react";
import PlantSearchBar from "../../catalog/components/PlantSearchBar";

export default function ProjetForm({ onSubmit, initialData = {} }) {
  const [clientName, setClientName] = useState(initialData.client || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [dateDebut, setDateDebut] = useState(
    initialData.dateDebut ? initialData.dateDebut.slice(0, 10) : ""
  );
  const [dateFin, setDateFin] = useState(
    initialData.dateFin ? initialData.dateFin.slice(0, 10) : ""
  );
  const [statut, setStatut] = useState(initialData.statut || "En cours");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPlants, setSelectedPlants] = useState(initialData.plants || []);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Si des fichiers sont sélectionnés, on construit un FormData
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      formData.append("client", clientName);
      formData.append("description", description);
      formData.append("dateDebut", dateDebut);
      formData.append("dateFin", dateFin);
      formData.append("statut", statut);
      formData.append("plants", JSON.stringify(selectedPlants));
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      onSubmit(formData);
    } else {
      // Sinon on envoie un objet JSON simple
      onSubmit({
        client: clientName,
        description,
        dateDebut,
        dateFin,
        statut,
        plants: selectedPlants
      });
    }

    // Réinitialisation du formulaire
    setClientName("");
    setDescription("");
    setDateDebut("");
    setDateFin("");
    setStatut("En cours");
    setSelectedFiles([]);
    setSelectedPlants([]);
    e.target.reset();
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      borderRadius: '32px',
      padding: '3rem',
      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.08), 0 8px 25px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(45deg, rgba(59,130,246,0.03), rgba(16,185,129,0.03))',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: '3rem', 
          fontWeight: '900',
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
          textShadow: '0 4px 20px rgba(59,130,246,0.3)'
        }}>
          🏗️ Nouveau projet
        </h2>
        <p style={{
          color: '#64748b',
          fontSize: '1.1rem',
          fontWeight: '500',
          margin: 0
        }}>
          Créez et organisez vos projets avec fichiers et suivi de progression
        </p>
      </div>

    <form
      onSubmit={handleSubmit}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        position: 'relative',
        zIndex: 1
      }}
    >

      {/* Client */}
      <div>
        <label
          htmlFor="client"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#1e293b'
          }}
        >
          👤 Client *
        </label>
        <input
          type="text"
          id="client"
          name="client"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
          placeholder="Nom du client"
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '2px solid rgba(148,163,184,0.3)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'rgba(255,255,255,0.9)',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
        />
      </div>

      {/* Description */}
      <div style={{gridColumn: '1 / -1'}}>
        <label
          htmlFor="description"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#1e293b'
          }}
        >
          📝 Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Description détaillée du projet..."
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '2px solid rgba(148,163,184,0.3)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'rgba(255,255,255,0.9)',
            transition: 'all 0.3s ease',
            outline: 'none',
            resize: 'vertical',
            minHeight: '120px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
        />
      </div>

      {/* Dates */}
      <div>
        <label
          htmlFor="dateDebut"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#1e293b'
          }}
        >
          🚀 Date de début *
        </label>
        <input
          type="date"
          id="dateDebut"
          name="dateDebut"
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '2px solid rgba(148,163,184,0.3)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'rgba(255,255,255,0.9)',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
        />
      </div>
      
      <div>
        <label
          htmlFor="dateFin"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#1e293b'
          }}
        >
          🏁 Date de fin *
        </label>
        <input
          type="date"
          id="dateFin"
          name="dateFin"
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '2px solid rgba(148,163,184,0.3)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'rgba(255,255,255,0.9)',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
        />
      </div>

      {/* Statut */}
      <div>
        <label
          htmlFor="statut"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#1e293b'
          }}
        >
          📊 Statut
        </label>
        <select
          id="statut"
          name="statut"
          value={statut}
          onChange={(e) => setStatut(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '2px solid rgba(148,163,184,0.3)',
            borderRadius: '16px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'rgba(255,255,255,0.9)',
            transition: 'all 0.3s ease',
            outline: 'none',
            cursor: 'pointer'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.3)'}
        >
          <option>En cours</option>
          <option>Terminé</option>
          <option>Archivé</option>
        </select>
      </div>

      {/* Barre de recherche des plantes */}
      <div style={{gridColumn: '1 / -1'}}>
        <PlantSearchBar 
          onPlantsChange={setSelectedPlants}
          selectedPlants={selectedPlants}
        />
      </div>

      {/* Upload de fichiers */}
      <div style={{gridColumn: '1 / -1'}}>
        <label
          htmlFor="files"
          style={{
            display: 'block',
            marginBottom: '1rem',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#1e293b'
          }}
        >
          📎 Fichiers (PDF, JPG, PNG...)
        </label>
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
          borderRadius: '20px',
          border: '2px dashed rgba(59,130,246,0.3)',
          padding: '2rem',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          <input
            type="file"
            id="files"
            name="files"
            multiple
            onChange={handleFileChange}
            accept=".pdf,image/*"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
          <div style={{
            fontSize: '2rem',
            marginBottom: '0.5rem'
          }}>📁</div>
          <p style={{
            color: '#64748b',
            fontSize: '1rem',
            fontWeight: '500',
            margin: 0
          }}>
            Cliquez ou glissez vos fichiers ici
          </p>
        </div>
        {selectedFiles.length > 0 && (
          <div style={{
            marginTop: '1rem',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(16,185,129,0.05))',
            borderRadius: '16px',
            padding: '1rem',
            border: '2px solid rgba(59,130,246,0.1)'
          }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: '700',
              color: '#3b82f6',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.5rem'
            }}>📎 Fichiers sélectionnés:</div>
            {selectedFiles.map((f, i) => (
              <div key={i} style={{
                padding: '0.5rem',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '8px',
                margin: '0.25rem 0',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#1e293b'
              }}>
                {f.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{gridColumn: '1 / -1', marginTop: '1rem'}}>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '1.5rem 2rem',
            fontSize: '1.2rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 15px 35px rgba(59,130,246,0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.02)';
            e.target.style.boxShadow = '0 20px 40px rgba(59,130,246,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 15px 35px rgba(59,130,246,0.3)';
          }}
        >
          ✨ Créer le projet
        </button>
      </div>
    </form>
    </div>
  );
}
