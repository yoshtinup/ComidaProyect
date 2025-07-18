import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../componets/Header';
function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:3002/api/v1/pago/user/${userId}`);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error al cargar los pedidos');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'processing': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'pending': 'Pendiente',
      'completed': 'Completado',
      'cancelled': 'Cancelado',
      'processing': 'Procesando'
    };
    return statusTexts[status] || status;
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
            <p className="text-lg text-gray-600">Cargando pedidos...</p>
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
            <h2 className="text-xl font-bold text-red-800 mb-4">Error</h2>
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
     <Header></Header>

        {/* Main Content */}
        <div className="px-10 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <h1 className="text-[#141414] text-4xl font-black leading-tight tracking-[-0.033em]">
                  Mis Pedidos
                </h1>
                <p className="text-[#141414] text-base font-normal leading-normal">
                  Aquí puedes ver el historial de todos tus pedidos realizados.
                </p>
              </div>
            </div>

            {/* Orders List */}
            <div className="px-4 py-3">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No tienes pedidos aún</h3>
                  <p className="text-gray-500 mb-6">¡Es hora de hacer tu primer pedido!</p>
                  <button
                    onClick={() => navigate('/snacks')}
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Explorar Snacks
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-[#ededed] rounded-lg p-6 shadow-sm">
                      {/* Order Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-[#141414] mb-1">
                            Pedido #{order.order_id}
                          </h3>
                          <p className="text-sm text-neutral-500">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <p className="text-lg font-bold text-[#141414] mt-2">
                            ${order.total}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2 mb-4">
                        <h4 className="text-sm font-medium text-[#141414] mb-2">Artículos:</h4>
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 py-2">
                            <div
                              className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-12"
                              style={{
                                backgroundImage: `url("${getProductImage(item.name)}")`
                              }}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#141414]">{item.name}</p>
                              <p className="text-xs text-neutral-500">
                                {item.quantity} x ${item.price}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-[#141414]">
                                ${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Actions */}
                      <div className="flex justify-between items-center pt-4 border-t border-[#ededed]">
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className="text-sm text-[#141414] hover:text-gray-600 transition-colors"
                        >
                          {selectedOrder === order.id ? 'Ocultar detalles' : 'Ver detalles'}
                        </button>
                        <div className="flex gap-2">
                          {order.status === 'completed' && (
                            <button
                              onClick={() => {/* Add reorder logic */}}
                              className="px-4 py-2 bg-[#ededed] text-[#141414] rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                            >
                              Reordenar
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/order/${order.order_id}`)}
                            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                          >
                            Ver pedido
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {selectedOrder === order.id && (
                        <div className="mt-4 pt-4 border-t border-[#ededed]">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-neutral-500 mb-1">Dispensador:</p>
                              <p className="text-[#141414]">{order.dispenser_id}</p>
                            </div>
                            <div>
                              <p className="text-neutral-500 mb-1">Estado:</p>
                              <p className="text-[#141414]">{getStatusText(order.status)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyOrders;