import React, { useState, useEffect } from 'react';
import reportsService from '../../services/reportsService';

const TopProductsTest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🧪 Testing API directly...');
      
      const response = await reportsService.getBestSellingProducts({
        period: 'all',
        limit: 10
      });
      
      console.log('🧪 Direct API response:', response);
      setData(response);
      
    } catch (err) {
      console.error('🧪 Direct API error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testAPI();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 m-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Plus_Jakarta_Sans']">
        🧪 Test API de Productos Más Vendidos
      </h3>
      
      <button 
        onClick={testAPI}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Cargando...' : 'Probar API'}
      </button>

      {loading && (
        <div className="text-blue-600">
          ⏳ Cargando datos de la API...
        </div>
      )}

      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded">
          ❌ Error: {error}
        </div>
      )}

      {data && (
        <div className="space-y-4">
          <div className="text-green-600 bg-green-50 p-3 rounded">
            ✅ API funcionando - {data.products?.length || 0} productos encontrados
          </div>
          
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Datos recibidos:</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>

          {data.products && data.products.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Productos transformados:</h4>
              <div className="space-y-2">
                {data.products.map((product, index) => (
                  <div key={index} className="bg-white p-3 border rounded">
                    <div className="font-medium">{product.product_name}</div>
                    <div className="text-sm text-gray-600">
                      Ventas: {product.total_quantity} | 
                      Ingresos: ${product.total_revenue} | 
                      Porcentaje: {product.revenue_percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopProductsTest;
