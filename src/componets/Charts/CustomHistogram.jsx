import React from 'react';
import PropTypes from 'prop-types';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const CustomHistogram = ({ data, title, height = 300 }) => {
  const formatTooltipValue = (value, name) => {
    if (name === 'frequency') {
      return [value, 'Frecuencia'];
    }
    if (name === 'cumulative') {
      return [`${value.toFixed(1)}%`, 'Acumulado'];
    }
    return [value, name];
  };

  // Calcular datos para histograma si no están calculados
  const processedData = data.map((item, index) => {
    const total = data.reduce((sum, d) => sum + (d.frequency || d.count || 0), 0);
    const cumulative = data.slice(0, index + 1).reduce((sum, d) => sum + (d.frequency || d.count || 0), 0);
    const cumulativePercentage = total > 0 ? (cumulative / total) * 100 : 0;
    
    return {
      ...item,
      frequency: item.frequency || item.count || 0,
      cumulative: cumulativePercentage
    };
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Plus_Jakarta_Sans']">
        {title}
      </h3>
      
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="range" 
            tick={{ fontSize: 12, fill: '#6b7280', fontFamily: 'Plus Jakarta Sans' }}
            tickLine={{ stroke: '#e5e7eb' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            yAxisId="frequency"
            orientation="left"
            tick={{ fontSize: 12, fill: '#6b7280', fontFamily: 'Plus Jakarta Sans' }}
            tickLine={{ stroke: '#e5e7eb' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            yAxisId="percentage"
            orientation="right"
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: '#6b7280', fontFamily: 'Plus Jakarta Sans' }}
            tickLine={{ stroke: '#e5e7eb' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontFamily: 'Plus Jakarta Sans',
              fontSize: '14px'
            }}
            formatter={formatTooltipValue}
          />
          <Legend 
            wrapperStyle={{ 
              fontFamily: 'Plus Jakarta Sans',
              fontSize: '14px',
              color: '#6b7280'
            }}
          />
          <Bar 
            yAxisId="frequency"
            dataKey="frequency" 
            fill="#374151" 
            radius={[2, 2, 0, 0]}
            name="Frecuencia"
          />
          <Line 
            yAxisId="percentage"
            type="monotone" 
            dataKey="cumulative" 
            stroke="#9ca3af"
            strokeWidth={3}
            dot={{ fill: '#9ca3af', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#9ca3af' }}
            name="% Acumulado"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

CustomHistogram.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    range: PropTypes.string.isRequired,
    frequency: PropTypes.number,
    count: PropTypes.number
  })).isRequired,
  title: PropTypes.string.isRequired,
  height: PropTypes.number
};

export default CustomHistogram;
