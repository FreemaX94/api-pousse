import React, { useEffect, useState } from "react";
import MouvementForm from "../components/MouvementForm";
import MouvementList from "../components/MouvementList";

// Ces fonctions seront à connecter dans clientApi.js
const getMovements = async () => {
  const res = await fetch("/api/movements");
  return res.json();
};

const createMovement = async (data) => {
  const res = await fetch("/api/movements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

const validateMovement = async (id) => {
  await fetch(`/api/movements/${id}/validate`, { method: "PUT" });
};

const markReturned = async (id) => {
  await fetch(`/api/movements/${id}/return`, { method: "PUT" });
};

const Mouvements = () => {
  const [mouvements, setMouvements] = useState([]);

  const fetchData = async () => {
    const data = await getMovements();
    setMouvements(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (formData) => {
    await createMovement(formData);
    fetchData();
  };

  const handleValidate = async (id) => {
    await validateMovement(id);
    fetchData();
  };

  const handleReturn = async (id) => {
    await markReturned(id);
    fetchData();
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-green-700">📦 Mouvements de stock</h1>
      <MouvementForm onSubmit={handleSubmit} />
      <hr className="my-4" />
      <MouvementList
        mouvements={mouvements}
        onValidate={handleValidate}
        onMarkReturned={handleReturn}
      />
    </div>
  );
};

export default Mouvements;
