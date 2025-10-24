import React from 'react';
import PropTypes from 'prop-types';
import { 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target,
  Activity,
  BarChart3
} from 'lucide-react';

const RecommendationsPanel = ({ recommendations = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'prediction':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const getColorClasses = (type) => {
    switch (type) {
      case 'opportunity':
        return 'bg-green-50 border-green-200 text-green-800 border-l-green-500';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 border-l-yellow-500';
      case 'prediction':
        return 'bg-blue-50 border-blue-200 text-blue-800 border-l-blue-500';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 border-l-gray-500';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'opportunity':
        return 'Oportunidad';
      case 'warning':
        return 'Advertencia';
      case 'prediction':
        return 'Predicción';
      default:
        return 'Recomendación';
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Plus_Jakarta_Sans'] flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Insights y Recomendaciones
        </h3>
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-['Plus_Jakarta_Sans']">
            No hay recomendaciones disponibles para este período
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Plus_Jakarta_Sans'] flex items-center">
        <Target className="w-5 h-5 mr-2" />
        Insights y Recomendaciones
      </h3>
      
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`p-4 border-l-4 rounded-r-lg border ${getColorClasses(rec.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getIcon(rec.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium uppercase tracking-wide">
                    {getTypeLabel(rec.type)}
                  </span>
                </div>
                <p className="text-sm font-['Plus_Jakarta_Sans'] leading-relaxed">
                  {rec.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer con resumen */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
          <span>
            {recommendations.filter(r => r.type === 'opportunity').length} oportunidades,{' '}
            {recommendations.filter(r => r.type === 'warning').length} advertencias,{' '}
            {recommendations.filter(r => r.type === 'prediction').length} predicciones
          </span>
          <div className="flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>Actualizado automáticamente</span>
          </div>
        </div>
      </div>
    </div>
  );
};

RecommendationsPanel.propTypes = {
  recommendations: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['opportunity', 'warning', 'prediction']).isRequired,
      message: PropTypes.string.isRequired
    })
  )
};

export default RecommendationsPanel;
