# 📊 Dashboard de Analytics - ApiCinema

Dashboard completo de analytics para el sistema de dispensadores inteligentes ApiCinema, creado con React, Recharts y Tailwind CSS.

## 🚀 Características Principales

### 📈 **KPI Cards**
- **Total de Órdenes**: Número total de órdenes procesadas
- **Ingresos Totales**: Revenue total del período
- **Ticket Promedio**: Valor promedio por orden (AOV)
- **Tasa de Conversión**: Porcentaje de conversión
- **Satisfacción**: Score de satisfacción del cliente
- **Usuarios Activos**: Usuarios únicos en el período

### 📊 **Gráficos Disponibles**
- **Gráfico de Barras**: Ingresos por período
- **Gráfico de Líneas**: Evolución de órdenes y tickets promedio
- **Gráfico Circular**: Distribución por productos
- **Gráfico de Área**: Tendencias de ingresos
- **Histograma**: Distribución de frecuencias con acumulado

### 🎯 **Funcionalidades**
- ✅ **Responsive Design**: Adaptable a móviles, tablets y desktop
- ✅ **Filtros por Período**: Hoy, Semana, Mes, Trimestre, Año
- ✅ **Auto-refresh**: Actualización automática de datos
- ✅ **Loading States**: Estados de carga elegantes
- ✅ **Error Handling**: Manejo robusto de errores
- ✅ **Insights Panel**: Oportunidades, riesgos y recomendaciones
- ✅ **Top Products Table**: Ranking de productos más vendidos

## 🛠️ Instalación y Uso

### **Dependencias Instaladas**
```bash
npm install recharts date-fns clsx
```

### **Navegación al Dashboard**
```bash
# Ir a la URL del dashboard
http://localhost:5173/dashboard
```

### **Estructura de Archivos Creada**
```
src/
├── hooks/
│   └── useDashboardData.js           # Hook personalizado para datos
├── componets/
│   ├── Dashboard/
│   │   ├── AnalyticsDashboard.jsx    # Componente principal
│   │   ├── KPICard.jsx               # Tarjetas de métricas
│   │   ├── InsightsPanel.jsx         # Panel de insights
│   │   ├── TopProductsTable.jsx      # Tabla de productos top
│   │   ├── FiltersBar.jsx            # Barra de filtros
│   │   └── LoadingSpinner.jsx        # Estados de carga
│   └── Charts/
│       ├── CustomBarChart.jsx        # Gráfico de barras
│       ├── CustomLineChart.jsx       # Gráfico de líneas
│       ├── CustomPieChart.jsx        # Gráfico circular
│       ├── CustomAreaChart.jsx       # Gráfico de área
│       └── CustomHistogram.jsx       # Histograma
├── pages/
│   └── Dashboard.jsx                 # Página del dashboard
└── services/
    └── analyticsService.js           # Servicio API (ya existía)
```

## 🎨 Diseño y Estilo

### **Paleta de Colores**
- **Primario**: Escala de grises (#1f2937 a #f9fafb)
- **Acentos**: Verde para positivo, Rojo para negativo, Amarillo para advertencias
- **Fuente**: Plus Jakarta Sans (consistente con tu diseño)

### **Responsive Breakpoints**
- **Mobile**: < 640px (1 columna)
- **Tablet**: 640px - 1024px (2 columnas)
- **Desktop**: > 1024px (3-6 columnas según componente)

## 📡 Integración con API

### **Endpoints Utilizados**
```javascript
// Dashboard principal
GET /api/v1/analytics/dashboard?period=${period}

// Productos top
GET /api/v1/analytics/top-products?period=${period}&limit=${limit}
```

### **Estructura de Datos Esperada**
```javascript
{
  success: true,
  data: {
    salesSummary: {
      totalRevenue: 3936.25,
      totalSales: 67,
      averageOrderValue: 58.75,
      growthPercentage: 15.2
    },
    topProducts: [
      {
        productId: 1,
        productName: "Coca Cola",
        salesCount: 63,
        totalRevenue: 1260,
        salesPercentage: 32
      }
      // ...más productos
    ],
    salesChart: [
      {
        date: "2025-01-01",
        revenue: 720,
        orders: 12
      }
      // ...más datos temporales
    ]
  }
}
```

## 🔧 Configuración

### **Personalizar Períodos**
```javascript
// En FiltersBar.jsx
const periods = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  // Agregar más períodos según necesidad
];
```

### **Personalizar Colores de Gráficos**
```javascript
// En cada componente de gráfico
const COLORS = [
  '#1f2937', // Gray-800
  '#374151', // Gray-700
  '#4b5563', // Gray-600
  // Modificar según preferencias
];
```

## 📱 Características Responsive

### **Grid Layout Adaptativo**
- **KPI Cards**: 1 → 2 → 3 → 6 columnas
- **Charts**: 1 → 2 columnas
- **Tables**: Scroll horizontal en móviles

### **Componentes Móviles**
- Barra de filtros colapsable
- Gráficos redimensionables automáticamente
- Tooltips adaptados a touch

## 🚦 Estados y Manejo de Errores

### **Estados de Loading**
- Skeleton placeholders para carga inicial
- Spinner para actualizaciones
- Indicadores de progreso en tiempo real

### **Manejo de Errores**
- Fallback a datos de ejemplo
- Mensajes de error user-friendly
- Botón de reintento automático

## 🎯 Datos de Prueba

Con tus 67 órdenes distribuidas desde Enero 2025, el dashboard mostrará:

### **KPIs Calculados**
- **Total Órdenes**: 67
- **Ingresos**: $3,936.25
- **AOV**: $58.75
- **Crecimiento**: Calculado automáticamente

### **Gráficos Poblados**
- Distribución mensual de ingresos
- Evolución de órdenes por período
- Ranking de productos por ventas
- Tendencias y patrones temporales

## 🔄 Auto-refresh

```javascript
// Configurado para actualizar cada 5 minutos
useEffect(() => {
  const interval = setInterval(fetchDashboardData, 300000);
  return () => clearInterval(interval);
}, []);
```

## 📋 Próximas Mejoras Sugeridas

1. **Exportar a PDF**: Generar reportes descargables
2. **Filtros Avanzados**: Rango de fechas, categorías específicas
3. **Comparación de Períodos**: Análisis período vs período anterior
4. **Predicciones**: Machine learning para forecasting
5. **Alertas Push**: Notificaciones en tiempo real
6. **Dark Mode**: Modo oscuro toggle

## 🎉 ¡Listo para Usar!

Tu dashboard de analytics está completamente funcional y listo para consumir los datos reales de tu API. Simplemente navega a `/dashboard` para empezar a visualizar tus métricas de negocio.

### **Comandos Útiles**
```bash
# Ejecutar en desarrollo
npm run dev

# Acceder al dashboard
http://localhost:5173/dashboard

# Verificar que recharts esté instalado
npm list recharts
```

¡Disfruta analizando los datos de tu sistema ApiCinema! 🚀
