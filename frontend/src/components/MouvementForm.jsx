import React, { useState } from "react";

const MouvementForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    type: "entrée",
    reference: "",
    name: "",
    quantity: 1,
    eventDate: "",
    returnPlannedAt: "",
    projet: "",
    commentaire: "",
    createdBy: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
    setFormData((prev) => ({ ...prev, quantity: 1, commentaire: "" }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow-md">
      <div className="flex gap-4">
        <select name="type" value={formData.type} onChange={handleChange} className="border p-2 rounded">
          <option value="entrée">Entrée</option>
          <option value="sortie">Sortie</option>
        </select>
        <input
          type="text"
          name="reference"
          placeholder="Référence"
          value={formData.reference}
          onChange={handleChange}
          className="flex-1 border p-2 rounded"
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={formData.name}
          onChange={handleChange}
          className="flex-1 border p-2 rounded"
          required
        />
      </div>

      <div className="flex gap-4">
        <input
          type="number"
          name="quantity"
          min={1}
          value={formData.quantity}
          onChange={handleChange}
          className="w-32 border p-2 rounded"
          required
        />
        <input
          type="date"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        {formData.type === "sortie" && (
          <input
            type="date"
            name="returnPlannedAt"
            value={formData.returnPlannedAt}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        )}
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          name="projet"
          placeholder="Projet / Événement"
          value={formData.projet}
          onChange={handleChange}
          className="flex-1 border p-2 rounded"
          required
        />
        <input
          type="text"
          name="createdBy"
          placeholder="Utilisateur"
          value={formData.createdBy}
          onChange={handleChange}
          className="w-64 border p-2 rounded"
          required
        />
      </div>

      <textarea
        name="commentaire"
        placeholder="Commentaire"
        value={formData.commentaire}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        ➕ Enregistrer le mouvement
      </button>
    </form>
  );
};

export default MouvementForm;
