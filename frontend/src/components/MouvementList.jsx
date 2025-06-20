import React from "react";
import MouvementCard from "./MouvementCard";

const MouvementList = ({ mouvements, onValidate, onMarkReturned }) => {
  if (!mouvements || mouvements.length === 0) {
    return <p className="italic text-gray-500">Aucun mouvement enregistré.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
      {mouvements.map((mouvement) => (
        <MouvementCard
          key={mouvement._id}
          mouvement={mouvement}
          onValidate={onValidate}
          onMarkReturned={onMarkReturned}
        />
      ))}
    </div>
  );
};

export default MouvementList;
