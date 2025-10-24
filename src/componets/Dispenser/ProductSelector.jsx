// Componente para seleccionar productos disponibles
import React, { useState } from 'react';
import productService from '../../services/productService';
import CineSnacksLoader from '../loader/CineSnacksLoader';

const ProductSelector = ({ 
  products, 
  selectedProducts, 
  onProductSelect, 
  maxProducts = 3,
  loading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filtrar productos disponibles (que no están ya seleccionados)
  const availableProducts = products.filter(
    product => !selectedProducts.some(selected => selected.id === product.id)
  );

  // Aplicar filtros de búsqueda y categoría
  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtener categorías únicas
  const categories = [...new Set(products.map(p => p.categoria))].filter(Boolean);

  const isMaxReached = selectedProducts.length >= maxProducts;

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <CineSnacksLoader texto="Cargando productos..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Seleccionar Productos
        </h3>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
          isMaxReached 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {selectedProducts.length}/{maxProducts} seleccionados
        </span>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Buscador */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg 
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filtro por categoría */}
        <div className="sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No se encontraron productos</p>
            {searchTerm && (
              <p className="text-gray-400 text-sm mt-1">
                Intenta con otros términos de búsqueda
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className={`border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  isMaxReached 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:border-blue-500 hover:shadow-md'
                }`}
                onClick={() => !isMaxReached && onProductSelect(product)}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={productService.getProductImageUrl(product.imagen)}
                    alt={product.nombre}
                    className="w-16 h-16 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/64x64?text=IMG';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {product.nombre}
                    </h4>
                    <p className="text-gray-500 text-sm truncate">
                      {product.descripcion}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-gray-900">
                        ${product.precio} MXN
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        Stock: {product.cantidad || 0}
                      </span>
                    </div>
                    {product.categoria && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                        {product.categoria}
                      </span>
                    )}
                  </div>
                </div>
                
                {!isMaxReached && (
                  <div className="mt-3 text-center">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                      Seleccionar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isMaxReached && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-amber-700 text-sm">
            Has alcanzado el límite máximo de {maxProducts} productos. 
            Elimina alguno para seleccionar otro.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductSelector;
