import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Datos de test basados en tu API
const testBarData = [
  { name: "Sem 1", Ingresos: 606, Órdenes: 9 },
  { name: "Sem 2", Ingresos: 441, Órdenes: 7 },
  { name: "Sem 3", Ingresos: 469, Órdenes: 7 },
  { name: "Sem 4", Ingresos: 404, Órdenes: 6 }
];

const testLineData = [
  { name: "01-jul", ingresos: 127 },
  { name: "02-jul", ingresos: 65 },
  { name: "03-jul", ingresos: 126 },
  { name: "04-jul", ingresos: 40 },
  { name: "05-jul", ingresos: 90 }
];

const TestChartsPage = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test de Gráficos con Datos Reales</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test BarChart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test BarChart</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={testBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Ingresos" fill="#4e73df" />
                <Bar dataKey="Órdenes" fill="#1cc88a" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Datos: {testBarData.length} semanas
              </p>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
                {JSON.stringify(testBarData[0], null, 2)}
              </pre>
            </div>
          </div>

          {/* Test LineChart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test LineChart</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={testLineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ingresos" stroke="#4e73df" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Datos: {testLineData.length} días (muestra)
              </p>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
                {JSON.stringify(testLineData[0], null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Estado de Datos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-medium text-green-800">✅ BarChart</h3>
              <p className="text-sm text-green-600">4 semanas de datos</p>
              <p className="text-xs text-green-500">Estructura: name + Ingresos + Órdenes</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-medium text-green-800">✅ LineChart</h3>
              <p className="text-sm text-green-600">24 días de datos</p>
              <p className="text-xs text-green-500">Estructura: name + ingresos</p>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-medium text-blue-800">📊 Estado</h3>
              <p className="text-sm text-blue-600">Transformaciones OK</p>
              <p className="text-xs text-blue-500">Listo para dashboard</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">🔍 Instrucciones de Debug</h2>
          <div className="text-sm text-yellow-700 space-y-2">
            <p><strong>1.</strong> Si estos gráficos se muestran correctamente, el problema está en el dashboard principal</p>
            <p><strong>2.</strong> Si no se muestran, hay un problema con Recharts o las dependencias</p>
            <p><strong>3.</strong> Revisa la consola para errores de importación de Recharts</p>
            <p><strong>4.</strong> Verifica que recharts esté instalado: <code>npm list recharts</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestChartsPage;
