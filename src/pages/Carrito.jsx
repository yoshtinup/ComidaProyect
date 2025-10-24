import React, { useEffect, useState } from "react";
import Header from "../componets/Header";
import BodyCarrito from "../organismo/BodyCarrito";
import { jwtDecode } from "jwt-decode";
import config from "../config/apiConfig";

function Carrito() {
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
            fetch(config.endpoints.carritoList)
                .then(res => res.json())
                .then(data => {
                    const filtrados = data.filter(item => String(item.iduser) === String(userData.id));
                    setCarritos(filtrados);
                })
                .catch(err => console.error("Error al obtener carritos:", err));
        }
    }, [userData]);

    return (
        <>
            <Header/>
            
            <BodyCarrito 
            idpruducto={carritos.map(c => c.idproducto)}
            idcarrito={carritos.map(c => c.id)}
             />
        </>
    );
}

export default Carrito;