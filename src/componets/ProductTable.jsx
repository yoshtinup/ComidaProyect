import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditProductModal from './EditProductModal';
import ScrollVertical from './scroll/ScrollVertical';
import ModalConfirmacion from './modal/ModalConfirmacion';
const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [showDesc, setShowDesc] = useState({ open: false, text: '' });
  const [editModal, setEditModal] = useState({ open: false, product: null });
  const [editForm, setEditForm] = useState({});

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3002/api/v1/producto');
      setProducts(res.data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns = [
    { title: 'Producto', key: 'nombre', className: 'flex-1 min-w-[120px] max-w-[180px]' },
    { title: 'Descripción', key: 'descripcion', className: 'flex-1 min-w-[150px] max-w-[220px]' },
    { title: 'Precio', key: 'precio', className: 'w-[70px] flex-none text-center' },
    { title: 'Cantidad', key: 'cantidad', className: 'w-[70px] flex-none text-center' },
    { title: 'Peso', key: 'peso', className: 'w-[70px] flex-none text-center' },
    { title: 'Categoría', key: 'categoria', className: 'w-[100px] flex-none text-center' },
    { title: 'Ingresos', key: 'ingreso', className: 'w-[90px] flex-none text-center' },
    { title: 'Imagen', key: 'imagen', className: 'w-[70px] flex-none text-center' },
    { title: 'Acciones', key: 'acciones', className: 'w-[90px] flex-none text-center' }
  ];

  // Abrir modal de edición y cargar datos del producto
  const handleEditOpen = (product) => {
    setEditForm(product);
    setEditModal({ open: true, product });
  };

  // Cerrar modal de edición
  const handleEditClose = () => {
    setEditModal({ open: false, product: null });
    setEditForm({});
  };

  // Manejar cambios en el formulario de edición
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen' && files && files.length > 0) {
      setEditForm(prev => ({ ...prev, imagen: files[0] }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Guardar cambios (puedes ajustar la URL y lógica según tu API)
  const handleEditSave = async () => {
    try {
      const id = editForm._id || editForm.id;
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (key !== 'imagen') formData.append(key, value);
      });
      if (editForm.imagen instanceof File) {
        formData.append('imagen', editForm.imagen);
      }
      await axios.put(
        `http://localhost:3000/actualizar-producto/${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      handleEditClose();
      fetchProducts(); // <-- Recarga la tabla desde el backend
    } catch (error) {
      alert('Error al guardar los cambios');
    }
  };
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const confirmarEliminacion = (producto) => {
    setProductoSeleccionado(producto);
  };

  const eliminarProducto = async () => {
    try {
      const id = productoSeleccionado._id || productoSeleccionado.id;
      await axios.delete(`http://localhost:3000/eliminar-producto/${id}`);
      fetchProducts(); // recarga la lista
      setProductoSeleccionado(null); // cerrar el modal
    } catch (error) {
      alert('Error al eliminar el producto');
    }
  };


  return (
    <div className="w-full px-2 py-2 sm:px-4 sm:py-3">
      <div className="overflow-x-auto overflow-y-auto w-full" style={{ maxHeight: '500px' }}>
        <div className="min-w-full rounded-xl border-[#DBDBDB] bg-[#F9F9F9]">
          <div className="flex bg-[#F9F9F9] w-full">
            {columns.map((col, index) => (
              <div
                key={index}
                className={`px-2 py-2 sm:px-4 sm:py-3 ${col.className} flex items-center font-medium text-xs sm:text-sm ${col.key === 'acciones' ? 'text-[#727272]' : ''}`}
              >
                {col.title}
              </div>
            ))}
          </div>

          {products.map((product, index) => (
            <div key={index} className="flex h-[70px] sm:h-[100px] border-t border-[#E5E8EA] w-full items-center">
              {columns.map((col) => (
                <div
                  key={col.key}
                  className={`px-2 sm:px-4 ${col.className} flex items-center`}
                >
                  {col.key === 'imagen' ? (
                    <img
                      src={`http://localhost:3000/imagenes/${product[col.key]}`}
                      alt={product.nombre}
                      className="max-h-10 max-w-[60px] object-contain mx-auto"
                    />
                  ) : col.key === 'descripcion' ? (
                    <span
                      className="text-xs sm:text-sm text-[#727272] truncate w-full block cursor-pointer hover:underline"
                      title={product[col.key]}
                      onClick={() => setShowDesc({ open: true, text: product[col.key] })}
                    >
                      {product[col.key]}
                    </span>
                  ) : col.key === 'acciones' ? (
                    <div className="flex flex-col items-center gap-1 w-full">
                      <button
                        type="button"
                        className="text-xs sm:text-sm font-bold text-[#000000] hover:underline"
                        onClick={() => handleEditOpen(product)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="text-xs sm:text-sm font-bold text-[#727272] hover:underline"
                         onClick={() => confirmarEliminacion(product)}
                      >
                        Eliminar
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm text-[#727272] truncate w-full block">{product[col.key]}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Modal */}
      {productoSeleccionado && (
        <ModalConfirmacion
          mensaje={`¿Deseas eliminar el producto "${productoSeleccionado.nombre}"?`}
          onConfirmar={eliminarProducto}
          onCancelar={() => setProductoSeleccionado(null)}
        />
      )}

      {/* Modal para mostrar descripción completa */}
      {showDesc.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xs sm:max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-lg font-bold"
              onClick={() => setShowDesc({ open: false, text: '' })}
            >
              ×
            </button>
            <div className="text-sm text-gray-800 whitespace-pre-line">{showDesc.text}</div>
          </div>
        </div>
      )}
      {/* Modal para editar producto */}
      <EditProductModal
        open={editModal.open}
        onClose={handleEditClose}
        form={editForm}
        onChange={handleEditChange}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default ProductTable;
