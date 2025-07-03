import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MangoBlobs from '../assets/img/MangoBlobs.png';
import Icono from '../assets/img/Icono.png';

const Form1 = () => {
  return (
    <div className="flex-1 flex flex-col items-start justify-center px-6 py-13 bg-white ms-8 md:ms-8">
      {/* Imagen superior izquierda */}
      <img src={Icono} alt="icono" className="w-16 h-12 rotate-[-4.47deg]" />

      {/* Subtítulo */}
      <p className="mt-4 text-zinc-900 text-xl md:text-3xl font-semibold tracking-tight">
        Ordena, recoge y sigue tu camino
      </p>

      {/* Título */}
      <div className="flex items-center mt-4 gap-2">
        <div className="w-[42px] h-[42px] bg-black rounded-full" />
        <h1 className="text-yellow-600 text-4xl md:text-6xl font-bold">CineSnacks</h1>
      </div>

      {/* Texto "snacks" */}
      <h2 className="mt-4 text-2xl md:text-4xl font-semibold text-black">Snacks</h2>

      {/* Características */}
      <div className="flex flex-wrap mt-4 gap-4 text-black text-base md:text-lg font-bold">
        <div className="flex items-center gap-2">
          <span>📍</span> Pureza
        </div>
        <div className="flex items-center gap-2">
          <span>✅</span> Calidad
        </div>
        <div className="flex items-center gap-2">
          <span>💲</span> Mejor precio
        </div>
      </div>

      {/* Imagen circular decorativa */}
      <div className="relative mt-12 flex justify-center items-center">
        {/* Imagen circular */}
        <div className="w-64 h-64 md:w-80 md:h-80 bg-slate-50 rounded-full shadow-[10px_10px_10px_10px_rgba(131,5,5,1.00)] border border-black" />

        {/* Imagen encima del círculo */}
        <img
          src={MangoBlobs}
          alt="Mango"
          className="absolute w-48 h-48 md:w-72 md:h-72 object-cover"
        />

        {/* Botón encima */}
        <div className="absolute bottom-[-2rem] md:bottom-[+3.5rem] sm-bottom-[+2.5rem] sm-2">
          <button className="bg-zinc-600 text-white font-bold px-6 py-2 rounded-[10px] hover:bg-zinc-700 shadow-md">
            Saber más
          </button>
        </div>
      </div>

    </div>
  );
};

const Form2 = ({ titulo, subtitulo, children, color, onSubmit }) => {
  return (
    <div className={`flex-1 flex justify-center items-center px-6 py-10 bg-gradient-to-r ${color}`}>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[450px] text-center"
      >
        <h2 className="text-4xl mb-2 text-[#212121] font-bold">{titulo}</h2>
        <p className="text-[#212121] mb-8 text-xl">{subtitulo}</p>
        {children}
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="text-2xl text-[#212121] hover:text-gray-700"><FaInstagram /></a>
          <a href="#" className="text-2xl text-[#212121] hover:text-gray-700"><FaFacebook /></a>
        </div>
      </form>
    </div>
  );
};

const Formulario = {
  Form1,
  Form2,
};

export default Formulario;
