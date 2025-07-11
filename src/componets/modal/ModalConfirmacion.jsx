// ModalConfirmacion.jsx
import React from 'react';

const ModalConfirmacion = ({ mensaje, onConfirmar, onCancelar }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">¿Estás seguro?</h2>
        <p className="mb-6">{mensaje}</p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={onConfirmar}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
