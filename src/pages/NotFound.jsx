import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft, RefreshCw } from 'lucide-react';
import Buttom from '../componets/bottom/Buttom';
import TitlePanel from '../componets/title/TitlePanel';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToStart = () => {
    navigate('/inicio');
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-neutral-50">
      <div className="w-full max-w-4xl px-2 sm:px-4 md:px-10 py-5 flex flex-col gap-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-700" />
            </div>
            <TitlePanel.Title title="404 - Página no encontrada" />
            <p className="text-gray-600 mt-2">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          
          {/* Ilustración 404 */}
          <div className="text-center mb-8">
            <div className="text-8xl font-bold text-gray-300 mb-4 font-['Plus_Jakarta_Sans']">
              404
            </div>
            <div className="text-6xl mb-6">🍿</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Plus_Jakarta_Sans']">
              ¡Ups! Esta página se perdió en el cine
            </h2>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              Parece que la página que buscas no está disponible. Tal vez fue movida, 
              eliminada o simplemente no existe. ¡Pero no te preocupes! Tenemos varias 
              opciones para ayudarte.
            </p>
          </div>

          {/* Sugerencias */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Sugerencia 1 */}
            <div className="bg-white rounded-lg p-4 border border-gray-300 hover:border-gray-400 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Ir al inicio</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Regresa a la página principal y explora nuestros snacks disponibles.
              </p>
            </div>

            {/* Sugerencia 2 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-300 hover:border-gray-400 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Página anterior</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Vuelve a la página donde estabas antes y continúa navegando.
              </p>
            </div>

            {/* Sugerencia 3 */}
            <div className="bg-white rounded-lg p-4 border border-gray-300 hover:border-gray-400 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Recargar página</h3>
              </div>
              <p className="text-gray-700 text-sm">
                A veces un simple refresh puede solucionar el problema.
              </p>
            </div>

            {/* Sugerencia 4 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-300 hover:border-gray-400 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Buscar contenido</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Explora nuestro menú completo o inicia sesión para ver más opciones.
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Buttom.Buttom1
              contexto="🏠 Ir al Menú Principal"
              onClick={handleGoHome}
              large="w-full sm:w-auto"
            />
            <Buttom.Buttom2
              contexto="⬅️ Página Anterior"
              onClick={handleGoBack}
              large="w-full sm:w-auto"
            />
          </div>

          {/* Enlaces adicionales */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">¿Necesitas ayuda? Prueba estas opciones:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleGoToStart}
                  className="text-sm text-gray-700 hover:text-black underline transition-colors duration-200"
                >
                  Página de inicio
                </button>
                <span className="text-gray-400">•</span>
                <button
                  onClick={handleGoToLogin}
                  className="text-sm text-gray-700 hover:text-black underline transition-colors duration-200"
                >
                  Iniciar sesión
                </button>
                <span className="text-gray-400">•</span>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-gray-700 hover:text-black underline transition-colors duration-200"
                >
                  Recargar página
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-xl p-6 text-white">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2 font-['Plus_Jakarta_Sans']">
              🎬 ¿Sabías que...?
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Mientras encuentras lo que buscas, recuerda que tenemos los mejores snacks 
              para tu experiencia cinematográfica. ¡Nuestro dispensador automático está 
              listo para servirte!
            </p>
          </div>
        </div>

        {/* Error code para debugging */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Error Code: 404 | URL: {window.location.pathname}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
