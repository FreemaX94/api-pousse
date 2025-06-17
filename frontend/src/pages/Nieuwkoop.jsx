import React, { useState } from "react";
import "./Nieuwkoop.css";

const Nieuwkoop = () => {
  const [activeSection, setActiveSection] = useState("Catalogue");
  const [productId, setProductId] = useState("4HOFOBX12");
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const [price, setPrice] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
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

      {/* Main */}
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

            <div className="max-w-xs p-4 bg-white shadow rounded-xl">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Product Nieuwkoop"
                  className="w-full h-auto mb-4 rounded"
                  onError={() => setError("❌ Image introuvable")}
                />
              )}
              {item && (
                <div className="space-y-1 text-sm text-gray-700">
                  <p><strong>Nom :</strong> {item.ItemDescription_EN || item.ItemDescription_FR}</p>
                  <p><strong>Hauteur :</strong> {item.Height} cm</p>
                  <p><strong>Diamètre du pot :</strong> {item.DiameterCulturePot} cm</p>
                </div>
              )}
              {price && (
                <p className="mt-2 font-bold text-green-700">
                  💶 Prix : {price.PriceNett?.toFixed(2)} €
                </p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Nieuwkoop;
