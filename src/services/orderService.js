import axios from 'axios';
import config from '../config/apiConfig';

// Configurar interceptor para incluir token de autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

class OrderService {
  // Obtener órdenes pendientes por NFC
  async getPendingOrdersByNFC(nfc) {
    try {
      const response = await axios.get(config.endpoints.ordersPendingByNFC(nfc), {
        headers: getAuthHeaders()
      });
      
      // Devolver las órdenes del array 'orders'
      return response.data.orders || [];
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      throw error;
    }
  }

  // Obtener la orden más antigua pendiente (tomar la primera de la lista)
  async getOldestPendingOrder(nfc) {
    try {
      const orders = await this.getPendingOrdersByNFC(nfc);
      return orders.length > 0 ? orders[0] : null;
    } catch (error) {
      console.error('Error fetching oldest order:', error);
      throw error;
    }
  }

  // Asignar orden específica al NFC
  async assignOrderToNFC(orderId, nfc, dispenserId = null) {
    try {
      const body = dispenserId ? { dispenserId } : {};
      
      const response = await axios.post(config.endpoints.ordersAssignToNFC(orderId, nfc), body, {
        headers: getAuthHeaders()
      });
      
      return response.data.order || response.data;
    } catch (error) {
      console.error('Error assigning order to NFC:', error);
      throw error;
    }
  }

  // Obtener orden actualmente cargada en el NFC
  async getLoadedOrderByNFC(nfc) {
    try {
      const response = await axios.get(config.endpoints.ordersLoadedByNFC(nfc), {
        headers: getAuthHeaders()
      });
      
      return response.data.order || null;
    } catch (error) {
      console.error('Error getting loaded order:', error);
      return null; // No es un error crítico si no hay orden cargada
    }
  }

  // Dispensar orden física (mantener para compatibilidad futura)
  async dispenseOrder(orderId, nfc) {
    try {
      const response = await axios.post(config.endpoints.ordersDispense, {
        order_id: orderId,
        nfc: nfc
      }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error dispensing order:', error);
      throw error;
    }
  }

  // Limpiar orden del NFC (implementar cuando esté disponible en backend)
  async clearNFCOrder(nfc) {
    try {
      // Por ahora, simplemente devolver éxito
      // TODO: Implementar cuando el endpoint esté disponible
      console.log('Clearing NFC order for:', nfc);
      return { success: true };
    } catch (error) {
      console.error('Error clearing NFC order:', error);
      throw error;
    }
  }

  // Obtener detalles de una orden específica
  async getOrderDetails(orderId) {
    try {
      const response = await axios.get(config.endpoints.orderDetails(orderId), {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  // Obtener productos de una orden
  async getOrderProducts(orderId) {
    try {
      const response = await axios.get(config.endpoints.orderProducts(orderId), {
        headers: getAuthHeaders()
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching order products:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
