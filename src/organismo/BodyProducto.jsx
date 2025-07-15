import React, { useState, useRef } from 'react';
import InputText from '../componets/inputForm/InputText';
import TextArea from '../componets/inputForm/TextArea';
import FileInput from '../componets/inputForm/FileInput';

const FormularioProducto = () => {
  const [fileName, setFileName] = useState('Seleccionar imagen...');
  const [previewUrl, setPreviewUrl] = useState(null);
  const formRef = useRef();

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
    const imagen = formData.get('imagen');

    if (!nombre || !descripcion || isNaN(cantidad) || isNaN(precio) || !imagen.name) {
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

    try {
      const response = await fetch('http://3.235.82.25:3000/registrar-producto', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert('Producto registrado correctamente');
        form.reset();
        setFileName('Seleccionar imagen...');
        setPreviewUrl(null);
      } else {
        alert('Error: ' + (data.error || 'No se pudo registrar el producto'));
      }
    } catch (error) {
      alert('Error de red o del servidor');
    }
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
            <InputText id="precio" label="Precio:" type="number" step="0.01" placeholder="Precio en €" />
          </div>
          <div className='max-w-[480px] mb-4'>
            <InputText id="cantidad" label="Cantidad:" type="number" placeholder="Cantidad en stock" />
          </div>
          <div className='max-w-[480px] mb-4'>
            <InputText id="peso" label="Peso:" type="number" step="0.01" placeholder="Peso en kg" />
          </div>
          <div className='max-w-[480px] mb-4'>
            <InputText id="categoria" label="Categoría:" placeholder="Ingrese la categoría del producto" />
          </div>
          <div className='max-w-[480px] mb-4'>
            <InputText id="ingreso" label="Ingreso:" type="number" step="0.01" placeholder="Ingreso en €" />
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
      </div>
    </div>
  );
};

export default FormularioProducto;
