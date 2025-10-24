// Función auxiliar para convertir períodos del frontend al backend
function convertPeriodForAPI(period) {
  switch(period) {
    case '1d':
    case 'today': return 'today';
    case '1w':  
    case 'week': return 'week';
    case '1m':
    case 'month': return 'month';
    default: return 'month';
  }
}

import config from '../config/apiConfig';

// Servicio para Analytics
const analyticsService = {
  getDashboard: async function(period = 'month') {
    try {
      const apiPeriod = convertPeriodForAPI(period);
      const response = await fetch(config.endpoints.analyticsDashboard(apiPeriod), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error in getDashboard:', error);
      return {
        summary: { totalRevenue: 0, totalSales: 0 },
        topProducts: [],
        salesMetrics: { totalRevenue: 0, totalSales: 0 }
      };
    }
  },

  getSalesMetrics: async function(period = 'month') {
    try {
      const apiPeriod = convertPeriodForAPI(period);
      const response = await fetch(config.endpoints.analyticsSalesMetrics(apiPeriod), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error in getSalesMetrics:', error);
      return {
        totalRevenue: 0,
        totalSales: 0,
        previousRevenue: 0,
        previousSales: 0
      };
    }
  },

  getTopProducts: async function(period = 'month', limit = 5) {
    try {
      const apiPeriod = convertPeriodForAPI(period);
      const response = await fetch(config.endpoints.analyticsTopProducts(apiPeriod, limit), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getTopProducts:', error);
      return [];
    }
  },

  getSalesSummary: async function(period = 'month') {
    try {
      const apiPeriod = convertPeriodForAPI(period);
      const response = await fetch(config.endpoints.analyticsSalesSummary(apiPeriod), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error in getSalesSummary:', error);
      return {
        totalRevenue: 0,
        totalSales: 0,
        growth: 0
      };
    }
  }
};

export default analyticsService;
