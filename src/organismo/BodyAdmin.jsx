import React from 'react';
import ProductTable from '../componets/ProductTable';
import TitlePanel from '../componets/title/TitlePanel';
import VentasResumen from '../componets/VentasResumen';
import EtiquetasFiltro from '../componets/EtiquetasFiltro';
import TopProductos from '../componets/TopProductos';
import { useNavigate } from 'react-router-dom';

const etiquetas = ['Hoy', 'Esta Semana', 'Este Mes'];
const productos = [
  { nombre: "Skittles", width: "w-full" },         // 100%
  { nombre: "Pop Karameladas", width: "w-4/5" },   // 80%
  { nombre: "Chips Moradas", width: "w-3/5" },     // 60%
  { nombre: "Snickers", width: "w-2/5" },          // 40%
  { nombre: "M & M’s", width: "w-1/5" },           // 20%
];
function BodyAdmin() {
  const navigate = useNavigate();
  return(
    <>
    <div className='flex justify-center w-full min-h-screen bg-neutral-50 '>
      <div className="self-stretch px-4 sm:px-10 md:px-20 lg:px-40 py-5 flex flex-col gap-6 bg-neutral-50 w-full max-w-7xl">
        <TitlePanel.Title title="Panel de Administración"  />
        <VentasResumen title="Resumen de Ventas" />
          {/* Sección  Productos Más Vendidos */}
        <div className="self-stretch h-14 px-2 sm:px-4 pt-5 pb-3 flex flex-col justify-start items-start">
          <div className="self-stretch text-neutral-900 text-xl font-bold font-['Plus_Jakarta_Sans'] leading-7">Productos Más Vendidos</div>
        </div>
        <EtiquetasFiltro etiquetas={etiquetas} />
        <TopProductos data={productos} />
        {/* Sección Detalles de Productos */}
        <div className="self-stretch h-14 px-2 sm:px-4 pt-5 pb-3 flex flex-col justify-start items-start">
          <div className="self-stretch text-neutral-900 text-xl font-bold font-['Plus_Jakarta_Sans'] leading-7">Detalles de Productos</div>
        </div>
        <div className="w-full px-2 sm:px-4 py-3">
          <div className="flex justify-start items-start hover:animate-pulse">
            <div className="min-w-[84px] max-w-full sm:max-w-[480px] h-10 px-4 bg-black rounded-[20px] flex items-center justify-center gap-2 overflow-hidden">
              {/* Icono (puedes reemplazar este div por un <svg> o un icono real) */}
              <div className="w-5 h-5 relative overflow-hidden">
                {/* Placeholder para ícono */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <g clip-path="url(#a)">
                    <path fill="#FAFAFA" fill-rule="evenodd" d="M17.5 10c0 .345-.28.625-.625.625h-6.25v6.25a.625.625 0 1 1-1.25 0v-6.25h-6.25a.625.625 0 1 1 0-1.25h6.25v-6.25a.625.625 0 1 1 1.25 0v6.25h6.25c.345 0 .625.28.625.625Z" clip-rule="evenodd"/>
                  </g>
                  <defs>
                    <clipPath id="a">
                      <path fill="#fff" d="M0 0h20v20H0z"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              {/* Texto */}
              <div className="text-[#F9F9F9] text-sm font-bold font-['Plus Jakarta Sans'] leading-[1.5] text-center cursor-pointer"
                onClick={() => navigate('/registro-producto')}
              >
                Agregar Producto
              </div>
            </div>
          </div>
        </div>
        <ProductTable />
      </div>
    </div>
    </>
  )
}
export default BodyAdmin;