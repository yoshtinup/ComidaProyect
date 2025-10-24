import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import ModalNotificacion from './modal/ModalNotificacion';
import ModalConfirmacion from './modal/ModalConfirmacion';
import config from '../config/apiConfig';

// Componente para un solo ítem del carrito
function CarritoItem({ imageUrl, name, units, total, idcarrito, onRemove, quantity = 1, onQuantityChange }) {
    const [showNotification, setShowNotification] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const handleRemove = () => {
        fetch(config.endpoints.carritoDelete(idcarrito), {
            method: 'DELETE',
        })
        .then(res => {
            if (res.status === 200 || res.status === 204) {
                // Notifica al padre para actualizar la lista
                if (onRemove) onRemove(idcarrito);
                setNotificationMessage("Producto retirado del carrito exitosamente");
                setShowNotification(true);
            } else {
                setNotificationMessage("No se pudo eliminar el producto del carrito");
                setShowNotification(true);
            }
        })
        .catch(() => {
            setNotificationMessage("Error al eliminar el producto del carrito");
            setShowNotification(true);
        });
    };

    const handleConfirmRemove = () => {
        setShowConfirmation(false);
        handleRemove();
    };

    const handleIncreaseQuantity = () => {
        if (onQuantityChange) {
            onQuantityChange(idcarrito, quantity + 1);
        }
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1 && onQuantityChange) {
            onQuantityChange(idcarrito, quantity - 1);
        }
    };

    return (
        <>
        <div className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-white border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            {/* Imagen y descripción */}
            <div className="flex justify-start items-center gap-3 sm:gap-4 flex-1">
                <img className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg shadow-sm flex-shrink-0" src={imageUrl} alt={name} />
                <div className="flex flex-col justify-center items-start min-w-0 flex-1">
                    <h1 className="text-sm sm:text-base md:text-lg font-semibold text-stone-900 font-['Plus_Jakarta_Sans'] leading-tight truncate w-full">
                        {name}
                    </h1>
                    <h2 className="text-xs sm:text-sm text-stone-500 font-normal font-['Plus_Jakarta_Sans'] mt-1">
                        {units} peso
                    </h2>
                </div>
            </div>

            {/* Controles de cantidad - Responsive */}
            <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-3">
                <div className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">Cantidad</div>
                <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 rounded-lg border border-gray-200 p-1">
                    <button
                        onClick={handleDecreaseQuantity}
                        disabled={quantity <= 1}
                        className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                    >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    </button>
                    <span className="w-8 sm:w-12 text-center font-semibold text-gray-900 text-sm sm:text-lg">
                        {quantity}
                    </span>
                    <button
                        onClick={handleIncreaseQuantity}
                        className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md bg-white hover:bg-gray-100 transition-colors duration-200 shadow-sm"
                    >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Precio y total - Responsive */}
            <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end text-right gap-2 sm:gap-1 w-full sm:w-auto">
                <div className="flex flex-col items-start sm:items-end">
                    <div className="text-xs sm:text-sm text-gray-600">Precio unitario</div>
                    <div className="text-sm sm:text-lg font-semibold text-gray-900">${total}</div>
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                    Total: <span className="font-semibold text-gray-900 text-sm sm:text-base">${(total * quantity).toFixed(2)}</span>
                </div>
            </div>

            {/* Botón de eliminar - Responsive */}
            <div className="flex gap-2 w-full sm:w-auto">
                <button
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-sm sm:text-base" 
                    onClick={() => setShowConfirmation(true)}
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
    units: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired,
    idcarrito: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    quantity: PropTypes.number,
    onQuantityChange: PropTypes.func,
};

export default CarritoItem;