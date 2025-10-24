// Servicio para Reportes de Productos y Ventas
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

const reportsService = {
  /**
   * Obtiene los productos más vendidos
   * @param {Object} options - Opciones de filtrado
   * @param {number} options.limit - Número de productos a obtener (default: 10)
   * @param {string} options.period - Período de tiempo ('all', 'week', 'month', 'year', etc.)
   */
  getBestSellingProducts: async function(options = {}) {
    try {
      const { limit = 10, period = 'all' } = options;
      
      console.log(`🚀 Obteniendo productos más vendidos - Límite: ${limit}, Período: ${period}`);
      
      const url = `${API_BASE_URL}/api/v1/reports/best-selling-products?limit=${limit}&period=${period}`;
      console.log(`📡 URL completa : ${url}`);
      console.log(`📡 API_BASE_URL: ${API_BASE_URL}`);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error response body: ${errorText}`);
        
        // Si es un bad request para período específico, intentar con fallback
        if (response.status === 400 && period === 'day') {
          console.log('🔄 Reintentando con período "week" como fallback...');
          return await this.getBestSellingProducts({ limit, period: 'week' });
        }
        
        // Para otros errores, devolver datos vacíos en lugar de fallar
        console.warn(`⚠️ Usando datos de fallback para período: ${period}`);
        return {
          products: [],
          summary: {
            total_products_analyzed: 0,
            total_quantity_sold: 0,
            total_revenue: 0,
            period: period,
            generated_at: new Date().toISOString()
          }
        };
      }

      const result = await response.json();
      console.log('📊 Productos más vendidos obtenidos:', result);
      
      if (!result.success || !result.data) {
        console.warn('⚠️ Respuesta inválida, usando datos vacíos');
        return {
          products: [],
          summary: {
            total_products_analyzed: 0,
            total_quantity_sold: 0,
            total_revenue: 0,
            period: period,
            generated_at: new Date().toISOString()
          }
        };
      }

      return result.data;
      
    } catch (error) {
      console.error('❌ Error al obtener productos más vendidos:', error);
      
      // Devolver datos vacíos en lugar de fallar completamente
      return {
        products: [],
        summary: {
          total_products_analyzed: 0,
          total_quantity_sold: 0,
          total_revenue: 0,
          period: options.period || 'all',
          generated_at: new Date().toISOString()
        }
      };
    }
  },

  /**
   * Obtiene el resumen de ventas
   * @param {Object} options - Opciones de filtrado
   * @param {string} options.period - Período de tiempo ('week', 'month', 'year', etc.)
   */
  getSalesSummary: async function(options = {}) {
    try {
      const { period = 'month' } = options;
      
      console.log(`🚀 Obteniendo resumen de ventas - Período: ${period}`);
      
      const url = `${API_BASE_URL}/api/v1/reports/sales-summary?period=${period}`;
      console.log(`📡 URL: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`📡 Sales Summary Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Sales Summary Error response body: ${errorText}`);
        
        // Si es un bad request para período específico, intentar con fallback
        if (response.status === 400 && period === 'day') {
          console.log('🔄 Reintentando Sales Summary con período "week" como fallback...');
          return await this.getSalesSummary({ period: 'week' });
        }
        
        // Para otros errores, devolver datos vacíos
        console.warn(`⚠️ Usando datos de fallback para Sales Summary, período: ${period}`);
        return {
          summary: {
            period: period,
            total_products_sold: 0,
            total_revenue: 0,
            top_product: null,
            product_diversity: 0,
            average_order_value: 0,
            generated_at: new Date().toISOString()
          },
          top_products: []
        };
      }

      const result = await response.json();
      console.log('📊 Resumen de ventas obtenido:', result);
      
      if (!result.success || !result.data) {
        console.warn('⚠️ Sales Summary respuesta inválida, usando datos vacíos');
        return {
          summary: {
            period: period,
            total_products_sold: 0,
            total_revenue: 0,
            top_product: null,
            product_diversity: 0,
            average_order_value: 0,
            generated_at: new Date().toISOString()
          },
          top_products: []
        };
      }

      return result.data;
      
    } catch (error) {
      console.error('❌ Error al obtener resumen de ventas:', error);
      
      // Devolver datos vacíos en lugar de fallar
      return {
        summary: {
          period: options.period || 'month',
          total_products_sold: 0,
          total_revenue: 0,
          top_product: null,
          product_diversity: 0,
          average_order_value: 0,
          generated_at: new Date().toISOString()
        },
        top_products: []
      };
    }
  },

  /**
   * Mapea el período del UI al formato esperado por la API
   * @param {string} uiPeriod - Período del UI ('today', 'week', 'month', '1w', '1m', '3m', '1y', 'all')
   */
  mapPeriodToAPI: function(uiPeriod) {
    const periodMap = {
      // Mapeo para EtiquetasFiltroInteractive
      'today': 'week', // Cambiar 'day' por 'week' ya que la API no soporta 'day'
      'week': 'week',
      'month': 'month',
      // Mapeo para otros componentes  
      '1w': 'week',
      '1m': 'month', 
      '3m': 'quarter',
      '1y': 'year',
      'all': 'all'
    };
    
    return periodMap[uiPeriod] || 'month';
  },

  /**
   * Obtiene datos combinados de productos y ventas
   * @param {Object} options - Opciones de filtrado
   */
  getCombinedData: async function(options = {}) {
    try {
      const { period = 'month', limit = 10 } = options;
      const apiPeriod = this.mapPeriodToAPI(period);
      
      console.log(`🚀 Obteniendo datos combinados - Período UI: ${period}, API: ${apiPeriod}`);
      
      // Hacer ambas llamadas en paralelo con manejo de errores individual
      const [bestSellingProducts, salesSummary] = await Promise.allSettled([
        this.getBestSellingProducts({ limit, period: apiPeriod }),
        this.getSalesSummary({ period: apiPeriod })
      ]);
      
      // Manejar resultados de Promise.allSettled
      const products = bestSellingProducts.status === 'fulfilled' 
        ? bestSellingProducts.value 
        : {
            products: [],
            summary: {
              total_products_analyzed: 0,
              total_quantity_sold: 0,
              total_revenue: 0,
              period: apiPeriod,
              generated_at: new Date().toISOString()
            }
          };
      
      const sales = salesSummary.status === 'fulfilled' 
        ? salesSummary.value 
        : {
            summary: {
              period: apiPeriod,
              total_products_sold: 0,
              total_revenue: 0,
              top_product: null,
              product_diversity: 0,
              average_order_value: 0,
              generated_at: new Date().toISOString()
            },
            top_products: []
          };
      
      return {
        bestSellingProducts: products,
        salesSummary: sales,
        period: apiPeriod,
        uiPeriod: period
      };
      
    } catch (error) {
      console.error('❌ Error al obtener datos combinados:', error);
      
      // Retornar estructura de datos vacía en lugar de fallar
      return {
        bestSellingProducts: {
          products: [],
          summary: {
            total_products_analyzed: 0,
            total_quantity_sold: 0,
            total_revenue: 0,
            period: this.mapPeriodToAPI(options.period || 'month'),
            generated_at: new Date().toISOString()
          }
        },
        salesSummary: {
          summary: {
            period: this.mapPeriodToAPI(options.period || 'month'),
            total_products_sold: 0,
            total_revenue: 0,
            top_product: null,
            product_diversity: 0,
            average_order_value: 0,
            generated_at: new Date().toISOString()
          },
          top_products: []
        },
        period: this.mapPeriodToAPI(options.period || 'month'),
        uiPeriod: options.period || 'month'
      };
    }
  },

  /**
   * Obtiene distribución gaussiana de tiempos de entrega
   * @param {Object} options - Opciones de análisis
   * @param {string} options.period - Período de análisis ('week', 'month', 'year', 'all')
   * @param {number} options.target_time - Tiempo objetivo en minutos (default: 15)
   * @param {number} options.confidence_level - Nivel de confianza (default: 95)
   * @param {number} options.data_points - Número de puntos para la curva (default: 50)
   */
  getDeliveryTimeDistribution: async function(options = {}) {
    try {
      const { 
        period = 'week', 
        target_time = 15, 
        confidence_level = 95,
        data_points = 50 
      } = options;
      
      console.log(`🔔 Obteniendo distribución gaussiana - Período: ${period}, Objetivo: ${target_time}min`);
      
      const params = new URLSearchParams({
        period,
        target_time,
        confidence_level,
        data_points
      });
      
      const url = `${API_BASE_URL}/api/v1/analytics/delivery-time-distribution?${params}`;
      console.log(`📡 URL Gaussiana: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`📡 Gaussian Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Gaussian Error response: ${errorText}`);
        
        // Datos de fallback para desarrollo
        console.warn('⚠️ Usando datos de fallback para distribución gaussiana');
        return {
          mean: 14.5,
          std_deviation: 3.2,
          sample_size: 150,
          data_points: this.generateMockGaussianData(14.5, 3.2, data_points),
          probability_within_target: 0.68,
          confidence_intervals: {
            "68_percent": [11.3, 17.7],
            "95_percent": [8.1, 20.9]
          }
        };
      }

      const result = await response.json();
      console.log('📊 Distribución gaussiana obtenida:', result);
      
      if (!result.success || !result.data) {
        console.warn('⚠️ Respuesta gaussiana inválida, usando datos de fallback');
        return {
          mean: 14.5,
          std_deviation: 3.2,
          sample_size: 150,
          data_points: this.generateMockGaussianData(14.5, 3.2, data_points),
          probability_within_target: 0.68,
          confidence_intervals: {
            "68_percent": [11.3, 17.7],
            "95_percent": [8.1, 20.9]
          }
        };
      }

      return result.data;
      
    } catch (error) {
      console.error('❌ Error al obtener distribución gaussiana:', error);
      
      // Datos de fallback en caso de error
      const { data_points = 50 } = options;
      return {
        mean: 14.5,
        std_deviation: 3.2,
        sample_size: 150,
        data_points: this.generateMockGaussianData(14.5, 3.2, data_points),
        probability_within_target: 0.68,
        confidence_intervals: {
          "68_percent": [11.3, 17.7],
          "95_percent": [8.1, 20.9]
        }
      };
    }
  },

  /**
   * Obtiene distribución gaussiana de valores de órdenes
   * @param {Object} options - Opciones de análisis
   */
  getOrderValueDistribution: async function(options = {}) {
    try {
      const { period = 'month', target_value = 100 } = options;
      
      console.log(`💰 Obteniendo distribución de valores de orden - Período: ${period}, Objetivo: $${target_value}`);
      
      const params = new URLSearchParams({
        period,
        target_value
      });
      
      const url = `${API_BASE_URL}/api/v1/gaussian/order-value-distribution?${params}`;
      console.log(`📡 URL Order Value: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`📡 Order Value Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('💰 Distribución de valores obtenida:', result);
      
      return result.data;
      
    } catch (error) {
      console.error('❌ Error al obtener distribución de valores:', error);
      throw error;
    }
  },

  /**
   * Obtiene distribución gaussiana de productos por orden
   * @param {Object} options - Opciones de análisis
   */
  getProductsPerOrderDistribution: async function(options = {}) {
    try {
      const { period = 'month', target_quantity = 3 } = options;
      
      console.log(`📦 Obteniendo distribución productos por orden - Período: ${period}, Objetivo: ${target_quantity}`);
      
      const params = new URLSearchParams({
        period,
        target_quantity
      });
      
      const url = `${API_BASE_URL}/api/v1/gaussian/products-per-order-distribution?${params}`;
      console.log(`📡 URL Products Per Order: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`📡 Products Per Order Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📦 Distribución productos obtenida:', result);
      
      return result.data;
      
    } catch (error) {
      console.error('❌ Error al obtener distribución de productos:', error);
      throw error;
    }
  },

  /**
   * Obtiene resumen completo de analytics gaussianos
   * @param {Object} options - Opciones de análisis
   */
  getBusinessSummary: async function(options = {}) {
    try {
      const { period = 'month' } = options;
      
      console.log(`📊 Obteniendo resumen de negocio - Período: ${period}`);
      
      const params = new URLSearchParams({ period });
      
      const url = `${API_BASE_URL}/api/v1/gaussian/business-summary?${params}`;
      console.log(`📡 URL Business Summary: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`📡 Business Summary Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📊 Resumen de negocio obtenido:', result);
      
      return result.data;
      
    } catch (error) {
      console.error('❌ Error al obtener resumen de negocio:', error);
      throw error;
    }
  },

  /**
   * Genera datos mock para distribución gaussiana (para desarrollo)
   * @param {number} mean - Media
   * @param {number} stdDev - Desviación estándar
   * @param {number} points - Número de puntos
   */
  generateMockGaussianData: function(mean, stdDev, points = 50) {
    const data = [];
    const minX = mean - 3 * stdDev;
    const maxX = mean + 3 * stdDev;
    const step = (maxX - minX) / points;
    
    for (let x = minX; x <= maxX; x += step) {
      // Función de densidad gaussiana
      const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
      const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
      const probability = coefficient * Math.exp(exponent);
      
      data.push({
        x: Math.round(x * 10) / 10,
        probability: Math.round(probability * 1000000) / 1000000
      });
    }
    
    return data;
  }
};

export default reportsService;
