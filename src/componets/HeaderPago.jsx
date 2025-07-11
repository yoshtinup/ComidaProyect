import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Iconos from './icono/Iconos';

export default function HeaderPago() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow-md  w-full top- z-5">
      <div className="max-w mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}

      <div className="flex items-center justify-between md:justify-start space-x-4 cursor-pointer" onClick={() => navigate("/inicio")}>
        <div className="w-9 h-9 bg-gray-400 rounded-full flex items-center justify-center hover:animate-bounce" >
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
            className="flex flex-col justify-center items-center w-8 h-8"
          >
            <div className="w-6 h-0.5 bg-black mb-1"></div>
            <div className="w-6 h-0.5 bg-black mb-1"></div>
            <div className="w-6 h-0.5 bg-black"></div>
          </button>
        </div>

        {/* Navegación (escritorio) */}
        <nav className="hidden lg:flex space-x-6 ">
          <Link to="/home" className="hover:text-blue-600 mt-2">Inicio</Link>
          <Link to="/home" className="hover:text-blue-600 mt-2">Menu panel</Link>
          <div className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center cursor-pointer hover:animate-bounce"
            onClick={() => navigate("/inicio")}>
            <Iconos.Busqueda />
          </div>   
           <div className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center cursor-pointer hover:animate-bounce"
            onClick={() => navigate("/inicio")}>
            <Iconos.Perfil />
          </div> 

        </nav>

      </div>

      {/* Navegación (móvil) */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md px-4 pb-4">
          <nav className="flex flex-col space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-blue-600">Inicio</Link>
            <Link to="/productos" onClick={() => setIsOpen(false)} className="hover:text-blue-600">Productos</Link>
            <Link to="/contacto" onClick={() => setIsOpen(false)} className="hover:text-blue-600">Contacto</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
