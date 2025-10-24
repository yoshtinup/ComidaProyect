import React from 'react';
import PropTypes from 'prop-types';

const StatCard = ({ title, value, description, unit = '' }) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (Math.abs(val) >= 1000000) {
        return `${(val / 1000000).toFixed(2)}M`;
      } else if (Math.abs(val) >= 1000) {
        return `${(val / 1000).toFixed(2)}K`;
      } else {
        return val.toFixed(2);
      }
    }
    return val;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-center">
        <h4 className="text-sm font-medium text-gray-600 mb-2 font-['Plus_Jakarta_Sans']">
          {title}
        </h4>
        <div className="text-xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
          {formatValue(value)}{unit}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1 font-['Plus_Jakarta_Sans']">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  unit: PropTypes.string
};

const DescriptiveStats = ({ probabilityData }) => {
  if (!probabilityData || !probabilityData.descriptiveStatistics) {
    return null;
  }

  const stats = probabilityData.descriptiveStatistics;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 font-['Plus_Jakarta_Sans']">
        Estadísticas Descriptivas
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Media"
          value={stats.mean || 0}
          description="Promedio de ventas"
          unit="$"
        />
        
        <StatCard
          title="Mediana"
          value={stats.median || 0}
          description="Valor central"
          unit="$"
        />
        
        <StatCard
          title="Desviación Estándar"
          value={stats.standardDeviation || 0}
          description="Variabilidad"
          unit="$"
        />
        
        <StatCard
          title="Coeficiente de Variación"
          value={stats.coefficientOfVariation || 0}
          description="Variabilidad relativa"
          unit="%"
        />
      </div>

      {/* Distribuciones de probabilidad si están disponibles */}
      {probabilityData.probabilityDistributions && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4 font-['Plus_Jakarta_Sans']">
            Análisis de Distribución
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {probabilityData.probabilityDistributions.normal && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-2 font-['Plus_Jakarta_Sans']">
                  Distribución Normal
                </h5>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Media: ${probabilityData.probabilityDistributions.normal.parameters?.mean?.toFixed(2) || 'N/A'}</div>
                  <div>Desv. Estándar: ${probabilityData.probabilityDistributions.normal.parameters?.standardDeviation?.toFixed(2) || 'N/A'}</div>
                </div>
              </div>
            )}
            
            {probabilityData.predictions && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-700 mb-2 font-['Plus_Jakarta_Sans']">
                  Predicción Próximo Período
                </h5>
                <div className="text-lg font-bold text-blue-900 font-['Plus_Jakarta_Sans']">
                  ${probabilityData.predictions.nextPeriod?.toFixed(2) || 'N/A'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

DescriptiveStats.propTypes = {
  probabilityData: PropTypes.shape({
    descriptiveStatistics: PropTypes.shape({
      mean: PropTypes.number,
      median: PropTypes.number,
      standardDeviation: PropTypes.number,
      coefficientOfVariation: PropTypes.number
    }),
    probabilityDistributions: PropTypes.object,
    predictions: PropTypes.object
  })
};

export { StatCard };
export default DescriptiveStats;
