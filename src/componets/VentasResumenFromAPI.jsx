import React from 'react';
import { TrendingUp, ShoppingCart, DollarSign, Package } from 'lucide-react';

const VentasResumenFromAPI = ({ 
  title = "Resumen de Ventas", 
  salesSummary, 
  productsSummary, 
  selectedPeriod,
  loading = false 
}) => {
  
  if (loading) {
    return (
      <div className="self-stretch p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-['Plus_Jakarta_Sans']">
          {title}
        </h3>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Verificar si hay datos válidos
  const hasData = salesSummary && Object.keys(salesSummary).length > 0;
  
  // Datos del resumen de ventas API con validación
  const revenue = hasData ? (salesSummary?.total_revenue || 0) : 0;
  const totalProducts = hasData ? (salesSummary?.total_products_sold || 0) : 0;
  const averageOrder = hasData ? (salesSummary?.average_order_value || 0) : 0;
  const diversity = hasData ? (salesSummary?.product_diversity || 0) : 0;
  const topProduct = hasData ? (salesSummary?.top_product?.product_name || 'Sin datos') : 'Sin datos';

  // Datos adicionales del summary de productos más vendidos
  const hasProductsData = productsSummary && Object.keys(productsSummary).length > 0;
  const totalAnalyzed = hasProductsData ? (productsSummary?.total_products_analyzed || 0) : 0;
  const totalQuantity = hasProductsData ? (productsSummary?.total_quantity_sold || 0) : 0;
  const totalRevenueProducts = hasProductsData ? (productsSummary?.total_revenue || 0) : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPeriodLabel = (period) => {
    const labels = {
      'today': 'Hoy',
      'week': 'Esta Semana', 
      'month': 'Este Mes',
      '1w': 'Última Semana',
      '1m': 'Último Mes', 
      '3m': 'Últimos 3 Meses',
      '1y': 'Último Año',
      'all': 'Todo el Tiempo'
    };
    return labels[period] || 'Período Seleccionado';
  };

  return (
    <div className="self-stretch p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-['Plus_Jakarta_Sans']">
          {title}
        </h3>
        <span className="text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
          {getPeriodLabel(selectedPeriod)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ingresos Totales */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 font-['Plus_Jakarta_Sans']">
                Ingresos
              </p>
              <p className="text-xl font-bold text-green-800 font-['Plus_Jakarta_Sans']">
                {formatCurrency(revenue)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        {/* Productos Vendidos */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 font-['Plus_Jakarta_Sans']">
                Productos Vendidos
              </p>
              <p className="text-xl font-bold text-blue-800 font-['Plus_Jakarta_Sans']">
                {totalProducts.toLocaleString()}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Ticket Promedio */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 font-['Plus_Jakarta_Sans']">
                Ticket Promedio
              </p>
              <p className="text-xl font-bold text-purple-800 font-['Plus_Jakarta_Sans']">
                {formatCurrency(averageOrder)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        {/* Diversidad de Productos */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 font-['Plus_Jakarta_Sans']">
                Productos Únicos
              </p>
              <p className="text-xl font-bold text-orange-800 font-['Plus_Jakarta_Sans']">
                {diversity}
              </p>
            </div>
            <Package className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Información adicional */}
      {topProduct !== 'N/A' && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 font-['Plus_Jakarta_Sans']">
            <span className="font-medium">Producto líder:</span> {topProduct}
          </p>
        </div>
      )}
      
      {/* Mostrar datos de resumen total si están disponibles */}
      {productsSummary && selectedPeriod === 'all' && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 font-['Plus_Jakarta_Sans']">
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium">Total Analizado:</span> {totalAnalyzed} productos
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium">Cantidad Total:</span> {totalQuantity.toLocaleString()} unidades
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium">Ingresos Históricos:</span> {formatCurrency(totalRevenueProducts)}
          </div>
        </div>
      )}
    </div>
  );
};

export default VentasResumenFromAPI;
