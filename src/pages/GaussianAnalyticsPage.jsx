
import React, { useState, useEffect, useMemo } from 'react';
import GaussianChart from '../componets/Charts/GaussianChart';
import reportsService from '../services/reportsService';
import HeaderAdmin from '../componets/HeaderAdmin';
import LoadingSpinner from '../componets/Dashboard/LoadingSpinner';

const GaussianAnalyticsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('month');
  
  // Estados para cada tipo de análisis
  const [orderValueData, setOrderValueData] = useState(null);
  const [productsPerOrderData, setProductsPerOrderData] = useState(null);
  const [businessSummary, setBusinessSummary] = useState(null);

  // Estados para datos crudos de la API (valores individuales)
  const [orderValueRaw, setOrderValueRaw] = useState([]);
  const [productsPerOrderRaw, setProductsPerOrderRaw] = useState([]);
  
  // Parámetros configurables
  const [targetOrderValue, setTargetOrderValue] = useState(100);
  const [targetProductsPerOrder, setTargetProductsPerOrder] = useState(3);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Fetching all Gaussian data...');
      
      // Hacer todas las llamadas en paralelo
      const [orderValue, productsPerOrder, summary] = await Promise.allSettled([
        reportsService.getOrderValueDistribution({ period, target_value: targetOrderValue }),
        reportsService.getProductsPerOrderDistribution({ period, target_quantity: targetProductsPerOrder }),
        reportsService.getBusinessSummary({ period })
      ]);

      // Procesar resultados
      if (orderValue.status === 'fulfilled') {
        setOrderValueData(orderValue.value);
        // Extraer valores individuales de la API (asumiendo data_points es un array de objetos con .x o .value)
        const arr = Array.isArray(orderValue.value?.data_points)
          ? orderValue.value.data_points.map(d => d.x ?? d.value ?? d.valor ?? d.amount ?? d[Object.keys(d)[0]])
          : [];
        setOrderValueRaw(arr.filter(v => typeof v === 'number' && !isNaN(v)));
      } else {
        console.error('Error en order value:', orderValue.reason);
        setOrderValueRaw([]);
      }

      if (productsPerOrder.status === 'fulfilled') {
        setProductsPerOrderData(productsPerOrder.value);
        // Extraer valores individuales de la API
        const arr = Array.isArray(productsPerOrder.value?.data_points)
          ? productsPerOrder.value.data_points.map(d => d.x ?? d.value ?? d.cantidad ?? d[Object.keys(d)[0]])
          : [];
        setProductsPerOrderRaw(arr.filter(v => typeof v === 'number' && !isNaN(v)));
      } else {
        console.error('Error en products per order:', productsPerOrder.reason);
        setProductsPerOrderRaw([]);
      }

      if (summary.status === 'fulfilled') {
        setBusinessSummary(summary.value);
      } else {
        console.error('Error en business summary:', summary.reason);
      }

      console.log('✅ All Gaussian data loaded successfully');
      
    } catch (err) {
      console.error('❌ Error loading Gaussian data:', err);
      setError(err.message || 'Error al cargar datos de análisis gaussiano');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [period]);



  // Ya no es necesario recargar desde la API al cambiar los inputs, solo al cambiar el periodo
  const handleUpdateTargets = () => {
    // No recarga la API, solo recalcula localmente
    // fetchAllData();
  };

  if (loading && !orderValueData && !productsPerOrderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 font-['Plus_Jakarta_Sans']">
            Cargando análisis gaussianos...
          </p>
        </div>
      </div>
    );
  }

  return (<>
    <HeaderAdmin />
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                <path d="M3 3v18h18"/>
                <path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
              Analytics Gaussiano Avanzado
            </h1>
          </div>
          <p className="text-gray-600 mt-2 font-['Plus_Jakarta_Sans']">
            Análisis estadístico completo de tu negocio usando distribuciones gaussianas
          </p>
        </div>

        {/* Controles Principales */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-['Plus_Jakarta_Sans']">
                Período de Análisis
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-['Plus_Jakarta_Sans'] focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="week">Última Semana</option>
                <option value="month">Último Mes</option>
                <option value="year">Último Año</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-['Plus_Jakarta_Sans']">
                Objetivo Valor Orden ($)
              </label>
              <input
                type="number"
                value={targetOrderValue}
                onChange={(e) => setTargetOrderValue(Number(e.target.value))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-['Plus_Jakarta_Sans'] focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-['Plus_Jakarta_Sans']">
                Objetivo Productos/Orden
              </label>
              <input
                type="number"
                value={targetProductsPerOrder}
                onChange={(e) => setTargetProductsPerOrder(Number(e.target.value))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-['Plus_Jakarta_Sans'] focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            
            <button
              onClick={handleUpdateTargets}
              disabled={loading}
              className="px-6 py-2 bg-gray-900 text-white rounded-md text-sm font-['Plus_Jakarta_Sans'] hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-['Plus_Jakarta_Sans']">
              ⚠️ {error}
            </p>
            <button 
              onClick={fetchAllData}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* KPIs del Resumen de Negocio */}
        {businessSummary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 font-['Plus_Jakarta_Sans']">
                  Valor Promedio Orden
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
                ${businessSummary.business_kpis?.average_order_value?.toFixed(2) || businessSummary.order_value_analysis?.mean?.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 font-['Plus_Jakarta_Sans'] mt-1">
                Consistencia: {businessSummary.business_kpis?.order_value_consistency || 'N/A'}
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 font-['Plus_Jakarta_Sans']">
                  Muestra Analizada
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
                {businessSummary.order_value_analysis?.sample_size || 0}
              </p>
              <p className="text-sm text-gray-600 font-['Plus_Jakarta_Sans'] mt-1">
                Órdenes en {period}
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
                  <line x1="12" y1="22" x2="12" y2="15.5"/>
                  <polyline points="22,8.5 12,15.5 2,8.5"/>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 font-['Plus_Jakarta_Sans']">
                  Score de Eficiencia
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
                {businessSummary.order_value_analysis?.insights?.efficiency_score || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 font-['Plus_Jakarta_Sans'] mt-1">
                Estado del negocio
              </p>
            </div>
          </div>
        )}

        {/* Gráficas */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Distribución de Valores de Orden */}
          {orderValueData?.data_points && orderValueData.data_points.length > 0 && (
            <GaussianChart
              data={{ data_points: orderValueData.data_points, mean: orderValueData.mean, std_deviation: orderValueData.std_deviation }}
              targetValue={targetOrderValue}
              title="Distribución de Valores de Orden"
              height={400}
              xAxisLabel="Valor de Orden ($)"
              yAxisLabel="Probabilidad"
              dataType="continuous"
            />
          )}

        </div>

        {/* Insights y Recomendaciones */}
        {(orderValueData?.insights || productsPerOrderData?.insights) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {orderValueData?.insights && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-900">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <h3 className="text-lg font-semibold text-blue-900 font-['Plus_Jakarta_Sans']">
                    Insights - Valores de Orden
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-blue-800 font-['Plus_Jakarta_Sans']">
                    <strong>Recomendación:</strong> {orderValueData.insights.recommendation}
                  </p>
                  <p className="text-sm text-blue-700 font-['Plus_Jakarta_Sans']">
                    <strong>Variabilidad:</strong> {orderValueData.insights.variability}
                  </p>
                  <p className="text-sm text-blue-700 font-['Plus_Jakarta_Sans']">
                    <strong>Salud del Negocio:</strong> {orderValueData.insights.business_health}
                  </p>
                </div>
              </div>
            )}

            {productsPerOrderData?.insights && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-900">
                    <rect x="1" y="3" width="15" height="13"/>
                    <path d="M16 8h4l-4 12h-4"/>
                  </svg>
                  <h3 className="text-lg font-semibold text-green-900 font-['Plus_Jakarta_Sans']">
                    Insights - Productos por Orden
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-green-800 font-['Plus_Jakarta_Sans']">
                    <strong>Recomendación:</strong> {productsPerOrderData.insights.recommendation}
                  </p>
                  <p className="text-sm text-green-700 font-['Plus_Jakarta_Sans']">
                    <strong>Consistencia:</strong> {productsPerOrderData.insights.purchase_consistency}
                  </p>
                  <p className="text-sm text-green-700 font-['Plus_Jakarta_Sans']">
                    <strong>Comportamiento:</strong> {productsPerOrderData.insights.customer_behavior}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}


      </div>
    </div>
    </>);
};

export default GaussianAnalyticsPage;
