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
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';

const GaussianChart = ({ data, targetValue, title, height = 350, xAxisLabel = "Valor", yAxisLabel = "Probabilidad", dataType = "continuous", mean, stdDeviation }) => {
  console.log('🔔 GaussianChart recibió datos:', data);

  // Verificar si los datos son válidos
  const hasValidData = data && ((data.data_points && data.data_points.length > 0) || (dataType === "discrete" && data.data_points));

  if (!hasValidData) {
    console.log('❌ GaussianChart: No hay datos válidos para mostrar');
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Plus_Jakarta_Sans']">
          {title}
        </h3>
        <div className="flex items-center justify-center h-80 text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-['Plus_Jakarta_Sans']">No hay datos de distribución disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  // Normalizar los datos según el tipo
  const normalizedData = dataType === "discrete" ? 
    data.data_points.map(point => ({
      x: point.quantity || point.value || point.x,
      probability: point.probability
    })) :
    data.data_points.map(point => ({
      x: point.value || point.x,
      probability: point.probability
    }));

  const formatTooltipValue = (value, name) => {
    if (name === 'probability') {
      return [`${(value * 100).toFixed(2)}%`, 'Probabilidad'];
    }
    return [value, name];
  };

  const formatXAxisTick = (value) => {
    if (dataType === "discrete") {
      return Number(value).toFixed(0);
    }
    if (xAxisLabel.toLowerCase().includes('valor') || xAxisLabel.toLowerCase().includes('precio')) {
      return `$${Number(value).toFixed(0)}`;
    }
    return Number(value).toFixed(1);
  };

  const formatYAxisTick = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Componente de gráfica según el tipo
  const ChartComponent = dataType === "discrete" ? 
    ({ children, ...props }) => (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart {...props} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          {children}
        </BarChart>
      </ResponsiveContainer>
    ) :
    ({ children, ...props }) => (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart {...props} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          {children}
        </AreaChart>
      </ResponsiveContainer>
    );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Plus_Jakarta_Sans']">
        {title}
      </h3>
      
      <ChartComponent data={normalizedData}>
        {dataType === "continuous" && (
          <defs>
            <linearGradient id="gaussianGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#111827" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#111827" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
        )}
        
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        
        <XAxis 
          dataKey="x" 
          tick={{ fill: '#374151', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
          tickLine={{ stroke: '#d1d5db' }}
          axisLine={{ stroke: '#d1d5db' }}
          tickFormatter={formatXAxisTick}
        />
        
        <YAxis 
          tick={{ fill: '#374151', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
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
          labelFormatter={(label) => {
            if (dataType === "discrete") {
              return `${xAxisLabel}: ${Number(label).toFixed(0)}`;
            }
            if (xAxisLabel.toLowerCase().includes('valor')) {
              return `${xAxisLabel}: $${Number(label).toFixed(2)}`;
            }
            return `${xAxisLabel}: ${Number(label).toFixed(2)}`;
          }}
        />
        
        {/* Renderizado según tipo de datos */}
        {dataType === "discrete" ? (
          <Bar 
            dataKey="probability" 
            fill="#111827"
            radius={[4, 4, 0, 0]}
          />
        ) : (
          <Area 
            type="monotone" 
            dataKey="probability" 
            stroke="#111827" 
            strokeWidth={3}
            fill="url(#gaussianGradient)"
            dot={false}
          />
        )}
        
        {/* Línea de referencia para valor objetivo */}
        {targetValue && (
          <ReferenceLine 
            x={targetValue} 
            stroke="#dc2626" 
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{ 
              value: `Objetivo: ${formatXAxisTick(targetValue)}`, 
              position: "topRight",
              style: { fill: '#dc2626', fontWeight: 'bold', fontSize: '12px' }
            }}
          />
        )}
        
        {/* Línea de la media */}
        {mean && (
          <ReferenceLine 
            x={data.mean} 
            stroke="#111827" 
            strokeWidth={2}
            strokeDasharray="2 2"
            label={{ 
              value: `Media: ${formatXAxisTick(mean)}`, 
              position: "topLeft",
              style: { fill: '#111827', fontWeight: 'bold', fontSize: '12px' }
            }}
          />
        )}
      </ChartComponent>
      
      {/* Panel de estadísticas */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 font-['Plus_Jakarta_Sans']">Media</p>
          <p className="text-lg font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
            {Number(data.mean).toFixed(2)}
          </p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 font-['Plus_Jakarta_Sans']">Desviación Estándar</p>
          <p className="text-lg font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
            ±{Number(data.std_deviation).toFixed(2)}
          </p>
        </div>
        
        {data.probability_within_target && (
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-['Plus_Jakarta_Sans']">Cumplimiento</p>
            <p className="text-lg font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
              {(data.probability_within_target * 100).toFixed(1)}%
            </p>
          </div>
        )}
        
        {data.sample_size && (
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-['Plus_Jakarta_Sans']">Muestra</p>
            <p className="text-lg font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
              {data.sample_size}
            </p>
          </div>
        )}
      </div>
      
      {/* Insights adicionales */}
      {data.confidence_intervals && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2 font-['Plus_Jakarta_Sans']">
            Intervalos de Confianza
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {data.confidence_intervals['68_percent'] && (
              <div>
                <span className="text-blue-700 font-['Plus_Jakarta_Sans']">68%:</span>
                <span className="ml-2 text-blue-900 font-['Plus_Jakarta_Sans']">
                  [{data.confidence_intervals['68_percent'][0].toFixed(2)}, {data.confidence_intervals['68_percent'][1].toFixed(2)}]
                </span>
              </div>
            )}
            {data.confidence_intervals['95_percent'] && (
              <div>
                <span className="text-blue-700 font-['Plus_Jakarta_Sans']">95%:</span>
                <span className="ml-2 text-blue-900 font-['Plus_Jakarta_Sans']">
                  [{data.confidence_intervals['95_percent'][0].toFixed(2)}, {data.confidence_intervals['95_percent'][1].toFixed(2)}]
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

GaussianChart.propTypes = {
  data: PropTypes.shape({
    mean: PropTypes.number.isRequired,
    std_deviation: PropTypes.number.isRequired,
    data_points: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number.isRequired,
      probability: PropTypes.number.isRequired
    })).isRequired,
    probability_within_target: PropTypes.number,
    sample_size: PropTypes.number,
    confidence_intervals: PropTypes.object
  }).isRequired,
  targetValue: PropTypes.number,
  title: PropTypes.string.isRequired,
  height: PropTypes.number,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string
};

export default GaussianChart;
