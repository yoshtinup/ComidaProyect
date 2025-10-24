import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import reportsService from '../../services/reportsService';

const TopProductsTable = ({ 
  products: externalProducts, 
  title = "Productos Más Vendidos",
  period = 'month',
  limit = 10,
  useAPI = false,
  loading: externalLoading = false
}) => {
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPositionIcon = (index) => {
    // Diseño simple en blanco y negro
    if (index === 0) return '1';
    if (index === 1) return '2'; 
    if (index === 2) return '3';
    return `${index + 1}`;
  };

  // Función para obtener datos de la API
  const fetchAPIData = async () => {
    if (!useAPI) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 TopProductsTable - Fetching API data for period:', period);
      console.log('🔄 TopProductsTable - Period mapped to API:', reportsService.mapPeriodToAPI(period));
      
      const response = await reportsService.getBestSellingProducts({
        period: reportsService.mapPeriodToAPI(period),
        limit
      });
      
      console.log('✅ TopProductsTable - API data received:', response);
      
      if (!response || !response.products) {
        console.warn('⚠️ TopProductsTable - No products in response:', response);
        setApiProducts([]);
        return;
      }
      
      // Transformar datos de la API al formato esperado por el componente
      const transformedProducts = response.products?.map((product, index) => ({
        id: product.product_id || index,
        name: product.product_name || 'Producto sin nombre',
        sales: product.total_quantity || 0,
        quantity: product.total_quantity || 0,
        revenue: product.total_revenue || 0,
        percentage: parseFloat(product.revenue_percentage || 0)
      })) || [];
      
      setApiProducts(transformedProducts);
      console.log('🔍 TopProductsTable - Transformed products:', transformedProducts);
      
    } catch (err) {
      console.error('❌ TopProductsTable - Error fetching API data:', err);
      setError(err.message);
      
      // Usar datos vacíos en caso de error
      setApiProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos cuando cambian las dependencias
  useEffect(() => {
    console.log('🔍 TopProductsTable useEffect triggered - useAPI:', useAPI, 'period:', period, 'limit:', limit);
    if (useAPI) {
      fetchAPIData();
    }
  }, [useAPI, period, limit]);

  // Determinar qué datos usar
  const products = useAPI ? apiProducts : (externalProducts || []);
  const isLoading = useAPI ? loading : externalLoading;

  console.log('🔍 TopProductsTable render - useAPI:', useAPI, 'products length:', products.length, 'isLoading:', isLoading);

  // Estado de carga
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 font-['Plus_Jakarta_Sans']">
          {title}
        </h3>
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

  // Estado de error
  if (error && useAPI) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 font-['Plus_Jakarta_Sans']">
          {title}
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500 font-['Plus_Jakarta_Sans']">
            No hay datos disponibles para este período
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 font-['Plus_Jakarta_Sans']">
        {title}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 font-['Plus_Jakarta_Sans']">
                Posición
              </th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 font-['Plus_Jakarta_Sans']">
                Producto
              </th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600 font-['Plus_Jakarta_Sans']">
                Ventas
              </th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600 font-['Plus_Jakarta_Sans']">
                Ingresos
              </th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600 font-['Plus_Jakarta_Sans']">
                % Total
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr 
                key={product.id || index} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="py-4 px-2">
                  <div className="flex items-center">
                    <div className={`
                      w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold
                      ${index === 0 ? 'bg-gray-900 text-white' : 
                        index === 1 ? 'bg-gray-700 text-white' : 
                        index === 2 ? 'bg-gray-500 text-white' : 
                        'bg-gray-200 text-gray-700'}
                    `}>
                      {getPositionIcon(index)}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
                    {product.name}
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <span className="text-sm font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
                    {product.sales || product.quantity || 0}
                  </span>
                </td>
                <td className="py-4 px-2 text-right">
                  <span className="text-sm font-semibold text-gray-900 font-['Plus_Jakarta_Sans']">
                    {formatCurrency(product.revenue || 0)}
                  </span>
                </td>
                <td className="py-4 px-2 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-sm font-medium text-gray-600 font-['Plus_Jakarta_Sans']">
                      {product.percentage || 0}%
                    </span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gray-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(product.percentage || 0, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 font-['Plus_Jakarta_Sans']">
              No hay datos de productos disponibles
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

TopProductsTable.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    sales: PropTypes.number,
    quantity: PropTypes.number,
    revenue: PropTypes.number.isRequired,
    percentage: PropTypes.number
  })),
  title: PropTypes.string,
  period: PropTypes.oneOf(['today', 'week', 'month', 'year']),
  limit: PropTypes.number,
  useAPI: PropTypes.bool,
  loading: PropTypes.bool
};

export default TopProductsTable;
