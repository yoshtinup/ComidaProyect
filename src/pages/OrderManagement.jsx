import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderList from '../componets/orders/OrderList';
import Header from '../componets/Header';
import EmptyState from '../componets/EmptyState';
import CineSnacksLoader from '../componets/loader/CineSnacksLoader';

const OrderManagement = () => {
  const [nfc, setNfc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Obtener NFC del localStorage
    const userNfc = localStorage.getItem('nfc');
    if (!userNfc) {
      setError('NFC no encontrado. Por favor, configura tu NFC primero.');
      setLoading(false);
      return;
    }

    setNfc(userNfc);
    setLoading(false);
  }, [navigate]);

  const handleGoToNFCSetup = () => {
    navigate('/nfc-reference');
  };

  const handleGoToHome = () => {
    navigate('/home');
  };

  if (loading) {
    return <CineSnacksLoader />;
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-neutral-50">
          <EmptyState 
            icon="⚠️" 
            title="Error de configuración" 
            description={error}
            buttonText="Configurar NFC" 
            onButtonClick={handleGoToNFCSetup}
          />
        </div>
      </div>
    );
  }

  if (!nfc) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-neutral-50">
          <EmptyState 
            icon="📱" 
            title="NFC no configurado" 
            description="Necesitas configurar tu NFC para gestionar las órdenes"
            buttonText="Configurar NFC" 
            onButtonClick={handleGoToNFCSetup}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-neutral-50">  
        <OrderList nfc={nfc} />
      </div>
    </div>
  );
};

export default OrderManagement;
