// Página principal para agregar un nuevo dispensador
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../componets/HeaderAdmin';
import TitlePanel from '../componets/title/TitlePanel';
import AddDispenserForm from '../componets/Dispenser/AddDispenserForm';
import ProductSelector from '../componets/Dispenser/ProductSelector';
import SelectedProductsList from '../componets/Dispenser/SelectedProductsList';
import CineSnacksLoader from '../componets/loader/CineSnacksLoader';
import ModalNotificacion from '../componets/modal/ModalNotificacion';
import { useProducts } from '../hooks/useProducts';
import { useDispenser } from '../hooks/useDispenser';

const AddDispenserPage = () => {
  const navigate = useNavigate();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { createDispenser, creating } = useDispenser();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // 1: Seleccionar productos, 2: Completar formulario
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const MAX_PRODUCTS = 3;

  // Manejar selección de productos
  const handleProductSelect = (product) => {
    if (selectedProducts.length >= MAX_PRODUCTS) {
      setModalMessage(`Solo puedes seleccionar ${MAX_PRODUCTS} productos`);
      setShowErrorModal(true);
      return;
    }

    setSelectedProducts(prev => [...prev, product]);
  };

  // Manejar eliminación de productos seleccionados
  const handleProductRemove = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Manejar envío del formulario
  const handleFormSubmit = async (dispenserData) => {
    try {
      console.log('Iniciando creación de dispensador con datos:', dispenserData);
      console.log('Productos seleccionados:', selectedProducts);
      
      const newDispenser = await createDispenser(dispenserData);
      
      setModalMessage(`Dispensador "${dispenserData.name}" creado exitosamente con estado "${dispenserData.status}"`);
      setShowSuccessModal(true);
      
      // Reset form después de éxito
      setSelectedProducts([]);
      setCurrentStep(1);
      
    } catch (error) {
      console.error('Error completo en handleFormSubmit:', error);
      console.error('Stack trace:', error.stack);
      console.error('Message:', error.message);
      
      let errorMessage = 'Error al crear el dispensador: ';
      if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Error desconocido';
      }
      
      setModalMessage(errorMessage);
      setShowErrorModal(true);
    }
  };

  // Manejar navegación entre pasos
  const handleNextStep = () => {
    if (selectedProducts.length !== MAX_PRODUCTS) {
      setModalMessage(`Debes seleccionar exactamente ${MAX_PRODUCTS} productos antes de continuar`);
      setShowErrorModal(true);
      return;
    }
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  // Manejar cierre de modal de éxito
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/panel-admin'); // Redirigir al panel de administración
  };

  // Manejar cancelación
  const handleCancel = () => {
    navigate('/panel-admin');
  };

  if (productsLoading) {
    return (
      <div>
        <HeaderAdmin />
        <CineSnacksLoader texto="Cargando productos disponibles..." />
      </div>
    );
  }

  if (productsError) {
    return (
      <div>
        <HeaderAdmin />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error al cargar productos</h3>
            <p className="text-red-600 text-sm mt-1">{productsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderAdmin />
      
      {/* Modales de notificación */}
      {showSuccessModal && (
        <ModalNotificacion
          mensaje={modalMessage}
          onClose={handleSuccessModalClose}
        />
      )}
      
      {showErrorModal && (
        <ModalNotificacion
          mensaje={modalMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Título y descripción */}
        <TitlePanel.Title title="Agregar Nuevo Dispensador" />
        <div className="mb-6">
          <p className="text-gray-600 text-lg max-w-3xl">
            Configura un nuevo dispensador seleccionando exactamente 3 productos y 
            completando la información básica. El dispensador se activará automáticamente 
            una vez creado.
          </p>
        </div>

        {/* Indicador de progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Seleccionar Productos</span>
            </div>
            
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            
            <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Información del Dispensador</span>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna principal - Selector de productos o Formulario */}
          <div className="lg:col-span-2">
            {currentStep === 1 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <ProductSelector
                  products={products}
                  selectedProducts={selectedProducts}
                  onProductSelect={handleProductSelect}
                  maxProducts={MAX_PRODUCTS}
                  loading={productsLoading}
                />
                
                {/* Botón para continuar */}
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  
                  <button
                    onClick={handleNextStep}
                    disabled={selectedProducts.length !== MAX_PRODUCTS}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                      selectedProducts.length === MAX_PRODUCTS
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <AddDispenserForm
                  onSubmit={handleFormSubmit}
                  selectedProducts={selectedProducts}
                  loading={creating}
                  onCancel={handleCancel}
                />
                
                {/* Botón para volver atrás */}
                <div className="mt-4">
                  <button
                    onClick={handlePrevStep}
                    disabled={creating}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    ← Volver a selección de productos
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Columna lateral - Lista de productos seleccionados */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <SelectedProductsList
                selectedProducts={selectedProducts}
                onRemove={handleProductRemove}
                maxProducts={MAX_PRODUCTS}
              />
            </div>
          </div>
        </div>

        {/* Loader overlay durante la creación */}
        {creating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <CineSnacksLoader texto="Creando dispensador..." />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDispenserPage;
