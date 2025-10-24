import React, {useState, useEffect} from "react";
import Buttom from "../componets/bottom/Buttom";
import CheckBox from "../componets/checkbox/CheckBox";
import ScrollVertical from "../componets/scroll/ScrollVertical";
import PagoItem from "../componets/PagoItem";
import TitlePanel from "../componets/title/TitlePanel";
import { useCallback } from "react";
import config from "../config/apiConfig";
import mercadoPagoService from "../services/mercadoPagoService";

function BodyPago({idpruducto, idcarrito}) {
    const [itemsDelCarrito, setItemsDelCarrito] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const ids = idpruducto || [];
    const idc = idcarrito || [];
    const [checked, setChecked] = useState(false);
    const usuario = localStorage.getItem("name") || "cinesnacksuser";
    const email = localStorage.getItem("email") || "cliente@cinesnacks.com";

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
    }, []);

    useEffect(() => {
        console.log("ID del producto:", ids);
        console.log("ID del carrito: ",idc)
        if (!ids || ids.length === 0) {
        setItemsDelCarrito([]);
        setLoading(false);
        return;
        }
        setLoading(true);
        Promise.all(
        ids.map((id) =>
            fetch(config.endpoints.producto(id)).then((res) =>
            res.json()
            )
        )
        )
        .then((data) => {
            setItemsDelCarrito(data);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [ids.join(",")]);

    console.log(itemsDelCarrito);
    

  const totalCarrito = itemsDelCarrito.reduce(
    (acum, item) => acum + (parseFloat(item.precio) || 0),
    0
  );

const handPayments = async () => {
    if (!checked) {
        alert("Debe seleccionar alguna casilla de Pago.");
        return;
    }

    setPaymentLoading(true);
    
    try {
        // Verificar que MercadoPago esté inicializado
        const mpStatus = mercadoPagoService.getStatus();
        console.log('🔍 Estado de MercadoPago SDK:', mpStatus);

        // Crear una descripción más detallada basada en los items
        const itemNames = itemsDelCarrito.map(item => item.nombre).join(", ");
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
                price: (totalCarrito + 1.5).toFixed(2),
                category_id: "food",
                quantity: 1,
                payer: {
                    first_name: usuario,
                    last_name: "CineSnacks",
                    email: email
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
                    ) : itemsDelCarrito.length > 0 ? (
                    itemsDelCarrito.map((item, idx) => (
                        <PagoItem
                        key={item.id}
                        imageUrl={item.imagen}
                        name={item.nombre}
                        units={item.cantidad}
                        total={item.precio}
                        idcarrito={idc[idx]}
                        />
                    ))
                    ) : (
                    <div className="p-10 text-center text-gray-500">
                        <p>Tu carrito de compras está vacío.</p>
                    </div>
                    )}
                </div>
                </ScrollVertical>
                <div className="self-stretch p-4 inline-flex flex-col justify-start items-start">
                    <div className="self-stretch py-2 inline-flex justify-between items-start">
                        <div className="inline-flex flex-col justify-start items-start">
                        <div className="justify-start text-stone-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight">
                            Subtotal
                        </div>
                        </div>
                        <div className="inline-flex flex-col justify-start items-start">
                        <div className="text-right justify-start text-stone-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight">
                           ${totalCarrito}
                        </div>
                        </div>
                    </div>
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
                    <div className="self-stretch py-2 inline-flex justify-between items-start">
                        <div className="inline-flex flex-col justify-start items-start">
                        <div className="justify-start text-stone-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight">
                            Total
                        </div>
                        </div>
                        <div className="inline-flex flex-col justify-start items-start">
                        <div className="text-right justify-start text-stone-700 text-sm font-medium font-['Plus_Jakarta_Sans'] leading-tight">
                           ${(totalCarrito + 1.5).toFixed(2)}
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