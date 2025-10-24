import React from 'react';
import PropTypes from 'prop-types';
import { TrendingUp, AlertCircle, Target } from 'lucide-react';

const InsightsPanel = ({ insights }) => {
  const { opportunities = [], risks = [], recommendations = [] } = insights || {};

  const InsightSection = ({ title, items, icon: Icon, borderColor }) => {
    if (!items || items.length === 0) return null;

    return (
      <div className={`bg-white border ${borderColor} rounded-lg p-4 hover:shadow-sm transition-shadow`}>
        <div className="flex items-center space-x-2 mb-3">
          <div className="p-1.5 bg-gray-100 rounded-lg">
            <Icon className="w-4 h-4 text-gray-700" />
          </div>
          <h4 className="font-semibold text-gray-900 font-['Plus_Jakarta_Sans']">
            {title}
          </h4>
        </div>
        <ul className="space-y-2">
          {items.map((item, index) => {
            // Manejar tanto strings como objetos
            const message = typeof item === 'string' ? item : item?.message || 'Sin información disponible';
            
            return (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-600 font-['Plus_Jakarta_Sans'] leading-relaxed">
                  {message}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <InsightSection
          title="Oportunidades"
          items={opportunities}
          icon={TrendingUp}
          borderColor="border-gray-200"
        />
        
        <InsightSection
          title="Riesgos"
          items={risks}
          icon={AlertCircle}
          borderColor="border-gray-200"
        />
        
        <InsightSection
          title="Recomendaciones"
          items={recommendations}
          icon={Target}
          borderColor="border-gray-200"
        />
      </div>
    </div>
  );
};

InsightsPanel.propTypes = {
  insights: PropTypes.shape({
    opportunities: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        message: PropTypes.string,
        type: PropTypes.string,
        priority: PropTypes.string
      })
    ])),
    risks: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        message: PropTypes.string,
        type: PropTypes.string,
        priority: PropTypes.string
      })
    ])),
    recommendations: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        message: PropTypes.string,
        type: PropTypes.string,
        priority: PropTypes.string
      })
    ]))
  })
};

export default InsightsPanel;
