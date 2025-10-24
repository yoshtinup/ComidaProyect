import { useState, useCallback } from 'react';
import { orderService } from '../services/orderService';

const useNFC = () => {
  const [nfcData, setNfcData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  // Simular escaneo de NFC (en tu caso probablemente viene del localStorage o props)
  const scanNFC = useCallback(async () => {
    setIsScanning(true);
    setError(null);
    
    try {
      // En tu implementación real, esto vendría del localStorage o del contexto
      const nfc = localStorage.getItem('nfc');
      if (!nfc) {
        throw new Error('NFC no encontrado');
      }
      
      setNfcData(nfc);
      return nfc;
    } catch (err) {
      setError('Error al leer NFC');
      console.error('Error scanning NFC:', err);
      throw err;
    } finally {
      setIsScanning(false);
    }
  }, []);

  // Dispensar orden física (cuando se escanea el NFC físicamente)
  const dispenseOrder = useCallback(async (nfc) => {
    setIsScanning(true);
    setError(null);
    
    try {
      // Obtener la orden cargada en el NFC
      const loadedOrder = await orderService.getLoadedOrderByNFC(nfc);
      
      if (loadedOrder) {
        // Dispensar la orden específica
        await orderService.dispenseOrder(loadedOrder.order_id, nfc);
        return loadedOrder;
      } else {
        // Si no hay orden cargada, tomar la más antigua
        const oldestOrder = await orderService.getOldestPendingOrder(nfc);
        if (oldestOrder) {
          await orderService.dispenseOrder(oldestOrder.order_id, nfc);
          return oldestOrder;
        } else {
          throw new Error('No hay órdenes pendientes para dispensar');
        }
      }
    } catch (err) {
      setError('Error al dispensar la orden');
      console.error('Error dispensing order:', err);
      throw err;
    } finally {
      setIsScanning(false);
    }
  }, []);

  // Limpiar datos NFC
  const clearNFC = useCallback(() => {
    setNfcData(null);
    setError(null);
  }, []);

  return {
    nfcData,
    isScanning,
    error,
    scanNFC,
    dispenseOrder,
    clearNFC
  };
};

export default useNFC;
