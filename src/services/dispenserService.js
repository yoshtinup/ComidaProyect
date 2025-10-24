// Servicio para operaciones de dispensadores
import config from '../config/apiConfig';

const dispenserService = {
  // Obtener todos los dispensadores
  getDispensers: async function() {
    try {
      const response = await fetch(config.endpoints.dispenserList, {
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
      console.error('Error in getDispensers:', error);
      throw error;
    }
  },

  // Obtener un dispensador específico por ID
  getDispenserById: async function(id) {
    try {
      const response = await fetch(config.endpoints.dispenser(id), {
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
      console.error('Error in getDispenserById:', error);
      throw error;
    }
  },

  // Crear un nuevo dispensador
  createDispenser: async function(dispenserData) {
    try {
      // Debug: Verificar que todas las URLs estén definidas
      console.log('=== DEBUG DISPENSER SERVICE ===');
      console.log('API_BASE_URL:', config.API_BASE_URL);
      console.log('dispenserCreate endpoint:', config.endpoints.dispenserCreate);
      console.log('Config completo:', config);
      
      // Verificar que la URL no sea undefined
      if (!config.endpoints.dispenserCreate) {
        throw new Error('Error de configuración: dispenserCreate endpoint is undefined');
      }
      
      // Estructura correcta según los nuevos requisitos del backend
      const dataToSend = {
        name: dispenserData.name,
        location: dispenserData.location,
        status: dispenserData.status || "active",
        items: dispenserData.items || [] // Array de objetos con { product_id: number }
      };

      console.log('Datos originales recibidos:', dispenserData);
      console.log('Datos transformados para enviar:', dataToSend);
      console.log('URL del endpoint:', config.endpoints.dispenserCreate);
      console.log('Token disponible:', localStorage.getItem('token') ? 'Sí' : 'No');
      
      // Verificar que la URL está bien formada
      const url = config.endpoints.dispenserCreate;
      if (!url || url.includes('undefined')) {
        throw new Error(`URL mal formada: ${url}`);
      }
      
      // Verificar token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }
      
      const response = await fetch(config.endpoints.dispenserCreate, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
      
      console.log('Respuesta del servidor - Status:', response.status);
      console.log('Respuesta del servidor - StatusText:', response.statusText);
      
      if (!response.ok) {
        let errorData;
        let errorText = '';
        
        try {
          errorText = await response.text();
          console.log('Respuesta completa del servidor:', errorText);
          
          try {
            errorData = JSON.parse(errorText);
            console.log('Error data from server:', errorData);
          } catch (parseError) {
            console.log('No se pudo parsear como JSON, respuesta raw:', errorText);
            errorData = { message: errorText || `Error ${response.status}: ${response.statusText}` };
          }
        } catch (textError) {
          console.log('No se pudo obtener el texto de la respuesta:', textError);
          errorData = { message: `Error ${response.status}: ${response.statusText}` };
        }
        
        throw new Error(errorData.message || errorData.error || errorText || `Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Dispensador creado exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error in createDispenser:', error);
      throw error;
    }
  },

  // Actualizar un dispensador
  updateDispenser: async function(id, dispenserData) {
    try {
      const response = await fetch(config.endpoints.dispenser(id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dispenserData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error in updateDispenser:', error);
      throw error;
    }
  },

  // Eliminar un dispensador
  deleteDispenser: async function(id) {
    try {
      const response = await fetch(config.endpoints.dispenser(id), {
        method: 'DELETE',
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
      console.error('Error in deleteDispenser:', error);
      throw error;
    }
  }
};

export default dispenserService;
