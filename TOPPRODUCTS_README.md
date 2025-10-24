# TopProductsTable - Integración con API de Reportes

## 📊 Resumen de Implementación

Hemos actualizado el componente `TopProductsTable` para que funcione tanto con datos estáticos como con la API de reportes que implementamos anteriormente.

## 🔧 Componentes Creados/Actualizados

### 1. `TopProductsTable.jsx` (Actualizado)
- **Ubicación:** `src/componets/Dashboard/TopProductsTable.jsx`
- **Funcionalidad:** Componente principal que puede trabajar con datos estáticos o API
- **Nuevas Props:**
  - `useAPI={true/false}` - Para activar el modo API
  - `period={'today'|'week'|'month'|'year'}` - Período de tiempo
  - `limit={number}` - Número máximo de productos
  - `loading={boolean}` - Estado de carga externo

### 2. `TopProductsTableAPI.jsx` (Nuevo)
- **Ubicación:** `src/componets/Dashboard/TopProductsTableAPI.jsx`
- **Funcionalidad:** Wrapper que incluye filtros de período y usa la API
- **Características:** Filtros interactivos con `EtiquetasFiltroInteractive`

### 3. `TopProductsDemo.jsx` (Nuevo)
- **Ubicación:** `src/componets/Dashboard/TopProductsDemo.jsx`
- **Funcionalidad:** Página de demostración que muestra ambas versiones
- **Uso:** Para comparar datos estáticos vs API en tiempo real

### 4. `TopProductsPage.jsx` (Nuevo)
- **Ubicación:** `src/pages/TopProductsPage.jsx`
- **Funcionalidad:** Página completa con header y demostración
- **Ruta:** `/top-products`

## 🎯 Cómo Usar

### Versión con Datos Estáticos
```jsx
import TopProductsTable from './components/Dashboard/TopProductsTable';

const products = [
  {
    id: 1,
    name: 'Pizza Margherita',
    sales: 120,
    revenue: 24000,
    percentage: 35.5
  }
  // ... más productos
];

<TopProductsTable 
  products={products} 
  title="Top Productos - Datos Estáticos" 
/>
```

### Versión con API
```jsx
import TopProductsTable from './components/Dashboard/TopProductsTable';

<TopProductsTable 
  useAPI={true}
  period="month"
  limit={10}
  title="Top Productos - API Tiempo Real" 
/>
```

### Versión Completa con Filtros
```jsx
import TopProductsTableAPI from './components/Dashboard/TopProductsTableAPI';

<TopProductsTableAPI title="Productos Más Vendidos" />
```

## 🔄 Integración con API de Reportes

El componente se integra perfectamente con:
- **Endpoint:** `/reports/best-selling-products`
- **Servicio:** `reportsService.getBestSellingProducts()`
- **Manejo de errores:** Fallback a datos vacíos sin romper el UI
- **Transformación de datos:** Convierte automáticamente la estructura de API

## 📱 Características

✅ **Responsive Design:** Se adapta a diferentes tamaños de pantalla
✅ **Estados de Carga:** Skeleton loading mientras carga datos
✅ **Manejo de Errores:** Muestra mensaje apropiado sin romper el UI
✅ **Filtros de Período:** Hoy, Semana, Mes, Año
✅ **Iconos de Posición:** 🥇🥈🥉 para los primeros 3 lugares
✅ **Formato de Moneda:** Formato mexicano (MXN)
✅ **Barras de Progreso:** Visualización de porcentajes
✅ **Datos Vacíos:** Manejo elegante cuando no hay datos

## 🧪 Testing

Para probar la implementación:
1. Navega a `/top-products`
2. Observa la comparación entre datos estáticos y API
3. Prueba los diferentes filtros de período
4. Verifica el manejo de errores

## 🔗 Dependencias

- `reportsService` - Para obtener datos de la API
- `EtiquetasFiltroInteractive` - Para filtros de período
- `PropTypes` - Para validación de props
- API de reportes funcionando

## 🎨 Estilos

Utiliza las mismas clases de Tailwind CSS que el resto del proyecto:
- Font: `Plus Jakarta Sans`
- Colores: Paleta de grises del sistema
- Animaciones: Transiciones suaves
- Hover effects: Estados interactivos

## 🚀 Próximos Pasos

1. Integrar en el panel de administración principal
2. Agregar más filtros (categorías, vendedores, etc.)
3. Exportar datos a CSV/Excel
4. Gráficos adicionales (charts de barras, pie charts)
5. Comparación entre períodos
