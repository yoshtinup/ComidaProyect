// Archivo de prueba para verificar importaciones
import analyticsService from './analyticsService.js';

console.log('✅ analyticsService importado correctamente');
console.log('Métodos disponibles:', Object.keys(analyticsService));

// Verificar que los métodos existen
const requiredMethods = ['getDashboard', 'getSalesMetrics', 'getTopProducts'];
const availableMethods = Object.keys(analyticsService);

requiredMethods.forEach(method => {
  if (availableMethods.includes(method)) {
    console.log(`✅ ${method} - OK`);
  } else {
    console.log(`❌ ${method} - FALTANTE`);
  }
});

export default true;
