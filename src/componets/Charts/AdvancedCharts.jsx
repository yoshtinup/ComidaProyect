import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ComposedChart } from 'recharts';

const CustomHistogramChart = ({ data, title = "Histograma" }) => {
  if (!data || !data.labels || !data.frequencies) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-['Plus_Jakarta_Sans']">
          📊 {title}
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No hay datos disponibles para el histograma
        </div>
      </div>
    );
  }

  // Transformar datos para Recharts
  const chartData = data.labels.map((label, index) => ({
    range: label,
    frequency: data.frequencies[index] || 0,
    label: `${label}: ${data.frequencies[index] || 0} casos`
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 font-['Plus_Jakarta_Sans']">
          📊 {title}
        </h3>
        <div className="text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
          Distribución de frecuencias
        </div>
      </div>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="range" 
              tick={{ fontSize: 12, fill: '#666' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#666' }}
              label={{ value: 'Frecuencia', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                      <p className="font-medium text-gray-800 font-['Plus_Jakarta_Sans']">
                        Rango: {label}
                      </p>
                      <p className="text-blue-600 font-['Plus_Jakarta_Sans']">
                        Frecuencia: {payload[0].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="frequency" 
              fill="#4f46e5"
              stroke="#3730a3"
              strokeWidth={1}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
        * Cada barra representa la cantidad de observaciones en ese rango de valores
      </div>
    </div>
  );
};

const CustomScatterChart = ({ data, title = "Gráfico de Dispersión" }) => {
  if (!data || !data.points || !Array.isArray(data.points)) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-['Plus_Jakarta_Sans']">
          🎯 {title}
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No hay datos disponibles para el scatter plot
        </div>
      </div>
    );
  }

  const scatterData = data.points.map(point => ({
    x: point.x,
    y: point.y,
    label: point.label || `(${point.x}, ${point.y})`
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 font-['Plus_Jakarta_Sans']">
          🎯 {title}
        </h3>
        <div className="text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
          {data.trendLine ? 'Con línea de tendencia' : 'Correlación de datos'}
        </div>
      </div>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <ScatterChart data={scatterData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number"
              dataKey="x"
              name={data.xAxis?.title || 'X'}
              tick={{ fontSize: 12, fill: '#666' }}
              label={{ value: data.xAxis?.title || 'X', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number"
              dataKey="y"
              name={data.yAxis?.title || 'Y'}
              tick={{ fontSize: 12, fill: '#666' }}
              label={{ value: data.yAxis?.title || 'Y', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                      <p className="font-medium text-gray-800 font-['Plus_Jakarta_Sans']">
                        {data.label}
                      </p>
                      <p className="text-blue-600 font-['Plus_Jakarta_Sans']">
                        X: {data.x}, Y: {data.y}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter 
              dataKey="y"
              fill="#10b981"
              stroke="#059669"
              strokeWidth={1}
              r={4}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      {data.trendLine && (
        <div className="mt-2 text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
          ✨ Línea de tendencia habilitada - muestra correlación entre variables
        </div>
      )}
    </div>
  );
};

const CustomBoxPlotChart = ({ data, title = "Diagrama de Caja" }) => {
  if (!data || !data.stats) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-['Plus_Jakarta_Sans']">
          📦 {title}
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No hay datos disponibles para el box plot
        </div>
      </div>
    );
  }

  const { stats } = data;
  const { min, q1, median, q3, max, outliers = [] } = stats;

  // Crear datos para simular un box plot usando ComposedChart
  const boxData = [
    {
      category: 'Distribución',
      min: min,
      q1: q1,
      median: median,
      q3: q3,
      max: max,
      iqr: q3 - q1,
      range: max - min
    }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 font-['Plus_Jakarta_Sans']">
          📦 {title}
        </h3>
        <div className="text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
          Análisis de distribución
        </div>
      </div>
      
      {/* Estadísticas en formato visual */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800 font-['Plus_Jakarta_Sans']">{min}</div>
          <div className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">Mínimo</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600 font-['Plus_Jakarta_Sans']">{q1}</div>
          <div className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">Q1 (25%)</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600 font-['Plus_Jakarta_Sans']">{median}</div>
          <div className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">Mediana</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600 font-['Plus_Jakarta_Sans']">{q3}</div>
          <div className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">Q3 (75%)</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800 font-['Plus_Jakarta_Sans']">{max}</div>
          <div className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">Máximo</div>
        </div>
      </div>

      {/* Visualización de la caja */}
      <div className="relative h-32 bg-gray-50 rounded-lg p-4 mb-4">
        <div className="relative h-full">
          {/* Línea de rango completo */}
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-0.5 bg-gray-300"></div>
          
          {/* Caja IQR */}
          <div 
            className="absolute top-1/4 h-1/2 bg-blue-100 border-2 border-blue-500 rounded"
            style={{
              left: `${((q1 - min) / (max - min)) * 100}%`,
              width: `${((q3 - q1) / (max - min)) * 100}%`
            }}
          >
            {/* Línea de mediana */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-green-600"
              style={{
                left: `${((median - q1) / (q3 - q1)) * 100}%`
              }}
            ></div>
          </div>
          
          {/* Bigotes */}
          <div 
            className="absolute top-1/3 h-1/3 w-0.5 bg-gray-400"
            style={{ left: '0%' }}
          ></div>
          <div 
            className="absolute top-1/3 h-1/3 w-0.5 bg-gray-400"
            style={{ right: '0%' }}
          ></div>
        </div>
      </div>

      {/* Outliers */}
      {outliers.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 font-['Plus_Jakarta_Sans']">
            ⚠️ Valores atípicos:
          </h4>
          <div className="flex flex-wrap gap-2">
            {outliers.map((outlier, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-['Plus_Jakarta_Sans']"
              >
                {outlier}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
        * IQR (Rango Intercuartílico): {(q3 - q1).toFixed(2)} | Rango total: {(max - min).toFixed(2)}
      </div>
    </div>
  );
};

// Props validation
CustomHistogramChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.array,
    frequencies: PropTypes.array
  }),
  title: PropTypes.string
};

CustomScatterChart.propTypes = {
  data: PropTypes.shape({
    points: PropTypes.array,
    xAxis: PropTypes.object,
    yAxis: PropTypes.object,
    trendLine: PropTypes.bool
  }),
  title: PropTypes.string
};

CustomBoxPlotChart.propTypes = {
  data: PropTypes.shape({
    stats: PropTypes.shape({
      min: PropTypes.number,
      q1: PropTypes.number,
      median: PropTypes.number,
      q3: PropTypes.number,
      max: PropTypes.number,
      outliers: PropTypes.array
    })
  }),
  title: PropTypes.string
};

export { CustomHistogramChart, CustomScatterChart, CustomBoxPlotChart };
