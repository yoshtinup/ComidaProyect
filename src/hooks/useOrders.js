import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService';

const useOrders = (nfc) => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener órdenes pendientes para un NFC específico
  const fetchPendingOrders = useCallback(async () => {
    if (!nfc) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const orders = await orderService.getPendingOrdersByNFC(nfc);
      setPendingOrders(orders);
    } catch (err) {
      setError('Error al cargar las órdenes pendientes');
      console.error('Error fetching pending orders:', err);
    } finally {
      setLoading(false);
    }
  }, [nfc]);

  // Seleccionar orden para cargar al NFC
  const selectOrderForNFC = useCallback(async (orderId, dispenserId = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await orderService.assignOrderToNFC(orderId, nfc, dispenserId);
      setSelectedOrder(result);
      
      // Actualizar la lista después de seleccionar
      await fetchPendingOrders();
      
      return result;
    } catch (err) {
      setError('Error al seleccionar la orden');
      console.error('Error selecting order:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [nfc, fetchPendingOrders]);

  // Obtener la orden actualmente cargada en el NFC
  const getCurrentLoadedOrder = useCallback(async () => {
    if (!nfc) return null;
    
    try {
      const loadedOrder = await orderService.getLoadedOrderByNFC(nfc);
      setSelectedOrder(loadedOrder);
      return loadedOrder;
    } catch (err) {
      console.error('Error getting loaded order:', err);
      return null;
    }
  }, [nfc]);

  // Limpiar orden del NFC
  const clearNFCOrder = useCallback(async () => {
    if (!nfc) return;
    
    setLoading(true);
    try {
      await orderService.clearNFCOrder(nfc);
      setSelectedOrder(null);
      await fetchPendingOrders();
    } catch (err) {
      setError('Error al limpiar el NFC');
      console.error('Error clearing NFC:', err);
    } finally {
      setLoading(false);
    }
  }, [nfc, fetchPendingOrders]);

  // Refrescar datos
  const refreshOrders = useCallback(async () => {
    await Promise.all([
      fetchPendingOrders(),
      getCurrentLoadedOrder()
    ]);
  }, [fetchPendingOrders, getCurrentLoadedOrder]);

  // Cargar datos iniciales
  useEffect(() => {
    if (nfc) {
      refreshOrders();
    }
  }, [nfc, refreshOrders]);

  return {
    pendingOrders,
    selectedOrder,
    loading,
    error,
    selectOrderForNFC,
    clearNFCOrder,
    getCurrentLoadedOrder
  };
};

export default useOrders;
