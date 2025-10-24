import React from 'react';
import TopProductsTable from './TopProductsTable';
import TopProductsTableAPI from './TopProductsTableAPI';
import TopProductsTest from './TopProductsTest';

const TopProductsDemo = () => {
  // Datos de ejemplo para la versión estática
  const sampleProducts = [
    {
      id: 1,
      name: 'Pizza Margherita',
      sales: 120,
      quantity: 120,
      revenue: 24000,
      percentage: 35.5
    },
    {
      id: 2,
      name: 'Hamburguesa Clásica',
      sales: 95,
      quantity: 95,
      revenue: 19000,
      percentage: 28.1
    },
    {
      id: 3,
      name: 'Tacos al Pastor',
      sales: 80,
      quantity: 80,
      revenue: 12800,
      percentage: 23.7
    },
    {
      id: 4,
      name: 'Ensalada César',
      sales: 45,
      quantity: 45,
      revenue: 6750,
      percentage: 13.3
    },
    {
      id: 5,
      name: 'Pasta Carbonara',
      sales: 30,
      quantity: 30,
      revenue: 4500,
      percentage: 8.9
    }
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-['Plus_Jakarta_Sans']">
          Demostración de Componentes Top Productos
        </h1>
        <p className="text-gray-600 font-['Plus_Jakarta_Sans']">
          Comparación entre versión con datos estáticos y versión con API
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Versión con datos estáticos */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 font-['Plus_Jakarta_Sans']">
            📊 Versión con Datos Estáticos
          </h2>
          <TopProductsTable
            products={sampleProducts}
            title="Top Productos - Datos de Ejemplo"
          />
        </div>

        {/* Versión con API */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 font-['Plus_Jakarta_Sans']">
            🔄 Versión con API en Tiempo Real
          </h2>
          <TopProductsTableAPI />
        </div>
      </div>

      {/* Componente de prueba de API */}
      <div className="mt-8">
        <TopProductsTest />
      </div>

      {/* Información de uso */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 font-['Plus_Jakarta_Sans']">
          💡 Cómo usar el componente
        </h3>
        <div className="space-y-2 text-sm text-blue-800 font-['Plus_Jakarta_Sans']">
          <p><strong>Versión estática:</strong></p>
          <code className="block bg-blue-100 p-2 rounded text-xs">
            {`<TopProductsTable products={products} title="Mi Título" />`}
          </code>
          
          <p className="mt-4"><strong>Versión con API:</strong></p>
          <code className="block bg-blue-100 p-2 rounded text-xs">
            {`<TopProductsTable useAPI={true} period="month" limit={10} title="Mi Título" />`}
          </code>
          
          <p className="mt-4"><strong>Períodos disponibles:</strong> today, week, month, year</p>
        </div>
      </div>
    </div>
  );
};

export default TopProductsDemo;
