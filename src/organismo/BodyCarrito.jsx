import { useEffect, useState } from "react";
  import EmptyState from "../componets/EmptyState";
  import { useNavigate } from "react-router-dom";
  import TitlePanel from "../componets/title/TitlePanel";
  import CarritoItem from "../componets/CarritoItem";
  import ScrollVertical from "../componets/scroll/ScrollVertical";
  import Buttom from "../componets/bottom/Buttom";
import CineSnacksLoader from "../componets/loader/CineSnacksLoader";
import config from "../config/apiConfig";

  function BodyCarrito({ cartData, loading, onRefreshCart, userId }) {
    const navigate = useNavigate();

    if (loading) {
      return (
        <div className="flex justify-center w-full min-h-screen bg-neutral-50 px-2 sm:px-4">
          <div className="w-full max-w-2xl lg:max-w-3xl py-4 sm:py-6 flex items-center justify-center">
            <CineSnacksLoader/>
          </div>
        </div>
      );
    }

    const items = cartData?.items || [];
    const total = parseFloat(cartData?.total || 0);
    const itemCount = cartData?.itemCount || 0;

    return (
      <div className="flex justify-center w-full min-h-screen bg-neutral-50 px-2 sm:px-4">
        <div className="w-full max-w-2xl lg:max-w-3xl py-4 sm:py-6 flex flex-col gap-3 sm:gap-4">
          <TitlePanel.Title title="Carrito de Compras" />
          <ScrollVertical>
            <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {items.length > 0 ? (
                items.map((item) => (
                  <CarritoItem
                    key={item.id}
                    imageUrl={item.imagen || config.endpoints.productImage('placeholder.png')}
                    name={item.nombre}
                    description={item.descripcion}
                    price={parseFloat(item.precio)}
                    stock={item.stock_disponible}
                    units={item.peso}
                    idcarrito={item.id}
                    idproducto={item.idproducto}
                    quantity={item.cantidad}
                    subtotal={parseFloat(item.subtotal)}
                    onRefreshCart={onRefreshCart}
                    userId={userId}
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

          { items.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
            
          <TitlePanel.Subtitle subtitle="Resumen de tu carrito" />

          <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center py-1.5">
              <span className="text-stone-500 text-sm font-normal font-['Plus_Jakarta_Sans']">
                Subtotal ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
              </span>
              <span className="text-stone-900 text-sm font-medium font-['Plus_Jakarta_Sans']">
                ${total.toFixed(2)}
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
                ${(total + 1.5).toFixed(2)}
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