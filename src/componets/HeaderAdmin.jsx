import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../componets/icon-style.css'; // Asegúrate de importar el CSS para los iconos

export default function HeaderAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md  w-full top- z-5">
      <div className="max-w mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}

      <div className="flex items-center justify-between md:justify-start space-x-4">
        <div className="w-9 h-9  rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-8">
            <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" />
          </svg>
        </div>
        <span className="text-[#141414] text-[24px] font-bold leading-[1.28] font-['Plus Jakarta Sans']">
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
          <Link to="/inicio" className="hover:text-blue-600 transition-colors duration-200">Inicio</Link>
          <Link to="/panel-admin" className="hover:text-blue-600 transition-colors duration-200">Menu panel</Link>
          <Link to="/dispenser-management" className="hover:text-blue-600 transition-colors duration-200">Gestión Dispensadores</Link>
          <Link to="/dashboard" className="hover:text-blue-600 transition-colors duration-200">Estadisticas</Link>
          <Link to="/add-dispenser" className="hover:text-blue-600 transition-colors duration-200">Agregar dispensador</Link>
          
          <div className="flex items-center space-x-3">
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
                to="/inicio" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium text-gray-700">Inicio</span>
              </Link>
              
              <Link 
                to="/panel-admin" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="font-medium text-gray-700">Menu panel</span>
              </Link>
              
              <Link 
                to="/dispenser-management" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-gray-700">Gestión Dispensadores</span>
              </Link>
                <Link 
                to="/dashboard" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                <path d="M3 3v18h18"/>
                <path d="m19 9-5 5-4-4-3 3"/>
              </svg>
                <span className="font-medium text-gray-700">Estadisticas</span>
              </Link>


              <Link 
                to="/add-dispenser" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-medium text-gray-700">Agregar dispensador</span>
              </Link>
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
