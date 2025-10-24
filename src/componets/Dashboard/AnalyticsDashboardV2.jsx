import React, { useState } from 'react';
import { useDashboardData } from '../../hooks/useDashboard2';
import KPICard from './KPICard';
import CustomBarChart from '../Charts/CustomBarChart';
import CustomLineChart from '../Charts/CustomLineChart';
import CustomPieChart from '../Charts/CustomPieChart';
import CustomAreaChart from '../Charts/CustomAreaChart';
import GaussianChart from '../Charts/GaussianChart';
import TopProductsTable from './TopProductsTable';
import InsightsPanel from './InsightsPanel';
import LoadingSpinner from './LoadingSpinner';
import CineSnacksLoader from '../loader/CineSnacksLoader';
import DescriptiveStats from './DescriptiveStats';
import { BarChart3, LineChart, PieChart, AreaChart, Activity, TrendingUp, DollarSign, ShoppingCart, Users, Target, Percent } from 'lucide-react';

const CHART_TYPES = [
  { id: 'bar', name: 'Barras', icon: BarChart3, component: CustomBarChart },
  { id: 'line', name: 'Líneas', icon: LineChart, component: CustomLineChart },
  { id: 'pie', name: 'Circular', icon: PieChart, component: CustomPieChart },
  { id: 'area', name: 'Área', icon: AreaChart, component: CustomAreaChart },
  { id: 'gaussian', name: 'Gaussiana', icon: Activity, component: GaussianChart }
];

const AnalyticsDashboard = () => {
  const { data, loading, error, refetch, lastFetch } = useDashboardData();
  const [selectedChart, setSelectedChart] = useState('bar');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CineSnacksLoader  />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-red-200">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 font-['Plus_Jakarta_Sans']">Error al cargar datos</h2>
          <p className="text-gray-600 mb-4 font-['Plus_Jakarta_Sans']">{error}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-['Plus_Jakarta_Sans']"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const chartData = data?.charts?.revenueChart?.data || [];
  const topProducts = data?.topProducts || [];
  const insights = data?.insights || {};

  const selectedChartType = CHART_TYPES.find(chart => chart.id === selectedChart);
  const ChartComponent = selectedChartType?.component || CustomBarChart;

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-['Plus_Jakarta_Sans']">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
                Dashboard Analytics
              </h1>
              <p className="text-gray-600 font-['Plus_Jakarta_Sans']">
                Resumen completo de tu negocio
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
              <span>Actualizado: {lastFetch ? new Date(lastFetch).toLocaleTimeString('es-ES') : 'Ahora'}</span>
            </div>
          </div>
        </div>

        {/* KPI Cards - Más compactos */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <KPICard
            title="Total Órdenes"
            value={kpis.totalOrders || 0}
            icon={ShoppingCart}
            trend={kpis.growthTrend}
            percentage={kpis.growthPercentage}
            format="number"
          />
          <KPICard
            title="Ticket Promedio"
            value={kpis.averageOrderValue || 0}
            icon={DollarSign}
            trend="positive"
            percentage={8.2}
            format="currency"
          />
          <KPICard
            title="Ingresos Totales"
            value={kpis.totalRevenue || 0}
            icon={TrendingUp}
            trend={kpis.growthTrend}
            percentage={kpis.growthPercentage}
            format="currency"
          />
          <KPICard
            title="Satisfacción"
            value={kpis.customerSatisfaction || 0}
            icon={Users}
            trend="positive"
            percentage={2.1}
            format="percentage"
          />
          <KPICard
            title="Conversión"
            value={kpis.conversionRate || 0}
            icon={Target}
            trend="positive"
            percentage={5.3}
            format="percentage"
          />
          <KPICard
            title="Crecimiento"
            value={kpis.growthPercentage || 0}
            icon={Percent}
            trend={kpis.growthTrend}
            percentage={kpis.growthPercentage}
            format="percentage"
          />
        </div>

        {/* Selector de Gráfica y Gráfica Principal */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          {/* Selector de tipo de gráfica */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 font-['Plus_Jakarta_Sans']">
              Análisis de Ingresos
            </h2>
            <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
              {CHART_TYPES.map((chart) => {
                const Icon = chart.icon;
                return (
                  <button
                    key={chart.id}
                    onClick={() => setSelectedChart(chart.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      selectedChart === chart.id
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <Icon size={16} />
                    {chart.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gráfica Principal */}
          <div className="h-80">
            <ChartComponent
              data={chartData}
              title={`Ingresos por Período - Vista ${selectedChartType?.name}`}
              height={300}
            />
          </div>
        </div>

        {/* Sección inferior - 2 columnas */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Tabla de Productos */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-['Plus_Jakarta_Sans']">
              Top Productos
            </h3>
            <TopProductsTable
              useAPI={true}
              period="all"
              limit={5}
              title=""
            />
          </div>

          {/* Panel de Insights */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-['Plus_Jakarta_Sans']">
              Insights y Recomendaciones
            </h3>
            <InsightsPanel insights={insights} />
          </div>
        </div>

        {/* Estadísticas Descriptivas - Compactas */}
        {data?.probabilityData && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-['Plus_Jakarta_Sans']">
              Análisis Estadístico
            </h3>
            <DescriptiveStats probabilityData={data.probabilityData} compact={true} />
          </div>
        )}

        {/* Footer más compacto */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
            Datos actualizados automáticamente • Última actualización: {lastFetch ? new Date(lastFetch).toLocaleTimeString('es-ES') : new Date().toLocaleTimeString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
