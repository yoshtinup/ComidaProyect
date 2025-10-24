import { useState, useEffect, useCallback, useRef } from 'react';
import analyticsService from '../services/analyticsService';

// Datos de ejemplo para el dashboard
const getMockData = () => ({
  kpis: {
    totalOrders: 67,
    averageOrderValue: 58.75,
    totalRevenue: 3936.25,
    growthTrend: "positive",
    growthPercentage: 15.2,
    customerSatisfaction: 89,
    conversionRate: 85.2,
    confidenceInterval: {
      lowerBound: 3800,
      upperBound: 4100,
      confidence: 95
    }
  },
  charts: {
    revenueChart: {
      type: "bar",
      data: [
        { name: "Ene", revenue: 720, orders: 12 },
        { name: "Feb", revenue: 705, orders: 12 },
        { name: "Mar", revenue: 360, orders: 6 },
        { name: "Abr", revenue: 345, orders: 6 },
        { name: "May", revenue: 285, orders: 5 },
        { name: "Jun", revenue: 310, orders: 5 },
        { name: "Jul", revenue: 1211, orders: 13 }
      ],
      title: "Ingresos Mensuales"
    },
    topProducts: {
      type: "doughnut",
      data: [
        { label: "Coca Cola", value: 1260, percentage: 32 },
        { label: "Hershey", value: 975, percentage: 25 },
        { label: "Doritos", value: 720, percentage: 18 },
        { label: "Skwintles", value: 585, percentage: 15 },
        { label: "Vuala", value: 396, percentage: 10 }
      ],
      title: "Productos Más Vendidos"
    }
  },
  insights: {
    opportunities: [
      "Incremento del 45% en ventas de Julio vs promedio",
      "Coca Cola lidera con 32% del total de ventas",
      "Alto nivel de retención de usuarios",
      "Crecimiento sostenido en los últimos meses"
    ],
    risks: [
      "Concentración alta en pocos productos",
      "Dependencia de productos específicos"
    ],
    recommendations: [
      "Diversificar portafolio de productos",
      "Implementar promociones estratégicas",
      "Aprovechar el momentum de crecimiento",
      "Analizar horarios de mayor demanda"
    ]
  },
  topProducts: [
    { id: 1, name: "Coca Cola", sales: 63, revenue: 1260, percentage: 32 },
    { id: 2, name: "Hershey", sales: 39, revenue: 975, percentage: 25 },
    { id: 3, name: "Doritos", sales: 40, revenue: 720, percentage: 18 },
    { id: 4, name: "Skwintles", sales: 39, revenue: 585, percentage: 15 },
    { id: 5, name: "Vuala", sales: 40, revenue: 396, percentage: 10 }
  ],
  metadata: {
    period: 'month',
    lastUpdated: Date.now(),
    cacheStatus: 'mock'
  },
  probabilityData: {
    descriptiveStats: {
      mean: 58.75,
      median: 55.00,
      standardDeviation: 12.5,
      variance: 156.25,
      coefficientOfVariation: 0.213
    },
    normalDistribution: {
      mean: 58.75,
      standardDeviation: 12.5,
      confidence95: [34.25, 83.25]
    },
    predictions: {
      nextWeek: 62.3,
      nextMonth: 245.8,
      confidence: 0.85
    }
  }
});

// Funciones de transformación para datos de la API
const transformBarChartData = (barChartData, period) => {
  console.log('🔄 Transformando BarChart:', barChartData);
  
  if (!barChartData || !barChartData.labels || !barChartData.datasets) {
    console.log('❌ BarChart: Datos inválidos');
    return [];
  }
  
  const { labels, datasets } = barChartData;
  
  const result = labels.map((label, index) => {
    const dataPoint = { name: label };
    
    datasets.forEach(dataset => {
      if (dataset.data && dataset.data[index] !== undefined) {
        // Usar el nombre del dataset como clave
        dataPoint[dataset.name] = dataset.data[index];
      }
    });
    
    return dataPoint;
  });
  
  console.log('✅ BarChart transformado:', result);
  return result;
};

const transformLineChartData = (lineChartData) => {
  console.log('🔄 Transformando LineChart:', lineChartData);
  
  if (!lineChartData || !lineChartData.labels || !lineChartData.datasets) {
    console.log('❌ LineChart: Datos inválidos');
    return [];
  }
  
  const { labels, datasets } = lineChartData;
  
  const result = labels.map((label, index) => {
    const dataPoint = { name: label };
    
    datasets.forEach(dataset => {
      if (dataset.data && dataset.data[index] !== undefined) {
        // Normalizar nombres de claves para que los reconozca CustomLineChart
        const keyName = dataset.name === 'Ingresos diarios' ? 'ingresos' : 
                       dataset.name === 'Órdenes' ? 'orders' :
                       dataset.name.toLowerCase().replace(/\s+/g, '');
        dataPoint[keyName] = dataset.data[index];
      }
    });
    
    return dataPoint;
  });
  
  console.log('✅ LineChart transformado:', result);
  return result;
};

const transformPieChartData = (pieChartData, fallbackBarChartData = null) => {
  console.log('🔄 Transformando PieChart:', pieChartData);
  
  if (!pieChartData || !pieChartData.labels || !pieChartData.data) {
    console.log('❌ PieChart: Datos inválidos');
    return [];
  }
  
  const { labels, data } = pieChartData;
  
  // Verificar si los datos son válidos (no errores)
  const hasValidData = labels.length > 0 && 
    !labels.some(label => label.toLowerCase().includes('error')) &&
    data.some(value => value > 0);
  
  if (!hasValidData && fallbackBarChartData) {
    console.log('🔄 PieChart: Usando datos del BarChart como fallback');
    // Usar datos del BarChart para crear un PieChart
    if (fallbackBarChartData.labels && fallbackBarChartData.datasets) {
      const ingresoDataset = fallbackBarChartData.datasets.find(d => d.name === 'Ingresos');
      if (ingresoDataset) {
        const result = fallbackBarChartData.labels.map((label, index) => ({
          label: label,
          value: ingresoDataset.data[index] || 0,
          percentage: Math.round((ingresoDataset.data[index] / ingresoDataset.data.reduce((a, b) => a + b, 0)) * 100)
        }));
        console.log('✅ PieChart creado desde BarChart:', result);
        return result;
      }
    }
  }
  
  const result = labels.map((label, index) => ({
    label: label,
    value: data[index] || 0,
    percentage: data[index] || 0
  }));
  
  console.log('✅ PieChart transformado:', result);
  return result;
};

// Hook principal  
export const useDashboardData = (initialPeriod = 'month') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(initialPeriod);
  const [analysisType, setAnalysisType] = useState('sales');
  const [timeGranularity, setTimeGranularity] = useState('weekly');
  const [lastFetch, setLastFetch] = useState(null);
  
  const cacheRef = useRef(new Map());
  
  const fetchData = useCallback(async (forceFetch = false) => {
    const cacheKey = `dashboard-${period}-${analysisType}-${timeGranularity}`;
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    
    // Verificar caché
    if (!forceFetch && cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      if (now - cached.timestamp < CACHE_DURATION) {
        setData(cached.data);
        setLoading(false);
        setLastFetch(cached.timestamp);
        return;
      }
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Llamar a tu API real
      console.log('🔥 Llamando a la API real:', `http://localhost:3002/api/v1/analytics/dashboard?period=${period}`);
      const dashboardData = await analyticsService.getDashboard(period, analysisType, timeGranularity);
      
      console.log('📊 Datos recibidos de la API:', dashboardData);
      console.log('📋 Top Products estructura:', dashboardData.topProducts);
      console.log('📈 Summary estructura:', dashboardData.summary);
      console.log('💡 Recommendations estructura:', dashboardData.recommendations);
      console.log('📊 Visualization charts:', dashboardData.visualization?.charts);
      console.log('📊 BarChart data:', dashboardData.visualization?.charts?.barChart);
      console.log('📈 LineChart data:', dashboardData.visualization?.charts?.lineChart);
      
      // Transformar datos reales de tu API al formato del dashboard
      const transformedData = {
        kpis: {
          totalOrders: dashboardData.salesSummary?.totalSales || 0,
          averageOrderValue: dashboardData.salesSummary?.averageOrderValue || 0,
          totalRevenue: dashboardData.salesSummary?.totalRevenue || 0,
          growthTrend: (dashboardData.salesSummary?.growthPercentage || 0) >= 0 ? "positive" : "negative",
          growthPercentage: Math.abs(dashboardData.salesSummary?.growthPercentage || 0),
          customerSatisfaction: 89, // Mock por ahora
          conversionRate: 85.2, // Mock por ahora
          confidenceInterval: {
            lowerBound: dashboardData.probabilityAnalysis?.confidenceIntervals?.['95%']?.lower || 0,
            upperBound: dashboardData.probabilityAnalysis?.confidenceIntervals?.['95%']?.upper || 0,
            confidence: 95
          }
        },
        charts: {
          // Usar datos de barChart de la API
          revenueChart: {
            type: "bar",
            data: transformBarChartData(dashboardData.visualization?.charts?.barChart, period),
            title: `Ingresos por ${getPeriodLabel(period)}`
          },
          // Usar datos de lineChart de la API
          lineChart: {
            type: "line",
            data: transformLineChartData(dashboardData.visualization?.charts?.lineChart),
            title: "Tendencia de Ingresos"
          },
          // Usar datos de pieChart de la API, con fallback al barChart si es necesario
          topProducts: {
            type: "doughnut", 
            data: transformPieChartData(
              dashboardData.visualization?.charts?.pieChart,
              dashboardData.visualization?.charts?.barChart
            ),
            title: "Productos Más Vendidos"
          },
          // Nuevos gráficos de análisis probabilístico
          histogram: {
            type: "histogram",
            data: dashboardData.visualization?.charts?.histogramData || null,
            title: "Distribución de Frecuencias"
          },
          scatterPlot: {
            type: "scatter",
            data: dashboardData.visualization?.charts?.scatterPlot || null,
            title: "Análisis de Correlación"
          },
          boxPlot: {
            type: "boxplot",
            data: dashboardData.visualization?.charts?.boxPlot || null,
            title: "Distribución Estadística"
          }
        },
        
        // Log de charts transformados
        _debugCharts: (() => {
          const chartData = {
            revenueChart: transformBarChartData(dashboardData.visualization?.charts?.barChart, period),
            lineChart: transformLineChartData(dashboardData.visualization?.charts?.lineChart),
            topProducts: transformPieChartData(
              dashboardData.visualization?.charts?.pieChart,
              dashboardData.visualization?.charts?.barChart
            )
          };
          console.log('📊 Charts finales:', chartData);
          return chartData;
        })(),
        insights: {
          opportunities: dashboardData.recommendations?.filter(r => r.type === 'opportunity').map(r => r.message) || [],
          risks: dashboardData.recommendations?.filter(r => r.type === 'risk').map(r => r.message) || [],
          recommendations: dashboardData.recommendations?.map(r => r.message) || []
        },
        topProducts: (dashboardData.topProducts || []).map((product, index) => {
          // Parsear el nombre del producto
          let productName = `Producto ${index + 1}`;
          
          try {
            if (product.name) {
              const nameArray = typeof product.name === 'string' 
                ? JSON.parse(product.name) 
                : product.name;
              
              productName = Array.isArray(nameArray) 
                ? nameArray.join(', ') 
                : String(nameArray);
            }
          } catch (error) {
            console.warn('Error parsing product name:', product.name, error);
            productName = String(product.name || `Producto ${index + 1}`);
          }
          
          return {
            id: product.id || index + 1,
            name: productName,
            sales: product.sales || product.totalSales || 0,
            revenue: product.sales || product.revenue || product.totalRevenue || 0, // Usar sales como revenue
            percentage: product.percentage || 0
          };
        }),
        metadata: {
          period,
          lastUpdated: now,
          cacheStatus: 'fresh',
          apiCalled: true
        },
        // Agregar datos específicos de análisis probabilístico
        probabilityData: {
          predictions: dashboardData.probabilityAnalysis?.predictions || {},
          confidenceIntervals: dashboardData.probabilityAnalysis?.confidenceIntervals || {},
          trends: dashboardData.probabilityAnalysis?.trends || {},
          metadata: dashboardData.probabilityAnalysis?.metadata || {},
          statistics: dashboardData.statistics || {}
        }
      };
      
      // Guardar en caché
      cacheRef.current.set(cacheKey, {
        data: transformedData,
        timestamp: now
      });
      
      setData(transformedData);
      setLastFetch(now);
      
      console.log('🔄 Datos transformados:', transformedData);
      console.log('📊 KPIs calculados:', transformedData.kpis);
      console.log('🏆 Productos procesados:', transformedData.topProducts);
      console.log('✅ Dashboard actualizado con datos reales');
      
    } catch (error) {
      console.error('❌ Error llamando a la API:', error);
      setError(error.message);
      
      // Intentar usar datos en caché como fallback
      if (cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey);
        setData({
          ...cached.data,
          metadata: {
            ...cached.data.metadata,
            cacheStatus: 'stale',
            error: 'Usando datos en caché debido a error de red'
          }
        });
        console.log('📦 Usando datos en caché como fallback');
      } else {
        // Usar datos de ejemplo como último recurso
        console.log('🎭 Usando datos mock como último recurso');
        const mockData = getMockData();
        mockData.metadata.cacheStatus = 'mock';
        mockData.metadata.error = 'No se pudo conectar con la API, mostrando datos de ejemplo';
        setData(mockData);
      }
    } finally {
      setLoading(false);
    }
  }, [period, analysisType, timeGranularity]);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  const changePeriod = useCallback((newPeriod) => {
    setPeriod(newPeriod);
  }, []);

  const changeAnalysisType = useCallback((newAnalysisType) => {
    setAnalysisType(newAnalysisType);
  }, []);

  const changeTimeGranularity = useCallback((newTimeGranularity) => {
    setTimeGranularity(newTimeGranularity);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error, 
    refetch, 
    period, 
    changePeriod,
    analysisType,
    changeAnalysisType,
    timeGranularity,
    changeTimeGranularity,
    lastFetch,
    cacheStatus: data?.metadata?.cacheStatus || 'loading'
  };
};

// Función para formatear labels de período
const formatPeriodLabel = (period) => {
  if (!period) return '';
  
  if (period.includes('-')) {
    const [year, month, day] = period.split('-');
    if (day) {
      return `${day}/${month}`;
    } else if (month) {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return months[parseInt(month) - 1] || month;
    }
  }
  
  return period;
};

// Función para obtener label del período
const getPeriodLabel = (period) => {
  const labels = {
    'today': 'Horas',
    'week': 'Días',
    'month': 'Semanas',
    'quarter': 'Meses',
    'year': 'Meses'
  };
  return labels[period] || 'Período';
};

// Función para generar datos históricos cuando la API no los proporcione
const generateHistoricalData = (dashboardData, period) => {
  // Si ya tenemos datos de salesChart con múltiples entradas, usarlos
  if (dashboardData.salesChart && dashboardData.salesChart.length > 1) {
    return dashboardData.salesChart.map(item => ({
      name: formatPeriodLabel(item.period_label || item.date || item.period),
      revenue: item.revenue || item.totalRevenue || 0,
      orders: item.sales_count || item.orders || item.orderCount || 0,
      date: item.period_label || item.date || item.period
    }));
  }

  // Si no hay datos históricos, generar datos simulados basados en los datos actuales
  const currentRevenue = dashboardData.summary?.totalRevenue || dashboardData.salesMetrics?.totalRevenue || 0;
  const currentOrders = dashboardData.summary?.totalSales || dashboardData.salesMetrics?.totalSales || 0;
  
  const data = [];
  const now = new Date();
  
  switch (period) {
    case 'today':
      // Generar datos por horas para el día actual
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0');
        data.push({
          name: `${hour}:00`,
          revenue: Math.floor(currentRevenue * (0.02 + Math.random() * 0.06)), // 2-8% por hora
          orders: Math.floor(currentOrders * (0.02 + Math.random() * 0.06)),
          date: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${hour}:00`
        });
      }
      break;
      
    case 'week':
      // Generar datos por días para la semana actual
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        data.push({
          name: days[date.getDay()],
          revenue: Math.floor(currentRevenue * (0.08 + Math.random() * 0.12)), // 8-20% por día
          orders: Math.floor(currentOrders * (0.08 + Math.random() * 0.12)),
          date: date.toISOString().split('T')[0]
        });
      }
      break;
      
    case 'month':
      // Generar datos por semanas para el mes actual
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7));
        data.push({
          name: `Sem ${4 - i}`,
          revenue: Math.floor(currentRevenue * (0.2 + Math.random() * 0.15)), // 20-35% por semana
          orders: Math.floor(currentOrders * (0.2 + Math.random() * 0.15)),
          date: weekStart.toISOString().split('T')[0]
        });
      }
      break;
      
    case 'quarter':
      // Generar datos por meses para el trimestre
      for (let i = 2; i >= 0; i--) {
        const month = new Date(now);
        month.setMonth(month.getMonth() - i);
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        data.push({
          name: months[month.getMonth()],
          revenue: Math.floor(currentRevenue * (0.25 + Math.random() * 0.2)), // 25-45% por mes
          orders: Math.floor(currentOrders * (0.25 + Math.random() * 0.2)),
          date: `${month.getFullYear()}-${(month.getMonth() + 1).toString().padStart(2, '0')}`
        });
      }
      break;
      
    case 'year':
      // Generar datos por meses para el año
      for (let i = 11; i >= 0; i--) {
        const month = new Date(now);
        month.setMonth(month.getMonth() - i);
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        data.push({
          name: months[month.getMonth()],
          revenue: Math.floor(currentRevenue * (0.06 + Math.random() * 0.1)), // 6-16% por mes
          orders: Math.floor(currentOrders * (0.06 + Math.random() * 0.1)),
          date: `${month.getFullYear()}-${(month.getMonth() + 1).toString().padStart(2, '0')}`
        });
      }
      break;
      
    default:
      // Fallback: datos actuales
      data.push({
        name: 'Actual',
        revenue: currentRevenue,
        orders: currentOrders,
        date: now.toISOString().split('T')[0]
      });
  }
  
  return data;
};

// Generar insights dinámicos basados en los datos
const generateInsights = (data, type) => {
  const { summary, topProducts } = data;
  
  switch (type) {
    case 'opportunities':
      const opportunities = [];
      
      // Total de órdenes
      const totalOrders = summary?.totalSales || summary?.totalOrders || 0;
      if (totalOrders > 0) {
        opportunities.push(`Total de ${totalOrders} órdenes procesadas`);
      }
      
      // Ingresos totales
      const totalRevenue = summary?.totalRevenue || 0;
      if (totalRevenue > 0) {
        opportunities.push(`Ingresos totales: $${totalRevenue.toFixed(2)}`);
      }
      
      // Ticket promedio
      const avgOrder = summary?.averageOrderValue || 0;
      if (avgOrder > 0) {
        opportunities.push(`Ticket promedio: $${avgOrder.toFixed(2)}`);
      }
      
      // Producto líder
      if (topProducts && topProducts.length > 0) {
        const topProduct = topProducts[0];
        const productName = Array.isArray(topProduct.name) 
          ? topProduct.name.join(', ') 
          : topProduct.name;
        
        if (productName) {
          opportunities.push(`${productName} lidera las ventas`);
        }
      }
      
      // Crecimiento
      if (summary?.growthPercentage > 0) {
        opportunities.push(`Crecimiento del ${summary.growthPercentage.toFixed(1)}%`);
      }
      
      return opportunities.length > 0 ? opportunities : ['Sistema funcionando correctamente'];
      
    case 'risks':
      const risks = [];
      
      // Decrecimiento
      if (summary?.growthPercentage < 0) {
        risks.push(`Decrecimiento del ${Math.abs(summary.growthPercentage).toFixed(1)}%`);
      }
      
      // Pocos productos
      if ((topProducts?.length || 0) < 3) {
        risks.push('Portafolio limitado de productos');
      }
      
      // Pocas ventas
      const totalSales = summary?.totalSales || summary?.totalOrders || 0;
      if (totalSales < 10) {
        risks.push('Volumen de ventas bajo');
      }
      
      // Ingresos bajos
      const revenue = summary?.totalRevenue || 0;
      if (revenue === 0) {
        risks.push('No se registraron ingresos en el período');
      }
      
      return risks.length > 0 ? risks : ['No se identificaron riesgos significativos'];
      
    case 'recommendations':
      const recommendations = [];
      
      // Upselling si ticket promedio es bajo
      const avgOrderValue = summary?.averageOrderValue || 0;
      if (avgOrderValue < 50) {
        recommendations.push('Implementar estrategias de upselling');
      }
      
      // Promocionar producto top
      if (topProducts && topProducts.length > 0) {
        const topProduct = topProducts[0];
        const productName = Array.isArray(topProduct.name) 
          ? topProduct.name[0] 
          : topProduct.name;
        
        if (productName) {
          recommendations.push(`Promover productos como ${productName}`);
        }
      }
      
      // Recomendaciones generales
      recommendations.push('Monitorear tendencias periódicamente');
      recommendations.push('Optimizar productos de mayor margen');
      
      return recommendations;
      
    default:
      return [];
  }
};
