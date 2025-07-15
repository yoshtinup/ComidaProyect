import React, { useEffect, useState } from 'react';
import axios from 'axios';
import videoFile from '../assets/img/perfil.gif';
import ProductoCard from '../componets/ProductoCard';
import ModalNotificacion from '../componets/modal/ModalNotificacion';


const Body = ({iduser, nombre}) => {
  const [productos, setProductos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://3.230.107.32:3002/api/v1/producto'); // Cambia por tu endpoint real
        setProductos(response.data); // Asegúrate que el formato coincida (nombre, precio, imagen)
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const handleAddToCart = async (id) => {
    const now = new Date();
    const fecha = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const hora = now.toTimeString().slice(0, 8);  // HH:MM:SS

    // Datos a enviar
    const data = {
      iduser: iduser,
      idproducto: id,
      fecha: fecha,
      hora: hora,
    };

    try {
      await axios.post('http://3.230.107.32:3002/api/v1/carrito', data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };
  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Modal de notificación */}
      {modalOpen && (
        <ModalNotificacion
          mensaje="Producto agregado al carrito"
          onClose={() => setModalOpen(false)}
        />
      )}
      {/* Perfil */}
      <div className="flex items-center gap-5 mt-5">
        <img className="w-36 h-32 rounded-full" src={videoFile} alt="Perfil" />
        <div>
          <div className="text-black text-xl font-bold">Hola, {nombre}</div>
          <div className="text-neutral-500 text-base">Que la fuerza te acompañe</div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="snap-x overflow-x-auto w-full max-w-[960px] h-[400px]">
        <div className="flex gap-4 snap-mandatory">
          {productos.map((p, index) => (
            <div className="snap-start scroll-ml-6 shrink-0">
              <ProductoCard
                key={index}
                id={p.id}
                nombre={p.nombre}
                precio={`$${p.precio} MXN - ${p.cantidad}g`}
                imagen={`http://3.235.82.25:3000/imagenes/${p.imagen}`}
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
