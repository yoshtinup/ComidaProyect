import React, { useState } from 'react';
import TopProductsTable from './TopProductsTable';
import EtiquetasFiltroInteractive from '../EtiquetasFiltroInteractive';

const TopProductsTableAPI = ({ title = "Top Productos - API" }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const handlePeriodChange = (newPeriod) => {
    console.log('📅 TopProductsTableAPI - Period changed to:', newPeriod);
    setSelectedPeriod(newPeriod);
  };

  const getPeriodLabel = (period) => {
    const labels = {
      'today': 'Hoy',
      'week': 'Esta Semana',
      'month': 'Este Mes',
      'year': 'Este Año',
      'all': 'Todos los Períodos'
    };
    return labels[period] || 'Este Mes';
  };

  return (
    <div className="space-y-4">
      {/* Filtros de período */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 font-['Plus_Jakarta_Sans']">
          Filtrar por período
        </h4>
        <EtiquetasFiltroInteractive
          etiquetas={[
            { label: 'Hoy', value: 'today' },
            { label: 'Esta Semana', value: 'week' },
            { label: 'Este Mes', value: 'month' },
            { label: 'Este Año', value: 'year' },
            { label: 'Todos', value: 'all' }
          ]}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
      </div>

      {/* Tabla de productos con API */}
      <TopProductsTable
        title={`${title} - ${getPeriodLabel(selectedPeriod)}`}
        period={selectedPeriod}
        limit={10}
        useAPI={true}
      />
    </div>
  );
};

export default TopProductsTableAPI;
