import React, { useState, useEffect } from "react";
import { getStockItems } from "../api/clientApi";
import { useTheme } from '../contexts/ThemeContext';

export default function ProjetForm({ onSubmit, initialData = {} }) {
  const { isDark, theme } = useTheme();
  const [clientName, setClientName] = useState(initialData.client || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [chargeProjet, setChargeProjet] = useState(initialData.chargeProjet || "");

  // Liste des chargés de projet disponibles avec leurs couleurs
  const chargesProjet = [
    { name: 'Amélie', color: '#10b981', bgColor: '#dcfce7' }, // Vert
    { name: 'Hugo', color: '#3b82f6', bgColor: '#dbeafe' },   // Bleu
    { name: 'Baptiste', color: '#eab308', bgColor: '#fef08a' } // Jaune
  ];

  // Fonction pour obtenir la couleur d'un chargé
  const getChargeColor = (chargeName) => {
    const charge = chargesProjet.find(c => c.name === chargeName);
    return charge ? charge.color : 'var(--color-text-primary)';
  };
  const [dateDebut, setDateDebut] = useState(
    initialData.dateDebut ? initialData.dateDebut.slice(0, 10) : ""
  );
  const [dateFin, setDateFin] = useState(
    initialData.dateFin ? initialData.dateFin.slice(0, 10) : ""
  );
  const [statut, setStatut] = useState(initialData.statut || "En cours");
  const [selectedFiles, setSelectedFiles] = useState([]);

  // États pour la gestion des plantes
  const [stockQuery, setStockQuery] = useState('');
  const [stockOptions, setStockOptions] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState(initialData.materials || []);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  // Fonctions pour le drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      return file.type.startsWith('image/') || file.type === 'application/pdf';
    });
    
    setSelectedFiles(validFiles);
  };

  // Recherche stock avec enrichissement des dimensions
  useEffect(() => {
    if (stockQuery.length < 2) {
      setStockOptions([]);
      return;
    }
    let cancelled = false;
    
    const fetchEnrichedItems = async () => {
      try {
        const items = await getStockItems(stockQuery);
        if (cancelled) return;
        
        console.log('🔍 ProjetForm - Résultats de recherche reçus:', items);
        
        if (items && items.length > 0) {
          // Le backend fait déjà l'enrichissement des dimensions, mais s'il ne retourne pas height/diameter
          // on les extrait de l'objet dimensions
          console.log('📦 ProjetForm - Résultats reçus du backend:', items.map(r => ({ 
            reference: r.reference, 
            name: r.name, 
            height: r.height || r.dimensions?.height, 
            diameter: r.diameter || r.dimensions?.diameter,
            dimensions: r.dimensions
          })))
          
          const enrichedResults = items.map(item => ({
            ...item,
            height: item.height || item.dimensions?.height || 0,
            diameter: item.diameter || item.dimensions?.diameter || 0
          }))
          
          if (!cancelled) setStockOptions(enrichedResults);
        } else {
          if (!cancelled) setStockOptions(items || []);
        }
      } catch (error) {
        console.error('Erreur de recherche stock ProjetForm:', error);
        if (!cancelled) setStockOptions([]);
      }
    };
    
    fetchEnrichedItems();
    return () => { cancelled = true; };
  }, [stockQuery]);

  // Ajouter une plante au projet
  const handleAddMaterial = (stockItem, quantity = 1) => {
    console.log('🌿 handleAddMaterial called with:', stockItem);
    const availableStock = stockItem.stock?.quantity || stockItem.availableQuantity || 0;
    const reservedStock = stockItem.stock?.reservedQuantity || 0;
    const actuallyAvailable = Math.max(0, availableStock - reservedStock);
    
    console.log('📊 Stock info:', { availableStock, reservedStock, actuallyAvailable });
    
    if (actuallyAvailable === 0) {
      alert('Cet article n\'est pas disponible en stock.');
      return;
    }

    const existingIndex = selectedMaterials.findIndex(m => m.reference === stockItem.reference);
    
    if (existingIndex !== -1) {
      // Si l'article existe déjà, vérifier qu'on ne dépasse pas le stock
      const currentQuantity = selectedMaterials[existingIndex].quantity;
      const newTotalQuantity = currentQuantity + quantity;
      
      if (newTotalQuantity > actuallyAvailable) {
        alert(`Stock insuffisant. Disponible: ${actuallyAvailable}, déjà sélectionné: ${currentQuantity}`);
        return;
      }
      
      const updatedMaterials = [...selectedMaterials];
      updatedMaterials[existingIndex].quantity = newTotalQuantity;
      setSelectedMaterials(updatedMaterials);
    } else {
      // Sinon on l'ajoute
      if (quantity > actuallyAvailable) {
        alert(`Stock insuffisant. Disponible: ${actuallyAvailable}`);
        return;
      }
      
      const newMaterial = {
        reference: stockItem.reference,
        name: stockItem.name,
        quantity: quantity,
        unitPrice: stockItem.price || 0,
        image: stockItem.image || '',
        status: 'needed',
        stock: stockItem.stock || null
      };
      setSelectedMaterials([...selectedMaterials, newMaterial]);
      console.log('✅ Material added to selectedMaterials:', newMaterial);
      console.log('📋 Total selectedMaterials:', [...selectedMaterials, newMaterial]);
    }
    
    // Reset de la recherche
    setStockQuery('');
    setStockOptions([]);
  };

  // Supprimer une plante du projet
  const handleRemoveMaterial = (reference) => {
    setSelectedMaterials(selectedMaterials.filter(m => m.reference !== reference));
  };

  // Modifier la quantité d'une plante
  const handleUpdateQuantity = (reference, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveMaterial(reference);
      return;
    }
    
    // Trouver le matériau et vérifier le stock disponible
    const material = selectedMaterials.find(m => m.reference === reference);
    if (material && material.stock) {
      const availableStock = material.stock.quantity || 0;
      const reservedStock = material.stock.reservedQuantity || 0;
      const actuallyAvailable = Math.max(0, availableStock - reservedStock);
      
      if (newQuantity > actuallyAvailable) {
        alert(`Stock insuffisant. Disponible: ${actuallyAvailable}`);
        return;
      }
    }
    
    const updatedMaterials = selectedMaterials.map(m => 
      m.reference === reference ? { ...m, quantity: newQuantity } : m
    );
    setSelectedMaterials(updatedMaterials);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('🎯 ProjetForm - Submitting with materials:', selectedMaterials);

    // Si des fichiers sont sélectionnés, on construit un FormData
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      formData.append("client", clientName);
      formData.append("description", description);
      formData.append("address", address);
      formData.append("chargeProjet", chargeProjet);
      formData.append("dateDebut", dateDebut);
      formData.append("dateFin", dateFin);
      formData.append("statut", statut);
      formData.append("materials", JSON.stringify(selectedMaterials));
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      onSubmit(formData);
    } else {
      // Sinon on envoie un objet JSON simple
      const projectData = {
        client: clientName,
        description,
        address,
        chargeProjet,
        dateDebut,
        dateFin,
        statut,
        materials: selectedMaterials
      };
      console.log('📦 ProjetForm - Sending JSON data:', projectData);
      onSubmit(projectData);
    }

    // Réinitialisation du formulaire
    setClientName("");
    setDescription("");
    setAddress("");
    setChargeProjet("");
    setDateDebut("");
    setDateFin("");
    setStatut("En cours");
    setSelectedFiles([]);
    setSelectedMaterials([]);
    setStockQuery('');
    setStockOptions([]);
    e.target.reset();
  };

  return (
    <div style={{
      background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'var(--color-surface)',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: isDark 
        ? '0 20px 40px -5px rgba(0, 0, 0, 0.5), 0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
        : 'var(--shadow-lg)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      maxWidth: '900px',
      margin: '0 auto',
      color: isDark ? '#ffffff' : 'inherit'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(45deg, var(--color-primary-alpha), var(--color-accent-alpha))',
        borderRadius: '50%',
        pointerEvents: 'none',
        opacity: 0.1
      }} />
      
      {/* En-tête avec style sombre */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid var(--color-primary)',
        position: 'relative',
        zIndex: 1,
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '2rem', 
          fontWeight: '700',
          color: 'var(--color-primary)',
          marginBottom: '0.5rem',
          margin: 0
        }}>
          🏗️ Nouveau projet
        </h2>
        <p style={{
          color: 'var(--color-secondary)',
          fontSize: '0.9rem',
          fontWeight: '500',
          margin: 0,
          opacity: 0.8
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
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
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
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
            color: 'var(--color-text-primary)',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      {/* Adresse */}
      <div>
        <label
          htmlFor="address"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          📍 Adresse du projet *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          placeholder="Adresse complète du projet"
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
            color: 'var(--color-text-primary)',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      {/* Chargé de projet */}
      <div>
        <label
          htmlFor="chargeProjet"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          👨‍💼 Chargé de projet
        </label>
        <select
          id="chargeProjet"
          name="chargeProjet"
          value={chargeProjet}
          onChange={(e) => setChargeProjet(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            border: `2px solid ${chargeProjet ? getChargeColor(chargeProjet) : 'var(--color-border)'}`,
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            background: chargeProjet
              ? `linear-gradient(135deg, ${chargesProjet.find(c => c.name === chargeProjet)?.bgColor || 'var(--color-bg-primary)'}, var(--color-bg-secondary))`
              : 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
            color: chargeProjet ? getChargeColor(chargeProjet) : 'var(--color-text-primary)',
            transition: 'all 0.3s ease',
            outline: 'none',
            cursor: 'pointer'
          }}
          onFocus={(e) => e.target.style.borderColor = chargeProjet ? getChargeColor(chargeProjet) : 'var(--color-primary)'}
          onBlur={(e) => e.target.style.borderColor = chargeProjet ? getChargeColor(chargeProjet) : 'var(--color-border)'}
        >
          <option value="">-- Sélectionnez un chargé de projet --</option>
          {chargesProjet.map((charge) => (
            <option key={charge.name} value={charge.name}>
              {charge.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div style={{gridColumn: '1 / -1'}}>
        <label
          htmlFor="description"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
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
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
            color: 'var(--color-text-primary)',
            transition: 'all 0.3s ease',
            outline: 'none',
            resize: 'vertical',
            minHeight: '120px'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      {/* Dates */}
      <div>
        <label
          htmlFor="dateDebut"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
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
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
            color: 'var(--color-text-primary)',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>
      
      <div>
        <label
          htmlFor="dateFin"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
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
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
            color: 'var(--color-text-primary)',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      {/* Statut */}
      <div>
        <label
          htmlFor="statut"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
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
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '500',
            background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
            color: 'var(--color-text-primary)',
            transition: 'all 0.3s ease',
            outline: 'none',
            cursor: 'pointer'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        >
          <option>En cours</option>
          <option>Terminé</option>
          <option>Archivé</option>
        </select>
      </div>

      {/* Section Plantes du Stock */}
      <div style={{gridColumn: '1 / -1'}}>
        <label style={{
          display: 'block',
          marginBottom: '1rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: 'var(--color-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          🌱 Plantes du projet
        </label>
        
        {/* Recherche de plantes */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
          borderRadius: '16px',
          border: '1px solid var(--color-primary)',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: '700',
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '1rem'
          }}>🔍 Rechercher dans le stock</div>
          
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={stockQuery}
              onChange={(e) => setStockQuery(e.target.value)}
              placeholder="Tapez le nom ou la référence d'une plante..."
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '500',
                background: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
            
            {/* Résultats de recherche */}
            {stockOptions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 10,
                maxHeight: '300px',
                overflowY: 'auto',
                marginTop: '0.5rem'
              }}>
                {stockOptions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      console.log('🖱️ Clicked on item:', item);
                      const hasStock = item.stock?.quantity > 0 || item.availableQuantity > 0;
                      console.log('📦 Has stock?', hasStock, 'Stock:', item.stock, 'Available:', item.availableQuantity);
                      if (hasStock) {
                        handleAddMaterial(item);
                      }
                    }}
                    style={{
                      padding: '1rem',
                      borderBottom: index < stockOptions.length - 1 ? '1px solid var(--color-border)' : 'none',
                      cursor: item.stock?.quantity > 0 ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      opacity: item.stock?.quantity > 0 ? 1 : 0.6
                    }}
                    onMouseEnter={(e) => item.stock?.quantity > 0 && (e.target.style.background = 'var(--color-bg-secondary)')}
                    onMouseLeave={(e) => item.stock?.quantity > 0 && (e.target.style.background = 'transparent')}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                        {item.category === 'externe' ? item.name : `${item.reference} — ${item.name}`}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span>{item.price ? `${item.price}€` : 'Prix non défini'}</span>
                        {item.height > 0 && <span style={{fontSize: '0.8rem'}}>📏 H: {item.height}cm</span>}
                        {item.diameter > 0 && <span style={{fontSize: '0.8rem'}}>📐 Ø: {item.diameter}cm</span>}
                        {(!item.height || !item.diameter) && (
                          <span style={{color: '#666', fontStyle: 'italic', fontSize: '0.8rem'}}>
                            Dimensions en cours...
                          </span>
                        )}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: item.stock?.quantity > 0 ? 
                            (item.stock?.quantity <= (item.stock?.minimumAlert || 0) ? '#fef3c7' : '#d1fae5') :
                            '#fee2e2',
                          color: item.stock?.quantity > 0 ? 
                            (item.stock?.quantity <= (item.stock?.minimumAlert || 0) ? '#d97706' : '#065f46') :
                            '#dc2626'
                        }}>
                          <span>
                            {item.stock?.quantity > 0 ? 
                              (item.stock?.quantity <= (item.stock?.minimumAlert || 0) ? '⚠️' : '✅') :
                              '❌'}
                          </span>
                          <span>
                            {item.stock?.quantity || 0} en stock
                          </span>
                          {item.stock?.reservedQuantity > 0 && (
                            <span style={{ 
                              fontSize: '0.7rem',
                              opacity: 0.8,
                              marginLeft: '0.25rem'
                            }}>
                              ({item.stock.reservedQuantity} réservé)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      background: item.stock?.quantity > 0 ? 'var(--color-primary)' : 'var(--color-secondary)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: item.stock?.quantity > 0 ? 'pointer' : 'not-allowed',
                      opacity: item.stock?.quantity > 0 ? 1 : 0.6
                    }}>
                      {item.stock?.quantity > 0 ? 'Ajouter' : 'Rupture'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Liste des plantes sélectionnées */}
        {selectedMaterials.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
            borderRadius: '16px',
            border: '1px solid var(--color-primary)',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: '700',
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '1rem'
            }}>🌿 Plantes sélectionnées ({selectedMaterials.length})</div>
            
            <div style={{
              display: 'grid',
              gap: '1rem'
            }}>
              {selectedMaterials.map((material, index) => (
                <div
                  key={index}
                  style={{
                    background: 'var(--color-surface)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  {material.image && (
                    <img
                      src={material.image}
                      alt={material.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                      {material.reference} — {material.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span>Prix unitaire: {material.unitPrice}€</span>
                      {material.stock && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: material.stock.quantity > 0 ? 
                            (material.stock.quantity <= (material.stock.minimumAlert || 0) ? '#fef3c7' : '#d1fae5') :
                            '#fee2e2',
                          color: material.stock.quantity > 0 ? 
                            (material.stock.quantity <= (material.stock.minimumAlert || 0) ? '#d97706' : '#065f46') :
                            '#dc2626'
                        }}>
                          <span>
                            {material.stock.quantity > 0 ? 
                              (material.stock.quantity <= (material.stock.minimumAlert || 0) ? '⚠️' : '✅') :
                              '❌'}
                          </span>
                          <span>
                            {material.stock.quantity || 0} dispo
                          </span>
                          {material.stock.reservedQuantity > 0 && (
                            <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>
                              ({material.stock.reservedQuantity} rés.)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(material.reference, material.quantity - 1)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      -
                    </button>
                    <span style={{
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      color: 'var(--color-text-primary)',
                      minWidth: '2rem',
                      textAlign: 'center'
                    }}>
                      {material.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(material.reference, material.quantity + 1)}
                      disabled={material.stock && material.quantity >= Math.max(0, (material.stock.quantity || 0) - (material.stock.reservedQuantity || 0))}
                      style={{
                        background: material.stock && material.quantity >= Math.max(0, (material.stock.quantity || 0) - (material.stock.reservedQuantity || 0)) 
                          ? 'var(--color-secondary)' : 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem',
                        cursor: material.stock && material.quantity >= Math.max(0, (material.stock.quantity || 0) - (material.stock.reservedQuantity || 0)) 
                          ? 'not-allowed' : 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        opacity: material.stock && material.quantity >= Math.max(0, (material.stock.quantity || 0) - (material.stock.reservedQuantity || 0)) 
                          ? 0.6 : 1
                      }}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(material.reference)}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 0.75rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        marginLeft: '0.5rem'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total estimé */}
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
              borderRadius: '12px',
              border: '1px solid var(--color-primary)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '0.25rem'
              }}>
                Coût total estimé des plantes
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: 'var(--color-primary)'
              }}>
                {selectedMaterials.reduce((total, m) => total + (m.quantity * m.unitPrice), 0).toFixed(2)}€
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload de fichiers */}
      <div style={{gridColumn: '1 / -1'}}>
        <label
          htmlFor="files"
          style={{
            display: 'block',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          📎 Fichiers (PDF, JPG, PNG...)
        </label>
        <div 
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
            borderRadius: '16px',
            border: '2px dashed var(--color-border)',
            padding: '2rem',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
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
            color: 'var(--color-text-secondary)',
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
            background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: '700',
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.5rem'
            }}>📎 Fichiers sélectionnés:</div>
            {selectedFiles.map((f, i) => (
              <div key={i} style={{
                padding: '0.5rem',
                background: 'var(--color-surface)',
                borderRadius: '6px',
                margin: '0.25rem 0',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)'
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
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--shadow-lg)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.02)';
            e.target.style.boxShadow = 'var(--shadow-2xl)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = 'var(--shadow-lg)';
          }}
        >
          ✨ Créer le projet
        </button>
      </div>
    </form>
    </div>
  );
}
