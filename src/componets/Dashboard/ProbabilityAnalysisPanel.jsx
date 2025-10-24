import React from 'react';
import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus, Target, AlertTriangle } from 'lucide-react';

const ProbabilityAnalysisPanel = ({ data }) => {
  if (!data || !data.predictions) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-['Plus_Jakarta_Sans']">
          📊 Análisis Probabilístico
        </h3>
        <p className="text-gray-500 text-center py-8 font-['Plus_Jakarta_Sans']">
          No hay datos de predicción disponibles
        </p>
      </div>
    );
  }

  const { predictions, confidenceIntervals, trends, metadata } = data;

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'stable':
        return <Minus className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-600 bg-green-50';
      case 'decreasing':
        return 'text-red-600 bg-red-50';
      case 'stable':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const formatValue = (value, unit = '') => {
    if (typeof value !== 'number') return 'N/A';
    return `${value.toFixed(2)}${unit}`;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-['Plus_Jakarta_Sans']">
          📊 Análisis Probabilístico
        </h3>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Target className="w-4 h-4" />
          <span>{metadata?.type || 'Análisis'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Predicción */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 font-['Plus_Jakarta_Sans']">🔮 Predicción</h4>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-['Plus_Jakarta_Sans']">Próximo período</span>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(predictions.confidence)}`}>
                {(predictions.confidence * 100).toFixed(0)}% confianza
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 font-['Plus_Jakarta_Sans']">
              {formatValue(predictions.nextPeriod, metadata?.unit === 'pesos' ? ' MXN' : '')}
            </div>
            
            <div className={`flex items-center space-x-1 mt-2 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(predictions.trend)}`}>
              {getTrendIcon(predictions.trend)}
              <span className="capitalize">{predictions.trend || 'Sin tendencia'}</span>
              {predictions.trendValue && (
                <span>({formatValue(predictions.trendValue, '%')})</span>
              )}
            </div>
          </div>
        </div>

        {/* Intervalos de Confianza */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 font-['Plus_Jakarta_Sans']">📈 Intervalos de Confianza</h4>
          
          <div className="space-y-3">
            {Object.entries(confidenceIntervals).map(([level, interval]) => (
              <div key={level} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 font-['Plus_Jakarta_Sans']">
                    {level}
                  </span>
                  <span className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
                    ±{formatValue(interval.marginOfError)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {formatValue(interval.lower)} - {formatValue(interval.upper)}
                  </span>
                  <span className="font-medium text-gray-800">
                    μ = {formatValue(interval.mean)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Análisis de Tendencias */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 font-['Plus_Jakarta_Sans']">📊 Tendencias</h4>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <div className={`flex items-center space-x-2 mb-3 px-3 py-2 rounded-full ${getTrendColor(trends.trend)}`}>
              {getTrendIcon(trends.trend)}
              <span className="font-medium capitalize">
                {trends.trend || 'Sin definir'}
              </span>
            </div>
            
            {trends.strength !== undefined && (
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-['Plus_Jakarta_Sans']">Fuerza</span>
                  <span className="font-medium">{formatValue(trends.strength, '%')}</span>
                </div>
              </div>
            )}
            
            {trends.changePercent !== undefined && (
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-['Plus_Jakarta_Sans']">Cambio</span>
                  <span className={`font-medium ${trends.changePercent > 0 ? 'text-green-600' : trends.changePercent < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {trends.changePercent > 0 ? '+' : ''}{formatValue(trends.changePercent, '%')}
                  </span>
                </div>
              </div>
            )}
            
            {trends.firstHalfAverage !== undefined && trends.secondHalfAverage !== undefined && (
              <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span>1ª mitad: {formatValue(trends.firstHalfAverage)}</span>
                  <span>2ª mitad: {formatValue(trends.secondHalfAverage)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metadata */}
      {metadata && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{metadata.description}</span>
            <span>Unidad: {metadata.unit}</span>
          </div>
        </div>
      )}
    </div>
  );
};

ProbabilityAnalysisPanel.propTypes = {
  data: PropTypes.shape({
    predictions: PropTypes.object,
    confidenceIntervals: PropTypes.object,
    trends: PropTypes.object,
    metadata: PropTypes.object
  })
};

export default ProbabilityAnalysisPanel;
