// Debug script to test dispenser creation
import config from './src/config/apiConfig.js';

console.log('Testing dispenser configuration...');
console.log('API Base URL:', config.API_BASE_URL);
console.log('Dispenser Create Endpoint:', config.endpoints.dispenserCreate);
console.log('Dispenser List Endpoint:', config.endpoints.dispenserList);

// Test data structure
const testDispenserData = {
  name: "Test Dispenser",
  status: "active",
  items: [
    { id: 1 },
    { id: 2 },
    { id: 3 }
  ]
};

console.log('Test dispenser data:', testDispenserData);
console.log('Nombre:', testDispenserData.name);
console.log('Tipo de nombre:', typeof testDispenserData.name);

// Test if any property is undefined
Object.keys(testDispenserData).forEach(key => {
  const value = testDispenserData[key];
  console.log(`${key}:`, value, `(type: ${typeof value})`);
  
  if (value === undefined) {
    console.warn(`WARNING: ${key} is undefined!`);
  }
  
  if (typeof value === 'string') {
    try {
      value.replace('test', 'test');
      console.log(`${key} can use replace method`);
    } catch (e) {
      console.error(`ERROR: ${key} cannot use replace method:`, e);
    }
  }
});

// Test environment variables
console.log('Environment variables:');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('VITE_API_CARRITO_URL:', import.meta.env.VITE_API_CARRITO_URL);
console.log('VITE_IMAGE_SERVER_URL:', import.meta.env.VITE_IMAGE_SERVER_URL);
