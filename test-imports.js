// Test script to verify imports and potential issues
console.log('Testing imports...');

// Test 1: Check if config import works
try {
  console.log('✓ Config import available');
} catch (e) {
  console.error('✗ Config import failed:', e);
}

// Test 2: Check environment variables
const envVars = {
  'VITE_API_BASE_URL': import.meta.env?.VITE_API_BASE_URL,
  'VITE_API_CARRITO_URL': import.meta.env?.VITE_API_CARRITO_URL,
  'VITE_IMAGE_SERVER_URL': import.meta.env?.VITE_IMAGE_SERVER_URL
};

console.log('Environment variables:', envVars);

// Test 3: Check for undefined values
Object.entries(envVars).forEach(([key, value]) => {
  if (value === undefined) {
    console.warn(`WARNING: ${key} is undefined`);
  } else {
    console.log(`✓ ${key}: ${value}`);
  }
});

// Test 4: Check localStorage
try {
  const token = localStorage.getItem('token');
  console.log('Token exists:', !!token);
} catch (e) {
  console.error('localStorage access failed:', e);
}

console.log('All import tests completed');
