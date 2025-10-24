import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Wifi, WifiOff } from 'lucide-react';
import OrderCard from './OrderCard';
import ConfirmationModal from './ConfirmationModal';
import EmptyState from '../EmptyState';
import TitlePanel from '../title/TitlePanel';
import CineSnacksLoader from '../loader/CineSnacksLoader';
import useOrders from '../../hooks/useOrders';

const OrderList = ({ nfc }) => {
  const { 
    pendingOrders, 
    selectedOrder,
    loading, 
    error, 
    selectOrderForNFC, 
    clearNFCOrder
  } = useOrders(nfc);
  
  const [showModal, setShowModal] = useState(false);
  const [modalOrder, setModalOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleSelectOrder = async (order) => {
    setActionLoading(true);
    try {
      const result = await selectOrderForNFC(order.order_id);
      setModalOrder(result);
      setShowModal(true);
    } catch (error) {
      console.error('Error al seleccionar orden:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearNFC = async () => {
    setActionLoading(true);
    try {
      await clearNFCOrder();
    } catch (error) {
      console.error('Error al limpiar NFC:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (!nfc) {
    return (
      <div className="flex justify-center w-full min-h-screen bg-neutral-50">
        <div className="w-full max-w-4xl px-2 sm:px-4 md:px-10 py-5 flex flex-col gap-4">
          <EmptyState 
            icon="📱" 
            title="NFC no detectado" 
            description="Necesitas un NFC válido para ver las órdenes pendientes" 
            buttonText="Configurar NFC" 
            buttonRoute="/nfc-reference" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full min-h-screen bg-neutral-50">
      <div className="w-full max-w-6xl px-3 sm:px-4 md:px-6 lg:px-10 py-4 md:py-5 flex flex-col gap-3 md:gap-4">
        {/* Header con información del NFC */}
        <div className="p-3 md:p-4">
          <div className="mb-4">
            <TitlePanel.Title title="Gestión de Órdenes NFC" />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                <span className="text-xs md:text-sm text-gray-600">NFC Conectado:</span>
                <span className="font-mono text-xs md:text-sm bg-gray-100 px-2 py-1 rounded">
                  {nfc}
                </span>
              </div>
            </div>
            
            {selectedOrder && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="text-xs md:text-sm text-green-600 font-medium">
                  ✓ Orden #{selectedOrder.order_id} cargada
                </div>
                <button
                  onClick={handleClearNFC}
                  disabled={actionLoading}
                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs md:text-sm transition-colors duration-200 disabled:opacity-50 w-fit"
                >
                  Limpiar NFC
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="space-y-4">
          <TitlePanel.Subtitle subtitle={`Órdenes Pendientes (${pendingOrders.length})`} />
          
          {/* Estados de carga y error */}
          {loading && <CineSnacksLoader />}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-medium">Error:</span>
                <span className="text-red-600">{error}</span>
              </div>
            </div>
          )}

          {/* Lista de órdenes */}
          {!loading && pendingOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
              {pendingOrders.map((order, index) => (
                <OrderCard
                  key={order.order_id}
                  order={order}
                  priority={index + 1}
                  onSelect={() => handleSelectOrder(order)}
                  disabled={actionLoading || (selectedOrder && selectedOrder.order_id !== order.order_id)}
                  isSelected={selectedOrder && selectedOrder.order_id === order.order_id}
                  isLoaded={selectedOrder && selectedOrder.order_id === order.order_id}
                />
              ))}
            </div>
          ) : !loading && (
            <EmptyState 
              icon="📦" 
              title="No hay órdenes pendientes" 
              description={`No se encontraron órdenes pendientes para el NFC ${nfc}`}
              buttonText="Recargar página" 
              onButtonClick={() => window.location.reload()}
            />
          )}
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-medium mb-2">ℹ️ Información del Sistema</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Las órdenes se muestran por orden de prioridad (más antigua = mayor prioridad)</li>
            <li>• Solo puedes cargar una orden a la vez en el NFC</li>
            <li>• Si no seleccionas una orden específica, se dispensará automáticamente la más antigua</li>
            <li>• El tiempo estimado de dispensado es aproximado y puede variar</li>
          </ul>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && modalOrder && (
        <ConfirmationModal 
          order={modalOrder}
          nfc={nfc}
          onClose={() => {
            setShowModal(false);
            setModalOrder(null);
          }}
        />
      )}
    </div>
  );
};

OrderList.propTypes = {
  nfc: PropTypes.string.isRequired
};

export default OrderList;
