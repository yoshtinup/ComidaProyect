import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const completePayment = async () => {
      try {
        // Get user ID from localStorage or your auth context
        const userId = localStorage.getItem('userId');
        const selectedDispenser = localStorage.getItem('selectedDispenserId');
        // Call your API to complete the payment
        const response = await axios.post('http://localhost:3002/api/v1/pago/complete', {
          user_id: userId,
          dispenser_id: selectedDispenser // or any identifier you want to use
        });
        
        setOrderDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error completing payment:', err);
        setError('Failed to process your order. Please contact support.');
        setLoading(false);
      }
    };
    
    // Check if this is a redirect from successful payment
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('status') === 'approved') {
      completePayment();
    } else {
      setLoading(false);
    }
  }, [location]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getProductImage = (productName) => {
    const defaultImages = {
      'palomitas': 'https://lh3.googleusercontent.com/aida-public/AB6AXuB44fKVSJQt5VyRS33pf0k_b299g-xgAF4M3b7naoy0HKsz87gfHBu_NpM1jBt6vxc0rGpsdqWeruRjGs_Kq1-NYd9_IRQEJ7h3kUQrHPE6E-ybTcU-RgXX3JU2UYz6B8ld7XaR6Jg10W_KOMSAABOFMwwHiEAnOXYuLO2oBOYRfaa86D6eVdu-vBxVp2mdyBSOhj8tDr4GFsH1aCxmMSkkeCHUi4MhkAVRkWI4LHb8oPZFIpYqfuLoJkYBrGNta4H-nLggP-xMUR8',
      'refresco': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_R7DnjOszivc5GnynL0eVUbTl00ZMJpk_UY4Q8U2NWeusgzd3BtLI3f0iTYxilsX90_aBU4i6XZ_PMCaZ7i3g7m_loVzkp50dByw3HW61cEawYjlrotMxcun7dFdFel_hokyAzjwYnOiMpqYraheo79HmygPaqF6Xb6Q-9NHkj4oTi75Ln_cAieAcTPwidEYitUApQWn0zF8p3bVMd8zwZNvLTN-zDMCdE0HCfBOa6CIa4mcRqR58vergVlaBQv9qBzI-zjx8s5s',
      'caramelos': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3aG3QUdjqGHBzvP9GzkLUWZ-0m0DrQkFfnEgcktWJI8WlBMSPZRRTN0SXGysi-Ou9qVHpWR5uK3EagD81ZICZ06k_f1SRwX6K0bdrlwl0bVz0xbyr1E4Tb6isFxkUKIP6U50nURO7mc1WxMGyN7g4KSrJXD7_YH_3_jG0vInXow7y9mrdMU3hkKv7xOQD3Qjpsyaq13dFmHyWR8NkazHmooxkkXhLyzUO3XG9pDM6cbFYI3l8rXChTMRr0TcDtVDvSl04AHYFMHM'
    };
    
    const productKey = productName.toLowerCase();
    return defaultImages[productKey] || 'https://via.placeholder.com/56x56?text=Product';
  };
  
  if (loading) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Procesando tu pedido...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200">
            <h2 className="text-xl font-bold text-red-800 mb-4">Error en el procesamiento</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/home')}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#ededed] px-10 py-3">
          <div className="flex items-center gap-4 text-[#141414]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">CineSnacks</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#141414] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigate('/home')}>Inicio</a>
              <a className="text-[#141414] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigate('/peliculas')}>Películas</a>
              <a className="text-[#141414] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigate('/snacks')}>Snacks</a>
              <a className="text-[#141414] text-sm font-medium leading-normal cursor-pointer" onClick={() => navigate('/cuenta')}>Mi Cuenta</a>
            </div>
            <div className="flex gap-2">
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#ededed] text-[#141414] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                <div className="text-[#141414]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/>
                  </svg>
                </div>
              </button>
              <button 
                className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#ededed] text-[#141414] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
                onClick={() => navigate('/cart')}
              >
                <div className="text-[#141414]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87ZM96,204a12,12,0,1,1-12-12A12,12,0,0,1,96,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,192,204Zm4-74.57A8,8,0,0,1,188.1,136H69.22L57.59,72H206.41Z"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <h2 className="text-[#141414] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              ¡Pago exitoso!
            </h2>
            <p className="text-[#141414] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
              Tu pedido ha sido procesado y está listo para ser recogido. Por favor, dirígete al dispensador de snacks con tu número de pedido.
            </p>

            {orderDetails && (
              <>
                {/* Order Summary */}
                <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                  Resumen del pedido
                </h3>
                <div className="p-4 grid grid-cols-[30%_1fr] gap-x-6">
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbdbdb] py-5">
                    <p className="text-neutral-500 text-sm font-normal leading-normal">Número de pedido</p>
                    <p className="text-[#141414] text-sm font-normal leading-normal">#{orderDetails.order_id}</p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbdbdb] py-5">
                    <p className="text-neutral-500 text-sm font-normal leading-normal">Fecha</p>
                    <p className="text-[#141414] text-sm font-normal leading-normal">
                      {formatDate(orderDetails.created_at)}
                    </p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbdbdb] py-5">
                    <p className="text-neutral-500 text-sm font-normal leading-normal">Subtotal</p>
                    <p className="text-[#141414] text-sm font-normal leading-normal">
                      ${orderDetails.subtotal}
                    </p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbdbdb] py-5">
                    <p className="text-neutral-500 text-sm font-normal leading-normal">IVA (16%)</p>
                    <p className="text-[#141414] text-sm font-normal leading-normal">
                      ${orderDetails.iva}
                    </p>
                  </div>
                  <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#dbdbdb] py-5">
                    <p className="text-neutral-500 text-sm font-normal leading-normal font-bold">Total</p>
                    <p className="text-[#141414] text-sm font-normal leading-normal font-bold">
                      ${orderDetails.total}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <h3 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                  Artículos
                </h3>
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-neutral-50 px-4 min-h-[72px] py-2">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14"
                      style={{
                        backgroundImage: `url("${getProductImage(item.name)}")`
                      }}
                    />
                    <div className="flex flex-col justify-center flex-1">
                      <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">
                        Cantidad: {item.quantity} - ${item.price} c/u
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#141414] text-sm font-medium">
                        ${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Action Button */}
            <div className="flex px-4 py-3 justify-center">
              <button
                onClick={() => navigate('/home')}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-black text-neutral-50 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-800 transition-colors"
              >
                <span className="truncate">Volver a la pantalla principal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;