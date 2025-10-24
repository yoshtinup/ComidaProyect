import React from 'react';
import PropTypes from 'prop-types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const CustomPieChart = ({ data, title, height = 300 }) => {
  console.log('🔧 CustomPieChart recibió datos:', data);

  // Verificar si los datos son válidos y útiles
  const hasValidData = data && data.length > 0 && 
    !data.some(item => item.label?.toLowerCase().includes('error')) &&
    data.some(item => item.value > 0);

  if (!hasValidData) {
    console.log('❌ CustomPieChart: No hay datos válidos para mostrar');
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Plus_Jakarta_Sans']">
          {title}
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="font-['Plus_Jakarta_Sans']">No hay datos disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  // Colores elegantes en escala de grises y negro
  const COLORS = [
    '#111827', // Gray-900
    '#1f2937', // Gray-800
    '#374151', // Gray-700
    '#4b5563', // Gray-600
    '#6b7280', // Gray-500
    '#9ca3af', // Gray-400
    '#d1d5db', // Gray-300
  ];

  const formatTooltipValue = (value, name) => {
    return [`$${value.toLocaleString()}`, name];
  };

  const renderCustomLabel = (entry) => {
    return `${entry.percentage}%`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Plus_Jakarta_Sans']">
        {title}
      </h3>
      
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '12px' }}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontFamily: 'Plus Jakarta Sans',
              fontSize: '14px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={formatTooltipValue}
          />
          <Legend 
            wrapperStyle={{ 
              fontFamily: 'Plus Jakarta Sans',
              fontSize: '14px',
              color: '#374151'
            }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

CustomPieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percentage: PropTypes.number
  })).isRequired,
  title: PropTypes.string.isRequired,
  height: PropTypes.number
};

export default CustomPieChart;
