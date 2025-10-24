
import HeaderAdmin from '../componets/HeaderAdmin';
import Header from '../componets/Header';
import Footer from '../organismo/Footer';
import BodyInicio from '../organismo/BodyInicio';
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
        <BodyInicio/>
        <Footer />
        </>
    )
}
export default Inicio;