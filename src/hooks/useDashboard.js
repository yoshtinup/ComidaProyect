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

// Hook principal
export const useDashboardData = (initialPeriod = 'month') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(initialPeriod);
  const [lastFetch, setLastFetch] = useState(null);
  
  const cacheRef = useRef(new Map());
  
  const fetchData = useCallback(async (forceFetch = false) => {
    const cacheKey = `dashboard-${period}`;
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
      
      // Intentar obtener datos reales del servicio
      const dashboardData = await analyticsService.getDashboard(period);
      
      // Usar datos reales si están disponibles, sino usar mock
      const finalData = dashboardData && dashboardData.summary ? {
        kpis: {
          totalOrders: dashboardData.summary.totalSales || 0,
          averageOrderValue: dashboardData.summary.averageOrderValue || 0,
          totalRevenue: dashboardData.summary.totalRevenue || 0,
          growthTrend: dashboardData.summary.growthPercentage >= 0 ? "positive" : "negative",
          growthPercentage: Math.abs(dashboardData.summary.growthPercentage || 0),
          customerSatisfaction: 89,
          conversionRate: 85.2
        },
        charts: {
          revenueChart: {
            type: "bar",
            data: dashboardData.salesChart || getMockData().charts.revenueChart.data,
            title: "Ingresos por Período"
          },
          topProducts: {
            type: "doughnut", 
            data: (dashboardData.topProducts || []).map(product => ({
              label: product.name,
              value: product.revenue,
              percentage: product.percentage
            })),
            title: "Productos Más Vendidos"
          }
        },
        insights: getMockData().insights,
        topProducts: dashboardData.topProducts || getMockData().topProducts,
        metadata: {
          period,
          lastUpdated: now,
          cacheStatus: 'fresh'
        },
        probabilityData: getMockData().probabilityData
      } : getMockData();
      
      // Guardar en caché
      cacheRef.current.set(cacheKey, {
        data: finalData,
        timestamp: now
      });
      
      setData(finalData);
      setLastFetch(now);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
      
      // Usar datos de ejemplo como fallback
      const mockData = getMockData();
      setData(mockData);
    } finally {
      setLoading(false);
    }
  }, [period]);

  const refetch = useCallback(() => {
    fetchData(true);
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
