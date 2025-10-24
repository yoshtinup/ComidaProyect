import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentPending = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  useEffect(() => {
    console.log('⏳ Pago pendiente:', {
      paymentId,
      status
    });
  }, [paymentId, status]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
            Pago Pendiente
          </h1>
          <p className="text-gray-600 mt-2 font-['Plus_Jakarta_Sans']">
            Tu pago está siendo procesado
          </p>
        </div>

        {paymentId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2 font-['Plus_Jakarta_Sans']">
              Detalles del pago
            </h3>
            <div className="text-sm text-gray-600 space-y-1 font-['Plus_Jakarta_Sans']">
              <p><span className="font-medium">ID de pago:</span> {paymentId}</p>
              <p><span className="font-medium">Estado:</span> {status}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/my-orders')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-['Plus_Jakarta_Sans']"
          >
            Ver mis pedidos
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-['Plus_Jakarta_Sans']"
          >
            Volver al inicio
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-900 mb-2 font-['Plus_Jakarta_Sans']">
            ¿Qué significa esto?
          </h4>
          <p className="text-sm text-yellow-700 font-['Plus_Jakarta_Sans']">
            Algunos métodos de pago requieren tiempo adicional para procesarse. 
            Te notificaremos cuando el pago sea confirmado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;
