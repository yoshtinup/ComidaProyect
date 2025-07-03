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
            </Routes>
        </BrowserRouter>
     );
}

export default App;
