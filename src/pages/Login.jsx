import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaInstagram, FaChartLine, FaDollarSign, FaDrupal} from 'react-icons/fa';
import '../assets/login/Login.css';
import MangoBlobs from '../assets/img/MangoBlobs.png'; 
import Icono from "../assets/img/Icono.png";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleregistro = (e) => {
    e.preventDefault();
    navigate('/registro');
    // Lógica de inicio de sesión aquí
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de inicio de sesión aquí
  };

  return (
    <div className="container">
      {/* Sección de marca */}
      <div className="brand-section">
        <div className='icono-template'>
            <img src={Icono} alt="Icono" />
            <span>By Ingehub</span>
        </div>

        <h1 className="title">Ordena, recoge y sigue tu camino</h1>
        <h2 className="subtitle">AutoServe</h2>
        <h3 className='subtitle2'>fast food</h3>
        
        <div className="features">
            <div className='agrupar-item'>
                <div className="feature-item">
                    <span>Pureza</span>
                    <FaDrupal className="feature-icon" />
                </div>
                <div className="feature-item">
                    <span>Calidad</span>
                    <FaChartLine className="feature-icon" />
                </div>
                <div className="feature-item">
                    <span>Mejor precio</span>
                    <FaDollarSign className="feature-icon" />
                </div>
            </div>
            <div className='image-container'>
                <div className='image-circle'></div>
                <img className='image-mango' src={MangoBlobs} alt="MangoBlobs" />
            </div>
          <button className="learn-more">Saber más</button>
        </div>
      </div>

      {/* Sección de Login */}
      <div className="login-section">
        <form onSubmit={handleSubmit} className="form">
          <h2 className="login-title">Iniciar sesión</h2>
          <p className="signup-text">O crear una cuenta nueva</p>

          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Correo electrónico'
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Contraseña'
            />
            <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="login-button">Iniciar sesión</button>
          <button className='login-button2' onClick={handleregistro}>Registrar cuenta </button>
          <div className="divider">O continuar con</div>

          <button type="button" className="google-button">
            <FaGoogle className="icon" />
            Iniciar sesión con Google
          </button>

          <div className="social-links">
            <a href="#"><FaInstagram className="social-icon" /></a>
            <a href="#"><FaFacebook className="social-icon" /></a>
            <a href="#"><FaGoogle className="social-icon" /></a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;