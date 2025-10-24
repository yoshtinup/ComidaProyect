import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const merchantOrderId = searchParams.get('merchant_order_id');

  useEffect(() => {
    console.log('✅ Pago exitoso:', {
      paymentId,
      status,
      merchantOrderId
    });

    // Limpiar carrito del localStorage si existe
    localStorage.removeItem('carrito');
    localStorage.removeItem('carritoIds');
    
    // Redirigir al home después de 5 segundos
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [paymentId, status, merchantOrderId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
            ¡Pago Exitoso!
          </h1>
          <p className="text-gray-600 mt-2 font-['Plus_Jakarta_Sans']">
            Tu pago ha sido procesado correctamente
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
              {merchantOrderId && (
                <p><span className="font-medium">Orden:</span> {merchantOrderId}</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-['Plus_Jakarta_Sans']"
          >
            Volver al inicio
          </button>
          <button
            onClick={() => navigate('/my-orders')}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-['Plus_Jakarta_Sans']"
          >
            Ver mis pedidos
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4 font-['Plus_Jakarta_Sans']">
          Serás redirigido al inicio en 5 segundos...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
