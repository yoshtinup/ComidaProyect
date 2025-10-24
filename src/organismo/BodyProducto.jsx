import React, { useState, useRef } from 'react';
import InputText from '../componets/inputForm/InputText';
import TextArea from '../componets/inputForm/TextArea';
import FileInput from '../componets/inputForm/FileInput';
import config from '../config/apiConfig';
import ModalExito from '../componets/modal/ModalExito';
import { useNavigate } from 'react-router-dom';

const FormularioProducto = () => {
  const [fileName, setFileName] = useState('Seleccionar imagen...');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const formRef = useRef();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName('Seleccionar imagen...');
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = formRef.current;
    const formData = new FormData(form);

    const nombre = formData.get('nombre');
    const descripcion = formData.get('descripcion');
    const cantidad = parseInt(formData.get('cantidad'), 10);
    const precio = parseFloat(formData.get('precio'));
    const no_apartado = parseInt(formData.get('no_apartado'), 10);
    const imagen = formData.get('imagen');

    if (!nombre || !descripcion || isNaN(cantidad) || isNaN(precio) || isNaN(no_apartado) || !imagen.name) {
      alert('Por favor, complete todos los campos del formulario.');
      return;
    }

    if (precio <= 0) {
      alert('El precio debe ser mayor que cero.');
      return;
    }

    if (cantidad < 0) {
      alert('La cantidad no puede ser negativa.');
      return;
    }

    if (no_apartado <= 0) {
      alert('El número de apartado debe ser mayor que cero.');
      return;
    }

    // Log para debugging - ver qué datos se envían
    console.log('Datos a enviar:', {
      nombre,
      descripcion,
      cantidad,
      precio,
      no_apartado,
      imagen: imagen.name,
      endpoint: config.endpoints.productoRegister,
      endpointAlt: config.endpoints.productoRegisterAlt
    });

    try {
      // Intenta primero con el endpoint principal
      let response = await fetch(config.endpoints.productoRegister, {
        method: 'POST',
        body: formData
      });

      // Si falla, intenta con el endpoint alternativo
      if (!response.ok && config.endpoints.productoRegisterAlt) {
        console.log('Intentando con endpoint alternativo...');
        response = await fetch(config.endpoints.productoRegisterAlt, {
          method: 'POST',
          body: formData
        });
      }

      const data = await response.json();

      if (response.ok) {
        form.reset();
        setFileName('Seleccionar imagen...');
        setPreviewUrl(null);
        setShowSuccessModal(true); // Mostrar modal de éxito
      } else {
        // Manejo más específico de errores del servidor
        console.error('Error del servidor:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        
        let errorMessage = 'Error del servidor: ';
        
        if (response.status === 400) {
          errorMessage += 'Datos inválidos. ';
        } else if (response.status === 401) {
          errorMessage += 'No autorizado. ';
        } else if (response.status === 403) {
          errorMessage += 'Acceso prohibido. ';
        } else if (response.status === 404) {
          errorMessage += 'Endpoint no encontrado. ';
        } else if (response.status === 500) {
          errorMessage += 'Error interno del servidor. ';
        } else {
          errorMessage += `Código ${response.status}. `;
        }
        
        // Agregar detalles específicos del error si están disponibles
        if (data.error) {
          errorMessage += `Detalle: ${data.error}`;
        } else if (data.message) {
          errorMessage += `Mensaje: ${data.message}`;
        } else if (data.details) {
          errorMessage += `Detalles: ${JSON.stringify(data.details)}`;
        } else {
          errorMessage += `Respuesta completa: ${JSON.stringify(data)}`;
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error completo:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        url: config.endpoints.productoRegister
      });
      
      let errorMessage = 'Error de conexión: ';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage += 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
      } else if (error.name === 'SyntaxError') {
        errorMessage += 'El servidor devolvió una respuesta inválida.';
      } else {
        errorMessage += `${error.message}. URL: ${config.endpoints.productoRegister}`;
      }
      
      alert(errorMessage);
    }
  };

  const handleGoToAdmin = () => {
    setShowSuccessModal(false);
    navigate('/panel-admin');
  };

  const handleRegisterAnother = () => {
    setShowSuccessModal(false);
    // El formulario ya está limpio, solo cerramos el modal
  };

  return (
    <div className=" flex justify-center">
      <div className="w-[960px] max-w-[960px] py-5 flex flex-col items-start overflow-hidden">
        <div className="self-stretch p-4 flex justify-between items-start flex-wrap">
          <div className="min-w-72 flex flex-col gap-3">
            <div className="text-neutral-900 text-3xl font-bold leading-10">Gestionar Producto</div>
            <div className="w-80 text-neutral-500 text-sm leading-tight">
              Edita o agrega nuevos productos al menú
            </div>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data" className="p-4 w-full">
          <div className='max-w-[480px] mb-4'>
            <InputText id="nombre" label="Nombre:" placeholder="Ingrese el nombre del producto" />
          </div>
          <div className='max-w-[480px] mb-4'>
            <TextArea id="descripcion" label="Descripción:" placeholder="Ingrese una descripción del producto" />
          </div>
          <div className='max-w-[480px] mb-4'>
            <InputText id="precio" label="Precio:" type="number" step="0.01" placeholder="Precio en MXN" />
          </div>
          <div className='max-w-[480px] mb-4'>
            <InputText id="cantidad" label="Cantidad:" type="number" placeholder="Cantidad en stock" />
          </div>
          <div className='max-w-[480px] mb-4'>
            <InputText id="peso" label="Peso:" type="number" step="0.01" placeholder="Peso en gr" />
          </div>
          <div className='max-w-[480px] mb-4'>
            <InputText id="categoria" label="Categoría:" placeholder="Ingrese la categoría del producto" />
          </div>
          <div className='max-w-[480px] mb-4'>
            <InputText id="no_apartado" label="No. Apartado:" type="number" placeholder="Número de apartado" />
          </div>
          <div className='max-w-[480px] mb-4'>
            <InputText id="ingreso" label="Ingreso:" type="number" step="0.01" placeholder="Ingreso en MXN" />
          </div>

          <FileInput onChange={handleImageChange} previewUrl={previewUrl} />

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus-circle"></i> Registrar Producto
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-400 text-center">
          Todos los campos son obligatorios. La imagen debe ser en formato JPG, PNG o GIF.
        </div>

        {/* Modal de éxito personalizado */}
        {showSuccessModal && (
          <ModalExito
            mensaje="¡Producto registrado correctamente! ¿Qué deseas hacer ahora?"
            onPrimaryAction={handleGoToAdmin}
            onSecondaryAction={handleRegisterAnother}
            textoPrimario="Ir al Panel Admin"
            textoSecundario="Registrar otro producto"
          />
        )}
      </div>
    </div>
  );
};

export default FormularioProducto;
