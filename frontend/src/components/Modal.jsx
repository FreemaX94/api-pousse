// src/components/Modal.jsx
import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="mt-4">{children}</div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
