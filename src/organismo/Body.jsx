import React, { useEffect, useState } from 'react';
import axios from 'axios';
import videoFile from '../assets/img/perfil.gif';
import ProductoCard from '../componets/ProductoCard';
import ModalNotificacion from '../componets/modal/ModalNotificacion';
import CartSideModal from '../componets/modal/CartSideModal';
import CineSnacksLoader from '../componets/loader/CineSnacksLoader';
import config from '../config/apiConfig';

const Body = ({iduser, nombre}) => {
  const [productos, setProductos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('Producto agregado al carrito');
  const [loading, setLoading] = useState(true);
  
  // Estados para el modal del carrito
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        // Obtener los ids de productos del dispensador seleccionado
        const dispenserId = localStorage.getItem('selectedDispenserId');
        if (!dispenserId) {
          setProductos([]);
          setLoading(false);
          return;
        }
        // Obtener los productos del dispensador
        const dispenserRes = await axios.get(config.endpoints.dispenser(dispenserId));
        const productosDisp = dispenserRes.data.products || [];
        const ids = productosDisp.map(p => p.id);
        if (!ids.length) {
          setProductos([]);
          setLoading(false);
          return;
        }
        // Consultar productos actualizados por ids
        const productosRes = await axios.post(config.endpoints.productosByIds, { ids });
        setProductos(productosRes.data || []);
      } catch (error) {
        console.error('Error al cargar los productos actualizados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
    
    // Obtener cantidad de items en el carrito
    fetchCartCount();
  }, []);
  
  // Función para obtener el conteo del carrito
  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !iduser) return;
      
      const response = await axios.get(config.endpoints.carritoByUser(iduser), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setCartItemsCount(response.data.data.itemCount || 0);
      }
    } catch (error) {
      console.error('Error al obtener conteo del carrito:', error);
    }
  };

  const handleAddToCart = async (id) => {
    const now = new Date();
    const fecha = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const hora = now.toTimeString().slice(0, 8);  // HH:MM:SS

    try {
      // Encontrar el producto agregado para mostrarlo en el modal
      const productoAgregado = productos.find(p => p.id === id);
      
      // Primero verificar si el producto ya está en el carrito
      const existingCartRes = await axios.get(config.endpoints.carritoByUser(iduser));
      const existingItems = existingCartRes.data || [];
      
      // Buscar si el producto ya existe en el carrito
      const existingItem = existingItems.find(item => item.idproducto === id);
      
      if (existingItem) {
        // Si el producto ya existe, actualizar la cantidad
        const newQuantity = (existingItem.cantidad || 1) + 1;
        await axios.put(config.endpoints.carritoUpdate(existingItem.id), {
          cantidad: newQuantity
        });
        setModalMessage('Cantidad actualizada en el carrito');
      } else {
        // Si el producto no existe, agregarlo como nuevo
        const data = {
          iduser: iduser,
          idproducto: id,
          fecha: fecha,
          hora: hora,
          cantidad: 1
        };
        
        await axios.post(config.endpoints.carritoAdd, data);
        setModalMessage('Producto agregado al carrito');
      }
      
      // Actualizar conteo del carrito
      await fetchCartCount();
      
      // Mostrar el modal lateral con la información del producto
      if (productoAgregado) {
        setAddedProduct({
          ...productoAgregado,
          imagen: config.endpoints.productImage(productoAgregado.imagen)
        });
        setCartModalOpen(true);
      }
      
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      // Si falla la verificación, intentar agregar normalmente
      try {
        const data = {
          iduser: iduser,
          idproducto: id,
          fecha: fecha,
          hora: hora,
          cantidad: 1
        };
        
        await axios.post(config.endpoints.carritoAdd, data);
        
        // Buscar el producto para el modal
        const productoAgregado = productos.find(p => p.id === id);
        if (productoAgregado) {
          setAddedProduct({
            ...productoAgregado,
            imagen: config.endpoints.productImage(productoAgregado.imagen)
          });
          setCartModalOpen(true);
        }
        
        await fetchCartCount();
      } catch (fallbackError) {
        console.error('Error en fallback al agregar al carrito:', fallbackError);
        setModalOpen(true);
      }
    }
  };

  if (loading) {
    return <CineSnacksLoader />;
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 sm:gap-8 pb-8">
      {/* Modal de notificación (mantener para compatibilidad) */}
      {modalOpen && (
        <ModalNotificacion
          mensaje={modalMessage}
          onClose={() => setModalOpen(false)}
        />
      )}
      
      {/* Modal lateral del carrito tipo Mercado Libre */}
      <CartSideModal
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        product={addedProduct}
        cartItemsCount={cartItemsCount}
      />
      
      {/* Perfil */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mt-5 px-4">
        <img className="w-24 h-24 sm:w-32 sm:h-28 md:w-36 md:h-32 rounded-full object-cover" src={videoFile} alt="Perfil" />
        <div className="text-center sm:text-left">
          <div className="text-black text-lg sm:text-xl font-bold">Hola, {nombre}</div>
          <div className="text-neutral-500 text-sm sm:text-base">Que la fuerza te acompañe</div>
        </div>
      </div>

      {/* Lista de productos centrada y responsive */}
      <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 place-items-center max-w-7xl">
          {productos.map((p, index) => (
            <div key={p.id || index} className="flex justify-center w-full">
              <ProductoCard
                id={p.id}
                nombre={p.nombre}
                precio={`$${p.precio} MXN - ${p.peso || p.cantidad || ''}g`}
                imagen={config.endpoints.productImage(p.imagen)}
                onAddToCart={(id) => handleAddToCart(id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Body;