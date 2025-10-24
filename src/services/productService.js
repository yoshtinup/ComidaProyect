// Servicio para operaciones de productos
import config from '../config/apiConfig';

const productService = {
  // Obtener todos los productos
  getProducts: async function() {
    try {
      const response = await fetch(config.endpoints.productos, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  },

  // Obtener productos por IDs específicos
  getProductsByIds: async function(ids) {
    try {
      const response = await fetch(config.endpoints.productosByIds, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids })
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error in getProductsByIds:', error);
      throw error;
    }
  },

  // Obtener un producto específico por ID
  getProductById: async function(id) {
    try {
      const response = await fetch(`${config.endpoints.productos}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error in getProductById:', error);
      throw error;
    }
  },

  // Obtener URL de imagen de producto
  getProductImageUrl: function(imageName) {
    return config.endpoints.productImage(imageName);
  }
};

export default productService;
