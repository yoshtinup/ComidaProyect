import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const CustomBarChart = ({ data, title, height = 300 }) => {
  // Debug: Log de datos recibidos
  console.log('🔧 CustomBarChart recibió datos:', data);
  if (data.length > 0) {
    console.log('🔧 Estructura del primer elemento:', Object.keys(data[0]));
  }
  
  const formatTooltipValue = (value, name) => {
    if (name === 'revenue' || name === 'Ingresos') {
      return [`$${value.toLocaleString()}`, 'Ingresos'];
    }
    if (name === 'orders' || name === 'Órdenes') {
      return [value, 'Órdenes'];
    }
    return [value, name];
  };

  const formatYAxisTick = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Plus_Jakarta_Sans']">
        {title}
      </h3>
      
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#374151', fontFamily: 'Plus Jakarta Sans' }}
            tickLine={{ stroke: '#d1d5db' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#374151', fontFamily: 'Plus Jakarta Sans' }}
            tickLine={{ stroke: '#d1d5db' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={formatYAxisTick}
          />
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
          />
          {/* Detectar automáticamente qué campos usar */}
          {data.length > 0 && (() => {
            const sampleData = data[0];
            const keys = Object.keys(sampleData).filter(key => key !== 'name');
            
            return keys.map((key, index) => {
              // Paleta de grises y negro elegante
              const colors = ['#111827', '#374151', '#6b7280', '#9ca3af', '#d1d5db'];
              const isRevenue = key.toLowerCase().includes('ingreso') || key === 'revenue';
              
              return (
                <Bar 
                  key={key}
                  dataKey={key} 
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                  name={key}
                />
              );
            });
          })()}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

CustomBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  height: PropTypes.number
};

export default CustomBarChart;
