import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login';
import Registro from './pages/Registro';
import RegistroProducto from './pages/RegistroProducto';
import Home from './pages/Home';
import PanelAdmin from './pages/PanelAdmin';
import Inicio from './pages/Inicio';
import LoginAdmin from './pages/LoginAdmin';
{/* ruta de carrito */}
import Carrito from './pages/Carrito';
import Pago from './pages/Pago';

import PaymentSuccess from './pages/PaymentSucess';
import PaymentFailure from './pages/PaymentFailure';
import PaymentPending from './pages/PaymentPending';
import MyOrders from './pages/MyOrders';

import GoogleCallback from './pages/GoogleCallback';

import DispenserSelector from './pages/DispenserSelector';
import DispenserRefill from './pages/DispenserRefill';
import AddDispenserPage from './pages/AddDispenserPage';
import DispenserManagement from './pages/DispenserManagement';
{/* rutas de nfc */}

import NFCReference from './pages/NFCReference';
import OrderManagement from './pages/OrderManagement';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import TestChartsPage from './pages/TestChartsPage';
import TopProductsPage from './pages/TopProductsPage';
import GaussianAnalyticsPage from './pages/GaussianAnalyticsPage';
import ProtectedRoute from './componets/ProtectedRoute';
function App() {
    return ( 
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/login-admin" element={<LoginAdmin/>}/>
                <Route path="/registro" element={<Registro/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/registro-producto" element={<RegistroProducto/>}/>
                <Route path="/panel-admin" element={<ProtectedRoute><PanelAdmin/></ProtectedRoute>}/>
                <Route path="/inicio" element={<Inicio/>}/>
                <Route path="/carrito" element={<Carrito/>}/>
                <Route path="/pago" element={<Pago/>}/>
                <Route path="/" element={<Inicio/>}/>

                <Route path="/nfc-reference" element={<NFCReference/>}/>
                <Route path="/order-management" element={<OrderManagement/>}/>
                <Route path="/payment-success" element={<PaymentSuccess/>}/>
                <Route path="/payment-failure" element={<PaymentFailure/>}/>
                <Route path="/payment-pending" element={<PaymentPending/>}/>
                <Route path="/my-orders" element={<MyOrders/>}/>
                <Route path="/dispenser-selector" element={<DispenserSelector/>}/>
                <Route path="/google-callback" element={<GoogleCallback />} />
                <Route path="/dispenser-refill" element={<DispenserRefill/>}/>
                <Route path="/add-dispenser" element={<ProtectedRoute><AddDispenserPage/></ProtectedRoute>}/>
                <Route path="/dispenser-management" element={<ProtectedRoute><DispenserManagement/></ProtectedRoute>}/>
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
                <Route path="/test-charts" element={<ProtectedRoute><TestChartsPage/></ProtectedRoute>}/>
                <Route path="/top-products" element={<ProtectedRoute><TopProductsPage/></ProtectedRoute>}/>
                <Route path="/gaussian-analytics" element={<ProtectedRoute><GaussianAnalyticsPage/></ProtectedRoute>}/>
                
                {/* Ruta catch-all para 404 - DEBE IR AL FINAL */}
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
     );
}

export default App;
