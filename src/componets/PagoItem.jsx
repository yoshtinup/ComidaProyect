import React from 'react';
import PropTypes from 'prop-types';
import productService from '../services/productService';

// Componente para un solo ítem del carrito
function PagoItem({ imageUrl, name, units, total, idcarrito, onRemove }) {

    return (
        <div className="self-stretch min-h-16 px-6 py-2 bg-stone-50 border-b border-neutral-200 inline-flex justify-between items-center">
            {/* Imagen y descripción */}
            <div className="flex justify-start items-center gap-4">
                {/* Imagen del producto */}
                <div className="w-16 h-16 flex-shrink-0">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                                e.target.src = '/snack_bag.jpg'; // imagen por defecto si falla
                                e.target.onerror = null; // evita bucle infinito
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </div>
                
                <div className="inline-flex flex-col justify-center items-start">
                    <div className="flex flex-col justify-start items-start overflow-hidden">
                        <div className="self-stretch justify-start text-stone-800 text-base font-medium font-['Plus_Jakarta_Sans'] leading-normal">
                            <h1 className="text-lg font-['Plus_Jakarta_Sans']">{name}</h1>
                        </div>
                    </div>
                    <div className="w-52 flex flex-col justify-start items-start overflow-hidden">
                        <div className="self-stretch justify-start text-stone-500 font-normal font-['Plus_Jakarta_Sans'] leading-tight">
                            <h2 className="text-sm font-['Plus_Jakarta_Sans']">{units} ud.</h2>
                        </div>
                    </div>
                </div>
            </div>
            {/* Total */}
            <div className="inline-flex flex-col justify-start items-end text-right">
                <div className="justify-start text-stone-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-normal">
                    <h3 className="text-sm text-stone-500 font-['Plus_Jakarta_Sans']">Precio:</h3>
                    <h3 className="text-base font-medium text-stone-600 font-['Plus_Jakarta_Sans']">${total}</h3>
                </div>
            </div>

        </div>
    );
}

PagoItem.propTypes = {
    imageUrl: PropTypes.string, // Removido isRequired para hacerlo opcional
    name: PropTypes.string.isRequired,
    units: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onRemove: PropTypes.func,
    idcarrito: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default PagoItem;