import Header from "../componets/Header";
import Body from "../organismo/Body";
import Footer from "../organismo/Footer";
import { jwtDecode } from "jwt-decode";

function Home() {
    // Obtener el token de localStorage
    const token = localStorage.getItem('token');
    let userData = null;
    if (token) {
        try {
            userData = jwtDecode(token);
            console.log("Token decodificado:", userData);
        } catch (e) {
            userData = null;
            console.log("Error al decodificar token:", e);
        }
    } else {
        console.log("No hay token en localStorage");
    }

    return (
        <>
            <Header />
            {/* Mostrar datos del usuario si existen */}
            {userData && (
                <div style={{ padding: "1rem", background: "#f3f3f3" }}>
                    <strong>ID:</strong> {userData.id}<br />
                    <strong>Tipo:</strong> {userData.tipo}<br />
                    <strong>Nombre:</strong> {userData.nombre}<br />
                </div>
            )}
            <Body
              iduser={userData.id}
              nombre={userData.nombre}
            />
            <Footer />
        </>
    );
}
export default Home;