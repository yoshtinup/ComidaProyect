import { useState, useEffect } from 'react';
import reportsService from '../services/reportsService';

export const useGaussianData = (options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const {
    period = 'week',
    target_time = 15,
    confidence_level = 95,
    data_points = 50,
    autoFetch = true
  } = options;

  const fetchGaussianData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔔 Fetching Gaussian data...');
      const result = await reportsService.getDeliveryTimeDistribution({
        period,
        target_time,
        confidence_level,
        data_points
      });

      setData(result);
      setLastFetch(new Date());
      console.log('✅ Gaussian data loaded successfully:', result);
      
    } catch (err) {
      console.error('❌ Error loading Gaussian data:', err);
      setError(err.message || 'Error al cargar datos de distribución');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchGaussianData();
    }
  }, [period, target_time, confidence_level, autoFetch]);

  return {
    data,
    loading,
    error,
    refetch: fetchGaussianData,
    lastFetch
  };
};
