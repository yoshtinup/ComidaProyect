import React from 'react';
import PropTypes from 'prop-types';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  PieChart,
  Calculator,
  Zap
} from 'lucide-react';

const StatisticsPanel = ({ statistics }) => {
  if (!statistics) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Plus_Jakarta_Sans'] flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Estadísticas Detalladas
        </h3>
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-['Plus_Jakarta_Sans']">
            No hay estadísticas disponibles
          </p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, children, icon: Icon, color = "blue" }) => {
    const colorClasses = {
      blue: "border-blue-200 bg-blue-50",
      green: "border-green-200 bg-green-50", 
      purple: "border-purple-200 bg-purple-50",
      orange: "border-orange-200 bg-orange-50"
    };

    return (
      <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
        <div className="flex items-center space-x-2 mb-3">
          <Icon className="w-4 h-4 text-gray-600" />
          <h4 className="text-sm font-semibold text-gray-900 font-['Plus_Jakarta_Sans']">
            {title}
          </h4>
        </div>
        <div className="space-y-2">
          {children}
        </div>
      </div>
    );
  };

  const StatItem = ({ label, value, unit = "" }) => (
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-600 font-['Plus_Jakarta_Sans']">{label}:</span>
      <span className="text-sm font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
        {typeof value === 'number' ? value.toLocaleString() : value}{unit}
      </span>
    </div>
  );

  const { centralTendency, dispersion, shape, percentiles, basic } = statistics;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 font-['Plus_Jakarta_Sans'] flex items-center">
        <Calculator className="w-5 h-5 mr-2" />
        Estadísticas Detalladas
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tendencia Central */}
        {centralTendency && (
          <StatCard title="Tendencia Central" icon={TrendingUp} color="blue">
            <StatItem label="Media" value={centralTendency.mean} />
            <StatItem label="Mediana" value={centralTendency.median} />
            <StatItem label="Moda" value={centralTendency.mode} />
          </StatCard>
        )}

        {/* Dispersión */}
        {dispersion && (
          <StatCard title="Dispersión" icon={Activity} color="green">
            <StatItem label="Desv. Estándar" value={dispersion.standardDeviation} />
            <StatItem label="Varianza" value={dispersion.variance} />
            <StatItem label="Rango" value={dispersion.range} />
            <StatItem label="Coef. Variación" value={dispersion.coefficientOfVariation} unit="%" />
          </StatCard>
        )}

        {/* Forma de Distribución */}
        {shape && (
          <StatCard title="Forma de Distribución" icon={PieChart} color="purple">
            <StatItem label="Sesgo" value={shape.skewness} />
            <div className="text-xs text-gray-600 font-['Plus_Jakarta_Sans'] mt-1">
              {shape.skewnessInterpretation}
            </div>
            <StatItem label="Curtosis" value={shape.kurtosis} />
            <div className="text-xs text-gray-600 font-['Plus_Jakarta_Sans'] mt-1">
              {shape.kurtosisInterpretation}
            </div>
          </StatCard>
        )}

        {/* Información Básica */}
        {basic && (
          <StatCard title="Información Básica" icon={Zap} color="orange">
            <StatItem label="Cantidad" value={basic.count} />
            <StatItem label="Suma Total" value={basic.sum} />
            <StatItem label="Mínimo" value={basic.min} />
            <StatItem label="Máximo" value={basic.max} />
          </StatCard>
        )}
      </div>

      {/* Percentiles */}
      {percentiles && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 font-['Plus_Jakarta_Sans'] flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Percentiles
          </h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Object.entries(percentiles).map(([percentile, value]) => (
              <div key={percentile} className="text-center">
                <div className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">P{percentile}</div>
                <div className="text-sm font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
          <span>Análisis estadístico completo</span>
          <div className="flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>Actualizado en tiempo real</span>
          </div>
        </div>
      </div>
    </div>
  );
};

StatisticsPanel.propTypes = {
  statistics: PropTypes.shape({
    centralTendency: PropTypes.shape({
      mean: PropTypes.number,
      median: PropTypes.number,
      mode: PropTypes.number
    }),
    dispersion: PropTypes.shape({
      standardDeviation: PropTypes.number,
      variance: PropTypes.number,
      range: PropTypes.number,
      coefficientOfVariation: PropTypes.number
    }),
    shape: PropTypes.shape({
      skewness: PropTypes.number,
      skewnessInterpretation: PropTypes.string,
      kurtosis: PropTypes.number,
      kurtosisInterpretation: PropTypes.string
    }),
    percentiles: PropTypes.object,
    basic: PropTypes.shape({
      count: PropTypes.number,
      sum: PropTypes.number,
      min: PropTypes.number,
      max: PropTypes.number
    })
  })
};

export default StatisticsPanel;
