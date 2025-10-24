// Formatear fecha para mostrar
export const formatOrderDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return `Hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  } else {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

// Formatear precio
export const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`;
};

// Calcular total de orden
export const calculateOrderTotal = (products) => {
  return products.reduce((total, product) => {
    return total + (parseFloat(product.precio) * (product.cantidad || 1));
  }, 0);
};

// Obtener estado visual de la orden
export const getOrderStatusInfo = (status) => {
  const statusMap = {
    'paid': {
      label: 'Pagada',
      color: 'bg-green-100 text-green-800',
      icon: '✓'
    },
    'pending': {
      label: 'Pendiente',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '⏳'
    },
    'dispensed': {
      label: 'Dispensada',
      color: 'bg-blue-100 text-blue-800',
      icon: '📦'
    },
    'cancelled': {
      label: 'Cancelada',
      color: 'bg-red-100 text-red-800',
      icon: '✗'
    }
  };
  
  return statusMap[status] || statusMap['pending'];
};

// Generar ID único para elementos React
export const generateUniqueId = () => {
  return `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Validar NFC
export const isValidNFC = (nfc) => {
  return nfc && typeof nfc === 'string' && nfc.trim().length > 0;
};

// Obtener prioridad visual de la orden
export const getOrderPriority = (index) => {
  const priorities = [
    { label: '1ª Prioridad', color: 'bg-red-500', textColor: 'text-white' },
    { label: '2ª Prioridad', color: 'bg-orange-500', textColor: 'text-white' },
    { label: '3ª Prioridad', color: 'bg-yellow-500', textColor: 'text-white' },
    { label: `${index + 1}ª Prioridad`, color: 'bg-gray-500', textColor: 'text-white' }
  ];
  
  return priorities[Math.min(index, 3)];
};

// Calcular tiempo estimado de dispensado
export const calculateDispenseTime = (productCount) => {
  // Aproximadamente 30 segundos por producto
  const baseTime = 30;
  const totalSeconds = productCount * baseTime;
  
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  } else {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }
};

// Agrupar productos por tipo
export const groupProductsByType = (products) => {
  return products.reduce((groups, product) => {
    const type = product.tipo || 'otros';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(product);
    return groups;
  }, {});
};
