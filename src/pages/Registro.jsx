
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Film, X, AlertCircle, CheckCircle } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CineSnacksLoader from '../componets/loader/CineSnacksLoader';
import config from '../config/apiConfig';

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState('error'); // 'error' or 'success'
  const [modalMessage, setModalMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  
  const handleRegisterGoogle = () => {
    alert("Regístrate con Google");
    window.location.href = config.endpoints.googleAuth;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (password !== confirmPassword) {
      setModalType('error');
      setModalMessage('Las contraseñas no coinciden');
      setModal(true);
      return;
    }
    
    if (password.length < 8) {
      setModalType('error');
      setModalMessage('La contraseña debe tener al menos 8 caracteres');
      setModal(true);
      return;
    }

    // Validación de campos requeridos
    if (!nombre.trim() || !apellido.trim() || !telefono.trim()) {
      setModalType('error');
      setModalMessage('Todos los campos son requeridos');
      setModal(true);
      return;
    }

    setLoader(true);
    
    try {
      const response = await axios.post(config.endpoints.userRegister, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        gmail: email.trim(),
        telefono: telefono.trim(),
        usuario: username.trim(),
        codigo: password
      });

      if (response.status === 201) {
        setModalType('success');
        setModalMessage('Cuenta creada exitosamente. Serás redirigido al login.');
        setModal(true);
        
        // Redirigir al login después de 2 segundos con el email pre-llenado
        setTimeout(() => {
          navigate('/login', { state: { email: email.trim() } });
        }, 2000);
      }
    } catch (error) {
      setLoader(false);
      setModalType('error');
      
      if (error.response?.status === 409) {
        setModalMessage('El email o nombre de usuario ya existe. Por favor, elige otros datos.');
      } else if (error.response?.status === 400) {
        setModalMessage(error.response?.data?.error || 'Datos inválidos. Verifica la información ingresada.');
      } else {
        setModalMessage('Error al crear la cuenta. Intenta nuevamente.');
      }
      
      setModal(true);
      console.error('Registration failed:', error);
    }
  };

  if (loader) {
    return <CineSnacksLoader />;
  }

  return (
    <>
      {/* Modal de notificación */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center transform animate-scaleIn shadow-2xl border border-gray-100">
            {/* Icono y decoración */}
            <div className="relative mb-6">
              <div className={`w-16 h-16 ${modalType === 'error' ? 'bg-red-100' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {modalType === 'error' ? (
                  <AlertCircle className="w-8 h-8 text-red-500" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                )}
              </div>
              <div className={`absolute -top-2 -right-2 w-6 h-6 ${modalType === 'error' ? 'bg-red-500' : 'bg-green-500'} rounded-full animate-ping opacity-75`}></div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {modalType === 'error' ? 'Error en el registro' : '¡Registro exitoso!'}
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {modalMessage}
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setModal(false)}
                className={`${modalType === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2`}
              >
                <X className="w-4 h-4" />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Layout principal */}
      <div className="flex min-h-screen bg-gray-50 font-[Arial]">
        {/* Panel izquierdo - Imagen/Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
          {/* Efectos de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
          
          {/* Contenido del panel */}
          <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                <Film className="w-10 h-10 text-black" />
              </div>
              <h1 className="text-5xl font-bold mb-4">
                <span className="text-white">Cine</span>
                <span className="text-gray-300">Snacks</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-md leading-relaxed">
                Únete a nuestra comunidad y disfruta de la mejor experiencia cinematográfica
              </p>
            </div>
            
            {/* Beneficios del registro */}
            <div className="grid grid-cols-1 gap-4 max-w-sm w-full">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Acceso a descuentos exclusivos</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <span className="text-sm">Historial de pedidos</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                <span className="text-sm">Recomendaciones personalizadas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho - Formulario */}
        <div className="flex-1 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Header del formulario para móvil */}
            <div className="text-center mb-8 lg:hidden">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Film className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-black">
                <span>Cine</span><span className="text-gray-600">Snacks</span>
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear cuenta</h2>
                <p className="text-gray-600">Completa tus datos para registrarte</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-6">
                {/* Campo de nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="nombre"
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                </div>

                {/* Campo de apellido */}
                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="apellido"
                      type="text"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Tu apellido"
                      required
                    />
                  </div>
                </div>

                {/* Campo de nombre de usuario */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de usuario
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Tu nombre de usuario"
                      required
                    />
                  </div>
                </div>

                {/* Campo de email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Campo de teléfono */}
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      id="telefono"
                      type="tel"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="+52 123 456 7890"
                      required
                    />
                  </div>
                </div>

                {/* Campo de contraseña */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Campo de confirmar contraseña */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Contraseña debe tener más de 8 caracteres</p>
                </div>

                {/* Términos y condiciones */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-2 mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-600">
                    Acepto los{' '}
                    <a href="#" className="text-black hover:text-gray-700 font-medium">
                      términos y condiciones
                    </a>{' '}
                    y la{' '}
                    <a href="#" className="text-black hover:text-gray-700 font-medium">
                      política de privacidad
                    </a>
                  </span>
                </div>

                {/* Botón de registro */}
                <button
                  type="submit"
                  disabled={loader}
                  className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:from-gray-800 hover:to-black transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 shadow-lg"
                >
                  {loader ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear cuenta'
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">O continúa con</span>
                  </div>
                </div>

                {/* Botón de Google */}
                <button
                  type="button"
                  onClick={handleRegisterGoogle}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-sm"
                >
                  <FaGoogle className="w-5 h-5 text-gray-600" />
                  Continuar con Google
                </button>

                {/* Link de login */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <a href="/login" className="text-black hover:text-gray-700 font-medium">
                      Inicia sesión aquí
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registro;