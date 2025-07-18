import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      // Redirige según el rol si lo necesitas
      if (decoded.id_role_fk === 1) {
        navigate('/dispenser-selector');
      } else if (decoded.id_role_fk === 2) {
        navigate('/panel-admin');
      } else {
        navigate('/dispenser-selector');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <div>Procesando login con Google...</div>;
};

export default GoogleCallback;