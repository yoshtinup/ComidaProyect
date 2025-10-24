# Implementación Backend - Distribución Gaussiana

## 📊 Endpoint para Análisis de Tiempos de Entrega

### Node.js Example
```javascript
// routes/analytics.js
const express = require('express');
const router = express.Router();

// Función para calcular distribución normal
function calculateGaussianDistribution(data, targetValue) {
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);
  
  // Generar puntos para la curva
  const points = [];
  const min = mean - 3 * stdDev;
  const max = mean + 3 * stdDev;
  
  for (let x = min; x <= max; x += (max - min) / 50) {
    const probability = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
                       Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    points.push({ x: Math.round(x * 10) / 10, probability });
  }
  
  // Calcular probabilidad de cumplir objetivo
  const zScore = (targetValue - mean) / stdDev;
  const probabilityWithinTarget = 0.5 + 0.5 * erf(zScore / Math.sqrt(2));
  
  return {
    mean,
    std_deviation: stdDev,
    data_points: points,
    probability_within_target: probabilityWithinTarget
  };
}

// Endpoint principal
router.get('/delivery-time-distribution', async (req, res) => {
  try {
    const { period = 'week', target_time = 15 } = req.query;
    
    // Obtener datos de entregas de la BD
    const deliveryTimes = await getDeliveryTimes(period);
    
    const distribution = calculateGaussianDistribution(deliveryTimes, target_time);
    
    res.json({
      distribution,
      insights: {
        total_deliveries: deliveryTimes.length,
        efficiency_score: distribution.probability_within_target > 0.8 ? 'Excellent' : 
                         distribution.probability_within_target > 0.6 ? 'Good' : 'Needs Improvement'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getDeliveryTimes(period) {
  // Tu lógica para obtener tiempos de entrega de la base de datos
  // Ejemplo de datos (en minutos):
  return [12, 14, 15, 13, 16, 18, 11, 14, 15, 17, 13, 14, 16, 12, 15];
}

module.exports = router;
```

### Python/FastAPI Example
```python
import numpy as np
from scipy import stats
from fastapi import APIRouter

router = APIRouter()

@router.get("/delivery-time-distribution")
async def get_delivery_distribution(period: str = "week", target_time: int = 15):
    # Obtener datos de la BD
    delivery_times = await get_delivery_times_from_db(period)
    
    mean = np.mean(delivery_times)
    std_dev = np.std(delivery_times)
    
    # Generar puntos para la curva gaussiana
    x = np.linspace(mean - 3*std_dev, mean + 3*std_dev, 50)
    y = stats.norm.pdf(x, mean, std_dev)
    
    data_points = [{"x": round(float(x[i]), 1), "probability": float(y[i])} 
                   for i in range(len(x))]
    
    # Probabilidad de cumplir objetivo
    prob_within_target = stats.norm.cdf(target_time, mean, std_dev)
    
    return {
        "distribution": {
            "mean": round(mean, 2),
            "std_deviation": round(std_dev, 2),
            "data_points": data_points,
            "probability_within_target": round(prob_within_target, 3)
        },
        "insights": {
            "efficiency_score": "Excellent" if prob_within_target > 0.8 else "Good" if prob_within_target > 0.6 else "Needs Improvement"
        }
    }
```

## 📈 Componente Frontend

```jsx
// GaussianChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const GaussianChart = ({ data, targetValue, title }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.data_points}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="x" 
            tick={{ fill: '#374151', fontSize: 12 }}
            label={{ value: 'Tiempo (minutos)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            tick={{ fill: '#374151', fontSize: 12 }}
            label={{ value: 'Probabilidad', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name) => [`${(value * 100).toFixed(2)}%`, 'Probabilidad']}
            labelFormatter={(label) => `${label} minutos`}
          />
          <Line 
            type="monotone" 
            dataKey="probability" 
            stroke="#111827" 
            strokeWidth={3}
            dot={false}
            fill="url(#gaussianGradient)"
          />
          {targetValue && (
            <ReferenceLine 
              x={targetValue} 
              stroke="#dc2626" 
              strokeDasharray="5 5"
              label={`Objetivo: ${targetValue}min`}
            />
          )}
          <defs>
            <linearGradient id="gaussianGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#111827" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#111827" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600">Media</p>
          <p className="text-lg font-bold">{data.mean}min</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Desviación</p>
          <p className="text-lg font-bold">±{data.std_deviation.toFixed(1)}min</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Cumplimiento</p>
          <p className="text-lg font-bold">{(data.probability_within_target * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};
```
