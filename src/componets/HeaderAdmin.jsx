import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HeaderAdmin() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md  w-full top- z-5">
      <div className="max-w mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}

      <div className="flex items-center justify-between md:justify-start space-x-4">
        <div className="w-9 h-9 bg-gray-400 rounded-full flex items-center justify-center hover:animate-bounce">
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
          <Link to="/inicio" className="hover:text-blue-600 mt-2">Inicio</Link>
          <Link to="/panel-admin" className="hover:text-blue-600 mt-2">Menu panel</Link>
          <Link to="/contacto" className="hover:text-blue-600 mt-2">Conbos</Link>
          <Link to="/carrito" className="hover:text-blue-600 mt-2">Mi Cuenta</Link>
          <div className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center cursor-pointer hover:animate-bounce"
            onClick={() => navigate("/inicio")}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#EDEDED] flex items-center justify-center cursor-pointer hover:animate-bounce"
            onClick={() => navigate("/carrito")}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
            </svg>
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
