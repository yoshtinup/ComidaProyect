import React from 'react';
import PropTypes from 'prop-types';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

const KPICard = ({ title, value, trend, percentage, icon: Icon, subtitle, confidenceInterval, previousValue }) => {
  const getTrendIcon = () => {
    if (trend === 'up' || trend === 'positive') {
      return <ArrowUp className="w-4 h-4 text-green-600" />;
    } else if (trend === 'down' || trend === 'negative') {
      return <ArrowDown className="w-4 h-4 text-red-600" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    if (trend === 'up' || trend === 'positive') {
      return 'text-green-600';
    } else if (trend === 'down' || trend === 'negative') {
      return 'text-red-600';
    } else {
      return 'text-gray-600';
    }
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `$${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `$${(val / 1000).toFixed(1)}K`;
      } else if (title.toLowerCase().includes('revenue') || title.toLowerCase().includes('value')) {
        return `$${val.toFixed(2)}`;
      } else if (title.toLowerCase().includes('%') || title.toLowerCase().includes('rate') || title.toLowerCase().includes('satisfaction')) {
        return `${val}%`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  // Calcular cambio porcentual si hay valor anterior
  const percentChange = previousValue && previousValue !== 0 ? 
    ((value - previousValue) / previousValue) * 100 : 
    percentage;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="p-2 bg-gray-100 rounded-lg">
              <Icon className="w-5 h-5 text-gray-700" />
            </div>
          )}
          <h3 className="text-sm font-medium text-gray-600 font-['Plus_Jakarta_Sans']">
            {title}
          </h3>
        </div>
        
        {(percentChange !== undefined && percentChange !== null) && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium font-['Plus_Jakarta_Sans']">
              {Math.abs(percentChange).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
          {formatValue(value)}
        </div>
        
        {subtitle && (
          <p className="text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
            {subtitle}
          </p>
        )}

        {/* Interval de Confianza */}
        {confidenceInterval && (
          <div className="mt-3 p-2 bg-gray-50 rounded border">
            <div className="text-xs text-gray-600 font-['Plus_Jakarta_Sans'] mb-1">
              {confidenceInterval.confidence || 95}% Intervalo de Confianza
            </div>
            <div className="text-xs font-medium text-gray-700 font-['Plus_Jakarta_Sans']">
              {formatValue(confidenceInterval.lowerBound)} - {formatValue(confidenceInterval.upperBound)}
            </div>
          </div>
        )}

        {/* Valor anterior para comparación */}
        {previousValue && (
          <div className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
            Anterior: {formatValue(previousValue)}
          </div>
        )}
      </div>
    </div>
  );
};

KPICard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.oneOf(['up', 'down', 'stable', 'positive', 'negative']),
  percentage: PropTypes.number,
  icon: PropTypes.elementType,
  subtitle: PropTypes.string,
  confidenceInterval: PropTypes.shape({
    lowerBound: PropTypes.number,
    upperBound: PropTypes.number,
    confidence: PropTypes.number
  }),
  previousValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default KPICard;
