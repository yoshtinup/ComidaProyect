import React from 'react';
import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Target } from 'lucide-react';

const ProbabilityPanel = ({ data }) => {
  if (!data) {
    return null;
  }

  const { predictions, confidenceIntervals, trends, metadata } = data;

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
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

  const formatConfidence = (confidence) => {
    return (confidence * 100).toFixed(0) + '%';
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-['Plus_Jakarta_Sans']">
          📊 Análisis Probabilístico
        </h3>
        <div className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
          {metadata?.type || 'Análisis'} • {metadata?.unit || 'valores'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Predicciones */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 font-['Plus_Jakarta_Sans'] flex items-center">
            <Target className="w-4 h-4 mr-2 text-blue-600" />
            Predicciones
          </h4>
          
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600 font-['Plus_Jakarta_Sans']">Próximo período</div>
              <div className="text-lg font-bold text-gray-800 font-['Plus_Jakarta_Sans']">
                {predictions?.nextPeriod ? predictions.nextPeriod.toFixed(2) : 'N/A'}
              </div>
              <div className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
                Confianza: {formatConfidence(predictions?.confidence || 0)}
              </div>
            </div>
            
            <div className={`p-3 rounded-lg flex items-center space-x-2 ${getTrendColor(predictions?.trend)}`}>
              {getTrendIcon(predictions?.trend)}
              <div>
                <div className="text-sm font-medium font-['Plus_Jakarta_Sans'] capitalize">
                  {predictions?.trend?.replace('_', ' ') || 'Sin datos'}
                </div>
                {predictions?.trendValue && (
                  <div className="text-xs font-['Plus_Jakarta_Sans']">
                    {predictions.trendValue > 0 ? '+' : ''}{predictions.trendValue.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Intervalos de Confianza */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 font-['Plus_Jakarta_Sans']">
            🎯 Intervalos de Confianza
          </h4>
          
          <div className="space-y-2">
            {['90%', '95%', '99%'].map((level) => {
              const interval = confidenceIntervals?.[level];
              if (!interval) return null;
              
              return (
                <div key={level} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700 font-['Plus_Jakarta_Sans']">
                      {level} Confianza
                    </span>
                    <span className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
                      ±{interval.marginOfError?.toFixed(2) || 0}
                    </span>
                  </div>
                  <div className="text-sm font-['Plus_Jakarta_Sans']">
                    <span className="text-gray-600">
                      {interval.lower?.toFixed(2) || 0} - {interval.upper?.toFixed(2) || 0}
                    </span>
                  </div>
                  <div className="text-xs text-blue-600 font-semibold font-['Plus_Jakarta_Sans']">
                    Media: {interval.mean?.toFixed(2) || 0}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tendencias */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 font-['Plus_Jakarta_Sans']">
            📈 Análisis de Tendencias
          </h4>
          
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${getTrendColor(trends?.trend)}`}>
              <div className="flex items-center space-x-2 mb-2">
                {getTrendIcon(trends?.trend)}
                <span className="text-sm font-medium font-['Plus_Jakarta_Sans'] capitalize">
                  {trends?.trend?.replace('_', ' ') || 'Sin datos'}
                </span>
              </div>
              {trends?.strength !== undefined && (
                <div className="text-xs font-['Plus_Jakarta_Sans']">
                  Fuerza: {trends.strength.toFixed(1)}%
                </div>
              )}
            </div>
            
            {trends?.changePercent !== undefined && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600 font-['Plus_Jakarta_Sans']">Cambio porcentual</div>
                <div className={`text-lg font-bold font-['Plus_Jakarta_Sans'] ${
                  trends.changePercent > 0 ? 'text-green-600' : 
                  trends.changePercent < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {trends.changePercent > 0 ? '+' : ''}{trends.changePercent.toFixed(1)}%
                </div>
              </div>
            )}
            
            {trends?.firstHalfAverage !== undefined && trends?.secondHalfAverage !== undefined && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600 font-['Plus_Jakarta_Sans'] mb-1">Comparación de períodos</div>
                <div className="flex justify-between text-xs font-['Plus_Jakarta_Sans']">
                  <span>Primera mitad: {trends.firstHalfAverage.toFixed(1)}</span>
                  <span>Segunda mitad: {trends.secondHalfAverage.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Descripción del análisis */}
      {metadata?.description && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-600 font-['Plus_Jakarta_Sans']">
            {metadata.description}
          </p>
        </div>
      )}
    </div>
  );
};

ProbabilityPanel.propTypes = {
  data: PropTypes.shape({
    predictions: PropTypes.shape({
      nextPeriod: PropTypes.number,
      confidence: PropTypes.number,
      trend: PropTypes.string,
      trendValue: PropTypes.number
    }),
    confidenceIntervals: PropTypes.object,
    trends: PropTypes.shape({
      trend: PropTypes.string,
      strength: PropTypes.number,
      changePercent: PropTypes.number,
      firstHalfAverage: PropTypes.number,
      secondHalfAverage: PropTypes.number
    }),
    metadata: PropTypes.shape({
      type: PropTypes.string,
      unit: PropTypes.string,
      description: PropTypes.string
    })
  })
};

export default ProbabilityPanel;
