import React from 'react';
import PropTypes from 'prop-types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const CustomAreaChart = ({ data, title, height = 300 }) => {
  console.log('🔧 CustomAreaChart recibió datos:', data);

  // Detectar automáticamente las claves de datos disponibles
  const dataKeys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'name') : [];
  console.log('🔧 CustomAreaChart claves detectadas:', dataKeys);

  const formatTooltipValue = (value, name) => {
    // Formatear según el tipo de dato
    if (name.toLowerCase().includes('ingreso') || name.toLowerCase().includes('revenue')) {
      return [`$${value.toLocaleString()}`, name];
    }
    if (name.toLowerCase().includes('orden') || name.toLowerCase().includes('order')) {
      return [value, name];
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
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {dataKeys.map((key, index) => {
              const colors = ['#111827', '#374151', '#6b7280', '#9ca3af'];
              const color = colors[index % colors.length];
              
              return (
                <linearGradient key={`color${index}`} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                </linearGradient>
              );
            })}
          </defs>
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
          {dataKeys.map((key, index) => {
            const colors = ['#374151', '#9ca3af', '#6b7280', '#d1d5db'];
            const color = colors[index % colors.length];
            
            return (
              <Area 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={color}
                strokeWidth={2}
                fillOpacity={1} 
                fill={`url(#color${index})`}
                name={key}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

CustomAreaChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  height: PropTypes.number
};

export default CustomAreaChart;
