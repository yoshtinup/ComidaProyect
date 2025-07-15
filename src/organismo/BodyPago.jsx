import React, {useState, useEffect} from "react";
import Buttom from "../componets/bottom/Buttom";
import CheckBox from "../componets/checkbox/CheckBox";
import ScrollVertical from "../componets/scroll/ScrollVertical";
import PagoItem from "../componets/PagoItem";
import TitlePanel from "../componets/title/TitlePanel";

function BodyPago({idpruducto, idcarrito}) {
    const [itemsDelCarrito, setItemsDelCarrito] = useState([]);
    const [loading, setLoading] = useState(true);

    const ids = idpruducto || [];
    const idc = idcarrito || [];
    const [checked, setChecked] = useState(false);

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
            fetch(`http://3.230.107.32:3002/api/v1/producto/${id}`).then((res) =>
            res.json()
            )
        )
        )
        .then((data) => {
            setItemsDelCarrito(data);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [ids.join(",")]); // Solo se ejecuta cuando cambian los IDs

  const totalCarrito = itemsDelCarrito.reduce(
    (acum, item) => acum + (parseFloat(item.precio) || 0),
    0
  );


    const handPayments = async () => {
        if (!checked) {
            alert("Debe seleccionar alguna casilla de Pago.");
            return;
        }
        try {
            const response = await fetch('http://3.230.107.32:3002/api/v1/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: "Producto",
                    price: (totalCarrito + 1.5).toFixed(2) 
                })
            });
            const data = await response.json();
            if (data.init_point) {
                window.location.href = data.init_point; // Redirige al usuario a la página de pago
            } else {
                console.error('No se recibió el init_point de pago');
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
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
                        <div className="text-right justify-start text-stone-900 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight">
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
                        <div className="text-right justify-start text-stone-900 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight">
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
                        <div className="text-right justify-start text-stone-900 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight">
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
                contexto="Pagar con Mercado"
                type="button"
                large="w-1/2"
                onClick={handPayments}
                >
                </Buttom.Buttom1>
            </div>
        </div>

        </>
    )
}
export default BodyPago;