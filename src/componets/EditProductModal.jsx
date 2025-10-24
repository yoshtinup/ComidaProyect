import React from 'react';
import Input from './inputForm/Input';
import TextArea from './inputForm/TextArea';
import FileInput from './inputForm/FileInput';
import Buttom from './bottom/Buttom';

const EditProductModal = ({
  open,
  onClose,
  form,
  onChange,
  onSave
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#141414] mb-2">Editar Producto</h2>
          <p className="text-gray-600 text-sm">Actualiza la información del producto</p>
        </div>

        <div className="space-y-4">
          <Input.Input1
            name="nombre"
            type="text"
            contexto="Nombre del producto"
            value={form.nombre || ''}
            onChange={onChange}
            placeholder="Ingresa el nombre del producto"
          />

          <TextArea
            id="descripcion"
            label="Descripción del producto"
            value={form.descripcion || ''}
            onChange={onChange}
            placeholder="Describe las características del producto"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input.Input1
              name="precio"
              type="number"
              contexto="Precio ($)"
              value={form.precio || ''}
              onChange={onChange}
              placeholder="0.00"
            />

            <Input.Input1
              name="cantidad"
              type="number"
              contexto="Cantidad en stock"
              value={form.cantidad || ''}
              onChange={onChange}
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input.Input1
              name="peso"
              type="number"
              contexto="Peso (gramos)"
              value={form.peso || ''}
              onChange={onChange}
              placeholder="0"
            />

            <Input.Input1
              name="categoria"
              type="text"
              contexto="Categoría"
              value={form.categoria || ''}
              onChange={onChange}
              placeholder="Bebidas, Snacks, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input.Input1
              name="ingreso"
              type="number"
              contexto="Ingresos estimados"
              value={form.ingreso || ''}
              onChange={onChange}
              placeholder="0.00"
            />

            <Input.Input1
              name="no_apartado"
              type="number"
              contexto="Número de apartado"
              value={form.no_apartado || ''}
              onChange={onChange}
              placeholder="0"
            />
          </div>

          <FileInput
            id="imagen"
            label="Imagen del producto"
            onChange={onChange}
          />

          <div className="flex gap-3 mt-8">
            <Buttom.Buttom1
              contexto="Cancelar"
              large="flex-1"
              onClick={onClose}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db'
              }}
            />
            <Buttom.Buttom1
              contexto="Guardar Cambios"
              large="flex-1"
              onClick={onSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;