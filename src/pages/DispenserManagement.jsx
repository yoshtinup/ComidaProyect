// Página principal para gestionar dispensado        setNotificationMessage(`Dispensador "${dispenserToDelete?.dispenser_id || dispenserToDelete?.id}" eliminado exitosamente`);es
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../componets/HeaderAdmin';
import Footer from '../organismo/Footer';
import DispenserList from '../componets/Dispenser/DispenserList';
import ModalConfirmacion from '../componets/modal/ModalConfirmacion';
import ModalNotificacion from '../componets/modal/ModalNotificacion';
import { useDispenser } from '../hooks/useDispenser';

const DispenserManagement = () => {
  const navigate = useNavigate();
  const { 
    dispensers, 
    loading, 
    error, 
    fetchDispensers, 
    deleteDispenser, 
    updateDispenser 
  } = useDispenser();

  // Estados para modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dispenserToDelete, setDispenserToDelete] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  // Cargar dispensadores al montar el componente
  useEffect(() => {
    fetchDispensers();
  }, []);

  // Manejar eliminación de dispensador
  const handleDeleteClick = (dispenser) => {
    setDispenserToDelete(dispenser);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!dispenserToDelete) return;

    try {
      await deleteDispenser(dispenserToDelete.id);
      
      setNotificationMessage(`Dispensador "${dispenserToDelete.name}" eliminado exitosamente`);
      setNotificationType('success');
      setShowNotification(true);
      
      // Actualizar la lista
      fetchDispensers();
    } catch (error) {
      console.error('Error al eliminar dispensador:', error);
      setNotificationMessage(`Error al eliminar el dispensador: ${error.message}`);
      setNotificationType('error');
      setShowNotification(true);
    } finally {
      setShowDeleteModal(false);
      setDispenserToDelete(null);
    }
  };

  // Manejar edición de dispensador
  const handleEditClick = (dispenser) => {
    // Navegar a página de edición con el ID del dispensador
    navigate(`/edit-dispenser/${dispenser.id}`);
  };

  // Manejar actualización de lista
  const handleRefresh = () => {
    fetchDispensers();
    setNotificationMessage('Lista de dispensadores actualizada');
    setNotificationType('success');
    setShowNotification(true);
  };

  // Manejar cambio de estado del dispensador
  const handleStatusChange = async (dispenserId, newStatus) => {
    try {
      await updateDispenser(dispenserId, { status: newStatus });
      
      setNotificationMessage(`Estado del dispensador actualizado a "${newStatus}"`);
      setNotificationType('success');
      setShowNotification(true);
      
      // Actualizar la lista
      fetchDispensers();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      setNotificationMessage(`Error al actualizar el estado: ${error.message}`);
      setNotificationType('error');
      setShowNotification(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderAdmin />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado de la página */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Dispensadores
              </h1>
              <p className="text-gray-600 mt-2">
                Administra todos tus dispensadores desde un solo lugar
              </p>
            </div>
            
            {/* Estadísticas rápidas */}
            <div className="hidden lg:flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {dispensers?.filter(d => d.status === 'active').length || 0}
                </div>
                <div className="text-sm text-gray-600">Activos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {dispensers?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {dispensers?.filter(d => d.status === 'offline').length || 0}
                </div>
                <div className="text-sm text-gray-600">Desconectados</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">
                Error al cargar dispensadores: {error}
              </span>
            </div>
          </div>
        )}

        <DispenserList
          dispensers={dispensers}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onRefresh={handleRefresh}
          onStatusChange={handleStatusChange}
        />

        {/* Acciones flotantes para móvil */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <button
            onClick={() => navigate('/add-dispenser')}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
            title="Agregar dispensador"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </main>

      <Footer />

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <ModalConfirmacion
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDispenserToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Eliminar Dispensador"
          message={
            <>
              ¿Estás seguro de que deseas eliminar el dispensador{' '}
              <strong>"{dispenserToDelete?.dispenser_id || dispenserToDelete?.id}"</strong>?
              <br />
              <br />
              <span className="text-red-600 text-sm">
                Esta acción no se puede deshacer y eliminará toda la configuración
                del dispensador.
              </span>
            </>
          }
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
        />
      )}

      {/* Modal de notificación */}
      {showNotification && (
        <ModalNotificacion
          isOpen={showNotification}
          onClose={() => setShowNotification(false)}
          message={notificationMessage}
          type={notificationType}
          autoClose={3000}
        />
      )}
    </div>
  );
};

export default DispenserManagement;
