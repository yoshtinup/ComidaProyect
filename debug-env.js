// Test environment variables and config
import config from './src/config/apiConfig.js';

console.log('=== TESTING ENVIRONMENT VARIABLES ===');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('VITE_API_CARRITO_URL:', import.meta.env.VITE_API_CARRITO_URL);
console.log('VITE_IMAGE_SERVER_URL:', import.meta.env.VITE_IMAGE_SERVER_URL);
console.log('VITE_API_PRODUCTOS_URL:', import.meta.env.VITE_API_PRODUCTOS_URL);

console.log('=== TESTING CONFIG OBJECT ===');
console.log('config.API_BASE_URL:', config.API_BASE_URL);
console.log('config.endpoints.dispenserCreate:', config.endpoints.dispenserCreate);
console.log('config.endpoints.dispenserList:', config.endpoints.dispenserList);

// Test if any of these are undefined
const testValues = {
  'API_BASE_URL': config.API_BASE_URL,
  'dispenserCreate': config.endpoints.dispenserCreate,
  'dispenserList': config.endpoints.dispenserList
};

Object.entries(testValues).forEach(([key, value]) => {
  if (value === undefined) {
    console.error(`ERROR: ${key} is undefined!`);
  } else if (typeof value === 'string' && value.includes('undefined')) {
    console.error(`ERROR: ${key} contains 'undefined' string: ${value}`);
  } else {
    console.log(`✓ ${key}: ${value}`);
  }
});
