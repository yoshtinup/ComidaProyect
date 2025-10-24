import React from 'react';
import { useNavigate } from 'react-router-dom';

function EmptyState({ 
  icon = '🛒', 
  title = 'No tienes pedidos aún', 
  description = '¡Es hora de hacer tu primer pedido!', 
  buttonText = 'Explorar Snacks', 
  buttonRoute = '/home',
  onButtonClick 
}) {
  const navigate = useNavigate();
  
  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonRoute) {
      navigate(buttonRoute);
    }
  };

  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-600 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      <button
        onClick={handleButtonClick}
        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default EmptyState;
