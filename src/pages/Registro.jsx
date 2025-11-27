
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
  const [errorType, setErrorType] = useState(''); // Nuevo: para guardar el tipo de error
  const [loader, setLoader] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false); // Para mostrar "verificando..."
  const [emailAvailable, setEmailAvailable] = useState(false); // Para mostrar "email disponible"
  
  // Estados de validación para cada campo
  const [fieldErrors, setFieldErrors] = useState({
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  
  const [fieldTouched, setFieldTouched] = useState({
    nombre: false,
    apellido: false,
    username: false,
    email: false,
    telefono: false,
    password: false,
    confirmPassword: false
  });
  
  const navigate = useNavigate();
  
  // Regex para validaciones
  const regexPatterns = {
    nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/,
    apellido: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefono: /^(\+52)?[\s]?(\d{10}|\d{3}[\s]?\d{3}[\s]?\d{4})$/,
    password: /^.{4,}$/  // Mínimo 4 caracteres según la API
  };
  
  // Validar campo específico
  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'nombre':
        if (!value.trim()) {
          error = 'El nombre es requerido';
        } else if (!regexPatterns.nombre.test(value)) {
          error = 'Solo letras y espacios (3-50 caracteres)';
        }
        break;
        
      case 'apellido':
        if (!value.trim()) {
          error = 'El apellido es requerido';
        } else if (!regexPatterns.apellido.test(value)) {
          error = 'Solo letras y espacios (2-50 caracteres)';
        }
        break;
        
      case 'username':
        if (!value.trim()) {
          error = 'El nombre de usuario es requerido';
        } else if (!regexPatterns.username.test(value)) {
          error = 'Solo letras, números y _ (3-20 caracteres, sin espacios)';
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          error = 'El correo electrónico es requerido';
        } else if (!regexPatterns.email.test(value)) {
          error = 'Formato de correo inválido (ejemplo: usuario@correo.com)';
        }
        break;
        
      case 'telefono':
        if (!value.trim()) {
          error = 'El teléfono es requerido';
        } else if (!regexPatterns.telefono.test(value)) {
          error = 'Formato: 10 dígitos o +52 123 456 7890';
        }
        break;
        
      case 'password':
        if (!value) {
          error = 'La contraseña es requerida';
        } else if (value.length < 4) {
          error = 'Mínimo 4 caracteres';
        } else if (!regexPatterns.password.test(value)) {
          error = 'La contraseña debe tener al menos 4 caracteres';
        }
        break;
        
      case 'confirmPassword':
        if (!value) {
          error = 'Confirma tu contraseña';
        } else if (value !== password) {
          error = 'Las contraseñas no coinciden';
        }
        break;
        
      default:
        break;
    }
    
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
    return error === '';
  };
  
  // Manejar cambio de campo
  const handleFieldChange = (fieldName, value) => {
    // Limpiar el estado de email disponible cuando el usuario escribe
    if (fieldName === 'email') {
      setEmailAvailable(false);
    }
    
    // Actualizar el valor
    switch (fieldName) {
      case 'nombre':
        setNombre(value);
        break;
      case 'apellido':
        setApellido(value);
        break;
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'telefono':
        setTelefono(value);
        break;
      case 'password':
        setPassword(value);
        // Re-validar confirmación si ya fue llenada
        if (confirmPassword && fieldTouched.confirmPassword) {
          validateField('confirmPassword', confirmPassword);
        }
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
    
    // Validar si el campo ya fue tocado
    if (fieldTouched[fieldName]) {
      validateField(fieldName, value);
    }
  };
  
  // Verificar si el email ya existe en el backend
  const checkEmailExists = async (emailValue) => {
    if (!emailValue.trim() || !regexPatterns.email.test(emailValue)) {
      setEmailAvailable(false);
      return; // No verificar si el email está vacío o es inválido
    }

    setCheckingEmail(true); // Mostrar indicador de "verificando..."
    setEmailAvailable(false); // Reset estado previo
    
    try {
      // Intentar hacer login con un password falso para verificar si el email existe
      const response = await axios.post(config.endpoints.userLogin, {
        gmail: emailValue.trim(),
        password: 'check_if_exists_12345' // Password temporal para verificación
      });
    } catch (error) {
      const errorCode = error.response?.data?.error;
      
      if (errorCode === 'USER_NOT_FOUND') {
        // Email NO existe - está disponible ✅
        setFieldErrors(prev => ({ ...prev, email: '' }));
        setEmailAvailable(true);
      } else if (errorCode === 'INVALID_PASSWORD') {
        // Email SÍ existe - ya está registrado ❌
        setFieldErrors(prev => ({ ...prev, email: '❌ Este email ya está registrado. ¿Quieres iniciar sesión?' }));
        setEmailAvailable(false);
      }
    } finally {
      setCheckingEmail(false);
    }
  };

  // Manejar blur (cuando el usuario sale del campo)
  const handleFieldBlur = async (fieldName, value) => {
    setFieldTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Primero validar formato
    validateField(fieldName, value);
    
    // Luego verificar si el email ya existe en el backend
    if (fieldName === 'email' && value.trim() && regexPatterns.email.test(value)) {
      await checkEmailExists(value);
    }
  };
  
  const handleRegisterGoogle = () => {
    window.location.href = config.endpoints.googleAuth;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    setFieldTouched({
      nombre: true,
      apellido: true,
      username: true,
      email: true,
      telefono: true,
      password: true,
      confirmPassword: true
    });
    
    // Validar todos los campos
    const isNombreValid = validateField('nombre', nombre);
    const isApellidoValid = validateField('apellido', apellido);
    const isUsernameValid = validateField('username', username);
    const isEmailValid = validateField('email', email);
    const isTelefonoValid = validateField('telefono', telefono);
    const isPasswordValid = validateField('password', password);
    const isConfirmPasswordValid = validateField('confirmPassword', confirmPassword);
    
    // Si algún campo es inválido, mostrar mensaje y detener
    if (!isNombreValid || !isApellidoValid || !isUsernameValid || 
        !isEmailValid || !isTelefonoValid || !isPasswordValid || !isConfirmPasswordValid) {
      setModalType('error');
      setModalMessage('Por favor, corrige los errores en el formulario antes de continuar.');
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
        codigo: password  // El backend espera "codigo" en lugar de "password"
      });

      const result = response.data;
      
      // ✅ Registro exitoso - Guardar token y datos del usuario
      if (result.success && result.data?.token) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('userId', result.data.id.toString());
        localStorage.setItem('userName', result.data.nombre || '');
        localStorage.setItem('userEmail', result.data.gmail || email.trim());
        localStorage.setItem('nfc', result.data.nfc || '');
        if (result.data.usuario) localStorage.setItem('username', result.data.usuario);
        
        setModalType('success');
        setModalMessage('¡Cuenta creada exitosamente! Serás redirigido al selector de dispensadores.');
        setModal(true);
        
        // Redirigir al dispenser-selector después de 2 segundos (usuario ya está autenticado)
        setTimeout(() => {
          navigate('/dispenser-selector');
        }, 2000);
      }
    } catch (error) {
      setLoader(false);
      setModalType('error');
      
      const errorData = error.response?.data;
      const errorCode = errorData?.error;
      
      // Manejar errores específicos según la documentación de la API
      switch (errorCode) {
        case 'EMAIL_ALREADY_EXISTS':
          setErrorType('EMAIL_ALREADY_EXISTS');
          setModalMessage('Este correo electrónico ya está registrado en el sistema. Si ya tienes una cuenta, puedes iniciar sesión. Si olvidaste tu contraseña, puedes recuperarla desde el login.');
          setFieldErrors({ ...fieldErrors, email: 'Este email ya está en uso' });
          setFieldTouched({ ...fieldTouched, email: true });
          break;
          
        case 'MISSING_REQUIRED_FIELDS':
          setErrorType('MISSING_REQUIRED_FIELDS');
          setModalMessage('Por favor completa todos los campos requeridos');
          // Marcar campos vacíos
          if (errorData.fields) {
            const newErrors = {};
            Object.keys(errorData.fields).forEach(field => {
              if (errorData.fields[field]) {
                newErrors[field === 'gmail' ? 'email' : field] = errorData.fields[field];
              }
            });
            setFieldErrors({ ...fieldErrors, ...newErrors });
          }
          break;
          
        case 'INVALID_EMAIL_FORMAT':
          setErrorType('INVALID_EMAIL_FORMAT');
          setModalMessage('El formato del correo electrónico no es válido. Por favor verifica que hayas escrito correctamente tu email.');
          setFieldErrors({ ...fieldErrors, email: 'Formato inválido (ejemplo: usuario@correo.com)' });
          setFieldTouched({ ...fieldTouched, email: true });
          break;
          
        case 'PASSWORD_TOO_SHORT':
          setErrorType('PASSWORD_TOO_SHORT');
          setModalMessage('La contraseña debe tener al menos 4 caracteres para garantizar la seguridad de tu cuenta.');
          setFieldErrors({ ...fieldErrors, password: 'Mínimo 4 caracteres requeridos' });
          setFieldTouched({ ...fieldTouched, password: true });
          break;
          
        default:
          setErrorType('GENERIC_ERROR');
          if (error.response?.status === 409) {
            setModalMessage('El email o nombre de usuario ya existe. Por favor, elige otros datos.');
          } else if (error.response?.status === 400) {
            setModalMessage(errorData?.message || 'Datos inválidos. Verifica la información ingresada.');
          } else {
            setModalMessage('Error al crear la cuenta. Intenta nuevamente.');
          }
      }
      
      setModal(true);
      console.error('Registration failed:', error.response?.data || error);
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
              <div className={`w-16 h-16 ${
                modalType === 'error' 
                  ? (errorType === 'EMAIL_ALREADY_EXISTS' ? 'bg-yellow-100' : 
                     errorType === 'INVALID_EMAIL_FORMAT' ? 'bg-blue-100' : 
                     errorType === 'PASSWORD_TOO_SHORT' ? 'bg-orange-100' : 'bg-red-100')
                  : 'bg-green-100'
              } rounded-full flex items-center justify-center mx-auto mb-4`}>
                {modalType === 'error' ? (
                  errorType === 'EMAIL_ALREADY_EXISTS' ? (
                    <Mail className="w-8 h-8 text-yellow-600" />
                  ) : errorType === 'INVALID_EMAIL_FORMAT' ? (
                    <Mail className="w-8 h-8 text-blue-600" />
                  ) : errorType === 'PASSWORD_TOO_SHORT' ? (
                    <Lock className="w-8 h-8 text-orange-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  )
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                )}
              </div>
              <div className={`absolute -top-2 -right-2 w-6 h-6 ${
                modalType === 'error'
                  ? (errorType === 'EMAIL_ALREADY_EXISTS' ? 'bg-yellow-500' :
                     errorType === 'INVALID_EMAIL_FORMAT' ? 'bg-blue-500' :
                     errorType === 'PASSWORD_TOO_SHORT' ? 'bg-orange-500' : 'bg-red-500')
                  : 'bg-green-500'
              } rounded-full animate-ping opacity-75`}></div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {modalType === 'error' ? (
                errorType === 'EMAIL_ALREADY_EXISTS' ? '¡Email ya registrado!' :
                errorType === 'INVALID_EMAIL_FORMAT' ? '📧 Email inválido' :
                errorType === 'PASSWORD_TOO_SHORT' ? '🔒 Contraseña muy corta' :
                errorType === 'MISSING_REQUIRED_FIELDS' ? '⚠️ Campos requeridos' :
                'Error en el registro'
              ) : '¡Registro exitoso!'}
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {modalMessage}
            </p>
            
            {/* Información adicional según el tipo de error */}
            {modalType === 'error' && errorType === 'EMAIL_ALREADY_EXISTS' && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  📧 Email detectado: <span className="font-bold">{email}</span>
                </p>
                <p className="text-xs text-blue-700">
                  Este correo ya está asociado a una cuenta existente. Por favor, inicia sesión con esta dirección de email.
                </p>
              </div>
            )}
            
            {modalType === 'error' && errorType === 'INVALID_EMAIL_FORMAT' && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  📧 Email ingresado: <span className="font-mono text-blue-900">{email}</span>
                </p>
                <p className="text-xs text-blue-700 mb-2">
                  El formato del correo electrónico no es válido.
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  ✅ Ejemplo válido: usuario@ejemplo.com
                </p>
              </div>
            )}
            
            {modalType === 'error' && errorType === 'PASSWORD_TOO_SHORT' && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800 font-medium mb-2">
                  🔒 Requisitos de contraseña:
                </p>
                <ul className="text-xs text-orange-700 text-left list-disc list-inside space-y-1">
                  <li>Mínimo 4 caracteres</li>
                  <li>Puedes usar letras, números y símbolos</li>
                  <li>Elige una contraseña segura y fácil de recordar</li>
                </ul>
              </div>
            )}
            
            {modalType === 'error' && errorType === 'MISSING_REQUIRED_FIELDS' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  ⚠️ Por favor completa todos los campos marcados con *
                </p>
                <p className="text-xs text-yellow-700">
                  Revisa el formulario y asegúrate de llenar todos los campos requeridos.
                </p>
              </div>
            )}
            
            <div className="flex gap-3 justify-center">
              {/* Botón especial para ir al login si el email ya existe */}
              {modalType === 'error' && errorType === 'EMAIL_ALREADY_EXISTS' && (
                <button
                  onClick={() => {
                    setModal(false);
                    navigate('/login', { state: { email: email } });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Ir al Login
                </button>
              )}
              
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
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="nombre"
                      type="text"
                      value={nombre}
                      onChange={(e) => handleFieldChange('nombre', e.target.value)}
                      onBlur={(e) => handleFieldBlur('nombre', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                        fieldErrors.nombre && fieldTouched.nombre
                          ? 'border-red-500 focus:ring-red-500 bg-red-50'
                          : 'border-gray-300 focus:ring-black focus:border-transparent'
                      }`}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  {fieldErrors.nombre && fieldTouched.nombre && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.nombre}
                    </p>
                  )}
                </div>

                {/* Campo de apellido */}
                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="apellido"
                      type="text"
                      value={apellido}
                      onChange={(e) => handleFieldChange('apellido', e.target.value)}
                      onBlur={(e) => handleFieldBlur('apellido', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                        fieldErrors.apellido && fieldTouched.apellido
                          ? 'border-red-500 focus:ring-red-500 bg-red-50'
                          : 'border-gray-300 focus:ring-black focus:border-transparent'
                      }`}
                      placeholder="Tu apellido"
                      required
                    />
                  </div>
                  {fieldErrors.apellido && fieldTouched.apellido && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.apellido}
                    </p>
                  )}
                </div>

                {/* Campo de nombre de usuario */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de usuario <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => handleFieldChange('username', e.target.value)}
                      onBlur={(e) => handleFieldBlur('username', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                        fieldErrors.username && fieldTouched.username
                          ? 'border-red-500 focus:ring-red-500 bg-red-50'
                          : 'border-gray-300 focus:ring-black focus:border-transparent'
                      }`}
                      placeholder="Tu nombre de usuario"
                      required
                    />
                  </div>
                  {fieldErrors.username && fieldTouched.username && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.username}
                    </p>
                  )}
                </div>

                {/* Campo de email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      onBlur={(e) => handleFieldBlur('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                        fieldErrors.email && fieldTouched.email
                          ? 'border-red-500 focus:ring-red-500 bg-red-50'
                          : 'border-gray-300 focus:ring-black focus:border-transparent'
                      }`}
                      placeholder="tu@email.com"
                      required
                      disabled={checkingEmail}
                    />
                    {checkingEmail && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  {checkingEmail && (
                    <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Verificando disponibilidad...
                    </p>
                  )}
                  {emailAvailable && !checkingEmail && !fieldErrors.email && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      ✅ Email disponible
                    </p>
                  )}
                  {fieldErrors.email && fieldTouched.email && !checkingEmail && (
                    <div className="text-xs mt-1 flex items-center gap-1">
                      {fieldErrors.email.includes('ya está registrado') ? (
                        <div className="flex flex-col gap-1">
                          <p className="text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {fieldErrors.email}
                          </p>
                          <button
                            type="button"
                            onClick={() => navigate('/login', { state: { email: email } })}
                            className="text-blue-600 hover:text-blue-700 font-medium text-left underline"
                          >
                            Ir al Login →
                          </button>
                        </div>
                      ) : (
                        <p className="text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Campo de teléfono */}
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono <span className="text-red-500">*</span>
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
                      onChange={(e) => handleFieldChange('telefono', e.target.value)}
                      onBlur={(e) => handleFieldBlur('telefono', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                        fieldErrors.telefono && fieldTouched.telefono
                          ? 'border-red-500 focus:ring-red-500 bg-red-50'
                          : 'border-gray-300 focus:ring-black focus:border-transparent'
                      }`}
                      placeholder="+52 123 456 7890 o 1234567890"
                      required
                    />
                  </div>
                  {fieldErrors.telefono && fieldTouched.telefono && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.telefono}
                    </p>
                  )}
                </div>

                {/* Campo de contraseña */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      onBlur={(e) => handleFieldBlur('password', e.target.value)}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                        fieldErrors.password && fieldTouched.password
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
                  {fieldErrors.password && fieldTouched.password && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Campo de confirmar contraseña */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                      onBlur={(e) => handleFieldBlur('confirmPassword', e.target.value)}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                        fieldErrors.confirmPassword && fieldTouched.confirmPassword
                          ? 'border-red-500 focus:ring-red-500 bg-red-50'
                          : 'border-gray-300 focus:ring-black focus:border-transparent'
                      }`}
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
                  {fieldErrors.confirmPassword && fieldTouched.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
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