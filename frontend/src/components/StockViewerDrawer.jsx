import React from 'react'
import StockViewer from './StockViewer'

export default function StockViewerDrawer({ open, onClose }) {
  return (
    <div
      className={`
        fixed top-0 left-0 h-full w-full sm:w-[420px]
        bg-white text-gray-800 shadow-lg z-50
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">
          📋 Historique des stocks
        </h3>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 transition"
        >
          ✖
        </button>
      </div>

      <div className="p-4 overflow-y-auto max-h-[90vh]">
        <StockViewer />
      </div>
    </div>
  )
}
