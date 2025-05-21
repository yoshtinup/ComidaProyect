
import Formulario from '../organismo/Formulario';
import { FaGoogle } from "react-icons/fa";
import Buttom from '../componets/Buttom';
import Input from '../componets/Input';
const Login = () => {

  return (
    <div className="flex min-h-screen font-[Arial]">
      {/* Sección de marca */}
      <Formulario.Form1>
      </Formulario.Form1>
      {/* Sección de Login */}
      <Formulario.Form2
      titulo={"Iniciar sesión"}
      subtitulo={"Ingresa tus datos de acceso"}
      color={"from-[#FD1D1D] to-[#FCB045]"}
      > 
          <Input.Input1
            name={"Correo electrónico"}
            type={"email"}
            contexto={"Correo electrónico"}
            />
          <Input.Input1
            name={"Contraseña"}
            type={"password"}
            contexto={"Contraseña"}
          />
            <a href="#" className="text-[#212121] text-sm block text-right ">Contraseña debe tener mas de 8 caracteres</a>
          <Buttom.Buttom1
            contexto={"Iniciar sesión"}
            type={"submit"}
          />
          <Buttom.Buttom2
            contexto={"Registrarse"}
            type={"submit"}
            ruta={"/registro"}
          />
          <div className="text-center text-[#212121] my-6 relative w-[110%] text-sm">
            O continuar con
          </div>
          <Buttom.Buttom3 
            contexto={"Iniciar registro con Google"}
            type={"submit"}
          >
            <FaGoogle className="text-xl" />
          </Buttom.Buttom3>
      </Formulario.Form2>
    </div>
  );
};

export default Login;