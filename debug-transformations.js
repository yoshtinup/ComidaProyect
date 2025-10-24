// Debug de transformaciones con datos reales de la API
console.log('🧪 Testing transformaciones con datos reales...');

// Datos de ejemplo de tu API
const apiData = {
  visualization: {
    charts: {
      barChart: {
        labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
        datasets: [
          {
            name: "Ingresos",
            data: [606, 441, 469, 416]
          },
          {
            name: "Órdenes", 
            data: [9, 7, 7, 7]
          }
        ]
      },
      lineChart: {
        labels: ['01-jul', '02-jul', '03-jul', '04-jul', '05-jul', '06-jul', '07-jul', '08-jul', '09-jul', '10-jul', '11-jul', '12-jul', '13-jul', '14-jul', '15-jul', '16-jul', '17-jul', '18-jul', '19-jul', '20-jul', '21-jul', '22-jul', '23-jul', '24-jul'],
        datasets: [
          {
            name: 'Ingresos diarios',
            data: [127, 65, 126, 40, 90, 58, 100, 72, 45, 80, 56, 45, 60, 83, 60, 50, 90, 56, 68, 90, 55, 128, 191, 85]
          }
        ]
      },
      pieChart: {
        labels: ["Error al obtener productos"],
        data: [1]
      }
    }
  }
};

// Funciones de transformación (copiadas del hook)
const transformBarChartData = (barChartData, period) => {
  console.log('🔄 Transformando BarChart:', barChartData);
  
  if (!barChartData || !barChartData.labels || !barChartData.datasets) {
    console.log('❌ BarChart: Datos inválidos');
    return [];
  }
  
  const { labels, datasets } = barChartData;
  
  const result = labels.map((label, index) => {
    const dataPoint = { name: label };
    
    datasets.forEach(dataset => {
      if (dataset.data && dataset.data[index] !== undefined) {
        dataPoint[dataset.name] = dataset.data[index];
      }
    });
    
    return dataPoint;
  });
  
  console.log('✅ BarChart transformado:', result);
  return result;
};

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

const transformPieChartData = (pieChartData) => {
  console.log('🔄 Transformando PieChart:', pieChartData);
  
  if (!pieChartData || !pieChartData.labels || !pieChartData.data) {
    console.log('❌ PieChart: Datos inválidos');
    return [];
  }
  
  const { labels, data } = pieChartData;
  
  const result = labels.map((label, index) => ({
    label: label,
    value: data[index] || 0,
    percentage: data[index] || 0
  }));
  
  console.log('✅ PieChart transformado:', result);
  return result;
};

// Ejecutar transformaciones
console.log('\n📊 === TESTING TRANSFORMACIONES ===');

console.log('\n1️⃣ BarChart Transformation:');
const barResult = transformBarChartData(apiData.visualization.charts.barChart, 'month');

console.log('\n2️⃣ LineChart Transformation:');
const lineResult = transformLineChartData(apiData.visualization.charts.lineChart);

console.log('\n3️⃣ PieChart Transformation:');
const pieResult = transformPieChartData(apiData.visualization.charts.pieChart);

console.log('\n📋 === RESUMEN DE RESULTADOS ===');
console.log('BarChart items:', barResult.length);
console.log('LineChart items:', lineResult.length);
console.log('PieChart items:', pieResult.length);

console.log('\n✅ Datos están listos para los componentes de gráficos!');
