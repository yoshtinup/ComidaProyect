import { useState, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff, Mail, Lock, Film, X, AlertCircle } from 'lucide-react';
import { FaGoogle } from "react-icons/fa";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import CineSnacksLoader from '../componets/loader/CineSnacksLoader';
import Formulario from '../organismo/Formulario';
import config from '../config/apiConfig';

const Login = () => {
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ gmail: false, password: false });
  const navigate = useNavigate();
  const jwt_decode = jwtDecode; 
  const location = useLocation();
  const GOOGLE_AUTH_URL = config.endpoints.googleAuth;

// Función para manejar el login con Google (igual que tienes)
const handleLoginGoogle = () => {
  window.location.href = GOOGLE_AUTH_URL;
};

// Pre-llenar email si viene del registro
useEffect(() => {
  if (location.state?.email) {
    setGmail(location.state.email);
  }
}, [location.state]);



useEffect(() => {
  // Función para procesar el token de Google OAuth cuando regresas del redirect
  const handleGoogleCallback = () => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    const nfc = urlParams.get('nfc') || '';
    const role = urlParams.get('role');

if (token) {
  try {
    const decoded = jwtDecode(token);

        // Extraer datos del token decodificado, no de los parámetros URL
        const userIdFromToken = decoded.id || userId; // En el token JWT está como 'id', no 'userId'
        const userNfc = decoded.nfc || nfc || ""; // Si nfc es null, usar string vacío

        // Guardar todo en localStorage igual que el login convencional
        localStorage.setItem('userId', userIdFromToken.toString());
        localStorage.setItem('nfc', userNfc);
        localStorage.setItem('token', token);
        localStorage.setItem('name', decoded.nombre || ''); // Guardar nombre si está disponible
        localStorage.setItem('email', decoded.email || ''); // Guardar email si está disponible
        

        // Limpiar los parámetros de la URL
        window.history.replaceState({}, document.title, location.pathname);

        // Redirigir según el rol igual que el login convencional
        const userRole = parseInt(role);

        if (userRole === 2) {
          navigate('/panel-admin');
        } else if (userRole === 1) {
          navigate('/dispenser-selector');
        } else {
          navigate('/dispenser-selector');
        }

      } catch (error) {
        console.error('Error processing Google login token:', error);
        // Opcional: mostrar mensaje de error o redirigir al login
        navigate('/login');
      }
    }
  };

  // Ejecutar solo si estamos en la página donde Google nos redirige
  handleGoogleCallback();
}, [location.search, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Limpiar errores previos
    setErrorMessage('');
    setErrorType('');
    setFieldErrors({ gmail: false, password: false });
    setLoader(true);
    
    try {
      const response = await axios.post(config.endpoints.userLogin, {
        gmail,
        password
      });

      // ✅ CORRECTO: El token está en response.data.data.token
      const result = response.data;
      
      if (!result.success || !result.data || !result.data.token) {
        console.error('Login failed: Token not received');
        setLoader(false);
        setErrorMessage('No se recibió el token de autenticación');
        setErrorType('TOKEN_ERROR');
        setModal(true); 
        return;
      }

      // Extraer datos de result.data
      const { token, userId, nombre, nfc, usuario, id_role_fk } = result.data;

      // Guardar datos en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('nfc', nfc || "");
      localStorage.setItem('userName', nombre || "");
      localStorage.setItem('userEmail', gmail);
      
      if (usuario) localStorage.setItem('username', usuario);

      // Decodificar token para obtener el rol
      const decoded = jwt_decode(token);
      const role = decoded.id_role_fk || id_role_fk;

      // Redirigir según el tipo
      if (role === 2) {
        navigate('/panel-admin');
      } else if (role === 1) {
        navigate('/dispenser-selector');
      } else {
        navigate('/dispenser-selector');
      }

    } catch (error) {
      setLoader(false);
      console.error('Login failed:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Manejar errores específicos del API
      handleLoginError(error.response?.data || { error: 'NETWORK_ERROR', message: 'Error de conexión' });
    }
  };

  // Función para manejar errores específicos del API
  const handleLoginError = (errorData) => {
    const errorCode = errorData.error;
    const message = errorData.message;
    
    setErrorMessage(message);
    setErrorType(errorCode);
    
    switch (errorCode) {
      case 'MISSING_CREDENTIALS':
        setFieldErrors({ gmail: true, password: true });
        break;
        
      case 'MISSING_EMAIL':
        setFieldErrors({ gmail: true, password: false });
        break;

      case 'ER_DUP_ENTRY':
        setFieldErrors({ gmail: true, password: false });
        break;  
        
      case 'MISSING_PASSWORD':
        setFieldErrors({ gmail: false, password: true });
        break;
        
      case 'INVALID_EMAIL_FORMAT':
        setFieldErrors({ gmail: true, password: false });
        break;
        
      case 'PASSWORD_TOO_SHORT':
        setFieldErrors({ gmail: false, password: true });
        break;
        
      case 'USER_NOT_FOUND':
        setFieldErrors({ gmail: true, password: false });
        break;
        
      case 'INVALID_PASSWORD':
        setFieldErrors({ gmail: false, password: true });
        setPassword(''); // Limpiar contraseña
        break;
        
      case 'INVALID_CREDENTIALS':
        setFieldErrors({ gmail: true, password: true });
        setPassword(''); // Limpiar contraseña
        break;
        
      case 'SERVER_ERROR':
        setFieldErrors({ gmail: false, password: false });
        break;
        
      default:
        setFieldErrors({ gmail: false, password: false });
        setErrorMessage(message || 'Ocurrió un error inesperado');
    }
    
    setModal(true);
  };

  if (loader) {
    return <CineSnacksLoader />;
  }

  return (
    <>
      {/* Modal de error - MEJORADO CON MENSAJES ESPECÍFICOS */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center transform animate-scaleIn shadow-2xl border border-gray-100">
            {/* Icono y decoración */}
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {errorType === 'USER_NOT_FOUND' ? '¡Usuario no encontrado!' : 'Error de inicio de sesión'}
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {errorMessage || 'Por favor, verifica tus credenciales e intenta nuevamente.'}
            </p>
            
            {/* Sugerencias específicas según el error */}
            {errorType === 'INVALID_EMAIL_FORMAT' && (
              <p className="text-sm text-gray-500 mb-4 italic">Ejemplo: usuario@correo.com</p>
            )}
            
            {errorType === 'PASSWORD_TOO_SHORT' && (
              <p className="text-sm text-gray-500 mb-4 italic">La contraseña debe tener al menos 4 caracteres</p>
            )}
            
            <div className="flex flex-col gap-3 justify-center">
              {/* Botón de crear cuenta si usuario no existe */}
              {errorType === 'USER_NOT_FOUND' && (
                <button
                  onClick={() => {
                    setModal(false);
                    navigate('/registro', { state: { email: gmail } });
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  ¿Quieres crear una cuenta?
                </button>
              )}
              
              {/* Link de recuperar contraseña si contraseña incorrecta */}
              {errorType === 'INVALID_PASSWORD' && (
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700 mb-2"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              )}
              
              <button
                onClick={() => {
                  setModal(false);
                  setErrorMessage('');
                  setErrorType('');
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2 justify-center"
              >
                <X className="w-4 h-4" />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NUEVO DISEÑO - Layout principal */}
      
      <div className="flex min-h-screen bg-gray-50 font-[Arial]">
        {/* Panel izquierdo - Imagen/Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
          {/* Efectos de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-red-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-40 h-40 bg-orange-500 rounded-full blur-3xl opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
          
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
                Dispensador inteligente de snacks para la mejor experiencia cinematográfica
              </p>
            </div>
            
            {/* Características */}
            <div className="grid grid-cols-1 gap-4 max-w-sm w-full">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Dispensado automático</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <span className="text-sm">Conectividad IoT</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                <span className="text-sm">Variedad de productos</span>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Iniciar sesión</h2>
                <p className="text-gray-600">Ingresa tus datos de acceso</p>
              </div>

              <div className="space-y-6">
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
                      value={gmail}
                      onChange={(e) => {
                        setGmail(e.target.value);
                        setFieldErrors(prev => ({ ...prev, gmail: false }));
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                        fieldErrors.gmail 
                          ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                          : 'border-gray-300 focus:ring-black focus:border-transparent'
                      }`}
                      placeholder="tu@email.com"
                      required
                    />
                    {fieldErrors.gmail && (
                      <p className="text-xs text-red-500 mt-1">Este campo tiene un error</p>
                    )}
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
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFieldErrors(prev => ({ ...prev, password: false }));
                      }}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                        fieldErrors.password 
                          ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                          : 'border-gray-300 focus:ring-black focus:border-transparent'
                      }`}
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
                  {fieldErrors.password ? (
                    <p className="text-xs text-red-500 mt-1">Este campo tiene un error</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Contraseña debe tener más de 8 caracteres</p>
                  )}
                </div>

                {/* Recordar sesión y olvidé contraseña */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                  </label>
                  <a href="#" className="text-sm text-black hover:text-gray-700 font-medium">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                {/* Botón de login - CON LÓGICA ORIGINAL */}
                <button
                  onClick={handleLogin}
                  disabled={loader}
                  className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:from-gray-800 hover:to-black transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 shadow-lg"
                >
                  {loader ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar sesión'
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

                {/* Botón de Google - CON LÓGICA ORIGINAL */}
                <button
                  type="button"
                  onClick={handleLoginGoogle}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-sm"
                >
                  <FaGoogle className="w-5 h-5 text-gray-600" />
                  Continuar con Google
                </button>

                {/* Link de registro */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    ¿No tienes cuenta?{' '}
                    <a href="/registro" className="text-black hover:text-gray-700 font-medium">
                      Regístrate aquí
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Formulario.Form2 color="bg-white"/>
    </>
  );
};

export default Login;