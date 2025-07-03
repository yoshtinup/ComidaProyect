import fondo from "../assets/img/fondo.png"
const Card = ({ title, description }) => (
  <div className="w-[301px] h-full p-4 bg-[#F9F9F9] border border-[#DBDBDB] rounded">
    <div className="w-full">
      <div className="w-6 overflow-hidden">
        {/* Aquí puedes agregar un ícono si deseas */}
      </div>
    </div>
    <div className="w-full space-y-1">
      <div className="h-5">
        <p className="w-[267px] text-[#141414] text-[16px] font-bold leading-[1.25] font-['Plus Jakarta Sans']">
          {title}
        </p>
      </div>
      <div>
        <p className="w-[267px] text-[#727272] text-[14px] font-normal leading-[1.5] font-['Plus Jakarta Sans']">
          {description}
        </p>
      </div>
    </div>
  </div>
);

function BodyInicio() {
    return(
            <div className="w-full flex flex-col items-center gap-6 mt-4">
            <div >
              <div className="relative w-full">
                {/* imagen */}
                <img src={fondo} className="w-full h-auto object-cover" />

                {/* botón sobre la imagen */}
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 cursor-pointer" >
                  <div className="h-12 max-w-[480px] min-w-20 px-5 bg-gradient-to-r from-zinc-900 to-gray-500 rounded inline-flex justify-center items-center overflow-hidden">
                    <div className="inline-flex flex-col justify-start items-center overflow-hidden">
                      <div className="text-center text-neutral-50 text-base font-bold font-['Plus_Jakarta_Sans'] leading-normal">
                        Explorar el menú
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Como comensar  */}
            <div>
                <div className="self-stretch inline-flex flex-col justify-start items-start gap-6">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                    <div className="w-[720px] max-w-[720px] flex flex-col justify-start items-start">
                    <div className="self-stretch justify-start text-neutral-900 text-4xl font-extrabold font-['Plus_Jakarta_Sans'] leading-10">Cómo funciona</div>
                    </div>
                    <div className="w-[720px] max-w-[720px] flex flex-col justify-start items-start">
                    <div className="self-stretch justify-start text-neutral-900 text-base font-normal font-['Plus_Jakarta_Sans'] leading-normal">Pedir tus snacks nunca ha sido tan fácil. Sigue estos sencillos pasos para disfrutar de tus películas sin interrupciones.</div>
                    </div>
                </div>
                <div className="h-12 max-w-[480px] min-w-20 px-5 bg-black rounded inline-flex justify-center items-center overflow-hidden">
                    <div className="inline-flex flex-col justify-start items-center overflow-hidden">
                    <div className="text-center justify-start text-neutral-50 text-base font-bold font-['Plus_Jakarta_Sans'] leading-normal">Comenzar a pedir</div>
                    </div>
                </div>
                </div>
            </div>
            {/* Lista de pasos */}
            <div>
            <div className="w-full flex flex-col space-y-3">
            <div className="flex gap-3">
                <Card
                title="Selecciona tu película"
                description="Indica la película que vas a ver y el horario de la función."
                />
                <Card
                title="Elige tus snacks"
                description="Explora nuestro menú y añade tus snacks favoritos al carrito."
                />
                <Card
                title="Recibe tu pedido"
                description="Te avisaremos cuando tu pedido esté listo para recoger en el mostrador."
                />
            </div>
            </div>
            </div>
                        
        </div>

    )
}
export default BodyInicio;