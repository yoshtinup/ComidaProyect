import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const statusDetail = searchParams.get('status_detail');

  useEffect(() => {
    console.log('❌ Pago fallido:', {
      paymentId,
      status,
      statusDetail
    });
  }, [paymentId, status, statusDetail]);

  const getErrorMessage = () => {
    switch (statusDetail) {
      case 'cc_rejected_insufficient_amount':
        return 'Fondos insuficientes en la tarjeta';
      case 'cc_rejected_bad_filled_security_code':
        return 'Código de seguridad incorrecto';
      case 'cc_rejected_bad_filled_date':
        return 'Fecha de vencimiento incorrecta';
      case 'cc_rejected_bad_filled_other':
        return 'Datos de tarjeta incorrectos';
      default:
        return 'El pago no pudo ser procesado';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
            Pago Rechazado
          </h1>
          <p className="text-gray-600 mt-2 font-['Plus_Jakarta_Sans']">
            {getErrorMessage()}
          </p>
        </div>

        {paymentId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2 font-['Plus_Jakarta_Sans']">
              Detalles del error
            </h3>
            <div className="text-sm text-gray-600 space-y-1 font-['Plus_Jakarta_Sans']">
              <p><span className="font-medium">ID de pago:</span> {paymentId}</p>
              <p><span className="font-medium">Estado:</span> {status}</p>
              {statusDetail && (
                <p><span className="font-medium">Detalle:</span> {statusDetail}</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/carrito')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-['Plus_Jakarta_Sans']"
          >
            Intentar nuevamente
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-['Plus_Jakarta_Sans']"
          >
            Volver al inicio
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2 font-['Plus_Jakarta_Sans']">
            ¿Necesitas ayuda?
          </h4>
          <p className="text-sm text-blue-700 font-['Plus_Jakarta_Sans']">
            Verifica que los datos de tu tarjeta sean correctos y que tengas fondos suficientes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
