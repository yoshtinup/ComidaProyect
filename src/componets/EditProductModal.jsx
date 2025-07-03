import React from 'react';

const EditProductModal = ({
  open,
  onClose,
  form,
  onChange,
  onSave
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-xs sm:max-w-md w-full shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-lg font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <div className="mb-4 text-lg font-bold">Editar Producto</div>
        <form className="flex flex-col gap-3">
          <input
            type="text"
            name="nombre"
            value={form.nombre || ''}
            onChange={onChange}
            placeholder="Producto"
            className="border rounded px-2 py-1 text-sm"
            required
          />
          <textarea
            name="descripcion"
            value={form.descripcion || ''}
            onChange={onChange}
            placeholder="Descripción"
            className="border rounded px-2 py-1 text-sm"
            required
          />
          <input
            type="number"
            name="precio"
            value={form.precio || ''}
            onChange={onChange}
            placeholder="Precio"
            className="border rounded px-2 py-1 text-sm"
            required
          />
          <input
            type="number"
            name="cantidad"
            value={form.cantidad || ''}
            onChange={onChange}
            placeholder="Cantidad"
            className="border rounded px-2 py-1 text-sm"
            required
          />
          <input
            type="number"
            name="peso"
            value={form.peso || ''}
            onChange={onChange}
            placeholder="Peso"
            className="border rounded px-2 py-1 text-sm"
            required
          />
          <input
            type="text"
            name="categoria"
            value={form.categoria || ''}
            onChange={onChange}
            placeholder="Categoría"
            className="border rounded px-2 py-1 text-sm"
            required
          />
          <input
            type="number"
            name="ingreso"
            value={form.ingreso || ''}
            onChange={onChange}
            placeholder="Ingresos"
            className="border rounded px-2 py-1 text-sm"
            required
          />
          <input
            type="file"
            name="imagen"
            accept='image/*'
            required
            onChange={onChange}
            placeholder="Imagen"
            className="border rounded px-2 py-1 text-sm"
          
          />
          <button
            type="button"
            onClick={onSave}
            className="bg-black text-white rounded px-4 py-2 mt-2 font-bold hover:bg-neutral-800"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;