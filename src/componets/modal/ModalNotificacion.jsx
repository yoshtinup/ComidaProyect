import React from 'react';

const ModalNotificacion = ({ mensaje, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
      {/* Icono de palomita */}
      <div className="flex justify-center mb-4">
        <svg
          className="w-16 h-16 text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Mensaje */}
      <p className="mb-4 text-lg font-medium text-gray-700">{mensaje}</p>

      {/* Botón de cerrar */}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={onClose}
      >
        Cerrar
      </button>
    </div>
  </div>
);

export default ModalNotificacion;
