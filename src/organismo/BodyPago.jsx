import React, {useState, useEffect} from "react";
import Buttom from "../componets/bottom/Buttom";
import CheckBox from "../componets/checkbox/CheckBox";
import ScrollVertical from "../componets/scroll/ScrollVertical";
import PagoItem from "../componets/PagoItem";
import TitlePanel from "../componets/title/TitlePanel";
import Input from "../componets/inputForm/Input";
import { useCallback } from "react";
import config from "../config/apiConfig";
import mercadoPagoService from "../services/mercadoPagoService";

function BodyPago({cartData, loading}) {
    const [paymentLoading, setPaymentLoading] = useState(false);

    const items = cartData?.items || [];
    const totalCarrito = parseFloat(cartData?.total || 0);
    const itemCount = cartData?.itemCount || 0;
    
    const [checked, setChecked] = useState(false);
    
    // Estados del formulario de pago
    const [payerInfo, setPayerInfo] = useState({
        codigoPromocional: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: ''
    });
    
    const [formErrors, setFormErrors] = useState({});
    const [promoApplied, setPromoApplied] = useState(false);
    const [discount, setDiscount] = useState(0);

    // Inicializar MercadoPago SDK cuando el componente se monta
    useEffect(() => {
        const initMercadoPago = async () => {
            try {
                // La clave pública debería venir de las variables de entorno
                // Por ahora usamos una clave de prueba, pero deberías configurar VITE_MP_PUBLIC_KEY
                const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY || 'TEST-e8c22925-4747-4c39-9b1e-62d0b5c1c8c8';
                await mercadoPagoService.initialize(publicKey);
                console.log('✅ MercadoPago SDK inicializado en componente');
            } catch (error) {
                console.error('❌ Error al inicializar MercadoPago:', error);
            }
        };

        initMercadoPago();
        
        // Cargar datos del usuario desde localStorage
        const nombre = localStorage.getItem("userName") || localStorage.getItem("name") || "";
        const email = localStorage.getItem("userEmail") || localStorage.getItem("email") || "";
        
        setPayerInfo(prev => ({
            ...prev,
            nombre: nombre,
            email: email
        }));
    }, []);
    
    // Manejo de cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPayerInfo(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    
    // Aplicar código promocional
    const handleApplyPromo = () => {
        const promoCode = payerInfo.codigoPromocional.toUpperCase();
        
        // Aquí puedes agregar tu lógica de códigos promocionales
        const validPromoCodes = {
            'PROMO1234': 10, // 10% de descuento
            'CINE2024': 15,  // 15% de descuento
            'SNACKS50': 5    // 5% de descuento
        };
        
        if (validPromoCodes[promoCode]) {
            setDiscount(validPromoCodes[promoCode]);
            setPromoApplied(true);
            alert(`¡Código aplicado! ${validPromoCodes[promoCode]}% de descuento`);
        } else if (promoCode) {
            alert('Código promocional no válido');
        }
    };
    
    // Validar formulario antes de proceder al pago
    const validateForm = () => {
        const errors = {};
        
        if (!payerInfo.nombre.trim()) {
            errors.nombre = 'El nombre es requerido';
        }
        
        if (!payerInfo.apellido.trim()) {
            errors.apellido = 'El apellido es requerido';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!payerInfo.email.trim()) {
            errors.email = 'El correo electrónico es requerido';
        } else if (!emailRegex.test(payerInfo.email)) {
            errors.email = 'Formato de correo inválido';
        }
        
        const phoneRegex = /^(\+52)?[\s]?(\d{10}|\d{3}[\s]?\d{3}[\s]?\d{4})$/;
        if (!payerInfo.telefono.trim()) {
            errors.telefono = 'El teléfono es requerido';
        } else if (!phoneRegex.test(payerInfo.telefono)) {
            errors.telefono = 'Formato de teléfono inválido (10 dígitos)';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    // Calcular total con descuento
    const subtotalConDescuento = totalCarrito * (1 - discount / 100);
    const totalFinal = subtotalConDescuento + 1.5;

    const handPayments = async () => {
    if (!checked) {
        alert("Debe aceptar los términos de Mercado Pago.");
        return;
    }
    
    // Validar formulario antes de proceder
    if (!validateForm()) {
        alert("Por favor, completa correctamente todos los campos del formulario.");
        return;
    }

    setPaymentLoading(true);
    
    try {
        // Verificar que MercadoPago esté inicializado
        const mpStatus = mercadoPagoService.getStatus();
        console.log('🔍 Estado de MercadoPago SDK:', mpStatus);

        // Crear una descripción más detallada basada en los items
        const itemNames = items.map(item => item.nombre).join(", ");
        const description = itemNames ? 
            `Productos de CineSnacks: ${itemNames}` : 
            "Deliciosos snacks para disfrutar tu película";

        console.log('🔄 Enviando solicitud de pago...');

        const response = await fetch(config.endpoints.payment, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "Combo CineSnacks",
                description: description,
                price: totalFinal.toFixed(2),
                category_id: "food",
                quantity: 1,
                payer: {
                    first_name: payerInfo.nombre,
                    last_name: payerInfo.apellido,
                    email: payerInfo.email,
                    phone: {
                        number: payerInfo.telefono
                    }
                },
                // URLs de retorno
                back_urls: {
                    success: `${window.location.origin}/payment-success`,
                    failure: `${window.location.origin}/payment-failure`, 
                    pending: `${window.location.origin}/payment-pending`
                },
                auto_return: "approved"
            })
        });
        
        const data = await response.json();
        console.log('📦 Respuesta del servidor:', data);
        
        if (data.success && data.data && data.data.init_point) {
            console.log('✅ Procesando pago con MercadoPago SDK...');
            
            // Usar el servicio de MercadoPago para manejar el checkout
            if (mpStatus.isInitialized) {
                // Opción 1: Usar redirección segura del SDK
                mercadoPagoService.redirectToCheckout(data.data.init_point);
            } else {
                // Fallback: Redirección tradicional
                console.log('⚠️ SDK no inicializado, usando redirección tradicional');
                window.location.href = data.data.init_point;
            }
            
        } else {
            console.error('❌ No se recibió el init_point de pago');
            console.error('Estructura recibida:', data);
            alert('Error al procesar el pago. Por favor, intenta nuevamente.');
        }
    } catch (error) {
        console.error('❌ Error al procesar el pago:', error);
        alert('Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.');
    } finally {
        setPaymentLoading(false);
    }
}

    return(
        <>

        <div className="flex justify-center w-full min-h-screen bg-neutral-50 ">
            <div className="w-full max-w-4xl px-2 sm:px-4 md:px-10 py-5 flex flex-col gap-4">
                <TitlePanel.Title
                    title="Resumen del pedido"             
                ></TitlePanel.Title> 
                <ScrollVertical>
                <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        <p>Cargando...</p>
                    </div>
                    ) : items.length > 0 ? (
                    items.map((item) => (
                        <PagoItem
                        key={item.id}
                        imageUrl={item.imagen || config.endpoints.productImage('placeholder.png')}
                        name={item.nombre}
                        units={item.cantidad}
                        total={parseFloat(item.subtotal)}
                        idcarrito={item.id}
                        />
                    ))
                    ) : (
                    <div className="p-10 text-center text-gray-500">
                        <p>Tu carrito de compras está vacío.</p>
                    </div>
                    )}
                </div>
                </ScrollVertical>
                
                {/* Formulario de información del comprador */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
                    <TitlePanel.Subtitle subtitle="Información del comprador" />
                    
                    <div className="mt-4 space-y-4">
                        {/* Código promocional */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                Código promocional
                            </label>
                            <div className="flex gap-2">
                                <input
                                    name="codigoPromocional"
                                    type="text"
                                    placeholder="Ingresa el código promocional aquí, ej: PROMO1234"
                                    value={payerInfo.codigoPromocional}
                                    onChange={handleInputChange}
                                    className="flex-1 p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    disabled={promoApplied}
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyPromo}
                                    disabled={promoApplied || !payerInfo.codigoPromocional.trim()}
                                    className="px-6 py-3 bg-[#c53030] text-white rounded-lg font-medium text-sm hover:bg-[#a02828] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {promoApplied ? 'Aplicado' : 'Aplicar'}
                                </button>
                            </div>
                            {promoApplied && (
                                <p className="mt-2 text-sm text-green-600 font-medium">
                                    ✓ Código aplicado - {discount}% de descuento
                                </p>
                            )}
                        </div>
                        
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                Nombre
                            </label>
                            <input
                                name="nombre"
                                type="text"
                                placeholder="Nombre"
                                value={payerInfo.nombre}
                                onChange={handleInputChange}
                                className={`w-full p-3 border ${formErrors.nombre ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 ${formErrors.nombre ? 'focus:ring-red-300' : 'focus:ring-gray-300'}`}
                            />
                            {formErrors.nombre && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.nombre}</p>
                            )}
                        </div>
                        
                        {/* Apellido */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                Apellido
                            </label>
                            <input
                                name="apellido"
                                type="text"
                                placeholder="Apellido"
                                value={payerInfo.apellido}
                                onChange={handleInputChange}
                                className={`w-full p-3 border ${formErrors.apellido ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 ${formErrors.apellido ? 'focus:ring-red-300' : 'focus:ring-gray-300'}`}
                            />
                            {formErrors.apellido && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.apellido}</p>
                            )}
                        </div>
                        
                        {/* Correo electrónico */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                Correo electrónico
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="Correo electrónico"
                                value={payerInfo.email}
                                onChange={handleInputChange}
                                className={`w-full p-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 ${formErrors.email ? 'focus:ring-red-300' : 'focus:ring-gray-300'}`}
                            />
                            {formErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                            )}
                        </div>
                        
                        {/* Número celular */}
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                Número celular a 10 Dígitos
                            </label>
                            <input
                                name="telefono"
                                type="tel"
                                placeholder="Número celular a 10 Dígitos"
                                value={payerInfo.telefono}
                                onChange={handleInputChange}
                                className={`w-full p-3 border ${formErrors.telefono ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 ${formErrors.telefono ? 'focus:ring-red-300' : 'focus:ring-gray-300'}`}
                            />
                            {formErrors.telefono && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.telefono}</p>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Resumen de totales */}
                <div className="self-stretch p-4 inline-flex flex-col justify-start items-start bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="self-stretch py-2 inline-flex justify-between items-start">
                        <div className="inline-flex flex-col justify-start items-start">
                        <div className="justify-start text-stone-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight">
                            Subtotal
                        </div>
                        </div>
                        <div className="inline-flex flex-col justify-start items-start">
                        <div className="text-right justify-start text-stone-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight">
                           ${totalCarrito.toFixed(2)}
                        </div>
                        </div>
                    </div>
                    
                    {discount > 0 && (
                        <div className="self-stretch py-2 inline-flex justify-between items-start">
                            <div className="inline-flex flex-col justify-start items-start">
                                <div className="justify-start text-green-600 text-sm font-medium font-['Plus_Jakarta_Sans'] leading-tight">
                                    Descuento ({discount}%)
                                </div>
                            </div>
                            <div className="inline-flex flex-col justify-start items-start">
                                <div className="text-right justify-start text-green-600 text-sm font-medium font-['Plus_Jakarta_Sans'] leading-tight">
                                    -${(totalCarrito * discount / 100).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="self-stretch py-2 inline-flex justify-between items-start">
                        <div className="inline-flex flex-col justify-start items-start">
                        <div className="justify-start text-stone-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight">
                            Impuestos
                        </div>
                        </div>
                        <div className="inline-flex flex-col justify-start items-start">
                        <div className="text-right justify-start text-stone-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight">
                            $1.50
                        </div>
                        </div>
                    </div>
                    <div className="self-stretch py-2 inline-flex justify-between items-start border-t border-gray-200 mt-2 pt-3">
                        <div className="inline-flex flex-col justify-start items-start">
                        <div className="justify-start text-stone-900 text-base font-semibold font-['Plus_Jakarta_Sans'] leading-tight">
                            Total
                        </div>
                        </div>
                        <div className="inline-flex flex-col justify-start items-start">
                        <div className="text-right justify-start text-stone-900 text-lg font-bold font-['Plus_Jakarta_Sans'] leading-tight">
                           ${totalFinal.toFixed(2)}
                        </div>
                        </div>
                    </div>
                </div>
                <CheckBox.White1
                contexto="Mercado pago" 
                large="w-1/2"
                onChange={() => setChecked(!checked)}
                />
                <Buttom.Buttom1
                contexto={paymentLoading ? "Procesando..." : "Pagar con Mercado"}
                type="button"
                large="w-1/2"
                onClick={handPayments}
                disabled={paymentLoading}
                >
                </Buttom.Buttom1>
            </div>
        </div>

        </>
    )
}
export default BodyPago;