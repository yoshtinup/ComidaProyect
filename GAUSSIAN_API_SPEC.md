# 🔔 API para Campana Gaussiana - Especificaciones Backend

## 📊 Endpoints Recomendados

### 1. **Análisis de Tiempos de Entrega**
```
GET /api/v1/analytics/delivery-time-distribution
```

**Parámetros de entrada:**
```javascript
{
  "period": "week|month|year|all",           // Período de análisis
  "target_time": 15,                         // Tiempo objetivo en minutos
  "confidence_level": 95,                    // Nivel de confianza (68, 95, 99)
  "data_points": 50                          // Número de puntos para la curva
}
```

**Respuesta esperada:**
```javascript
{
  "status": "success",
  "data": {
    "mean": 14.5,                           // Media en minutos
    "std_deviation": 3.2,                   // Desviación estándar
    "sample_size": 450,                     // Número de entregas analizadas
    "probability_within_target": 0.68,      // Probabilidad de cumplir objetivo
    "data_points": [                        // Puntos para graficar la curva
      { "x": 8.0, "probability": 0.02 },
      { "x": 10.0, "probability": 0.08 },
      { "x": 12.0, "probability": 0.18 },
      { "x": 14.0, "probability": 0.35 },
      { "x": 16.0, "probability": 0.25 },
      { "x": 18.0, "probability": 0.10 },
      { "x": 20.0, "probability": 0.02 }
    ],
    "confidence_intervals": {               // Intervalos de confianza
      "68_percent": [11.3, 17.7],
      "95_percent": [8.1, 20.9]
    },
    "insights": {
      "efficiency_score": "Good",           // Excelente/Bueno/Necesita Mejora
      "recommendation": "El 68% de las entregas se completan dentro del objetivo"
    }
  },
  "metadata": {
    "generated_at": "2025-01-20T10:30:00Z",
    "period_analyzed": "2025-01-13 to 2025-01-20"
  }
}
```

### 2. **Distribución de Satisfacción del Cliente**
```
GET /api/v1/analytics/customer-satisfaction-distribution
```

**Parámetros:**
```javascript
{
  "period": "week|month|year",
  "target_rating": 4.5,                     // Rating objetivo (1-5)
  "min_reviews": 10                         // Mínimo de reseñas para incluir
}
```

### 3. **Predicción de Ventas Diarias**
```
GET /api/v1/analytics/daily-sales-distribution
```

**Parámetros:**
```javascript
{
  "period": "month|quarter|year",
  "target_sales": 1000,                     // Ventas objetivo en unidades monetarias
  "currency": "USD|MXN"
}
```

### 4. **Distribución de Precios de Productos**
```
GET /api/v1/analytics/product-price-distribution
```

**Parámetros:**
```javascript
{
  "category": "all|bebidas|comida|postres",
  "target_price": 25.00,                    // Precio objetivo
  "include_outliers": false                 // Incluir valores extremos
}
```

## 🛠️ Implementación Backend Mínima

### SQL Query Example (para tiempos de entrega)
```sql
-- Obtener tiempos de entrega para análisis
SELECT 
  TIMESTAMPDIFF(MINUTE, order_time, delivery_time) as delivery_minutes
FROM orders 
WHERE 
  delivery_time IS NOT NULL 
  AND order_time >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
  AND status = 'delivered'
ORDER BY delivery_minutes;
```

### Cálculo de Distribución Gaussiana (Pseudocódigo)
```javascript
function calculateGaussianDistribution(data, targetValue, dataPoints = 50) {
  // 1. Calcular estadísticas básicas
  const mean = calculateMean(data);
  const stdDev = calculateStandardDeviation(data, mean);
  
  // 2. Generar puntos para la curva
  const minX = mean - 3 * stdDev;
  const maxX = mean + 3 * stdDev;
  const step = (maxX - minX) / dataPoints;
  
  const points = [];
  for (let x = minX; x <= maxX; x += step) {
    const probability = gaussianPDF(x, mean, stdDev);
    points.push({ x: round(x, 2), probability: round(probability, 6) });
  }
  
  // 3. Calcular probabilidad de cumplir objetivo
  const probabilityWithinTarget = gaussianCDF(targetValue, mean, stdDev);
  
  // 4. Calcular intervalos de confianza
  const confidence68 = [mean - stdDev, mean + stdDev];
  const confidence95 = [mean - 2*stdDev, mean + 2*stdDev];
  
  return {
    mean,
    std_deviation: stdDev,
    sample_size: data.length,
    data_points: points,
    probability_within_target: probabilityWithinTarget,
    confidence_intervals: {
      "68_percent": confidence68,
      "95_percent": confidence95
    }
  };
}

// Función de densidad de probabilidad gaussiana
function gaussianPDF(x, mean, stdDev) {
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
  return coefficient * Math.exp(exponent);
}

// Función de distribución acumulativa (aproximación)
function gaussianCDF(x, mean, stdDev) {
  const z = (x - mean) / stdDev;
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}
```

## 📱 Uso en el Frontend

```javascript
// En tu servicio reportsService.js
const reportsService = {
  // ... otros métodos existentes ...
  
  /**
   * Obtiene distribución gaussiana de tiempos de entrega
   */
  getDeliveryTimeDistribution: async function(options = {}) {
    const { period = 'week', target_time = 15, confidence_level = 95 } = options;
    
    try {
      const url = `${API_BASE_URL}/api/v1/analytics/delivery-time-distribution`;
      const params = new URLSearchParams({
        period,
        target_time,
        confidence_level,
        data_points: 50
      });
      
      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data;
      
    } catch (error) {
      console.error('Error obteniendo distribución gaussiana:', error);
      throw error;
    }
  }
};
```

## 🎯 Casos de Uso Prioritarios

1. **Tiempos de Entrega** - Más útil para operaciones
2. **Satisfacción del Cliente** - Importante para calidad
3. **Ventas Diarias** - Útil para predicciones
4. **Precios de Productos** - Análisis de competitividad

¿Con cuál quieres empezar?
