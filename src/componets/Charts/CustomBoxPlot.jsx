import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer } from 'recharts';

const CustomBoxPlot = ({ data, title = "Distribución de Datos" }) => {
  if (!data || !data.stats) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-['Plus_Jakarta_Sans']">
          {title}
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p className="font-['Plus_Jakarta_Sans']">No hay datos de distribución disponibles</p>
        </div>
      </div>
    );
  }

  const { min, q1, median, q3, max, outliers = [] } = data.stats;
  
  // Configuración del gráfico
  const chartHeight = 200;
  const chartWidth = 300;
  const boxWidth = 80;
  const centerX = chartWidth / 2;
  
  // Calcular escalas
  const dataRange = max - min;
  const padding = dataRange * 0.1;
  const scale = (chartHeight - 40) / (dataRange + 2 * padding);
  
  const getY = (value) => {
    return chartHeight - 20 - ((value - min + padding) * scale);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 font-['Plus_Jakarta_Sans']">
          {data.title || title}
        </h3>
        <div className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
          📦 Distribución cuartílica
        </div>
      </div>
      
      <div className="flex">
        {/* Box Plot SVG */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={chartHeight + 40}>
            <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}>
              {/* Línea de máximo */}
              <line 
                x1={centerX} y1={getY(max)} 
                x2={centerX} y2={getY(q3)} 
                stroke="#374151" 
                strokeWidth="2"
              />
              
              {/* Línea de mínimo */}
              <line 
                x1={centerX} y1={getY(min)} 
                x2={centerX} y2={getY(q1)} 
                stroke="#374151" 
                strokeWidth="2"
              />
              
              {/* Caja (Q1 a Q3) */}
              <rect 
                x={centerX - boxWidth/2} 
                y={getY(q3)} 
                width={boxWidth} 
                height={getY(q1) - getY(q3)}
                fill="#e5e7eb"
                stroke="#374151" 
                strokeWidth="2"
              />
              
              {/* Mediana */}
              <line 
                x1={centerX - boxWidth/2} y1={getY(median)} 
                x2={centerX + boxWidth/2} y2={getY(median)} 
                stroke="#dc2626" 
                strokeWidth="3"
              />
              
              {/* Líneas de máximo y mínimo (whiskers) */}
              <line 
                x1={centerX - 15} y1={getY(max)} 
                x2={centerX + 15} y2={getY(max)} 
                stroke="#374151" 
                strokeWidth="2"
              />
              <line 
                x1={centerX - 15} y1={getY(min)} 
                x2={centerX + 15} y2={getY(min)} 
                stroke="#374151" 
                strokeWidth="2"
              />
              
              {/* Outliers */}
              {outliers.map((outlier, index) => (
                <circle 
                  key={index}
                  cx={centerX + (index % 2 === 0 ? -30 : 30)} 
                  cy={getY(outlier)} 
                  r="4" 
                  fill="#dc2626"
                  stroke="#dc2626"
                />
              ))}
              
              {/* Etiquetas de valores */}
              <text x={centerX + boxWidth/2 + 10} y={getY(max) + 5} fontSize="10" fill="#6b7280" fontFamily="Plus Jakarta Sans">Max: {max}</text>
              <text x={centerX + boxWidth/2 + 10} y={getY(q3) + 5} fontSize="10" fill="#6b7280" fontFamily="Plus Jakarta Sans">Q3: {q3}</text>
              <text x={centerX + boxWidth/2 + 10} y={getY(median) + 5} fontSize="10" fill="#dc2626" fontFamily="Plus Jakarta Sans">Med: {median}</text>
              <text x={centerX + boxWidth/2 + 10} y={getY(q1) + 5} fontSize="10" fill="#6b7280" fontFamily="Plus Jakarta Sans">Q1: {q1}</text>
              <text x={centerX + boxWidth/2 + 10} y={getY(min) + 5} fontSize="10" fill="#6b7280" fontFamily="Plus Jakarta Sans">Min: {min}</text>
            </svg>
          </ResponsiveContainer>
        </div>
        
        {/* Estadísticas */}
        <div className="w-48 ml-4 space-y-2">
          <div className="text-sm font-medium text-gray-800 font-['Plus_Jakarta_Sans'] mb-3">
            Estadísticas:
          </div>
          
          <div className="space-y-1 text-xs font-['Plus_Jakarta_Sans']">
            <div className="flex justify-between">
              <span className="text-gray-600">Mínimo:</span>
              <span className="font-medium">{min}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Q1 (25%):</span>
              <span className="font-medium">{q1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Mediana:</span>
              <span className="font-medium text-red-600">{median}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Q3 (75%):</span>
              <span className="font-medium">{q3}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Máximo:</span>
              <span className="font-medium">{max}</span>
            </div>
            {outliers.length > 0 && (
              <div className="flex justify-between border-t pt-1 mt-2">
                <span className="text-red-600">Outliers:</span>
                <span className="font-medium text-red-600">{outliers.length}</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500 font-['Plus_Jakarta_Sans'] mt-3 pt-2 border-t">
            <p>IQR: {(q3 - q1).toFixed(2)}</p>
            <p>Rango: {(max - min).toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-600 font-['Plus_Jakarta_Sans']">
        <p>Muestra la distribución de los datos mediante cuartiles y valores atípicos</p>
      </div>
    </div>
  );
};

CustomBoxPlot.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    yAxis: PropTypes.shape({
      title: PropTypes.string
    }),
    stats: PropTypes.shape({
      min: PropTypes.number.isRequired,
      q1: PropTypes.number.isRequired,
      median: PropTypes.number.isRequired,
      q3: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      outliers: PropTypes.arrayOf(PropTypes.number)
    }).isRequired
  }),
  title: PropTypes.string
};

export default CustomBoxPlot;
