import React from 'react';
import PropTypes from 'prop-types';

// Componente para un solo ítem del carrito
function PagoItem({ imageUrl, name, units, total, idcarrito, onRemove }) {

    return (
        <div className="self-stretch min-h-16 px-6 py-2 bg-stone-50 border-b border-neutral-200 inline-flex justify-between items-center">
            {/* Imagen y descripción */}
            <div className="flex justify-start items-center gap-4">
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

        </div>
    );
}

PagoItem.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    units: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onRemove: PropTypes.func.isRequired,
    idcarrito: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default PagoItem;