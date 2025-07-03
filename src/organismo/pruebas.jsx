

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  return (
    <div className="w-full px-5 py-3 border border-[#E5E8EA] flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
      {/* Logo y nombre */}
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

      {/* Menú + acciones */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 md:gap-8 w-full">
        {/* Menú */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-9">
          <span className="text-[#141414] text-sm font-medium leading-[1.5] font-['Plus Jakarta Sans'] cursor-pointer"
            onClick={() => navigate("/inicio")}>Inicio
          </span>
          <span className="text-[#141414] text-sm font-medium leading-[1.5] font-['Plus Jakarta Sans'] cursor-pointer"
            onClick={() => navigate("/home")}>Menú
          </span>
          <span className="text-[#141414] text-sm font-medium leading-[1.5] font-['Plus Jakarta Sans']">Combos</span>
          <span className="text-[#141414] text-sm font-medium leading-[1.5] font-['Plus Jakarta Sans']">Mi Cuenta</span>
        </div>

        {/* Iconos de acción */}
        <div className="flex items-center space-x-2">
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
        </div>
      </div>
    </div>
  );
}

export default Header;
