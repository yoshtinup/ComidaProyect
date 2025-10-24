import React, { useState, useEffect } from 'react';
import ProductTable from '../componets/ProductTable';
import TitlePanel from '../componets/title/TitlePanel';
import VentasResumenDynamic from '../componets/VentasResumenDynamic';
import VentasResumenFromAPI from '../componets/VentasResumenFromAPI';
import EtiquetasFiltroInteractive from '../componets/EtiquetasFiltroInteractive';
import TopProductosDynamic from '../componets/TopProductosDynamic';
import TopProductosFromAPI from '../componets/TopProductosFromAPI';
import analyticsService from '../services/analyticsService.js';
import reportsService from '../services/reportsService.js';
import { useReportsData } from '../hooks/useReportsData.js';
import { useNavigate } from 'react-router-dom';
import Body from './Body.jsx';
import BodyDispenserProducts from './BodyDispenserProducts.jsx';

function BodyAdmin() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // Cambiar a 'month' para coincidir con EtiquetasFiltroInteractive
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar el hook de reportes para datos específicos
  const {
    data: reportsData,
    loading: reportsLoading,
    error: reportsError,
    period: reportsPeriod,
    changePeriod: changeReportsPeriod,
    refresh: refreshReports,
    bestSellingProducts,
    salesSummary,
    topProducts,
    summary: productsSummary
  } = useReportsData('month'); // Cambiar el inicial también

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getDashboard();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handlePeriodChange = (period) => {
    console.log('📅 Period changed to:', period);
    setSelectedPeriod(period);
    changeReportsPeriod(period); // Actualizar datos de reportes
  };

  // Mostrar loading si cualquiera de los servicios está cargando
  const isLoading = loading || reportsLoading;
  const hasError = error || reportsError;

  if (isLoading) {
    return (
      <div className="flex justify-center w-full min-h-screen bg-neutral-50">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex justify-center w-full min-h-screen bg-neutral-50">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-red-500 text-center">
            <p className="text-xl font-semibold mb-2">Error</p>
            <p>{error || reportsError}</p>
            <button 
              onClick={() => {
                if (error) {
                  // Retry analytics data
                  window.location.reload();
                }
                if (reportsError) {
                  refreshReports();
                }
              }}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full min-h-screen bg-neutral-50">
      <div className="self-stretch px-4 sm:px-10 md:px-20 lg:px-40 py-5 flex flex-col gap-6 bg-neutral-50 w-full max-w-7xl">
        <TitlePanel.Title title="Panel de Administración" />
        
        {/* Resumen de Ventas con datos de la API */}
        <VentasResumenFromAPI 
          title="Resumen de Ventas" 
          salesSummary={salesSummary}
          productsSummary={productsSummary}
          selectedPeriod={selectedPeriod}
          loading={reportsLoading}
        />
        { /* panel de productos del dispensador */}
        <BodyDispenserProducts />
        {/* Sección Productos Más Vendidos */}
        <div className="self-stretch h-14 px-2 sm:px-4 pt-5 pb-3 flex flex-col justify-start items-start">
          <div className="self-stretch text-neutral-900 text-xl font-bold font-['Plus_Jakarta_Sans'] leading-7">
            Productos Más Vendidos
          </div>
        </div>
        
        {/* Filtros interactivos */}
        <EtiquetasFiltroInteractive 
          onPeriodChange={handlePeriodChange}
          selectedPeriod={selectedPeriod}
        />
        
        {/* Top productos con datos de la API */}
        <TopProductosFromAPI 
          bestSellingProducts={bestSellingProducts}
          selectedPeriod={selectedPeriod}
          loading={reportsLoading}
        />
        
        {/* Sección Detalles de Productos */}
        <div className="self-stretch h-14 px-2 sm:px-4 pt-5 pb-3 flex flex-col justify-start items-start">
          <div className="self-stretch text-neutral-900 text-xl font-bold font-['Plus_Jakarta_Sans'] leading-7">
            Detalles de Productos
          </div>
        </div>
        
        <div className="w-full px-2 sm:px-4 py-3">
          <div className="flex justify-start items-start gap-4 flex-wrap">
            {/* Botón Agregar Producto */}
            <div className="hover:animate-pulse">
              <div className="min-w-[84px] max-w-full sm:max-w-[480px] h-10 px-4 bg-black rounded-[20px] flex items-center justify-center gap-2 overflow-hidden">
                <div className="w-5 h-5 relative overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <g clipPath="url(#a)">
                      <path fill="#FAFAFA" fillRule="evenodd" d="M17.5 10c0 .345-.28.625-.625.625h-6.25v6.25a.625.625 0 1 1-1.25 0v-6.25h-6.25a.625.625 0 1 1 0-1.25h6.25v-6.25a.625.625 0 1 1 1.25 0v6.25h6.25c.345 0 .625.28.625.625Z" clipRule="evenodd"/>
                    </g>
                    <defs>
                      <clipPath id="a">
                        <path fill="#fff" d="M0 0h20v20H0z"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div 
                  className="text-[#F9F9F9] text-sm font-bold font-['Plus Jakarta Sans'] leading-[1.5] text-center cursor-pointer"
                  onClick={() => navigate('/registro-producto')}
                >
                  Agregar Producto
                </div>
              </div>
            </div>
            
            {/* Botón Analytics Gaussiano */}
            <div className="hover:animate-pulse">
              <div className="min-w-[84px] max-w-full sm:max-w-[480px] h-10 px-4 bg-gray-800 rounded-[20px] flex items-center justify-center gap-2 overflow-hidden">
                <div className="w-5 h-5 relative overflow-hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18"/>
                    <path d="m19 9-5 5-4-4-3 3"/>
                  </svg>
                </div>
                <div 
                  className="text-[#F9F9F9] text-sm font-bold font-['Plus Jakarta Sans'] leading-[1.5] text-center cursor-pointer"
                  onClick={() => navigate('/gaussian-analytics')}
                >
                  Analytics Gaussiano
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ProductTable />
      </div>
    </div>
  );
}

export default BodyAdmin;
