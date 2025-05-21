import { FaChartLine, FaDollarSign, FaDrupal, 
    FaFacebook, FaInstagram} from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MangoBlobs from '../assets/img/MangoBlobs.png'; 
import Icono from "../assets/img/Icono.png";
const Form1 = () => {
    return (
        <div className="flex-1 bg-gray-50 p-4 flex flex-col gap-4">
        <div className='flex items-center justify-between gap-40 p-4'>
            <img src={Icono} alt="Icono" className="w-[150px] h-auto object-contain" />
            <span className="text-2xl font-bold text-black p-[50px]">By Ingehub</span>
        </div>

        <h1 className="text-[#141517] text-4xl mb-2 ml-8 font-['Palatino_Linotype']">Ordena, recoge y sigue tu camino</h1>
        <h2 className="text-black text-5xl ml-8">AutoServe</h2>
        <h3 className='text-red-500 text-3xl ml-8'>fast food</h3>
        
        <div className="flex flex-col gap-6 my-8 ml-8">
            <div className='w-full flex flex-row items-center gap-12'>
                <div className="flex items-center text-xl text-black pr-4 gap-2.5">
                    <span>Pureza</span>
                    <FaDrupal className="text-2xl" />
                </div>
                <div className="flex items-center text-xl text-black pr-4 gap-2.5">
                    <span>Calidad</span>
                    <FaChartLine className="text-2xl" />
                </div>
                <div className="flex items-center text-xl text-black pr-4 gap-2.5">
                    <span>Mejor precio</span>
                    <FaDollarSign className="text-2xl" />
                </div>
            </div>
            <div className='relative '>
                <div className="image-circle"></div>
                <img className='w-[60%] h-auto object-cover relative' src={MangoBlobs} alt="MangoBlobs" />
          
            </div>
          <button className="absolute bottom-[50px] left-1/2 -translate-x-[350%] bg-[#2c2c2c] text-white py-3 px-6 rounded-xl cursor-pointer font-bold text-sm shadow-md transition-all duration-300 hover:bg-[#3c3c3c]">
            Saber más
          </button>
        </div>
      </div>
    )
  }
const Form2 = ({titulo, subtitulo, children, color}) => {
    const handleSubmit = (e) => {
      e.preventDefault();
      // Lógica de inicio de sesión aquí
    };
    return (
        <div className={`flex-1 flex justify-center p-8 bg-gradient-to-r ${color}`}>
        <form onSubmit={handleSubmit} className="w-full max-w-[450px] text-center mt-12">
          <h2 className="text-4xl mb-2 text-[#212121] font-bold">{titulo}</h2>
          <p className="text-[#212121] mb-8 text-xl">{subtitulo}</p>
          {children}
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="text-2xl text-[#212121] hover:text-gray-700"><FaInstagram /></a>
            <a href="#" className="text-2xl text-[#212121] hover:text-gray-700"><FaFacebook /></a>
          </div>
        </form>
      </div>
    )
  }


const Formulario =  {
    Form1,
    Form2
}

export default Formulario;