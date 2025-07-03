import React from 'react';
import PropTypes from 'prop-types';

// Componente para un solo ítem del carrito
function CarritoItem({ imageUrl, name, units, total, idcarrito, onRemove }) {
    const handleRemove = () => {
        fetch(`http://localhost:3002/api/v1/carrito/${idcarrito}`, {
            method: 'DELETE',
        })
        .then(res => {
            if (res.status === 200 || res.status === 204) {
                // Notifica al padre para actualizar la lista
                if (onRemove) onRemove(idcarrito);
                alert("Retirado del carrito");
            } else {
                alert("No se pudo eliminar el producto del carrito.");
            }
        })
        .catch(() => alert("Error al eliminar el producto del carrito."));
    };

    return (
        <div className="self-stretch min-h-16 px-6 py-2 bg-stone-50 border-b border-neutral-200 inline-flex justify-between items-center">
            {/* Imagen y descripción */}
            <div className="flex justify-start items-center gap-4">
                <img className="w-24 h-24 object-cover rounded-lg" src={imageUrl} alt={name} />
                <div className="inline-flex flex-col justify-center items-start">
                    <div className="flex flex-col justify-start items-start overflow-hidden">
                        <div className="self-stretch justify-start text-stone-900 text-base font-medium font-['Plus_Jakarta_Sans'] leading-normal">
                            <h1 className="text-xl">{name}</h1>
                        </div>
                    </div>
                    <div className="w-52 flex flex-col justify-start items-start overflow-hidden">
                        <div className="self-stretch justify-start text-stone-500 font-normal font-['Plus_Jakarta_Sans'] leading-tight">
                            <h2 className="text-base">{units} peso</h2>
                        </div>
                    </div>
                </div>
            </div>
            {/* Total */}
            <div className="inline-flex flex-col justify-start items-start text-right">
                <div className="justify-start text-stone-900 text-base font-normal font-['Plus_Jakarta_Sans'] leading-normal">
                    <h3 className="text-lg text-stone-500">Precio:</h3>
                    <h3 className="text-xl font-semibold">${total}</h3>
                </div>
            </div>
            <div className="flex gap-2 mt-2">
                <button
                    className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 transition-colors duration-200" 
                    onClick={handleRemove}
                >
                    Quitar del carrito
                </button>
            </div>
        </div>
    );
}

CarritoItem.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    units: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired,
    idcarrito: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default CarritoItem;