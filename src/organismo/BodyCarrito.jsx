  import { useEffect, useState } from "react";
  import EmptyState from "../componets/EmptyState";
  import { useNavigate } from "react-router-dom";
  import TitlePanel from "../componets/title/TitlePanel";
  import CarritoItem from "../componets/CarritoItem";
  import ScrollVertical from "../componets/scroll/ScrollVertical";
  import Buttom from "../componets/bottom/Buttom";
import CineSnacksLoader from "../componets/loader/CineSnacksLoader";
import config from "../config/apiConfig";
  function BodyCarrito({ idpruducto, idcarrito }) {
    const [itemsDelCarrito, setItemsDelCarrito] = useState([]);
    const [quantities, setQuantities] = useState({}); // Estado para las cantidades
    const [loading, setLoading] = useState(true);
    const ids = idpruducto || [];
    const idc = idcarrito || [];
    const navigate = useNavigate();

    useEffect(() => {
      console.log("ID del producto:", ids);
      console.log("ID del carrito: ",idc)
      if (!ids || ids.length === 0) {
        setItemsDelCarrito([]);
        setQuantities({});
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
          // Inicializar cantidades en 1 para cada producto
          const initialQuantities = {};
          idc.forEach((carritoId) => {
            initialQuantities[carritoId] = 1;
          });
          setQuantities(initialQuantities);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [ids.join(",")]); // Solo se ejecuta cuando cambian los IDs

    // Calcular total considerando las cantidades
    const totalCarrito = itemsDelCarrito.reduce(
      (acum, item, idx) => {
        const carritoId = idc[idx];
        const quantity = quantities[carritoId] || 1;
        return acum + (parseFloat(item.precio) * quantity || 0);
      },
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
        // Remover cantidad del estado
        setQuantities(prev => {
          const newQuantities = { ...prev };
          delete newQuantities[idcarritoToRemove];
          return newQuantities;
        });
        // Si los ids/idc vienen de props, deberías notificar al padre real aquí
      }
    };

    const handleQuantityChange = (carritoId, newQuantity) => {
      setQuantities(prev => ({
        ...prev,
        [carritoId]: newQuantity
      }));
    };



    return (
      <div className="flex justify-center w-full min-h-screen bg-neutral-50 px-2 sm:px-4">
        <div className="w-full max-w-2xl lg:max-w-3xl py-4 sm:py-6 flex flex-col gap-3 sm:gap-4">
          <TitlePanel.Title title="Carrito de Compras" />
          <ScrollVertical>
            <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <CineSnacksLoader/>
              ) : itemsDelCarrito.length > 0 ? (
                itemsDelCarrito.map((item, idx) => (
                  <CarritoItem
                    key={item.id}
                    imageUrl={config.endpoints.productImage(item.imagen)}
                    name={item.nombre}
                    units={item.cantidad}
                    total={item.precio}
                    idcarrito={idc[idx]}
                    quantity={quantities[idc[idx]] || 1}
                    onRemove={handleRemoveItem}
                    onQuantityChange={handleQuantityChange}
                  />
                ))
              ) : (
                <EmptyState 
                  icon="🛒" 
                  title="Tu carrito de compras está vacío" 
                  description="¡Agrega productos para comenzar tu pedido!" 
                  buttonText="Explorar Snacks" 
                  buttonRoute="/home" 
                />
              )}
            </div>
          </ScrollVertical>

          { itemsDelCarrito.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            
          <TitlePanel.Subtitle subtitle="Resumen de tu carrito" />

          <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center py-1.5">
              <span className="text-stone-500 text-sm font-normal font-['Plus_Jakarta_Sans']">
                Subtotal
              </span>
              <span className="text-stone-900 text-sm font-medium font-['Plus_Jakarta_Sans']">
                ${totalCarrito.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-stone-500 text-sm font-normal font-['Plus_Jakarta_Sans']">
                Impuestos
              </span>
              <span className="text-stone-900 text-sm font-medium font-['Plus_Jakarta_Sans']">
                $1.50
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-200 mt-3">
              <span className="text-stone-900 text-base sm:text-lg font-semibold font-['Plus_Jakarta_Sans']">
                Total
              </span>
              <span className="text-stone-900 text-base sm:text-lg font-bold font-['Plus_Jakarta_Sans']">
                ${(totalCarrito + 1.5).toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Buttom.Buttom1
              contexto="Proceder al pago"
              large="w-full sm:w-2/3 lg:w-1/2" 
              onClick={() => navigate("/pago") }
            />
          </div>
          </div>
          )}
        </div>
        
      </div>
    );
  }

  export default BodyCarrito;