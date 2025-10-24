import React from 'react';
import { useNavigate } from 'react-router-dom';
import fondo from "../assets/img/fondo.png"

const Card = ({ title, description, icon, delay = 0 }) => (
  <div 
    className="group w-full max-w-[301px] h-full p-4 md:p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-gray-300"
    style={{animationDelay: `${delay}s`}}
  >
    <div className="w-full mb-3 md:mb-4">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-black to-gray-700 rounded-full flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
    </div>
    <div className="w-full space-y-2 md:space-y-3">
      <div>
        <h3 className="text-[#141414] text-base md:text-lg font-bold leading-tight font-['Plus_Jakarta_Sans'] group-hover:text-gray-800 transition-colors duration-300">
          {title}
        </h3>
      </div>
      <div>
        <p className="text-[#727272] text-xs md:text-sm font-normal leading-relaxed font-['Plus_Jakarta_Sans'] group-hover:text-gray-600 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const AnimatedButton = ({ children, variant = "primary", onClick, className = "" }) => {
  const baseClasses = "h-12 px-6 sm:px-8 rounded-lg inline-flex justify-center items-center overflow-hidden font-bold font-['Plus_Jakarta_Sans'] text-sm sm:text-base leading-normal transition-all duration-300 transform hover:scale-105 hover:shadow-lg duration-[.5s] active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black shadow-lg",
    secondary: "bg-gradient-to-r from-gray-100 to-white text-black border-2 border-gray-300 hover:border-black hover:shadow-md",
    accent: "bg-gradient-to-r from-zinc-900 to-gray-500 text-white hover:from-gray-500 hover:to-zinc-900"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      <div className="inline-flex flex-col justify-center items-center">
        <div className="text-center">
          {children}
        </div>
      </div>
    </button>
  );
};

const FloatingParticle = ({ size = "w-2 h-2", color = "bg-yellow-400", position, delay = 0 }) => (
  <div 
    className={`absolute ${size} ${color} rounded-full animate-ping opacity-60`}
    style={{
      ...position,
      animationDelay: `${delay}s`,
      animationDuration: '3s'
    }}
  />
);

function BodyInicio() {
    const navigate = useNavigate();
    
    const handleLogin = () => {
        // Lógica para redirigir al login
        navigate('/login');
        console.log("Redirigir al login");
    };

    const handleRegister = () => {
        // Lógica para redirigir al registro
        navigate('/registro');
        console.log("Redirigir al registro");
    };

    const handleExploreMenu = () => {
        // Lógica para explorar el menú
        navigate('/home');
        console.log("Explorar menú");
    };

    const handleStartOrdering = () => {
        // Lógica para comenzar a pedir
        navigate('/home');
        console.log("Comenzar a pedir");
    };

    return(
        <div className=" w-full flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
            {/* Partículas flotantes de fondo */}
            <FloatingParticle 
                size="w-3 h-3" 
                color="bg-yellow-400" 
                position={{top: '10%', left: '5%'}} 
                delay={0}
            />
            <FloatingParticle 
                size="w-2 h-2" 
                color="bg-red-500" 
                position={{top: '20%', right: '8%'}} 
                delay={0.5}
            />
            <FloatingParticle 
                size="w-4 h-4" 
                color="bg-orange-500" 
                position={{top: '60%', left: '3%'}} 
                delay={1}
            />
            <FloatingParticle 
                size="w-2 h-2" 
                color="bg-amber-600" 
                position={{bottom: '15%', right: '5%'}} 
                delay={1.5}
            />
            <FloatingParticle 
                size="w-1 h-1" 
                color="bg-yellow-300" 
                position={{top: '40%', left: '8%'}} 
                delay={2}
            />
            <FloatingParticle 
                size="w-1 h-1" 
                color="bg-red-400" 
                position={{bottom: '40%', right: '10%'}} 
                delay={2.5}
            />

            {/* Header con botones de autenticación */}
            <div className="w-full max-w-7xl px-4 py-4 md:py-6 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
                <div className="flex items-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-wide">
                        <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Cine</span>
                        <span className="text-gray-600 ml-1">Snacks</span>
                    </h1>
                    <div className="w-12 md:w-16 h-0.5 bg-gradient-to-r from-black to-transparent ml-2 mt-2"></div>
                </div>
                <div className="flex gap-2 sm:gap-3">
                    <AnimatedButton variant="secondary" onClick={handleLogin} className="text-sm sm:text-base px-4 sm:px-6 h-10 sm:h-12">
                        Iniciar Sesión
                    </AnimatedButton>
                    <AnimatedButton variant="primary" onClick={handleRegister} className="text-sm sm:text-base px-4 sm:px-6 h-10 sm:h-12">
                        Registrarse
                    </AnimatedButton>
                </div>
            </div>

            {/* Hero Section */}
            <div className="w-full flex flex-col items-center gap-8 mt-8 px-4">
                <div className="relative w-full max-w-6xl">
                    {/* Imagen principal con overlay mejorado */}
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                        <img 
                            src={fondo} 
                            className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" 
                            alt="Cinema background"
                        />
                        {/* Overlay con gradiente mejorado */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                        
                        {/* Contenido superpuesto */}
                        <div className="absolute bg-black inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-8">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 md:mb-4 leading-tight animate-fade-in">
                                Disfruta el cine
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                                    sin interrupciones
                                </span>
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 md:mb-8 max-w-2xl leading-relaxed px-2">
                                Pide tus snacks favoritos y recíbelos directamente en tu asiento. 
                                La experiencia cinematográfica perfecta te está esperando.
                            </p>
                            
                            <AnimatedButton 
                                variant="accent" 
                                onClick={handleExploreMenu}
                                className="text-sm sm:text-base px-6 sm:px-10 h-10 sm:h-12 shadow-2xl"
                            >
                                Explorar el menú
                            </AnimatedButton>
                        </div>

                        {/* Efectos de brillo */}
                        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-transparent rounded-full blur-xl animate-pulse"></div>
                        <div className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-orange-500/30 to-transparent rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>
                </div>

                {/* Sección Cómo funciona */}
                <div className="w-full max-w-6xl px-4">
                    <div className="flex flex-col justify-center items-center gap-6 md:gap-8 text-center mb-8 md:mb-12">
                        <div className="space-y-3 md:space-y-4">
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-900 font-['Plus_Jakarta_Sans'] leading-tight">
                                Cómo funciona
                            </h2>
                            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-black to-gray-500 mx-auto rounded-full"></div>
                        </div>
                        <p className="text-base sm:text-lg text-neutral-600 font-normal font-['Plus_Jakarta_Sans'] leading-relaxed max-w-3xl px-4">
                            Pedir tus snacks nunca ha sido tan fácil. Sigue estos sencillos pasos para disfrutar de tus películas sin interrupciones.
                        </p>
                        <AnimatedButton 
                            variant="primary" 
                            onClick={handleStartOrdering}
                            className="mt-2 md:mt-4 text-sm sm:text-base px-6 sm:px-8 h-10 sm:h-12"
                        >
                            Comenzar a pedir
                        </AnimatedButton>
                    </div>

                    {/* Cards con iconos y animaciones */}
                    <div className="w-full flex justify-center">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl px-4">
                            <Card
                                title="Selecciona tu película"
                                description="Indica la película que vas a ver y el horario de la función para una experiencia perfecta."
                                delay={0.2}
                                icon={
                                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16l13-8L7 4z" />
                                    </svg>
                                }
                            />
                            <Card
                                title="Elige tus snacks"
                                description="Explora nuestro menú completo y añade todos tus snacks favoritos al carrito de compras."
                                delay={0.4}
                                icon={
                                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                                    </svg>
                                }
                            />
                            <Card
                                title="Recibe tu pedido"
                                description="Te notificaremos cuando tu pedido esté listo para recoger en el mostrador del cinema."
                                delay={0.6}
                                icon={
                                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5zm0 0V3" />
                                    </svg>
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Call to Action final */}
                <div className="w-full max-w-4xl text-center py-12 md:py-16 px-4">
                    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                        {/* Efectos de fondo */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 via-transparent to-orange-600/10"></div>
                        <div className="absolute top-4 right-4 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-4 left-4 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4 leading-tight">
                                ¿Listo para la mejor experiencia cinematográfica?
                            </h3>
                            <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 md:mb-8 leading-relaxed px-2">
                                Únete a miles de usuarios que ya disfrutan del cine sin interrupciones
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                                <AnimatedButton 
                                    variant="accent" 
                                    onClick={handleRegister}
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-black font-bold text-sm sm:text-base px-6 sm:px-8 h-10 sm:h-12"
                                >
                                    Crear cuenta gratis
                                </AnimatedButton>
                                <AnimatedButton 
                                    variant="secondary" 
                                    onClick={handleExploreMenu}
                                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black text-sm sm:text-base px-6 sm:px-8 h-10 sm:h-12"
                                >
                                    Ver menú completo
                                </AnimatedButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ondas de fondo sutiles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-100/30 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-orange-100/30 to-transparent rounded-full blur-3xl"></div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
            `}</style>
        </div>
    )
}

export default BodyInicio;