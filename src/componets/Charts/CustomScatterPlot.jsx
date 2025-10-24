import React from 'react';
import PropTypes from 'prop-types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const CustomScatterPlot = ({ data, title = "Dispersión de Datos" }) => {
  if (!data || !data.points || data.points.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-['Plus_Jakarta_Sans']">
          {title}
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p className="font-['Plus_Jakarta_Sans']">No hay datos de dispersión disponibles</p>
        </div>
      </div>
    );
  }

  // Calcular línea de tendencia si está habilitada
  const calculateTrendLine = (points) => {
    if (!points || points.length < 2) return null;
    
    const n = points.length;
    const sumX = points.reduce((sum, point) => sum + point.x, 0);
    const sumY = points.reduce((sum, point) => sum + point.y, 0);
    const sumXY = points.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumX2 = points.reduce((sum, point) => sum + point.x * point.x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    
    return [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];
  };

  const trendLine = data.trendLine ? calculateTrendLine(data.points) : null;

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 font-['Plus_Jakarta_Sans']">
          {data.title || title}
        </h3>
        <div className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
          📈 Análisis de correlación
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            data={data.points}
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number"
              dataKey="x"
              name={data.xAxis?.title || 'X'}
              tick={{ fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
              label={{ 
                value: data.xAxis?.title || 'X', 
                position: 'insideBottom', 
                offset: -10,
                style: { textAnchor: 'middle', fontFamily: 'Plus Jakarta Sans' }
              }}
            />
            <YAxis 
              type="number"
              dataKey="y"
              name={data.yAxis?.title || 'Y'}
              tick={{ fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
              label={{ 
                value: data.yAxis?.title || 'Y', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontFamily: 'Plus Jakarta Sans' }
              }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name, props) => {
                if (props.payload && props.payload.label) {
                  return [value, props.payload.label];
                }
                return [value, name];
              }}
              labelFormatter={() => ''}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontFamily: 'Plus Jakarta Sans'
              }}
            />
            <Scatter 
              dataKey="y" 
              fill="#4e73df"
              fillOpacity={0.7}
              stroke="#4e73df"
              strokeWidth={1}
            />
            
            {/* Línea de tendencia */}
            {trendLine && (
              <ReferenceLine 
                segment={[
                  { x: trendLine[0].x, y: trendLine[0].y },
                  { x: trendLine[1].x, y: trendLine[1].y }
                ]}
                stroke="#e74a3b"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-gray-600 font-['Plus_Jakarta_Sans'] flex justify-between">
        <p>Muestra la relación entre dos variables</p>
        {data.trendLine && (
          <p className="text-red-600">— — Línea de tendencia</p>
        )}
      </div>
    </div>
  );
};

CustomScatterPlot.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    xAxis: PropTypes.shape({
      title: PropTypes.string
    }),
    yAxis: PropTypes.shape({
      title: PropTypes.string
    }),
    points: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      label: PropTypes.string
    })),
    trendLine: PropTypes.bool
  }),
  title: PropTypes.string
};

export default CustomScatterPlot;
