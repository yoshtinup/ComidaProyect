// Componente para mostrar la lista de dispensadores existentes
import React from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import Buttom from '../bottom/Buttom';

const DispenserList = ({ dispensers, loading, onEdit, onDelete, onRefresh }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800',
      'maintenance': 'bg-yellow-100 text-yellow-800',
      'offline': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'active': 'Activo',
      'inactive': 'Inactivo',
      'maintenance': 'Mantenimiento',
      'offline': 'Desconectado'
    };
    return statusTexts[status] || status;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
                <div className="h-8 w-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!dispensers || dispensers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-4xl mb-4">🏪</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay dispensadores configurados
        </h3>
        <p className="text-gray-600 mb-6">
          Crea tu primer dispensador para comenzar a vender productos
        </p>
        <Buttom.Buttom1
          contexto="Agregar Primer Dispensador"
          onClick={() => navigate('/add-dispenser')}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Dispensadores ({dispensers.length})
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Gestiona tus dispensadores y su configuración
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onRefresh}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Actualizar
            </button>
            <Buttom.Buttom1
              contexto="Nuevo Dispensador"
              onClick={() => navigate('/add-dispenser')}
            />
          </div>
        </div>
      </div>

      {/* Lista de dispensadores */}
      <div className="divide-y divide-gray-200">
        {dispensers.map((dispenser) => (
          <div key={dispenser.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start justify-between">
              {/* Información básica */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {dispenser.dispenser_id || `Dispensador ${dispenser.id}`}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispenser.status)}`}>
                    {getStatusText(dispenser.status)}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{dispenser.location}</span>
                  </div>
                  
                  {dispenser.last_maintenance && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Último mantenimiento: {new Date(dispenser.last_maintenance).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Productos del dispensador */}
                {dispenser.products && dispenser.products.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">
                      Productos ({dispenser.products.length})
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {dispenser.products.slice(0, 3).map((product, index) => (
                        <div key={product.id || index} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                          {product.imagen && (
                            <img
                              src={productService.getProductImageUrl(product.imagen)}
                              alt={product.nombre}
                              className="w-6 h-6 object-cover rounded"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <span className="text-sm text-gray-700">
                            {product.nombre || `Producto ${product.id}`}
                          </span>
                          {product.cantidad !== undefined && (
                            <span className="text-xs text-gray-500">
                              (Stock: {product.cantidad})
                            </span>
                          )}
                        </div>
                      ))}
                      {dispenser.products.length > 3 && (
                        <span className="text-sm text-gray-500 px-2 py-1">
                          +{dispenser.products.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEdit && onEdit(dispenser)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  title="Editar dispensador"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button
                  onClick={() => onDelete && onDelete(dispenser)}
                  className="px-3 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors duration-200"
                  title="Eliminar dispensador"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer con estadísticas */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <span className="block text-2xl font-bold text-gray-900">
              {dispensers.filter(d => d.status === 'active').length}
            </span>
            <span className="text-sm text-gray-600">Activos</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900">
              {dispensers.reduce((acc, d) => acc + (d.products?.length || 0), 0)}
            </span>
            <span className="text-sm text-gray-600">Productos Total</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900">
              {dispensers.filter(d => d.status === 'offline').length}
            </span>
            <span className="text-sm text-gray-600">Desconectados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispenserList;
