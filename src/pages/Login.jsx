import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';// Asegúrate de instalar jwt-decode con npm o yarn

import Formulario from '../organismo/Formulario';
import { FaGoogle } from "react-icons/fa";
import Buttom from '../componets/bottom/Buttom';
import Input from '../componets/inputForm/Input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const jwt_decode = jwtDecode; // Asegúrate de que jwt_decode esté correctamente importado


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/api/v1/loginUser', {
        gmail,
        password
      });

      const { token } = response.data;

      // Guardar token en localStorage
      localStorage.setItem('token', token);

      // Decodificar el token para extraer el tipo
      const decoded = jwt_decode(token);
      const tipo = decoded.tipo;

      // Redirigir según el tipo
      if (tipo === 'admin') {
        navigate('/panel-admin');
      } else if (tipo === 'cliente') {
        navigate('/home');
      } else {
        navigate('/home');
      }

    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-[Arial]">
    <Formulario.Form1 />
    <Formulario.Form2
      titulo={"Iniciar sesión"}
      subtitulo={"Ingresa tus datos de acceso"}
      color={"from-[#FD1D1D] to-[#FCB045]"}
      onSubmit={handleLogin} // ✅ Este es el cambio más importante
    >
      <Input.Input1
        name={"Correo electrónico"}
        type={"email"}
        contexto={"Correo electrónico"}
        value={gmail}
        onChange={(e) => setGmail(e.target.value)}
      />
      <Input.Input1
        name={"Contraseña"}
        type={"password"}
        contexto={"Contraseña"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <a href="#" className="text-[#212121] text-sm block text-right">
        Contraseña debe tener más de 8 caracteres
      </a>

      <Buttom.Buttom1 contexto={"Iniciar sesión"} type={"submit"} />
      <Buttom.Buttom2 contexto={"Registrarse"} type={"button"} ruta={"/registro"} />

      <div className="text-center text-[#212121] my-6 relative w-[110%] text-sm">
        O continuar con
      </div>

      <Buttom.Buttom3 contexto={"Iniciar registro con Google"} type={"button"}>
        <FaGoogle className="text-xl" />
      </Buttom.Buttom3>
    </Formulario.Form2>

    </div>
  );
};

export default Login;
