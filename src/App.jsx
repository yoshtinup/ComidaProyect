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
import MyOrders from './pages/MyOrders';

import GoogleCallback from './pages/GoogleCallback';

import DispenserSelector from './pages/DispenserSelector';
{/* rutas de nfc */}
import NFCReference from './pages/NFCReference';
function App() {
    return ( 
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/login-admin" element={<LoginAdmin/>}/>
                <Route path="/registro" element={<Registro/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/registro-producto" element={<RegistroProducto/>}/>
                <Route path="/panel-admin" element={<PanelAdmin/>}/>
                <Route path="/inicio" element={<Inicio/>}/>
                <Route path="/carrito" element={<Carrito/>}/>
                <Route path="/pago" element={<Pago/>}/>


                <Route path="/nfc-reference" element={<NFCReference/>}/>
                <Route path="/payment-success" element={<PaymentSuccess/>}/>
                <Route path="/my-orders" element={<MyOrders/>}/>
                <Route path="/dispenser-selector" element={<DispenserSelector/>}/>
                <Route path="/google-callback" element={<GoogleCallback />} />
                
                

            </Routes>
        </BrowserRouter>
     );
}

export default App;
