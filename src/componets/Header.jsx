import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Iconos from './icono/Iconos';
import { useNavigate } from 'react-router-dom';
import '../componets/icon-style.css'; // Asegúrate de importar el CSS para los iconos
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md  w-full top- z-5">
      <div className="max-w mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}

      <div className="flex items-center justify-between md:justify-start space-x-4">
        <div className="w-9 h-9 rounded-full flex items-center justify-center ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-8">
            <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" />
          </svg>  
        </div>
        <span className="text-[#141414]  text-[24px] font-bold leading-[1.28] font-['Plus Jakarta Sans']">
          CineSnacks
        </span>
      </div>
        {/* Botón hamburguesa */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col justify-center items-center w-8 h-8 space-y-1 group"
          >
            <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>

        {/* Navegación (escritorio) */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link to="/home" className="hover:text-blue-600 transition-colors duration-200">Menu panel</Link>
          <Link to="/nfc-reference" className="hover:text-blue-600 transition-colors duration-200">Referenciar NFC</Link>
          <Link to="/my-orders" className="hover:text-blue-600 transition-colors duration-200">Mis pedidos</Link>
          
          <div className="flex items-center space-x-3">
            <div id='icon-animate' className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors duration-200"
              onClick={() => navigate("/carrito")}>
              <div>
                <Iconos.Carrito />
              </div>
            </div>
            
            <button
              onClick={()=>{
                navigate("/login");
                localStorage.removeItem("token");
                localStorage.removeItem("selectedDispenserId");
                localStorage.removeItem("userId");
                localStorage.removeItem("user");
                localStorage.removeItem("nfc");
              }} 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </nav>

      </div>

      {/* Navegación (móvil) */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-lg border-t border-gray-100">
          <nav className="px-4 py-4 space-y-3">
            {/* Enlaces principales */}
            <div className="space-y-3">
              <Link 
                to="/home" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 7 4-4 4 4" />
                </svg>
                <span className="font-medium text-gray-700">Menu panel</span>
              </Link>
              
              <Link 
                to="/nfc-reference" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                <span className="font-medium text-gray-700">Referenciar NFC</span>
              </Link>
              
              <Link 
                to="/my-orders" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="font-medium text-gray-700">Mis pedidos</span>
              </Link>
            
              <button
                onClick={() => {
                  navigate("/carrito");
                  setIsOpen(false);
                }}
                className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 w-full text-left"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <Iconos.Carrito />
                </div>
                <span className="font-medium text-gray-700">Carrito</span>
              </button>
            </div>
            
            {/* Separador */}
            <div className="border-t border-gray-200 my-3"></div>
            
            {/* Logout */}
            <button
              onClick={()=>{
                navigate("/login");
                localStorage.removeItem("token");
                localStorage.removeItem("selectedDispenserId");
                localStorage.removeItem("userId");
                localStorage.removeItem("user");
                localStorage.removeItem("nfc");
                setIsOpen(false);
              }}
              className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors duration-200 w-full text-left"
            >
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium text-red-600">Logout</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
