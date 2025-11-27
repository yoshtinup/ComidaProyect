import React, { useEffect } from 'react';
import { X, CheckCircle, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartSideModal = ({ isOpen, onClose, product, cartItemsCount }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            // Auto-cerrar después de 5 segundos
            const timer = setTimeout(() => {
                onClose();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleGoToCart = () => {
        onClose();
        navigate('/carrito');
    };

    return (
        <>
            {/* Overlay semi-transparente */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity duration-300"
                onClick={onClose}
            />
            
            {/* Modal deslizable desde la derecha */}
            <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out animate-slide-in-right overflow-y-auto">
                {/* Header del modal */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <h2 className="text-lg font-bold text-stone-900 font-['Plus_Jakarta_Sans']">
                            Agregaste a tu carrito
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Contenido del modal */}
                <div className="p-6">
                    {/* Producto agregado */}
                    {product && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex gap-4">
                            <div className="w-20 h-20 flex-shrink-0">
                                <img
                                    src={product.imagen}
                                    alt={product.nombre}
                                    className="w-full h-full object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src = '/snack_bag.jpg';
                                    }}
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-semibold text-stone-900 font-['Plus_Jakarta_Sans'] mb-1">
                                    {product.nombre}
                                </h3>
                                <p className="text-sm text-stone-500 font-['Plus_Jakarta_Sans']">
                                    {product.peso || product.cantidad || ''} {product.peso ? 'g' : 'ud.'}
                                </p>
                                <p className="text-base font-bold text-stone-900 font-['Plus_Jakarta_Sans'] mt-2">
                                    ${parseFloat(product.precio).toFixed(2)} MXN
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="space-y-3">
                        <button
                            onClick={handleGoToCart}
                            className="w-full bg-[#2c2c2c] text-white py-4 px-6 rounded-lg font-bold text-base font-['Plus_Jakarta_Sans'] hover:bg-[#3c3c3c] transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Ir al carrito {cartItemsCount > 0 && `(${cartItemsCount})`}
                        </button>
                        
                        <button
                            onClick={onClose}
                            className="w-full bg-white text-[#2c2c2c] py-4 px-6 rounded-lg font-semibold text-base font-['Plus_Jakarta_Sans'] border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Seguir comprando
                        </button>
                    </div>

                    {/* Información del carrito */}
                    {cartItemsCount > 0 && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-stone-600 font-['Plus_Jakarta_Sans'] text-center">
                                Tienes {cartItemsCount} {cartItemsCount === 1 ? 'producto' : 'productos'} en tu carrito
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Estilos para la animación */}
            <style jsx>{`
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default CartSideModal;
