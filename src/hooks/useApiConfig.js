// Hook personalizado para usar la configuración de API
import { useMemo } from 'react';
import config from '../config/apiConfig';

export const useApiConfig = () => {
  const apiConfig = useMemo(() => config, []);
  
  return {
    ...apiConfig,
    // Funciones de utilidad adicionales
    isLocal: () => {
      return apiConfig.API_BASE_URL.includes('localhost') || 
             apiConfig.API_BASE_URL.includes('127.0.0.1');
    },
    
    getEnvironment: () => {
      if (apiConfig.API_BASE_URL.includes('localhost') || 
          apiConfig.API_BASE_URL.includes('127.0.0.1')) {
        return 'development';
      }
      return 'production';
    },
    
    // Función para construir URLs personalizadas
    buildUrl: (endpoint, params = {}) => {
      let url = `${apiConfig.API_BASE_URL}${endpoint}`;
      
      if (Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
      }
      
      return url;
    }
  };
};

export default useApiConfig;
