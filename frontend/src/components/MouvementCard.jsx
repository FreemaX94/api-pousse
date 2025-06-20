import React from "react";
import { format } from "date-fns";

const MouvementCard = ({ mouvement, onValidate, onMarkReturned }) => {
  const {
    type,
    reference,
    name,
    quantity,
    eventDate,
    returnPlannedAt,
    projet,
    commentaire,
    createdBy,
    validated,
    returned,
    createdAt
  } = mouvement;

  const badgeColor =
    type === "entrée"
      ? "bg-green-500"
      : returned
      ? "bg-blue-500"
      : "bg-yellow-500";

  const formattedDate = eventDate ? format(new Date(eventDate), "dd/MM/yyyy") : "—";
  const retourDate = returnPlannedAt ? format(new Date(returnPlannedAt), "dd/MM/yyyy") : "—";

  return (
    <div className="relative p-4 space-y-2 bg-white border rounded-lg shadow">
      <div
        title={type}
        className={`absolute top-2 right-2 w-3 h-3 rounded-full ${badgeColor}`}
      ></div>

      <h3 className="text-lg font-semibold">{name} ({reference})</h3>
      <p className="text-sm text-gray-600">Projet : {projet}</p>
      <p className="text-sm text-gray-600">Quantité : {quantity}</p>
      <p className="text-sm text-gray-600">Date prévue : {formattedDate}</p>
      {type === "sortie" && (
        <p className="text-sm text-gray-600">Retour prévu : {retourDate}</p>
      )}
      <p className="text-sm text-gray-600">Créé par : {createdBy}</p>
      {commentaire && <p className="text-xs italic text-gray-500">📝 {commentaire}</p>}

      <div className="flex gap-2 mt-2">
        {!validated && (
          <button
            onClick={() => onValidate && onValidate(mouvement._id)}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            ✅ Valider
          </button>
        )}
        {type === "sortie" && !returned && (
          <button
            onClick={() => onMarkReturned && onMarkReturned(mouvement._id)}
            className="px-3 py-1 text-sm bg-blue-200 rounded hover:bg-blue-300"
          >
            ♻️ Marquer comme revenu
          </button>
        )}
      </div>
    </div>
  );
};

export default MouvementCard;
