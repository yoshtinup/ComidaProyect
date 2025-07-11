import { useNavigate } from 'react-router-dom';
const Buttom1 = ({contexto, type, large, onClick }) => {
    return (
      <div className={`w-full md:${large}`}>
        <button
            type={type}
            className="bg-[#2c2c2c] w-full text-white p-4 border-none rounded-lg font-['Plus_Jakarta_Sans'] cursor-pointer text-sm mt-2 font-bold hover:bg-[#3c3c3c]"
            onClick={onClick}
       >
            {contexto}
        </button>
      </div>
    )
}

const Buttom2 = ({contexto, type, ruta}) => {
  const navigate = useNavigate();
  const handlenavegin = () => {
    navigate(ruta);
  }
    return(
      <button type={type} onClick={handlenavegin} className="bg-[rgba(143,143,143,0.851)] text-white w-[100%] p-4 border-none rounded-lg cursor-pointer text-sm mt-4 font-bold hover:bg-gray-500">
        {contexto}
      </button>
    )
}
const Buttom3 = ({contexto, type, children, large}) => {
    return(
      <button type={type} className={`bg-white text-black w-full lg:${large}  p-4 border border-gray-200 rounded-lg cursor-pointer flex items-center justify-center gap-3 text-sm font-medium hover:bg-gray-50`}>
        {children}
        {contexto}
      </button>
    )
}


const Buttom = {
    Buttom1,
    Buttom2,
    Buttom3
}
export default Buttom;