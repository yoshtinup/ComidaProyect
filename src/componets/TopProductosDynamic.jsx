import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService.js';

const ProductoBarDynamic = ({ nombre, value, maxValue, percentage }) => {
  // Validar props y proporcionar valores por defecto
  const safeName = nombre || 'Producto';
  const safeValue = typeof value === 'number' ? value : 0;
  const safePercentage = typeof percentage === 'number' ? Math.min(Math.max(percentage, 0), 100) : 0;
  
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '$0';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="w-full flex items-center gap-2 sm:gap-4 mb-3">
      <div className="w-20 sm:w-28 text-neutral-500 text-xs font-bold truncate">
        {safeName}
      </div>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
          <div 
            className="h-full bg-gray-800 rounded-full transition-all duration-500 ease-out border-r-2 border-neutral-500"
            style={{ width: `${safePercentage}%` }}
          />
        </div>
        <div className="text-xs text-neutral-600 min-w-[40px] text-right">
          {Math.round(safePercentage)}%
        </div>
      </div>
      <div className="text-xs text-neutral-500 min-w-[60px] text-right">
        {formatCurrency(safeValue)}
      </div>
    </div>
  );
};

const TopProductosDynamic = ({ period = '1m', selectedPeriod = '1m' }) => {
  const [data, setData] = useState([]);
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
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiPeriod = convertPeriodForAPI(selectedPeriod);
        const topProducts = await analyticsService.getTopProducts(apiPeriod);
        
        // Validar que topProducts sea un array
        if (Array.isArray(topProducts)) {
          setData(topProducts);
        } else {
          console.warn('Los datos recibidos no son un array:', topProducts);
          setData([]);
        }
      } catch (err) {
        console.error('Error fetching top products:', err);
        setError('Error al cargar los productos más vendidos');
        setData([]); // Resetear datos en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [selectedPeriod]);
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '$0';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getPeriodText = () => {
    switch(selectedPeriod) {
      case '1d':
      case 'today': return 'Hoy';
      case '1w':
      case 'week': return 'Esta Semana';
      case '1m':
      case 'month': return 'Este Mes';
      default: return 'Este Mes';
    }
  };

  const getGrowthIndicator = (growth) => {
    if (growth === null || growth === undefined) return null;
    const isPositive = growth > 0;
    return (
      <span className={`text-base font-medium ${isPositive ? 'text-green-700' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{growth.toFixed(1)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-2 sm:p-4">
        <div className="text-neutral-900 text-base font-medium mb-1">Ventas por Producto</div>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 sm:p-4">
        <div className="text-neutral-900 text-base font-medium mb-1">Ventas por Producto</div>
        <div className="p-4 text-center text-red-600 text-sm">
          {error}
        </div>
      </div>
    );
  }

  // Calcular el valor máximo para las barras proporcionales
  const maxValue = Math.max(...(data?.map(item => item.revenue || item.valor || 0) || [1]));

  return (
    <div className="p-2 sm:p-4">
      <div className="text-neutral-900 text-base font-medium mb-1">Ventas por Producto</div>
      <div className="text-neutral-900 text-2xl sm:text-3xl font-bold mb-1">
        {formatCurrency(0)} {/* Cambiaremos esto cuando tengamos salesSummary */}
      </div>
      <div className="flex gap-1 mb-4">
        <span className="text-neutral-500 text-base">{getPeriodText()}</span>
      </div>
      
      <div className="flex flex-col gap-2">
        {data && data.length > 0 ? (
          data.map((producto, idx) => {
            // Validar que el producto tenga los datos necesarios
            const nombre = producto.name || producto.nombre || `Producto ${idx + 1}`;
            const revenue = producto.revenue || producto.valor || 0;
            const percentage = maxValue > 0 ? (revenue / maxValue * 100) : 0;
            
            return (
              <ProductoBarDynamic 
                key={idx} 
                nombre={nombre}
                value={revenue}
                maxValue={maxValue}
                percentage={percentage}
              />
            );
          })
        ) : (
          <div className="text-center text-neutral-500 py-8">
            {loading ? 'Cargando productos...' : 'No hay datos disponibles para este período'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProductosDynamic;
