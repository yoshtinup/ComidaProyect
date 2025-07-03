
import HeaderAdmin from '../componets/HeaderAdmin';
import Header from '../componets/Header';
import Footer from '../organismo/Footer';
import BodyInicio from '../organismo/bodyInicio';
import { jwtDecode } from 'jwt-decode';


function Inicio() {
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
        {/* Header */}
        {userData?.tipo === 'admin' ? <HeaderAdmin /> : <Header />}
        {userData && (
            <div style={{ padding: "1rem", background: "#f3f3f3" }}>
                <strong>ID:</strong> {userData.id}<br />
                <strong>Tipo:</strong> {userData.tipo}<br />
                <strong>Nombre:</strong> {userData.nombre}<br />
            </div>
        )}

        {/* body */}
        <BodyInicio></BodyInicio>
        {/* Footer */}
        <Footer />
        
        {/* Fin body */}
        </>
    )
}
export default Inicio;