import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Nieuwkoop.css";
import MouvementForm from "../components/MouvementForm";
import MouvementList from "../components/MouvementList";
import {
  getMovements,
  createMovement,
  validateMovement,
  markReturned
, createPartnerItem } from "../api/clientApi";


const Nieuwkoop = () => {
  const [activeSection, setActiveSection] = useState("Catalogue");
  const [productId, setProductId] = useState("4HOFOBX12");
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const [price, setPrice] = useState(null);
  const [addedItems, setAddedItems] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [mouvements, setMouvements] = useState([]);

  useEffect(() => {
    if (activeSection === "Entrées/Sorties") fetchMovements();
    if (activeSection === "Stock") {
      fetch("/api/nieuwkoop/stock")
        .then(res => res.json())
        .then(data => setAddedItems(data))
        .catch(err => console.error("Erreur chargement stock local:", err));
    }
  }, [activeSection]);

  const handleSearch = () => {
    setError(null);
    setImageUrl(`/api/nieuwkoop/items/${productId}/image`);

    fetch(`/api/nieuwkoop/items/${productId}/details`)
      .then(res => res.json())
      .then(data => setItem(data.item))
      .catch(() => {
        setError("Produit introuvable.");
        setItem(null);
      });

    fetch(`/api/nieuwkoop/prices/${productId}`)
      .then(res => res.json())
      .then(data => setPrice(data.price))
      .catch(() => setPrice(null));
  };

  const handleAddToStock = () => {
    if (!item || !price) return;

    const payload = {
      reference: item.Itemcode,
      name: item.ItemDescription_EN || item.ItemDescription_FR,
      height: item.Height,
      diameter: item.DiameterCulturePot || item.PotSize,
      price: price.PriceNett,
    };

    fetch("/api/nieuwkoop/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors de l'ajout");
        return res.json();
      })
      .then(newItem => {
        setAddedItems([newItem, ...addedItems]);
      })
      .catch(err => {
        console.error("Erreur ajout stock:", err);
        setError("Déjà dans le stock ou erreur serveur.");
      });
  };

  const updateQuantity = (id, quantity) => {
    fetch(`/api/nieuwkoop/stock/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity })
    })
      .then(res => res.json())
      .then(updated => {
        setAddedItems(prev => prev.map(item => item._id === id ? updated : item));
      });
  };

  const updateNote = (id, note) => {
    fetch(`/api/nieuwkoop/stock/${id}/note`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note })
    })
      .then(res => res.json())
      .then(updated => {
        setAddedItems(prev => prev.map(item => item._id === id ? updated : item));
      });
  };

  const deleteItem = (id) => {
    fetch(`/api/nieuwkoop/stock/${id}`, { method: "DELETE" })
      .then(() => {
        setAddedItems(prev => prev.filter(item => item._id !== id));
      });
  };

  const handleClearAll = () => {
    fetch("/api/nieuwkoop/stock/all", { method: "DELETE" })
      .then(() => setAddedItems([]))
      .catch(err => console.error("Erreur nettoyage:", err));
  };

  const handleExportCSV = () => {
    const headers = ["Nom", "Hauteur", "Diametre", "Prix", "Quantite", "Total", "Note"];
    const rows = addedItems.map(i => [
      i.name,
      i.height,
      i.diameter,
      i.price,
      i.quantity,
      (i.price * i.quantity).toFixed(2),
      i.note || ""
    ]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "articles_nieuwkoop.csv";
    link.click();
  };

  const totalPrice = addedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalQty = addedItems.reduce((acc, item) => acc + item.quantity, 0);
  const sortedItems = [...addedItems].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="flex flex-col justify-between p-6 bg-white border-r shadow-md w-60">
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-extrabold tracking-wide text-green-700">POUSSE</h1>
          <nav className="flex flex-col gap-2 text-sm font-medium">
            {["Catalogue", "Produits", "Stock", "Entrées/Sorties"].map((item) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={item}
                className={`hover-animate text-left flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  activeSection === item
                    ? "bg-green-100 text-green-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveSection(item)}
              >
                {item === "Catalogue" && "🌿"}
                {item === "Produits" && "🧺"}
                {item === "Stock" && "📦"}
                {item === "Entrées/Sorties" && "🔁"}
                {item}
              </motion.button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <motion.header
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-800">Interface Nieuwkoop</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-1 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Se déconnecter
          </motion.button>
        </motion.header>

        {activeSection === "Entrées/Sorties" && (
          <motion.section key="mouvements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
            <MouvementForm onSubmit={handleSubmitMouvement} />
            <MouvementList mouvements={mouvements} onValidate={handleValidate} onMarkReturned={handleReturn} />
          </motion.section>
        )}

        {activeSection === "Stock" && (
          <motion.section
            key="stock"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Code produit Nieuwkoop"
                className="w-64 px-3 py-2 border rounded"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
              >
                Rechercher
              </motion.button>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            {item && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-xs p-4 bg-white shadow rounded-xl"
              >
                {imageUrl && (
                  <img src={imageUrl} alt="Product Nieuwkoop" className="w-full h-auto mb-4 rounded" />
                )}
                <div className="space-y-1 text-sm text-gray-700">
                  <p><strong>Nom :</strong> {item.ItemDescription_EN || item.ItemDescription_FR}</p>
                  <p><strong>Hauteur :</strong> {item.Height} cm</p>
                  <p><strong>Diamètre pot :</strong> {item.DiameterCulturePot || item.PotSize} cm</p>
                </div>
                {price && (
                  <p className="mt-2 font-bold text-green-700">
                    💶 Prix : {price.PriceNett?.toFixed(2)} €
                  </p>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToStock}
                  className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  ➕ Ajouter au stock
                </motion.button>
              </motion.div>
            )}

            {addedItems.length > 0 && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-lg font-semibold text-green-700">
                    Total : {totalPrice.toFixed(2)} € | Quantités : {totalQty}
                  </p>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowPartnerForm(true)} className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700">
  ➕ Ajouter un article
</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={handleExportCSV} className="px-3 py-1 text-white rounded bg-sky-600 hover:bg-sky-700">
                      Export CSV
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} onClick={handleClearAll} className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700">
                      Tout vider
                    </motion.button>

{showPartnerForm && (
  <div className="p-4 mt-4 space-y-4 bg-white rounded shadow">
    <h3 className="text-lg font-semibold">➕ Nouvel article partenaire</h3>
    <input id="partner-name" type="text" placeholder="Nom" className="w-full p-2 border rounded" />
    <input id="partner-ref" type="text" placeholder="Référence" className="w-full p-2 border rounded" />
    <input id="partner-price" type="number" placeholder="Prix (€)" className="w-full p-2 border rounded" />
    <input id="partner-qty" type="number" placeholder="Quantité" className="w-full p-2 border rounded" />
    <input type="file" accept="image/*" className="w-full p-2 border rounded" onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      }
    }} />
    {previewImage && <img src={previewImage} alt="Aperçu" className="object-cover w-32 h-32 rounded" />}
    <div className="flex gap-2">
      <button onClick={handleAddPartnerItem} className="px-4 py-2 text-white bg-green-600 rounded">✅ Ajouter</button>
      <button onClick={() => setShowPartnerForm(false)} className="px-4 py-2 bg-gray-300 rounded">❌ Annuler</button>
    </div>
  </div>
)}

                    <motion.button whileHover={{ scale: 1.05 }} onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="px-3 py-1 bg-gray-300 rounded">
                      Trier par prix ({sortOrder === 'asc' ? '⬆️' : '⬇️'})
                    </motion.button>
                  </div>
                </div>

                <motion.div layout className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {sortedItems.map((prod) => (
                      <motion.div
                        key={prod._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="relative p-4 bg-white shadow rounded-xl"
                      >
                        <button
                          onClick={() => deleteItem(prod._id)}
                          className="absolute text-red-500 top-2 right-2 hover:text-red-700"
                        >
                          🗑️
                        </button>
                        <img src={prod.image} alt={prod.name} className="object-contain w-full h-40 mb-2" />
                        <h3 className="font-semibold">{prod.name}</h3>
                        <p className="text-sm text-gray-500">Hauteur : {prod.height} cm</p>
                        <p className="text-sm text-gray-500">Diamètre : {prod.diameter} cm</p>
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="number"
                            min={1}
                            value={prod.quantity}
                            onChange={(e) => updateQuantity(prod._id, parseInt(e.target.value))}
                            className="w-16 px-2 py-1 border rounded"
                          />
                          <span className="text-sm text-gray-600">x {(typeof prod.price === "number") ? prod.price.toFixed(2) : "0.00"} €</span>
                        </div>
                        <textarea
                          placeholder="Note"
                          value={prod.note || ""}
                          onChange={(e) => updateNote(prod._id, e.target.value)}
                          className="w-full p-1 mt-2 text-sm border rounded"
                        />
                        <p className="mt-1 font-bold text-green-700">
                          Total : {(typeof prod.price === "number" && typeof prod.quantity === "number") ? (prod.price * prod.quantity).toFixed(2) : "0.00"} €
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </>
            )}
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default Nieuwkoop;


  const fetchMovements = async () => {
    try {
      const data = await getMovements();
      setMouvements(data);
    } catch (err) {
      console.error("Erreur chargement mouvements:", err);
    }
  };

  const handleSubmitMouvement = async (formData) => {
    await createMovement(formData);
    fetchMovements();
  };

  const handleValidate = async (id) => {
    await validateMovement(id);
    fetchMovements();
  };


  const handleAddPartnerItem = async () => {
    const name = document.querySelector("#partner-name")?.value;
    const reference = document.querySelector("#partner-ref")?.value;
    const price = parseFloat(document.querySelector("#partner-price")?.value || 0);
    const quantity = parseInt(document.querySelector("#partner-qty")?.value || 1);

    if (!name || !reference) return alert("Nom et référence requis");

    const payload = {
      name,
      reference,
      price,
      quantity,
      image: previewImage,
    };

    try {
      const newItem = await createPartnerItem(payload);
      setAddedItems(prev => [newItem, ...prev]);
      setShowPartnerForm(false);
      setPreviewImage(null);
    } catch (err) {
      alert("Erreur ajout partenaire");
      console.error(err);
    }
  };

  const handleReturn = async (id) => {
    await markReturned(id);
    fetchMovements();
  };
