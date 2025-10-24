// Servicio para Analytics - API de Análisis Probabilístico
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api/v1';

const analyticsService = {
  getDashboard: async function(period = 'month', analysisType = 'sales', timeGranularity = 'weekly') {
    try {
      console.log(`🚀 Llamando a API de probabilidad - Período: ${period}, Tipo: ${analysisType}, Granularidad: ${timeGranularity}`);
      
      const url = `${API_BASE_URL}/api/v1/analytics/probability?period=${period}${analysisType !== 'sales' ? `&analysisType=${analysisType}` : ''}${timeGranularity !== 'weekly' ? `&timeGranularity=${timeGranularity}` : ''}`;
      console.log(`📡 URL de API: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📊 Respuesta de API de probabilidad:', result);
      
      if (!result.success || !result.data) {
        throw new Error('Respuesta inválida de la API');
      }

      const data = result.data;
      
      // Adaptar la respuesta de probability API al formato esperado por el dashboard
      return {
        // Extraer métricas de ventas
        salesSummary: {
          totalRevenue: data.visualization?.barChart?.datasets?.find(d => d.name === 'Ingresos')?.data?.reduce((a, b) => a + b, 0) || 0,
          totalSales: data.visualization?.barChart?.datasets?.find(d => d.name === 'Órdenes')?.data?.reduce((a, b) => a + b, 0) || 0,
          averageOrderValue: data.confidenceIntervals?.['95%']?.mean || 0,
          growthPercentage: data.trends?.changePercent || 0,
          dataPoints: data.dataPoints || 0,
          period: data.period,
          analysisType: data.analysisType
        },
        
        // Gráficos adaptados
        visualization: {
          charts: {
            barChart: data.visualization?.barChart || { labels: [], datasets: [] },
            lineChart: data.visualization?.lineChart || { labels: [], datasets: [] },
            pieChart: data.visualization?.pieChart || { labels: [], datasets: [] },
            histogramData: data.visualization?.histogramData || null,
            scatterPlot: data.visualization?.scatterPlot || null,
            boxPlot: data.visualization?.boxPlot || null
          }
        },
        
        // Recomendaciones directas
        recommendations: data.recommendations || [],
        
        // Estadísticas extraídas de los datos de probabilidad
        statistics: {
          centralTendency: {
            mean: data.confidenceIntervals?.['95%']?.mean || 0,
            median: data.visualization?.boxPlot?.stats?.median || 0,
            mode: 0
          },
          dispersion: {
            standardDeviation: data.confidenceIntervals?.['95%']?.marginOfError || 0,
            variance: Math.pow(data.confidenceIntervals?.['95%']?.marginOfError || 0, 2),
            range: (data.visualization?.boxPlot?.stats?.max || 0) - (data.visualization?.boxPlot?.stats?.min || 0),
            coefficientOfVariation: 0
          },
          shape: {
            skewness: 0,
            skewnessInterpretation: '',
            kurtosis: 0,
            kurtosisInterpretation: ''
          },
          percentiles: {
            25: data.visualization?.boxPlot?.stats?.q1 || 0,
            50: data.visualization?.boxPlot?.stats?.median || 0,
            75: data.visualization?.boxPlot?.stats?.q3 || 0,
            90: data.confidenceIntervals?.['90%']?.upper || 0,
            95: data.confidenceIntervals?.['95%']?.upper || 0,
            99: data.confidenceIntervals?.['99%']?.upper || 0
          },
          basic: {
            count: data.dataPoints || 0,
            sum: data.visualization?.barChart?.datasets?.find(d => d.name === 'Ingresos')?.data?.reduce((a, b) => a + b, 0) || 0,
            min: data.visualization?.boxPlot?.stats?.min || 0,
            max: data.visualization?.boxPlot?.stats?.max || 0
          }
        },
        
        // Nuevos datos específicos de análisis probabilístico
        probabilityAnalysis: {
          predictions: data.predictions || {},
          confidenceIntervals: data.confidenceIntervals || {},
          trends: data.trends || {},
          metadata: data.metadata || {}
        }
      };
    } catch (error) {
      console.error('❌ Error en getDashboard:', error);
      
      // Datos de fallback cuando la API no está disponible
      return {
        salesSummary: {
          totalRevenue: 0,
          totalSales: 0,
          averageOrderValue: 0,
          growthPercentage: 0,
          dataPoints: 0,
          period: period,
          analysisType: analysisType
        },
        visualization: {
          charts: {
            barChart: { labels: [], datasets: [] },
            lineChart: { labels: [], datasets: [] },
            pieChart: { labels: ['Sin datos'], datasets: [{ name: 'Sin datos', data: [1] }] },
            histogramData: null,
            scatterPlot: null,
            boxPlot: null
          }
        },
        recommendations: [
          {
            type: "warning",
            priority: "high",
            message: "No se pudieron obtener datos de la API. Verificar conexión."
          }
        ],
        statistics: {
          centralTendency: { mean: 0, median: 0, mode: 0 },
          dispersion: { standardDeviation: 0, variance: 0, range: 0, coefficientOfVariation: 0 },
          shape: { skewness: 0, skewnessInterpretation: '', kurtosis: 0, kurtosisInterpretation: '' },
          percentiles: { 25: 0, 50: 0, 75: 0, 90: 0, 95: 0, 99: 0 },
          basic: { count: 0, sum: 0, min: 0, max: 0 }
        },
        probabilityAnalysis: {
          predictions: { nextPeriod: 0, confidence: 0, trend: 'insufficient_data' },
          confidenceIntervals: {},
          trends: { trend: 'insufficient_data', strength: 0 },
          metadata: { type: 'Error', description: 'Sin conexión a API' }
        }
      };
    }
  },

  // Métodos de compatibilidad para componentes existentes
  getSalesMetrics: async function(period = 'month') {
    const dashboard = await this.getDashboard(period);
    return dashboard.salesSummary;
  },

  getTopProducts: async function(period = 'month') {
    const dashboard = await this.getDashboard(period);
    return dashboard.visualization.charts.pieChart || { labels: [], datasets: [] };
  }
};

export default analyticsService;