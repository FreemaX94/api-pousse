import React, { useState, useEffect } from "react";
import "./Nieuwkoop.css";

const Nieuwkoop = () => {
  const [activeSection, setActiveSection] = useState("Catalogue");
  const [productId, setProductId] = useState("4HOFOBX12");
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const [price, setPrice] = useState(null);
  const [addedItems, setAddedItems] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
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
      .catch(err => {
        console.error("Erreur produit:", err);
        setError("Produit introuvable.");
        setItem(null);
      });

    fetch(`/api/nieuwkoop/prices/${productId}`)
      .then(res => res.json())
      .then(data => setPrice(data.price))
      .catch(err => {
        console.error("Erreur prix:", err);
        setPrice(null);
      });
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

  const deleteItem = (id) => {
    fetch(`/api/nieuwkoop/stock/${id}`, { method: "DELETE" })
      .then(() => {
        setAddedItems(prev => prev.filter(item => item._id !== id));
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="flex flex-col gap-6 p-4 bg-white border-r shadow-sm w-52">
        <h2 className="text-xl font-bold">Nieuwkoop</h2>
        <nav className="flex flex-col gap-3 text-sm font-medium">
          {["Catalogue", "Produits", "Stock"].map((item) => (
            <button
              key={item}
              className={`hover-animate text-left flex items-center gap-2 ${
                activeSection === item ? "text-green-600 font-semibold" : "text-gray-800"
              }`}
              onClick={() => setActiveSection(item)}
            >
              {item === "Catalogue" && "🌿"}
              {item === "Produits" && "🧺"}
              {item === "Stock" && "📦"}
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">POUSSE</h1>
          <button className="px-4 py-1 text-white bg-red-500 rounded hover:bg-red-600">
            Se déconnecter
          </button>
        </header>

        {activeSection === "Stock" && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Code produit Nieuwkoop"
                className="w-64 px-3 py-2 border rounded"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
              >
                Rechercher
              </button>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            {item && (
              <div className="max-w-xs p-4 bg-white shadow rounded-xl">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Product Nieuwkoop"
                    className="w-full h-auto mb-4 rounded"
                  />
                )}
                <div className="space-y-1 text-sm text-gray-700">
                  <p><strong>Nom :</strong> {item.ItemDescription_EN || item.ItemDescription_FR}</p>
                  <p><strong>Hauteur :</strong> {item.Height} cm</p>
                  <p><strong>Diamètre pot :</strong> {item.DiameterCulturePot || item.PotSize} cm</p>
                </div>
                {price && (
                  <p className="mt-2 font-bold text-green-700">💶 Prix : {price.PriceNett?.toFixed(2)} €</p>
                )}
                <button
                  onClick={handleAddToStock}
                  className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  ➕ Ajouter au stock
                </button>
              </div>
            )}

            {addedItems.length > 0 && (
              <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
                {addedItems.map((prod) => (
                  <div key={prod._id} className="relative p-4 bg-white shadow rounded-xl">
                    <button
                      onClick={() => deleteItem(prod._id)}
                      className="absolute text-red-500 top-2 right-2 hover:text-red-700"
                    >
                      🗑️
                    </button>
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="object-contain w-full h-40 mb-2"
                    />
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
                      <span className="text-sm text-gray-600">x {prod.price.toFixed(2)} €</span>
                    </div>
                    <p className="mt-1 font-bold text-green-700">
                      Total : {(prod.price * prod.quantity).toFixed(2)} €
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Nieuwkoop;
