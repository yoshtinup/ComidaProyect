import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "../componets/Header";
import Body from "../organismo/Body";
import Footer from "../organismo/Footer";
import { jwtDecode } from "jwt-decode";

function Home() {
    const navigate = useNavigate();

    // Obtener el token de localStorage
    const token = localStorage.getItem('token');
    const dispenserId = localStorage.getItem('selectedDispenserId');
    let userData = null;
    
    if (token) {
        try {
            userData = jwtDecode(token);
        } catch (e) {
            userData = null;
            console.log("Error al decodificar token:", e);
            // Opcional: redirigir al login si el token es inválido
            // navigate("/login");
        }
    } else {
        console.log("No hay token en localStorage");
        // Opcional: redirigir al login si no hay token
        // navigate("/login");
    }

    // Usar useEffect para las redirecciones
    useEffect(() => {
        if (!dispenserId) {
            navigate("/dispenser-selector");
        }
    }, [dispenserId, navigate]);

    // Verificar que userData existe antes de renderizar
    if (!userData) {
        return (
            <div>
                <p>No se pudo cargar la información del usuario. Por favor, inicia sesión.</p>
            </div>
        );
    }

    return (
        <>
            <Header />
            <Body
                iduser={userData.id}
                nombre={userData.nombre}
            />
            <Footer />
        </>
    );
}

export default Home;