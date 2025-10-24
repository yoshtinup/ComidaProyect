import React from 'react';
import PropTypes from 'prop-types';
import { Clock, Package, User } from 'lucide-react';
import Buttom from '../bottom/Buttom';
import { 
  formatOrderDate, 
  formatPrice, 
  getOrderPriority, 
  calculateDispenseTime,
  getOrderStatusInfo 
} from '../../utils/orderHelpers';

const OrderCard = ({ 
  order, 
  priority, 
  onSelect, 
  disabled = false, 
  isSelected = false,
  isLoaded = false 
}) => {
  const priorityInfo = getOrderPriority(priority - 1);
  const statusInfo = getOrderStatusInfo(order.status || 'paid'); // Usar 'status' en lugar de 'estado'
  const productCount = order.items?.length || 0; // Usar 'items' en lugar de 'products'
  const totalPrice = order.total || 0;

  return (
    <div className={`
      relative w-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden
      transition-all duration-300 transform hover:shadow-lg
      ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
      ${isLoaded ? 'ring-2 ring-green-500 ring-opacity-50' : ''}
      ${disabled ? 'opacity-60' : 'hover:-translate-y-1'}
    `}>
      {/* Header con prioridad y estado */}
      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className={`
            px-2 py-1 rounded-full text-xs font-bold
            ${priorityInfo.color} ${priorityInfo.textColor}
          `}>
            {priorityInfo.label}
          </div>
          <div className={`
            px-2 py-1 rounded-md text-xs font-medium
            ${statusInfo.color}
          `}>
            {statusInfo.icon} {statusInfo.label}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs md:text-sm text-gray-600">Orden #{order.order_id}</div>
          <div className="text-xs text-gray-500">{formatOrderDate(order.created_at)}</div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {/* Información del cliente */}
          <div className="flex items-center gap-2">
            <User className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            <div>
              <div className="text-xs md:text-sm font-medium text-gray-900">Usuario</div>
              <div className="text-xs text-gray-600">{order.user_id || 'N/A'}</div>
            </div>
          </div>

          {/* Información de productos */}
          <div className="flex items-center gap-2">
            <Package className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            <div>
              <div className="text-xs md:text-sm font-medium text-gray-900">Productos</div>
              <div className="text-xs text-gray-600">{productCount} items</div>
            </div>
          </div>

          {/* Tiempo estimado */}
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            <div>
              <div className="text-xs md:text-sm font-medium text-gray-900">Tiempo est.</div>
              <div className="text-xs text-gray-600">{calculateDispenseTime(productCount)}</div>
            </div>
          </div>
        </div>

        {/* Lista de productos (resumida) */}
        {order.items && order.items.length > 0 && (
          <div className="mb-3">
            <div className="text-xs md:text-sm font-medium text-gray-900 mb-2">Productos:</div>
            <div className="space-y-1">
              {order.items.slice(0, 2).map((item, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 truncate">
                    {item.cantidad || item.quantity || 1}x {item.nombre || item.name || 'Producto'}
                  </span>
                  <span className="text-gray-900 font-medium text-xs">
                    {formatPrice((item.precio || item.price || 0) * (item.cantidad || item.quantity || 1))}
                  </span>
                </div>
              ))}
              {order.items.length > 2 && (
                <div className="text-xs text-gray-500 italic">
                  +{order.items.length - 2} productos más...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Total y botón de acción */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-3 border-t border-gray-200">
          <div>
            <div className="text-base md:text-lg font-bold text-gray-900">
              {formatPrice(totalPrice)}
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          
          <div className="flex gap-2">
            {isLoaded ? (
              <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-xs md:text-sm font-medium">
                ✓ Cargada en NFC
              </div>
            ) : (
              <Buttom.Buttom1
                contexto={isSelected ? "Seleccionada" : "Cargar en NFC"}
                onClick={onSelect}
                large="w-auto text-xs md:text-sm"
                disabled={disabled}
              />
            )}
          </div>
        </div>
      </div>

      {/* Indicador visual si está cargada */}
      {isLoaded && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px] border-b-green-500">
          <div className="absolute -top-[15px] -left-[15px] text-white text-xs">
            ✓
          </div>
        </div>
      )}
    </div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    order_id: PropTypes.string.isRequired,
    user_id: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    items: PropTypes.array
  }).isRequired,
  priority: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  isLoaded: PropTypes.bool
};

export default OrderCard;
