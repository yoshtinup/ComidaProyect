import { useEffect, useState } from "react";
import HeaderPago from "../componets/HeaderPago";
import BodyPago from "../organismo/BodyPago";
import { jwtDecode } from "jwt-decode";

function Pago() {
    const [userData, setUserData] = useState(null);
    const [carritos, setCarritos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserData(decoded);
                console.log("Token decodificado:", decoded);
            } catch (e) {
                setUserData(null);
                console.log("Error al decodificar token:", e);
            }
        } else {
            setUserData(null);
            console.log("No hay token en localStorage");
        }
    }, []);

    useEffect(() => {
        if (userData && userData.id) {
            fetch("http://localhost:3002/api/v1/carrito")
                .then(res => res.json())
                .then(data => {
                    const filtrados = data.filter(item => String(item.iduser) === String(userData.id));
                    setCarritos(filtrados);
                })
                .catch(err => console.error("Error al obtener carritos:", err));
        }
    }, [userData]);

    return(
        <>
        <HeaderPago></HeaderPago>
        <BodyPago
            idpruducto={carritos.map(c => c.idproducto)}
            idcarrito={carritos.map(c => c.id)}
        ></BodyPago>
        </>
    )
}
export default Pago;