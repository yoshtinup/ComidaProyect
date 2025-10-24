// Debug script para probar los endpoints de reportes
const API_BASE_URL = 'https://apiempresacinesnack.acstree.xyz';

const testEndpoints = async () => {
  console.log('🧪 Probando endpoints de reportes...');
  
  try {
    // Test 1: Best selling products
    console.log('\n📊 Probando productos más vendidos...');
    const bestSellingUrl = `${API_BASE_URL}/api/v1/reports/best-selling-products?limit=10&period=all`;
    console.log('URL:', bestSellingUrl);
    
    const bestSellingResponse = await fetch(bestSellingUrl, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (bestSellingResponse.ok) {
      const bestSellingData = await bestSellingResponse.json();
      console.log('✅ Best Selling Products:', bestSellingData);
    } else {
      console.error('❌ Error en best selling products:', bestSellingResponse.status, bestSellingResponse.statusText);
    }
    
    // Test 2: Sales summary
    console.log('\n📈 Probando resumen de ventas...');
    const salesSummaryUrl = `${API_BASE_URL}/api/v1/reports/sales-summary?period=month`;
    console.log('URL:', salesSummaryUrl);
    
    const salesSummaryResponse = await fetch(salesSummaryUrl, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (salesSummaryResponse.ok) {
      const salesSummaryData = await salesSummaryResponse.json();
      console.log('✅ Sales Summary:', salesSummaryData);
    } else {
      console.error('❌ Error en sales summary:', salesSummaryResponse.status, salesSummaryResponse.statusText);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
};

// Ejecutar el test
console.log('Para probar los endpoints, ejecuta en la consola del navegador: testEndpoints()');
window.testEndpoints = testEndpoints;
