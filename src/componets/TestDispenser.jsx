// Componente de prueba para verificar la estructura de datos
import React from 'react';
import dispenserService from '../services/dispenserService';

const TestDispenser = () => {
  
  const testCreateDispenser = async () => {
    const testData = {
      name: "Dispensador Entrada",
      status: "active", 
      items: [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ]
    };

    console.log('Testing dispenser creation with data:', testData);
    
    try {
      const result = await dispenserService.createDispenser(testData);
      console.log('Test successful:', result);
      alert('✅ Test exitoso! Revisa la consola para ver los detalles.');
    } catch (error) {
      console.error('Test failed:', error);
      alert('❌ Test falló. Revisa la consola para ver el error.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Prueba de Creación de Dispensador</h3>
      <p className="text-gray-600 mb-4">
        Esto probará la estructura exacta que proporcionaste:
      </p>
      <pre className="bg-gray-100 p-3 rounded text-sm mb-4">
{`{
  "name": "Dispensador Entrada",
  "status": "active", 
  "items": [
    { "id": 1 },
    { "id": 2 },
    { "id": 3 }
  ]
}`}
      </pre>
      <button
        onClick={testCreateDispenser}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        🧪 Probar Creación
      </button>
    </div>
  );
};

export default TestDispenser;
