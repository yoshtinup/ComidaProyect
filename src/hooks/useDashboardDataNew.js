import { useState, useEffect, useCallback, useRef } from 'react';
import analyticsService from '../services/analyticsService';

export const useDashboardData = (initialPeriod = 'month') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(initialPeriod);
  const [lastFetch, setLastFetch] = useState(null);
  
  // Cache para evitar múltiples llamadas
  const cacheRef = useRef(new Map());
  
  const fetchData = useCallback(async (forceFetch = false) => {
    const cacheKey = `dashboard-${period}`;
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    
    // Verificar caché si no es forzado
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
      
      // Fetch tanto dashboard como datos de probabilidad
      const [dashboardData, probabilityData] = await Promise.all([
        analyticsService.getDashboard(period),
        fetchProbabilityAnalysis(period, 'sales').catch(() => null) // Opcional si falla
      ]);
      
      // Transformar datos para el formato esperado por los componentes
      const transformedData = {
        kpis: {
          totalOrders: dashboardData.summary?.totalSales || 0,
          averageOrderValue: dashboardData.summary?.averageOrderValue || 0,
          totalRevenue: dashboardData.summary?.totalRevenue || 0,
          growthTrend: dashboardData.summary?.growthPercentage >= 0 ? "positive" : "negative",
          growthPercentage: Math.abs(dashboardData.summary?.growthPercentage || 0),
          customerSatisfaction: 89, // Valor calculado o fijo
          conversionRate: 85.2, // Valor calculado o fijo
          confidenceInterval: probabilityData?.confidenceInterval || null
        },
        charts: {
          revenueChart: {
            type: "bar",
            data: transformSalesChartData(dashboardData.salesChart || []),
            title: "Ingresos por Período"
          },
          topProducts: {
            type: "doughnut",
            data: dashboardData.topProducts?.map(product => ({
              label: product.name,
              value: product.revenue,
              percentage: Math.round((product.revenue / dashboardData.summary?.totalRevenue) * 100) || 0
            })) || [],
            title: "Productos Más Vendidos"
          },
          salesTrend: {
            type: "line",
            data: transformSalesChartData(dashboardData.salesChart || []),
            title: "Tendencia de Ventas"
          }
        },
        insights: {
          opportunities: generateInsights(dashboardData, 'opportunities'),
          risks: generateInsights(dashboardData, 'risks'),
          recommendations: generateInsights(dashboardData, 'recommendations')
        },
        topProducts: dashboardData.topProducts || [],
        rawData: dashboardData,
        probabilityData: probabilityData,
        metadata: {
          period,
          lastUpdated: now,
          cacheStatus: 'fresh'
        }
      };

      // Guardar en caché
      cacheRef.current.set(cacheKey, {
        data: transformedData,
        timestamp: now
      });
      
      setData(transformedData);
      setLastFetch(now);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Error al cargar los datos del dashboard');
      
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
      } else {
        // Usar datos de ejemplo como último recurso
        setData(getMockData());
      }
    } finally {
      setLoading(false);
    }
  }, [period]);

  const refetch = useCallback(() => {
    fetchData(true); // Forzar nueva consulta
  }, [fetchData]);

  const changePeriod = useCallback((newPeriod) => {
    setPeriod(newPeriod);
  }, []);

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchData(true);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchData, loading]);

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
    lastFetch,
    cacheStatus: data?.metadata?.cacheStatus || 'loading'
  };
};

// Función auxiliar para obtener análisis de probabilidad
const fetchProbabilityAnalysis = async (period, metric) => {
  try {
    const response = await fetch(`http://localhost:3002/api/v1/analytics/probability?period=${period}&metric=${metric}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.warn('Probability analysis not available:', error.message);
    return null;
  }
};

// Transformar datos de gráfico de ventas
const transformSalesChartData = (salesChart) => {
  return salesChart.map(item => ({
    name: formatPeriodLabel(item.date || item.period),
    revenue: item.revenue || item.totalRevenue || 0,
    orders: item.orders || item.orderCount || 0,
    date: item.date || item.period
  }));
};

// Formatear etiquetas de período
const formatPeriodLabel = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Si es del año actual, mostrar solo mes
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('es-ES', { month: 'short' });
  }
  
  return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
};

// Generar insights dinámicos basados en los datos
const generateInsights = (data, type) => {
  const { summary, topProducts } = data;
  
  switch (type) {
    case 'opportunities':
      return [
        `Total de ${summary?.totalSales || 0} órdenes procesadas`,
        `Ingresos totales: $${(summary?.totalRevenue || 0).toFixed(2)}`,
        `Ticket promedio: $${(summary?.averageOrderValue || 0).toFixed(2)}`,
        topProducts?.[0] ? `${topProducts[0].name} lidera las ventas` : '',
        summary?.growthPercentage > 0 ? `Crecimiento del ${summary.growthPercentage.toFixed(1)}%` : ''
      ].filter(Boolean);
      
    case 'risks':
      const risks = [];
      if (summary?.growthPercentage < 0) {
        risks.push(`Decrecimiento del ${Math.abs(summary.growthPercentage).toFixed(1)}%`);
      }
      if ((topProducts?.length || 0) < 3) {
        risks.push('Portafolio limitado de productos');
      }
      if ((summary?.totalSales || 0) < 10) {
        risks.push('Volumen de ventas bajo');
      }
      return risks.length > 0 ? risks : ['No se identificaron riesgos significativos'];
      
    case 'recommendations':
      const recommendations = [];
      if (summary?.averageOrderValue < 50) {
        recommendations.push('Implementar estrategias de upselling');
      }
      if (topProducts?.length > 0) {
        recommendations.push(`Promover productos como ${topProducts[0]?.name}`);
      }
      recommendations.push('Monitorear tendencias periódicamente');
      recommendations.push('Optimizar productos de mayor margen');
      return recommendations;
      
    default:
      return [];
  }
};

// Datos de ejemplo mejorados
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
  }
});

export default useDashboardData;
