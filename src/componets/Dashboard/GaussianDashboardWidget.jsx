import React, { useState } from 'react';
import GaussianChart from '../Charts/GaussianChart';
import { useGaussianData } from '../../hooks/useGaussianData';
import LoadingSpinner from '../Dashboard/LoadingSpinner';

const GaussianDashboardWidget = () => {
  const [period, setPeriod] = useState('week');
  const [targetTime, setTargetTime] = useState(15);
  
  const { data, loading, error, refetch, lastFetch } = useGaussianData({
    period,
    target_time: targetTime,
    confidence_level: 95,
    data_points: 50
  });

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center h-80">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-['Plus_Jakarta_Sans']">
          Distribución de Tiempos de Entrega
        </h3>
        <div className="flex items-center justify-center h-80 text-red-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-['Plus_Jakarta_Sans']">Error al cargar análisis gaussiano</p>
            <button 
              onClick={refetch}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 font-['Plus_Jakarta_Sans']">
              Período:
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-['Plus_Jakarta_Sans'] focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="week">Última Semana</option>
              <option value="month">Último Mes</option>
              <option value="year">Último Año</option>
              <option value="all">Todo el Tiempo</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 font-['Plus_Jakarta_Sans']">
              Objetivo (min):
            </label>
            <input
              type="number"
              value={targetTime}
              onChange={(e) => setTargetTime(Number(e.target.value))}
              min="1"
              max="60"
              className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm font-['Plus_Jakarta_Sans'] focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          
          <button
            onClick={refetch}
            className="px-4 py-1 bg-gray-900 text-white rounded-md text-sm font-['Plus_Jakarta_Sans'] hover:bg-gray-800 transition-colors"
          >
            Actualizar
          </button>
          
          {lastFetch && (
            <span className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
              Actualizado: {lastFetch.toLocaleTimeString('es-ES')}
            </span>
          )}
        </div>
      </div>

      {/* Gráfica Gaussiana */}
      {data && (
        <GaussianChart
          data={data}
          targetValue={targetTime}
          title="Distribución de Tiempos de Entrega"
          height={400}
          xAxisLabel="Tiempo (minutos)"
          yAxisLabel="Probabilidad"
        />
      )}
    </div>
  );
};

export default GaussianDashboardWidget;
