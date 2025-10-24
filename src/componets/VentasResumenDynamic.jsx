import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService.js';

const VentasResumenDynamic = ({ title, selectedPeriod }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para convertir el período del frontend al formato del backend
  const convertPeriodForAPI = (period) => {
    switch(period) {
      case '1d':
      case 'today': return 'today';
      case '1w':
      case 'week': return 'week';
      case '1m':
      case 'month': return 'month';
      default: return 'month';
    }
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiPeriod = convertPeriodForAPI(selectedPeriod);
        const salesData = await analyticsService.getSalesMetrics(apiPeriod);
        
        // Validar que salesData tenga la estructura esperada
        if (salesData && typeof salesData === 'object') {
          setData(salesData);
        } else {
          console.warn('Los datos de ventas no tienen la estructura esperada:', salesData);
          setData({
            totalRevenue: 0,
            totalSales: 0,
            previousRevenue: 0,
            previousSales: 0
          });
        }
      } catch (err) {
        console.error('Error fetching sales data:', err);
        setError('Error al cargar los datos de ventas');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedPeriod]);
  // Funciones de formato
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '$0';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    if (typeof value !== 'number') return '0';
    return new Intl.NumberFormat('es-MX').format(value);
  };

  const getPeriodText = () => {
    switch(selectedPeriod) {
      case 'today':
      case '1d': return 'Hoy';
      case 'week':
      case '1w': return 'Esta Semana';
      case 'month':
      case '1m': return 'Este Mes';
      default: return 'Este Mes';
    }
  };

  const getGrowthIndicator = (currentValue, previousValue) => {
    if (!previousValue || previousValue === 0 || !currentValue) return null;
    const growth = ((currentValue - previousValue) / previousValue) * 100;
    const isPositive = growth > 0;
    return (
      <span className={`text-sm font-medium ml-2 ${isPositive ? 'text-green-700' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{growth.toFixed(1)}%
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <div className="w-full px-4 pt-5 pb-3">
          <div className="text-neutral-900 text-xl font-bold leading-7">
            {title}
          </div>
        </div>
        <div className="w-full px-4">
          <div className="rounded-xl outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden">
            <div className="p-6 flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="w-full px-4 pt-5 pb-3">
          <div className="text-neutral-900 text-xl font-bold leading-7">
            {title}
          </div>
        </div>
        <div className="w-full px-4">
          <div className="rounded-xl outline-1 outline-offset-[-1px] outline-red-300 overflow-hidden">
            <div className="p-6 text-center">
              <div className="text-red-600 text-sm">{error}</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full px-4 pt-5 pb-3">
        <div className="text-neutral-900 text-xl font-bold leading-7">
          {title}
        </div>
        <div className="text-neutral-500 text-sm">{getPeriodText()}</div>
      </div>

      <div className="w-full px-4">
        <div className="rounded-xl outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden">
          {/* Para escritorio (tabla) */}
          <div className="hidden sm:block">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-6 text-neutral-900 text-base font-medium leading-normal border-b border-zinc-300">
                    Ingresos Totales
                  </th>
                  <th className="text-left p-6 text-neutral-900 text-base font-medium leading-normal border-b border-zinc-300">
                    Número de Ventas
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-left p-6">
                    <div className="text-2xl font-bold">
                      {formatCurrency(data?.totalRevenue || 0)}
                      {data?.totalRevenue && data?.previousRevenue && 
                        getGrowthIndicator(data.totalRevenue, data.previousRevenue)
                      }
                    </div>
                  </td>
                  <td className="text-left p-6">
                    <div className="text-2xl font-bold">
                      {formatNumber(data?.totalSales || 0)}
                      {data?.totalSales && data?.previousSales && 
                        getGrowthIndicator(data.totalSales, data.previousSales)
                      }
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Para móviles (stack) */}
          <div className="sm:hidden p-4 flex flex-col gap-4">
            <div>
              <div className="text-sm text-neutral-900 font-medium">Ingresos Totales</div>
              <div className="text-2xl font-bold">
                {formatCurrency(data?.totalRevenue || 0)}
                {data?.totalRevenue && data?.previousRevenue && 
                  getGrowthIndicator(data.totalRevenue, data.previousRevenue)
                }
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-900 font-medium">Número de Ventas</div>
              <div className="text-2xl font-bold">
                {formatNumber(data?.totalSales || 0)}
                {data?.totalSales && data?.previousSales && 
                  getGrowthIndicator(data.totalSales, data.previousSales)
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VentasResumenDynamic;
