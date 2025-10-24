// Componente principal del formulario para agregar dispensador
import React, { useState } from 'react';
import InputText from '../inputForm/InputText';
import Buttom from '../bottom/Buttom';
import ModalNotificacion from '../modal/ModalNotificacion';

const AddDispenserForm = ({ 
  onSubmit, 
  selectedProducts, 
  loading = false,
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del dispensador es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar ubicación
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación del dispensador es requerida';
    } else if (formData.location.trim().length < 3) {
      newErrors.location = 'La ubicación debe tener al menos 3 caracteres';
    }

    // Validar estado
    if (!formData.status) {
      newErrors.status = 'El estado del dispensador es requerido';
    }

    // Validar productos seleccionados
    if (selectedProducts.length !== 3) {
      newErrors.products = 'Debes seleccionar exactamente 3 productos';
      setModalMessage('Por favor, selecciona exactamente 3 productos para el dispensador');
      setShowModal(true);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Preparar datos del dispensador según la nueva estructura requerida por el backend
    const dispenserData = {
      name: formData.name.trim(),
      location: formData.location.trim(),
      status: formData.status,
      items: selectedProducts.map(product => ({ id: Number(product.id) }))
    };

    console.log('Datos del formulario antes de enviar:', {
      formData,
      selectedProducts: selectedProducts.map(p => ({ id: p.id, nombre: p.nombre })),
      dispenserData,
      token: localStorage.getItem('token') ? 'Token present' : 'No token found'
    });

    // Validaciones adicionales
    if (!formData.name || formData.name.trim().length < 3) {
      setModalMessage('El nombre del dispensador debe tener al menos 3 caracteres');
      setShowModal(true);
      return;
    }

    if (!formData.location || formData.location.trim().length < 3) {
      setModalMessage('La ubicación del dispensador debe tener al menos 3 caracteres');
      setShowModal(true);
      return;
    }

    if (!selectedProducts || selectedProducts.length !== 3) {
      setModalMessage('Debes seleccionar exactamente 3 productos');
      setShowModal(true);
      return;
    }

    // Verificar que todos los IDs sean válidos
    const invalidIds = selectedProducts.filter(product => !product.id || isNaN(Number(product.id)));
    if (invalidIds.length > 0) {
      setModalMessage('Error: IDs de productos inválidos detectados');
      setShowModal(true);
      return;
    }

    onSubmit(dispenserData);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      location: '',
      status: 'active'
    });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Modal de notificación */}
      {showModal && (
        <ModalNotificacion
          mensaje={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Información del Dispensador
        </h2>
        <p className="text-gray-600 text-sm">
          Completa los datos básicos del nuevo dispensador
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo Nombre */}
        <div>
          <InputText
            id="name"
            name="name"
            label="Nombre del Dispensador *"
            placeholder="Ej: Dispensador Entrada, Dispensador Principal"
            value={formData.name}
            onChange={handleInputChange}
            required={true}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Campo Ubicación */}
        <div>
          <InputText
            id="location"
            name="location"
            label="Ubicación del Dispensador *"
            placeholder="Ej: Entrada principal, Sala 1, Piso 2"
            value={formData.location}
            onChange={handleInputChange}
            required={true}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Campo Estado */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Estado del Dispensador *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          >
            <option value="active">Activo (Online)</option>
            <option value="inactive">Inactivo (Offline)</option>
            <option value="maintenance">Mantenimiento</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
          )}
        </div>

        {/* Resumen de productos */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">
            Resumen de Configuración
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nombre:</span>
              <span className="font-medium text-gray-900">
                {formData.name || 'Sin especificar'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className={`font-medium ${
                formData.status === 'active' ? 'text-green-600' : 
                formData.status === 'maintenance' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {formData.status === 'active' ? 'Activo' : 
                 formData.status === 'maintenance' ? 'Mantenimiento' : 'Inactivo'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Productos seleccionados:</span>
              <span className={`font-medium ${
                selectedProducts.length === 3 ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedProducts.length}/3
              </span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <div className="flex-1">
            <Buttom.Buttom1
              contexto={loading ? "Creando..." : "Crear Dispensador"}
              type="submit"
              onClick={() => {}} // El submit se maneja por el form
              disabled={loading}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Limpiar
            </button>
            
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDispenserForm;
