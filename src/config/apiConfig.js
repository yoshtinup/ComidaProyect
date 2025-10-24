// Configuración centralizada de URLs del proyecto

// Primero definimos las URLs base desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const API_CARRITO_URL = import.meta.env.VITE_API_CARRITO_URL || 'http://127.0.0.1:3002';
const IMAGE_SERVER_URL = import.meta.env.VITE_IMAGE_SERVER_URL || 'https://apiempresaimagen.acstree.xyz';
const API_PRODUCTOS_URL = import.meta.env.VITE_API_PRODUCTOS_URL || 'http://apigatewaycinesnack.acstree.xyz';
// Luego creamos el objeto de configuración
const config = {
  // URLs base para diferentes servicios
  API_BASE_URL,
  API_CARRITO_URL,
  IMAGE_SERVER_URL,
  API_PRODUCTOS_URL,
  
  // Endpoints específicos
  endpoints: {
    // API de productos y dispensadores
    dispenser: (id) => `${API_BASE_URL}/api/v1/dispenser/${id}`,
    dispenserList: `${API_BASE_URL}/api/v1/dispenser/`,
    dispenserCreate: `${API_BASE_URL}/api/v1/dispenser`,
    productos: `${API_BASE_URL}/api/v1/producto`,
    producto: (id) => `${API_BASE_URL}/api/v1/producto/${id}`,
    productoUpdate: (id) => `${API_BASE_URL}/api/v1/producto/${id}`,
    productoDelete: (id) => `${API_BASE_URL}/api/v1/producto/${id}`,
    // Product registration using the main API
    productoRegister: `${API_BASE_URL}/api/v1/producto`,
    // Alternative product endpoints for legacy compatibility (using IMAGE_SERVER_URL)
    productoUpdateAlt: (id) => `${API_PRODUCTOS_URL}/actualizar-producto/${id}`,
    productoDeleteAlt: (id) => `${API_PRODUCTOS_URL}/eliminar-producto/${id}`,
    productoRegisterAlt: `${API_PRODUCTOS_URL}/registrar-producto`,
    productosByIds: `${API_BASE_URL}/api/v1/pago/productos/by-ids`,
    
    // API de carrito
    carritoList: `${API_CARRITO_URL}/api/v1/carrito`,
    carritoByUser: (userId) => `${API_CARRITO_URL}/api/v1/carrito/user/${userId}`,
    carritoAdd: `${API_CARRITO_URL}/api/v1/carrito`,
    carritoUpdate: (itemId) => `${API_CARRITO_URL}/api/v1/carrito/${itemId}`,
    carritoDelete: (itemId) => `${API_CARRITO_URL}/api/v1/carrito/${itemId}`,
    
    // API de autenticación y usuarios
    userRegister: `${API_BASE_URL}/api/v1/user`,
    userLogin: `${API_CARRITO_URL}/api/v1/loginUser`,
    userUpdateNfc: (userId) => `${API_BASE_URL}/api/v1/user/${userId}/nfc`,
    googleAuth: `${API_BASE_URL}/api/v1/auth/google`,
    
    // API de pagos y órdenes
    payment: `${API_CARRITO_URL}/api/v1/payment`,
    paymentComplete: `${API_BASE_URL}/api/v1/pago/complete`,
    ordersByUser: (userId) => `${API_BASE_URL}/api/v1/pago/user/${userId}`,
    ordersPendingByNFC: (nfc) => `${API_BASE_URL}/api/v1/pago/nfc/${nfc}/pending`,
    ordersAssignToNFC: (orderId, nfc) => `${API_BASE_URL}/api/v1/pago/select/${orderId}/nfc/${nfc}`,
    ordersLoadedByNFC: (nfc) => `${API_BASE_URL}/api/v1/pago/nfc/${nfc}/ready`,
    ordersDispense: `${API_BASE_URL}/api/v1/orders/dispense`,
    orderDetails: (orderId) => `${API_BASE_URL}/api/v1/orders/${orderId}`,
    orderProducts: (orderId) => `${API_BASE_URL}/api/v1/orders/${orderId}/products`,
    
    // API de transacciones y NFC
    transactions: `${API_BASE_URL}/api/v1/transactions`,
    nfc: (tokenId) => `${API_BASE_URL}/api/v1/nfc/${tokenId}`,
    
    // API de analytics
    analyticsDashboard: (period) => `${API_BASE_URL}/api/v1/analytics/dashboard?period=${period}`,
    analyticsTopProducts: (period, limit) => `${API_BASE_URL}/api/v1/analytics/top-products?period=${period}&limit=${limit}`,
    analyticsSalesMetrics: (period) => `${API_BASE_URL}/api/v1/analytics/sales-metrics?period=${period}`,
    analyticsSalesSummary: (period) => `${API_BASE_URL}/api/v1/analytics/sales-summary?period=${period}`,
    
    // Servidor de imágenes
    productImage: (imageName) => `${IMAGE_SERVER_URL}/imagen/${imageName}`,
    
    // URLs alternativas comentadas para referencia
    // productImageLocal: (imageName) => `http://localhost:3000/imagenes/${imageName}`,
  },
  
  // Configuración adicional
  settings: {
    defaultTimeout: 10000,
    retryAttempts: 3,
  }
};

export default config;
