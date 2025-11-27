import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import ModalNotificacion from './modal/ModalNotificacion';
import ModalConfirmacion from './modal/ModalConfirmacion';
import config from '../config/apiConfig';
import placeholderImg from '/snack_bag.jpg';

// Componente para un solo ítem del carrito
function CarritoItem({ 
    imageUrl, 
    name, 
    description,
    price,
    stock,
    units, 
    idcarrito, 
    idproducto,
    quantity = 1, 
    subtotal,
    onRefreshCart,
    userId
}) {
    const [showNotification, setShowNotification] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleImageError = (e) => {
        e.target.src = placeholderImg;
    };

    // Incrementar cantidad usando el endpoint del backend
    const handleIncreaseQuantity = async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(config.endpoints.carritoIncrement(userId, idproducto), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                // Refrescar el carrito completo
                if (onRefreshCart) onRefreshCart();
            } else {
                setNotificationMessage(result.message || 'No se pudo incrementar la cantidad');
                setShowNotification(true);
            }
        } catch (error) {
            console.error('Error al incrementar:', error);
            setNotificationMessage('Error al actualizar la cantidad');
            setShowNotification(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Decrementar cantidad usando el endpoint del backend
    const handleDecreaseQuantity = async () => {
        if (isLoading || quantity <= 1) return;
        
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(config.endpoints.carritoDecrement(userId, idproducto), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                if (result.removed) {
                    // El producto fue eliminado (cantidad llegó a 0)
                    setNotificationMessage('Producto eliminado del carrito');
                    setShowNotification(true);
                }
                // Refrescar el carrito completo
                if (onRefreshCart) onRefreshCart();
            } else {
                setNotificationMessage(result.message || 'No se pudo decrementar la cantidad');
                setShowNotification(true);
            }
        } catch (error) {
            console.error('Error al decrementar:', error);
            setNotificationMessage('Error al actualizar la cantidad');
            setShowNotification(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Eliminar producto del carrito completamente
    const handleRemove = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(config.endpoints.carritoDelete(idcarrito), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200 || response.status === 204) {
                setNotificationMessage('Producto eliminado del carrito exitosamente');
                setShowNotification(true);
                
                // Refrescar el carrito después de eliminar
                if (onRefreshCart) onRefreshCart();
            } else {
                setNotificationMessage('No se pudo eliminar el producto del carrito');
                setShowNotification(true);
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            setNotificationMessage('Error al eliminar el producto del carrito');
            setShowNotification(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmRemove = () => {
        setShowConfirmation(false);
        handleRemove();
    };

    return (
        <>
        <div className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-white border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            {/* Imagen y descripción */}
            <div className="flex justify-start items-center gap-3 sm:gap-4 flex-1">
                <img 
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg shadow-sm flex-shrink-0" 
                    src={imageUrl} 
                    alt={name}
                    onError={handleImageError}
                />
                <div className="flex flex-col justify-center items-start min-w-0 flex-1">
                    <h1 className="text-sm sm:text-base md:text-lg font-semibold text-stone-900 font-['Plus_Jakarta_Sans'] leading-tight truncate w-full">
                        {name}
                    </h1>
                  
                    {stock && (
                        <p className="text-xs text-green-600 mt-1">
                            +{stock} disponibles
                        </p>
                    )}
                </div>
            </div>

            {/* Controles de cantidad - Responsive */}
            <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-3">
                <div className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">Cantidad</div>
                <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 rounded-lg border border-gray-200 p-1">
                    <button
                        onClick={handleDecreaseQuantity}
                        disabled={quantity <= 1 || isLoading}
                        className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                    >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    </button>
                    <span className="w-8 sm:w-12 text-center font-semibold text-gray-900 text-sm sm:text-lg">
                        {isLoading ? '...' : quantity}
                    </span>
                    <button
                        onClick={handleIncreaseQuantity}
                        disabled={isLoading}
                        className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                    >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Precio y total - Responsive */}
            <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end text-right gap-2 sm:gap-1 w-full sm:w-auto">
                <div className="flex flex-col items-start sm:items-end">
                    <div className="text-xs sm:text-sm text-gray-600">Precio unitario</div>
                    <div className="text-sm sm:text-lg font-semibold text-gray-900">${price.toFixed(2)}</div>
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                    Total: <span className="font-semibold text-gray-900 text-sm sm:text-base">${subtotal.toFixed(2)}</span>
                </div>
            </div>

            {/* Botón de eliminar - Responsive */}
            <div className="flex gap-2 w-full sm:w-auto">
                <button
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-sm sm:text-base" 
                    onClick={() => setShowConfirmation(true)}
                    disabled={isLoading}
                >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Eliminar</span>
                    <span className="sm:hidden">Eliminar</span>
                </button>
            </div>
        </div>

        {/* Modales */}
        {showNotification && (
            <ModalNotificacion 
                mensaje={notificationMessage}
                onClose={() => setShowNotification(false)}
            />
        )}

        {showConfirmation && (
            <ModalConfirmacion 
                mensaje={`¿Estás seguro de que quieres eliminar "${name}" del carrito?`}
                onConfirmar={handleConfirmRemove}
                onCancelar={() => setShowConfirmation(false)}
            />
        )}
        </>
    );
}

CarritoItem.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number,
    units: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    idcarrito: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    idproducto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    quantity: PropTypes.number,
    subtotal: PropTypes.number.isRequired,
    onRefreshCart: PropTypes.func,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default CarritoItem;