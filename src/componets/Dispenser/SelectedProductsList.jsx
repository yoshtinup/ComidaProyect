// Componente para mostrar la lista de productos seleccionados
import React from 'react';
import productService from '../../services/productService';

const SelectedProductsList = ({ selectedProducts, onRemove, maxProducts = 3 }) => {
  if (selectedProducts.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500 text-sm">No hay productos seleccionados</p>
        <p className="text-gray-400 text-xs mt-1">Selecciona hasta {maxProducts} productos</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Productos Seleccionados ({selectedProducts.length}/{maxProducts})
        </h3>
        {selectedProducts.length === maxProducts && (
          <span className="text-green-600 text-sm font-medium">✓ Completo</span>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {selectedProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={productService.getProductImageUrl(product.imagen)}
                    alt={product.nombre}
                    className="w-12 h-12 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/48x48?text=IMG';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {product.nombre}
                    </h4>
                    <p className="text-gray-500 text-xs">
                      ${product.precio} MXN
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    Slot {index + 1}
                  </span>
                  <button
                    onClick={() => onRemove(product.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                    title="Eliminar producto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedProducts.length < maxProducts && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-700 text-sm">
            Puedes agregar {maxProducts - selectedProducts.length} producto(s) más
          </p>
        </div>
      )}
    </div>
  );
};

export default SelectedProductsList;
