import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, Package, Clock, X } from 'lucide-react';
import Buttom from '../bottom/Buttom';
import { formatPrice, formatOrderDate, calculateDispenseTime } from '../../utils/orderHelpers';

const ConfirmationModal = ({ order, nfc, onClose }) => {
  const productCount = order.items?.length || 0; // Usar 'items' en lugar de 'products'
  const estimatedTime = calculateDispenseTime(productCount);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 transform animate-scaleIn shadow-2xl border border-gray-100">
        {/* Header con icono de éxito */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Orden Cargada en NFC!
          </h2>
          <p className="text-gray-600">
            La orden ha sido asignada exitosamente a tu NFC
          </p>
        </div>

        {/* Información de la orden */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Orden #</span>
            <span className="font-mono text-gray-900 font-bold">
              {order.order_id}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">NFC Asignado</span>
            <span className="font-mono text-gray-900 bg-white px-2 py-1 rounded text-sm">
              {nfc}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Estado</span>
            <span className="text-gray-900">
              {order.readyForDispensing ? 'Listo para dispensar' : 'Asignado'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total</span>
            <span className="text-gray-900 font-bold text-lg">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Información de productos */}
        {order.items && order.items.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900">
                Productos ({productCount} items)
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">
                      {item.cantidad || item.quantity || 1}x {item.nombre || item.name || 'Producto'}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {formatPrice((item.precio || item.price || 0) * (item.cantidad || item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tiempo estimado */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <div className="flex items-center gap-2 text-blue-800">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Tiempo estimado de dispensado:</span>
            <span className="font-bold">{estimatedTime}</span>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <h4 className="font-medium text-yellow-800 mb-2">📱 Instrucciones:</h4>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>1. Tu NFC ahora tiene esta orden cargada</li>
            <li>2. Acércate al dispensador físico</li>
            <li>3. Escanea tu NFC en el lector</li>
            <li>4. La orden se dispensará automáticamente</li>
          </ul>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <Buttom.Buttom1
            contexto="Entendido"
            onClick={onClose}
            large="w-full"
          />
        </div>

        {/* Botón de cerrar en la esquina */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

ConfirmationModal.propTypes = {
  order: PropTypes.shape({
    order_id: PropTypes.string.isRequired,
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.string,
    readyForDispensing: PropTypes.bool,
    items: PropTypes.array
  }).isRequired,
  nfc: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ConfirmationModal;
