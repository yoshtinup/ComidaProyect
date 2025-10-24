import React from 'react';
import { Navigate } from 'react-router-dom';

// Obtiene el rol del usuario desde localStorage (ajusta según tu lógica)
function getUserRole() {
  // El rol puede estar guardado como 'role', 'id_role_fk', etc. en el token o localStorage
  // Aquí se asume que está en localStorage como 'token' (JWT) o 'role'
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    // Decodifica el JWT para extraer el rol
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id_role_fk || payload.role || null;
  } catch {
    // Si no es JWT válido, intenta leer 'role' directo
    return localStorage.getItem('role') || null;
  }
}

const ProtectedRoute = ({ children, allowedRoles = [2] }) => {
  const userRole = getUserRole();
  if (!userRole || !allowedRoles.includes(Number(userRole))) {
    // Si no es admin, redirige al login
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
