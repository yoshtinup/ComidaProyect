import React from 'react';

const CineSnacksLoader = ({ texto = "Cargando..." }) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <div className="relative w-full flex flex-col items-center justify-center">
        {/* Contenedor principal */}
        <div className="text-center w-full">
          {/* Logo/Título mejorado */}
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-black mb-4 tracking-wide">
              <span className="animate-pulse bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Cine</span>
              <span className="text-gray-600 animate-pulse ml-1" style={{animationDelay: '0.3s'}}>Snacks</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-black via-gray-500 to-transparent mx-auto rounded-full animate-pulse"></div>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-black mx-auto rounded-full animate-pulse mt-1" style={{animationDelay: '0.5s'}}></div>
          </div>
          {/* Spinner principal con productos mejorado */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            {/* Círculo exterior giratorio con gradiente */}
            <div className="absolute inset-0 w-40 h-40 rounded-full border-4 border-gray-100 border-t-black animate-spin shadow-lg"></div>
            {/* Círculo medio */}
            <div className="absolute inset-2 w-36 h-36 rounded-full border-2 border-gray-50 border-t-gray-400 animate-spin opacity-60" style={{animationDuration: '2s', animationDirection: 'reverse'}}></div>
            {/* Iconos de productos orbitando */}
            <div className="absolute inset-0 w-40 h-40 animate-spin" style={{animationDuration: '4s'}}>
              {/* Palomitas */}
              <div className="absolute w-6 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full top-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-yellow-600 rounded-full animate-pulse"></div>
              </div>
              {/* Refresco */}
              <div className="absolute w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full top-1/2 right-0 transform -translate-y-1/2 flex items-center justify-center shadow-lg">
                <div className="w-2 h-4 bg-red-800 rounded animate-pulse"></div>
              </div>
              {/* Chocolate */}
              <div className="absolute w-6 h-6 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg bottom-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-amber-950 rounded animate-pulse"></div>
              </div>
              {/* Chips */}
              <div className="absolute w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full top-1/2 left-0 transform -translate-y-1/2 flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-orange-800 rounded-full animate-pulse"></div>
              </div>
            </div>
            {/* Centro del spinner mejorado */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center animate-pulse shadow-xl">
                <div className="text-white text-lg font-bold tracking-wider">CS</div>
              </div>
            </div>
            {/* Efectos de brillo */}
            <div className="absolute inset-0 w-40 h-40 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-ping"></div>
          </div>
          {/* Indicadores de carga elegantes */}
          <div className="flex justify-center space-x-2 mb-8">
            <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
          </div>
          {/* Texto personalizado debajo del loader */}
          <div className="w-full flex justify-center">
            <p className="text-lg text-gray-600 font-semibold mt-2 mb-8">{texto}</p>
          </div>
        </div>
        {/* Partículas flotantes mejoradas */}
        <div className="absolute -top-12 -left-12 w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full animate-ping opacity-70 shadow-lg"></div>
        <div className="absolute -top-8 -right-10 w-2 h-2 bg-gradient-to-br from-red-500 to-red-700 rounded-full animate-ping opacity-60" style={{animationDelay: '0.4s'}}></div>
        <div className="absolute -bottom-10 -left-8 w-2 h-2 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full animate-ping opacity-50" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute -bottom-12 -right-12 w-3 h-3 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full animate-ping opacity-40" style={{animationDelay: '1.2s'}}></div>
        {/* Partículas adicionales */}
        <div className="absolute top-10 -left-6 w-1 h-1 bg-yellow-300 rounded-full animate-ping opacity-50" style={{animationDelay: '0.6s'}}></div>
        <div className="absolute top-20 -right-4 w-1 h-1 bg-red-400 rounded-full animate-ping opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 -left-10 w-1 h-1 bg-orange-400 rounded-full animate-ping opacity-60" style={{animationDelay: '1.4s'}}></div>
        <div className="absolute bottom-10 -right-8 w-1 h-1 bg-amber-500 rounded-full animate-ping opacity-30" style={{animationDelay: '1.8s'}}></div>
        {/* Ondas de carga mejoradas */}
        <div className="absolute -inset-20 w-80 h-80 rounded-full border border-gray-100 opacity-20 animate-ping"></div>
        <div className="absolute -inset-24 w-96 h-96 rounded-full border border-gray-50 opacity-15 animate-ping" style={{animationDelay: '0.7s'}}></div>
        <div className="absolute -inset-28 w-112 h-112 rounded-full border border-gray-50 opacity-10 animate-ping" style={{animationDelay: '1.4s'}}></div>
      </div>
      <style jsx>{`
        @keyframes loading {
          0% { width: 0% }
          50% { width: 60% }
          100% { width: 100% }
        }
      `}</style>
    </div>
  );
};

export default CineSnacksLoader;