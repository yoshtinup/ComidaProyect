import React, { useEffect, useState } from "react";
import Header from "../componets/Header";
import BodyCarrito from "../organismo/BodyCarrito";
import { jwtDecode } from "jwt-decode";
import config from "../config/apiConfig";

function Carrito() {
    const [userData, setUserData] = useState(null);
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    // Función para obtener el carrito del usuario
    const fetchCart = async (userId) => {
        if (!userId) return;
        
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(config.endpoints.carritoByUser(userId), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                setCartData(result.data);
                console.log("Carrito obtenido:", result.data);
            } else {
                setCartData({ items: [], total: "0.00", itemCount: 0, totalQuantity: 0 });
            }
        } catch (err) {
            console.error("Error al obtener carrito:", err);
            setCartData({ items: [], total: "0.00", itemCount: 0, totalQuantity: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userData && userData.id) {
            fetchCart(userData.id);
        }
    }, [userData]);

    return (
        <>
            <Header/>
            
            <BodyCarrito 
                cartData={cartData}
                loading={loading}
                onRefreshCart={() => fetchCart(userData?.id)}
                userId={userData?.id}
            />
        </>
    );
}

export default Carrito;