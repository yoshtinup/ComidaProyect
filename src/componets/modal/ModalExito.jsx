import React from 'react';

const ModalExito = ({ 
  mensaje, 
  onPrimaryAction, 
  onSecondaryAction, 
  textoPrimario = "Continuar", 
  textoSecundario = "Regresar" 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
        {/* Header con icono de éxito */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">¡Éxito!</h3>
        </div>

        {/* Contenido */}
        <div className="px-6 py-6">
          <p className="text-gray-700 text-center mb-6 leading-relaxed">
            {mensaje}
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onPrimaryAction}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {textoPrimario}
            </button>
            <button
              onClick={onSecondaryAction}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-gray-300"
            >
              {textoSecundario}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalExito;
