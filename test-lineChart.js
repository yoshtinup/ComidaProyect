// Test específico con la estructura exacta de lineChart
console.log('🧪 Testing LineChart con datos reales...');

const realLineChartData = {
  labels: ["01-jul", "02-jul", "03-jul", "04-jul", "05-jul", "06-jul", "07-jul", "08-jul", "09-jul", "10-jul", "11-jul", "12-jul", "13-jul", "14-jul", "15-jul", "16-jul", "17-jul", "18-jul", "19-jul", "20-jul", "21-jul", "22-jul", "23-jul", "24-jul"],
  datasets: [
    {
      name: "Ingresos diarios",
      data: [127, 65, 126, 40, 90, 58, 100, 72, 45, 80, 56, 45, 60, 83, 60, 50, 90, 56, 68, 90, 55, 128, 191, 85]
    }
  ]
};

// Función de transformación exacta del hook
const transformLineChartData = (lineChartData) => {
  console.log('🔄 Transformando LineChart:', lineChartData);
  
  if (!lineChartData || !lineChartData.labels || !lineChartData.datasets) {
    console.log('❌ LineChart: Datos inválidos');
    return [];
  }
  
  const { labels, datasets } = lineChartData;
  
  const result = labels.map((label, index) => {
    const dataPoint = { name: label };
    
    datasets.forEach(dataset => {
      if (dataset.data && dataset.data[index] !== undefined) {
        // Normalizar nombres de claves para que los reconozca CustomLineChart
        const keyName = dataset.name === 'Ingresos diarios' ? 'ingresos' : 
                       dataset.name === 'Órdenes' ? 'orders' :
                       dataset.name.toLowerCase().replace(/\s+/g, '');
        dataPoint[keyName] = dataset.data[index];
      }
    });
    
    return dataPoint;
  });
  
  console.log('✅ LineChart transformado:', result);
  return result;
};

// Ejecutar transformación
const transformed = transformLineChartData(realLineChartData);

console.log('\n📊 RESULTADO ESPERADO PARA CustomLineChart:');
console.log('Primer elemento:', JSON.stringify(transformed[0], null, 2));
console.log('Último elemento:', JSON.stringify(transformed[transformed.length - 1], null, 2));
console.log('Total de elementos:', transformed.length);

// Verificar que tiene la estructura correcta para Recharts
const hasCorrectStructure = transformed.every(item => 
  item.hasOwnProperty('name') && item.hasOwnProperty('ingresos')
);

console.log('\n✅ Estructura válida para Recharts:', hasCorrectStructure);
console.log('✅ Datos listos para CustomLineChart:', transformed.length > 0);

// Mostrar algunos puntos de muestra
console.log('\n📈 Puntos de muestra:');
transformed.slice(0, 5).forEach(point => {
  console.log(`- ${point.name}: $${point.ingresos}`);
});

console.log('\n🎯 Los datos transformados están listos para ser graficados!');
