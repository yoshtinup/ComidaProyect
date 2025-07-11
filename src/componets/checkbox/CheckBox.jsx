import Iconos from "../icono/Iconos";
const White1 = ({contexto, type, large, checked, onChange }) => {
    return(
        <label className={`bg-white text-black w-full lg:${large}  p-4 border border-gray-200 rounded-lg cursor-pointer flex items-center justify-between gap-3 text-sm font-medium hover:bg-gray-50`}>
        <div className="flex flex-row gap-3">
            <input
            type="checkbox"
            className="peer hidden "
            checked={checked}
            onChange={onChange}
            />
            <div className="w-5 h-5 relative rounded-[10px] border-4 border-gray-300 transition-colors duration-200 outline-none overflow-hidden peer-checked:bg-gray-400 peer-checked:border-gray-500 " />

            <div className="inline-flex flex-col justify-between items-start">
                <div className="w-full max-w-[860px] flex flex-col justify-start items-start">
                <div className="text-black text-sm font-medium  leading-tight">
                    {contexto}
                </div>
                </div>
            
            </div>
        </div>

         <Iconos.MercadoPago></Iconos.MercadoPago>
        
        </label>

    )
}

const CheckBox = {
    White1
}
export default CheckBox;