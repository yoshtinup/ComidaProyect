import { useEffect, useState } from "react";
import TitlePanel from "../componets/title/TitlePanel";
import CarritoItem from "../componets/CarritoItem";
import ScrollVertical from "../componets/scroll/ScrollVertical";

function BodyCarrito({ idpruducto, idcarrito }) {
  const [itemsDelCarrito, setItemsDelCarrito] = useState([]);
  const [loading, setLoading] = useState(true);

  const ids = idpruducto || [];
  const idc = idcarrito || [];

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
        fetch(`http://localhost:3002/api/v1/producto/${id}`).then((res) =>
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

  const handleRemoveItem = (idcarritoToRemove) => {
    // Remueve el id del carrito y el producto correspondiente
    const idxToRemove = idc.findIndex(id => id === idcarritoToRemove);
    if (idxToRemove !== -1) {
      const newIds = [...ids];
      const newIdc = [...idc];
      newIds.splice(idxToRemove, 1);
      newIdc.splice(idxToRemove, 1);
      // Actualiza los arrays (esto puede requerir que los arrays vengan de props y se actualicen en el padre real)
      setItemsDelCarrito(prev => prev.filter((_, i) => i !== idxToRemove));
      // Si los ids/idc vienen de props, deberías notificar al padre real aquí
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-neutral-50 ">
      <div className="w-full max-w-4xl px-2 sm:px-4 md:px-10 py-5 flex flex-col gap-4">
        <TitlePanel.Title title="Carrito de Compras" />
        <ScrollVertical>
          <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-gray-500">
                <p>Cargando...</p>
              </div>
            ) : itemsDelCarrito.length > 0 ? (
              itemsDelCarrito.map((item, idx) => (
                <CarritoItem
                  key={item.id}
                  imageUrl={`http://localhost:3000/imagenes/${item.imagen}`}
                  name={item.nombre}
                  units={item.cantidad}
                  total={item.precio}
                  idcarrito={idc[idx]}
                  onRemove={handleRemoveItem}
                />
              ))
            ) : (
              <div className="p-10 text-center text-gray-500">
                <p>Tu carrito de compras está vacío.</p>
              </div>
            )}
          </div>
        </ScrollVertical>
        <TitlePanel.Subtitle subtitle="Resumen de tu carrito" />

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
        {/*boton de pago*/}
        <div className="self-stretch px-4 py-3 inline-flex justify-start items-start cursor-pointer">
          <div className="flex-1 h-12 max-w-[480px] min-w-20 px-5 bg-black rounded-lg flex justify-center items-center overflow-hidden">
            <div className="inline-flex flex-col justify-start items-center overflow-hidden">
              <div className="text-center justify-start text-neutral-50 text-base font-bold font-['Plus_Jakarta_Sans'] leading-normal">
                Proceder al Pago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BodyCarrito;