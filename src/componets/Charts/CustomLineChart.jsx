import React from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const CustomLineChart = ({ data, title, height = 300 }) => {
  // Debug: Log de datos recibidos
  console.log('🔧 CustomLineChart recibió datos:', data);
  if (data.length > 0) {
    console.log('🔧 Estructura del primer elemento:', Object.keys(data[0]));
  }
  
  const formatTooltipValue = (value, name) => {
    if (name === 'avgAmount' || name === 'averageOrderValue') {
      return [`$${value.toFixed(2)}`, 'Ticket Promedio'];
    }
    if (name === 'orders') {
      return [value, 'Órdenes'];
    }
    if (name.includes('mes') || name.includes('month')) {
      return [`$${value.toLocaleString()}`, name];
    }
    return [value, name];
  };

  // Colores elegantes en escala de grises y negro
  const colors = ['#111827', '#374151', '#6b7280', '#9ca3af', '#d1d5db'];

  // Detectar qué campos de datos tenemos (excluyendo 'name')
  const dataKeys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'name') : [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Plus_Jakarta_Sans']">
        {title}
      </h3>
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              fontSize: '12px',
              color: '#374151'
            }}
          />
          
          {/* Renderizar múltiples líneas dinámicamente */}
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: colors[index % colors.length], strokeWidth: 3, fill: 'white' }}
              name={key.charAt(0).toUpperCase() + key.slice(1)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

CustomLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  height: PropTypes.number
};

export default CustomLineChart;
