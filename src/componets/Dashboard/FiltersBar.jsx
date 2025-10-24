import React from 'react';
import PropTypes from 'prop-types';
import { RefreshCw, Calendar, Filter, BarChart3, TrendingUp } from 'lucide-react';

const FiltersBar = ({ 
  period, 
  onPeriodChange, 
  analysisType = 'sales',
  onAnalysisTypeChange,
  timeGranularity = 'weekly',
  onTimeGranularityChange,
  onRefresh, 
  loading = false 
}) => {
  const periods = [
    { value: 'today', label: '📅 Hoy', description: 'Datos de las últimas 24 horas' },
    { value: 'week', label: '📊 Esta Semana', description: 'Últimos 7 días' },
    { value: 'month', label: '📈 Este Mes', description: 'Últimas 4 semanas' },
    { value: 'quarter', label: '🗓️ Trimestre', description: 'Últimos 3 meses' },
    { value: 'year', label: '📆 Este Año', description: 'Últimos 12 meses' }
  ];

  const analysisTypes = [
    { value: 'sales', label: '💰 Ventas', description: 'Análisis de ingresos y transacciones' },
    { value: 'products', label: '📦 Productos', description: 'Análisis de productos más vendidos' },
    { value: 'customers', label: '👥 Clientes', description: 'Análisis de comportamiento de clientes' }
  ];

  const timeGranularities = [
    { value: 'hourly', label: '⏰ Por Hora', description: 'Análisis hora por hora' },
    { value: 'daily', label: '📅 Por Día', description: 'Análisis día por día' },
    { value: 'weekly', label: '📊 Por Semana', description: 'Análisis semanal' },
    { value: 'monthly', label: '📈 Por Mes', description: 'Análisis mensual' },
    { value: 'yearly', label: '📆 Por Año', description: 'Análisis anual' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Título y descripción */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800 font-['Plus_Jakarta_Sans']">
              Análisis Probabilístico
            </h3>
          </div>
          <div className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
            Última actualización: {new Date().toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>

        {/* Controles principales */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Lado izquierdo - Filtros */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            
            {/* Selector de tipo de análisis */}
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <select
                value={analysisType}
                onChange={(e) => onAnalysisTypeChange && onAnalysisTypeChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm font-['Plus_Jakarta_Sans'] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[160px]"
                title={analysisTypes.find(a => a.value === analysisType)?.description || ''}
              >
                {analysisTypes.map((type) => (
                  <option key={type.value} value={type.value} title={type.description}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Selector de período */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={period}
                onChange={(e) => onPeriodChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm font-['Plus_Jakarta_Sans'] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[180px]"
                title={periods.find(p => p.value === period)?.description || ''}
              >
                {periods.map((p) => (
                  <option key={p.value} value={p.value} title={p.description}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de granularidad temporal */}
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <select
                value={timeGranularity}
                onChange={(e) => onTimeGranularityChange && onTimeGranularityChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm font-['Plus_Jakarta_Sans'] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[150px]"
                title={timeGranularities.find(g => g.value === timeGranularity)?.description || ''}
              >
                {timeGranularities.map((granularity) => (
                  <option key={granularity.value} value={granularity.value} title={granularity.description}>
                    {granularity.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Indicadores de estado activo */}
            <div className="flex items-center space-x-2 flex-wrap">
              <div className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                <BarChart3 className="w-3 h-3 mr-1" />
                {analysisTypes.find(a => a.value === analysisType)?.label.replace(/^[^\s]+ /, '') || 'Análisis'}
              </div>
              <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                <Calendar className="w-3 h-3 mr-1" />
                {periods.find(p => p.value === period)?.description || 'Período personalizado'}
              </div>
              <div className="flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                <TrendingUp className="w-3 h-3 mr-1" />
                {timeGranularities.find(g => g.value === timeGranularity)?.label.replace(/^[^\s]+ /, '') || 'Granularidad'}
              </div>
            </div>
          </div>

          {/* Lado derecho - Acciones */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-['Plus_Jakarta_Sans']"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
            <div className="flex items-center space-x-4">
              <span>🔄 Análisis en tiempo real</span>
              <span>📊 Datos probabilísticos</span>
              <span>🎯 Predicciones IA</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Conectado a API</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FiltersBar.propTypes = {
  period: PropTypes.string.isRequired,
  onPeriodChange: PropTypes.func.isRequired,
  analysisType: PropTypes.string,
  onAnalysisTypeChange: PropTypes.func,
  timeGranularity: PropTypes.string,
  onTimeGranularityChange: PropTypes.func,
  onRefresh: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default FiltersBar;
