import React, { useEffect, useState } from "react";
import Header from "../componets/Header";
import BodyCarrito from "../organismo/BodyCarrito";
import { jwtDecode } from "jwt-decode";

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
            fetch("http://3.230.107.32:3002/api/v1/carrito")
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
            {userData && (
                <div style={{ padding: "1rem", background: "#f3f3f3" }}>
                    <strong>ID:</strong> {userData.id}<br />
                    <strong>Tipo:</strong> {userData.tipo}
                    <strong>ID(s) Carrito:</strong> {carritos.map(c => c.id).join(", ")}
                </div>
            )}
            <BodyCarrito 
            idpruducto={carritos.map(c => c.idproducto)}
            idcarrito={carritos.map(c => c.id)}
             />
        </>
    );
}

export default Carrito;