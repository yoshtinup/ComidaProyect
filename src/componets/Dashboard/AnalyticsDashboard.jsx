import React from 'react';
import { useDashboardData } from '../../hooks/useDashboard2';
import KPICard from './KPICard';
import CustomBarChart from '../Charts/CustomBarChart';
import CustomLineChart from '../Charts/CustomLineChart';
import CustomPieChart from '../Charts/CustomPieChart';
import CustomAreaChart from '../Charts/CustomAreaChart';
import CustomHistogram from '../Charts/CustomHistogram';
import CustomScatterPlot from '../Charts/CustomScatterPlot';
import CustomBoxPlot from '../Charts/CustomBoxPlot';
import TopProductsTable from './TopProductsTable';
import RecommendationsPanel from './RecommendationsPanel';
import StatisticsPanel from './StatisticsPanel';
import ProbabilityPanel from './ProbabilityPanel';
import FiltersBar from './FiltersBar';
import { DashboardLoading } from './LoadingSpinner';
import { 
  ShoppingCart, 
  DollarSign, 
  BarChart3,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const { 
    data, 
    loading, 
    error, 
    refetch, 
    period, 
    changePeriod, 
    analysisType, 
    changeAnalysisType,
    timeGranularity,
    changeTimeGranularity,
    lastFetch, 
    cacheStatus 
  } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
              Dashboard Analytics
            </h1>
            <p className="text-gray-600 mt-2 font-['Plus_Jakarta_Sans']">
              Cargando datos del sistema...
            </p>
          </div>
          <DashboardLoading />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-red-200 rounded-lg p-8 text-center">
            <div className="text-red-500 mb-4">
              <BarChart3 className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 font-['Plus_Jakarta_Sans']">
              Error al cargar el dashboard
            </h2>
            <p className="text-gray-600 mb-6 font-['Plus_Jakarta_Sans']">
              {error}
            </p>
            <button
              onClick={refetch}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-['Plus_Jakarta_Sans']"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { kpis, charts, insights, topProducts, recommendations, statistics, metadata } = data || {};

  // Debug: Verificar datos de las gráficas
  React.useEffect(() => {
    if (charts) {
      console.log('🎯 Charts data in AnalyticsDashboard:', {
        revenueChart: charts.revenueChart,
        topProducts: charts.topProducts,
        lineChart: charts.lineChart,
        dispenserChart: charts.dispenserChart,
        revenueDataLength: charts.revenueChart?.data?.length || 0,
        topProductsDataLength: charts.topProducts?.data?.length || 0,
        sampleRevenueData: charts.revenueChart?.data?.slice(0, 3),
        sampleTopProductsData: charts.topProducts?.data?.slice(0, 3)
      });
    }
  }, [charts]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
                Dashboard Analytics
              </h1>
              <p className="text-gray-600 mt-2 font-['Plus_Jakarta_Sans']">
                Análisis completo del rendimiento de tu sistema ApiCinema
              </p>
            </div>
            
            {/* Status indicators */}
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              {cacheStatus && (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  cacheStatus === 'fresh' ? 'bg-green-100 text-green-800' :
                  cacheStatus === 'stale' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {cacheStatus === 'fresh' ? 'Datos actualizados' :
                   cacheStatus === 'stale' ? 'Datos en caché' :
                   'Datos de ejemplo'}
                </div>
              )}
              
              {lastFetch && (
                <div className="text-xs text-gray-500 font-['Plus_Jakarta_Sans']">
                  Actualizado: {new Date(lastFetch).toLocaleTimeString('es-ES')}
                </div>
              )}
            </div>
          </div>
          
          {/* Error banner si hay error pero datos en caché */}
          {error && data && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-['Plus_Jakarta_Sans']">
                ⚠️ {metadata?.error || 'Mostrando datos en caché debido a error de conexión'}
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <FiltersBar
          period={period}
          onPeriodChange={changePeriod}
          analysisType={analysisType}
          onAnalysisTypeChange={changeAnalysisType}
          timeGranularity={timeGranularity}
          onTimeGranularityChange={changeTimeGranularity}
          onRefresh={refetch}
          loading={loading}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <KPICard
            title="Total Órdenes"
            value={kpis?.totalOrders || 0}
            trend={kpis?.growthTrend}
            percentage={kpis?.growthPercentage}
            icon={ShoppingCart}
            subtitle="Órdenes procesadas"
            confidenceInterval={kpis?.confidenceInterval}
          />
          <KPICard
            title="Ingresos Totales"
            value={kpis?.totalRevenue || 0}
            trend={kpis?.growthTrend}
            percentage={kpis?.growthPercentage}
            icon={DollarSign}
            subtitle="Revenue total"
            confidenceInterval={kpis?.confidenceInterval}
          />
          <KPICard
            title="Ticket Promedio"
            value={kpis?.averageOrderValue || 0}
            trend="stable"
            icon={BarChart3}
            subtitle="AOV"
          />
          <KPICard
            title="Conversión"
            value={kpis?.conversionRate || 0}
            trend="positive"
            icon={TrendingUp}
            subtitle="Tasa de conversión"
          />
          <KPICard
            title="Satisfacción"
            value={kpis?.customerSatisfaction || 0}
            trend="positive"
            icon={Star}
            subtitle="Score de satisfacción"
          />
          <KPICard
            title="Usuarios Activos"
            value={11}
            trend="stable"
            icon={Users}
            subtitle="Usuarios únicos"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Bar Chart */}
          <div className="relative">
            {(() => {
              const barChartData = charts?.revenueChart?.data || [];
              console.log('📊 Datos que recibe CustomBarChart:', barChartData);
              console.log('📊 Cantidad de barras:', barChartData.length);
              if (barChartData.length > 0) {
                console.log('📊 Primera barra:', barChartData[0]);
                console.log('📊 Estructura de la primera barra:', Object.keys(barChartData[0]));
              }
              return null;
            })()}
            
            <CustomBarChart
              data={charts?.revenueChart?.data || []}
              title={charts?.revenueChart?.title || "Ingresos por Período"}
              height={350}
            />
            {(!charts?.revenueChart?.data || charts.revenueChart.data.length === 0) && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-['Plus_Jakarta_Sans']">No hay datos para mostrar</p>
                </div>
              </div>
            )}
          </div>

          {/* Top Products Pie Chart */}
          <div className="relative">
            <CustomPieChart
              data={charts?.topProducts?.data || []}
              title={charts?.topProducts?.title || "Distribución por Productos"}
              height={350}
            />
            {(!charts?.topProducts?.data || charts.topProducts.data.length === 0) && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-['Plus_Jakarta_Sans']">No hay productos para mostrar</p>
                </div>
              </div>
            )}
          </div>

          {/* Line Chart - Tendencia Comparativa */}
          <div className="relative">
            {(() => {
              const lineChartData = charts?.lineChart?.data || charts?.revenueChart?.data || [];
              console.log('🎯 Datos que recibe CustomLineChart:', lineChartData);
              console.log('🎯 Cantidad de puntos:', lineChartData.length);
              if (lineChartData.length > 0) {
                console.log('🎯 Primer punto:', lineChartData[0]);
                console.log('🎯 Estructura del primer punto:', Object.keys(lineChartData[0]));
              }
              return null;
            })()}
            
            <CustomLineChart
              data={charts?.lineChart?.data || charts?.revenueChart?.data || []}
              title={charts?.lineChart?.title || "Tendencia Comparativa"}
              height={350}
            />
            {(!charts?.lineChart?.data && !charts?.revenueChart?.data) && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-['Plus_Jakarta_Sans']">No hay tendencias para mostrar</p>
                </div>
              </div>
            )}
          </div>

          {/* Dispenser Usage Pie Chart */}
          <div className="relative">
            <CustomPieChart
              data={charts?.dispenserChart?.data || []}
              title={charts?.dispenserChart?.title || "Uso de Dispensadores"}
              height={350}
            />
            {(!charts?.dispenserChart?.data || charts.dispenserChart.data.length === 0) && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm font-['Plus_Jakarta_Sans']">No hay datos de dispensadores</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Analytics Charts */}
        {(data?.charts?.histogramData || data?.charts?.scatterPlot || data?.charts?.boxPlot) && (
          <>
            <div className="mt-8 mb-4">
              <h2 className="text-xl font-semibold text-gray-800 font-['Plus_Jakarta_Sans']">
                📊 Análisis Avanzado
              </h2>
              <p className="text-gray-600 text-sm font-['Plus_Jakarta_Sans']">
                Distribuciones, correlaciones y análisis estadístico detallado
              </p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Histogram */}
              {data.charts.histogramData && (
                <CustomHistogram
                  data={data.charts.histogramData}
                  title="Distribución de Frecuencias"
                />
              )}
              
              {/* Scatter Plot */}
              {data.charts.scatterPlot && (
                <CustomScatterPlot
                  data={data.charts.scatterPlot}
                  title="Análisis de Correlación"
                />
              )}
              
              {/* Box Plot */}
              {data.charts.boxPlot && data.charts.boxPlot.display && (
                <CustomBoxPlot
                  data={data.charts.boxPlot}
                  title="Distribución Estadística"
                />
              )}
            </div>
          </>
        )}

        {/* Probability Analysis Panel */}
        {data?.probabilityAnalysis && (
          <ProbabilityPanel data={data.probabilityAnalysis} />
        )}

        {/* Recommendations and Statistics */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recommendations Panel */}
          <RecommendationsPanel recommendations={recommendations} />

          {/* Statistics Panel */}
          <StatisticsPanel statistics={statistics} />
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Top Products Table */}
          <TopProductsTable
            products={topProducts || []}
            title="Ranking de Productos"
          />
        </div>

        {/* Análisis Probabilístico */}
        {data?.probabilityAnalysis && (
          <ProbabilityPanel data={data.probabilityAnalysis} />
        )}

        {/* Footer */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
            Análisis probabilístico con IA • Datos actualizados automáticamente • Última actualización: {lastFetch ? new Date(lastFetch).toLocaleTimeString('es-ES') : new Date().toLocaleTimeString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
