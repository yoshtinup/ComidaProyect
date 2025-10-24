import React from 'react';
import { Trophy, TrendingUp, Calendar, DollarSign, ShoppingCart, Package } from 'lucide-react';

const TopProductosFromAPI = ({ 
  bestSellingProducts = [], 
  selectedPeriod = '1m',
  loading = false 
}) => {
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!bestSellingProducts || bestSellingProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="font-['Plus_Jakarta_Sans']">No hay datos de productos disponibles</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRankIcon = (index) => {
    const icons = [
      <Trophy className="h-5 w-5 text-yellow-500" />,
      <Trophy className="h-5 w-5 text-gray-400" />,
      <Trophy className="h-5 w-5 text-orange-600" />
    ];
    return icons[index] || <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">{index + 1}</div>;
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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800 font-['Plus_Jakarta_Sans']">
          Top Productos - {getPeriodLabel(selectedPeriod)}
        </h4>
        <span className="text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
          {bestSellingProducts.length} productos
        </span>
      </div>
      
      <div className="space-y-4">
        {bestSellingProducts.map((product, index) => (
          <div 
            key={product.product_id} 
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              {/* Ranking */}
              <div className="flex-shrink-0">
                {getRankIcon(index)}
              </div>
              
              {/* Información del producto */}
              <div className="flex-1">
                <h5 className="font-semibold text-gray-900 font-['Plus_Jakarta_Sans']">
                  {product.product_name}
                </h5>
                <div className="flex items-center space-x-4 text-sm text-gray-600 font-['Plus_Jakarta_Sans']">
                  <span className="flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {product.order_count} órdenes
                  </span>
                  <span className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    {product.total_quantity} unidades
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {formatCurrency(product.average_price)} c/u
                  </span>
                </div>
              </div>
            </div>
            
            {/* Métricas principales */}
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
                {formatCurrency(product.total_revenue)}
              </div>
              <div className="text-sm text-gray-600 font-['Plus_Jakarta_Sans']">
                {product.revenue_percentage}% del total
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Información adicional para el período 'all' */}
      {selectedPeriod === 'all' && bestSellingProducts.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700 font-['Plus_Jakarta_Sans']">
            <div className="flex items-center justify-between">
              <span>
                <Calendar className="h-4 w-4 inline mr-1" />
                Primer venta: {formatDate(bestSellingProducts[0].first_sale)}
              </span>
              <span>
                Última venta: {formatDate(bestSellingProducts[0].last_sale)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopProductosFromAPI;
