import { useState, useEffect, useCallback } from 'react';
import reportsService from '../services/reportsService';

/**
 * Hook personalizado para manejar datos de reportes
 * @param {string} initialPeriod - Período inicial
 */
export const useReportsData = (initialPeriod = 'month') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(initialPeriod);

  const fetchData = useCallback(async (selectedPeriod = period) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useReportsData - Fetching reports data for period:', selectedPeriod);
      console.log('🔄 useReportsData - API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
      
      const combinedData = await reportsService.getCombinedData({
        period: selectedPeriod,
        limit: 10
      });
      
      console.log('✅ useReportsData - Reports data loaded successfully:', combinedData);
      setData(combinedData);
      
    } catch (err) {
      console.error('❌ useReportsData - Error loading reports data:', err);
      
      // En lugar de mostrar error, usar datos vacíos
      console.log('🔄 useReportsData - Using fallback empty data');
      setData({
        bestSellingProducts: {
          products: [],
          summary: {
            total_products_analyzed: 0,
            total_quantity_sold: 0,
            total_revenue: 0,
            period: selectedPeriod,
            generated_at: new Date().toISOString()
          }
        },
        salesSummary: {
          summary: {
            period: selectedPeriod,
            total_products_sold: 0,
            total_revenue: 0,
            top_product: null,
            product_diversity: 0,
            average_order_value: 0,
            generated_at: new Date().toISOString()
          },
          top_products: []
        },
        period: selectedPeriod,
        uiPeriod: selectedPeriod
      });
      
      // Solo mostrar error si es crítico, pero no bloquear el UI
      setError(null); // No mostrar error en el UI, solo logear
    } finally {
      setLoading(false);
    }
  }, [period]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchData(period);
  }, [fetchData, period]);

  // Función para cambiar el período
  const changePeriod = useCallback((newPeriod) => {
    console.log('📅 Changing period from', period, 'to', newPeriod);
    setPeriod(newPeriod);
    fetchData(newPeriod);
  }, [fetchData, period]);

  // Función para refrescar datos
  const refresh = useCallback(() => {
    console.log('🔄 Refreshing reports data');
    fetchData(period);
  }, [fetchData, period]);

  return {
    data,
    loading,
    error,
    period,
    changePeriod,
    refresh,
    // Datos específicos para fácil acceso
    bestSellingProducts: data?.bestSellingProducts?.products || [],
    salesSummary: data?.salesSummary?.summary || null,
    topProducts: data?.salesSummary?.top_products || [],
    summary: data?.bestSellingProducts?.summary || null
  };
};
