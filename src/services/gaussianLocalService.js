// Servicio para cálculos gaussianos locales a partir de datos reales de la API
// Recibe un array de valores y calcula media, desviación estándar, pdf, probabilidad de superar un target, etc.

function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stddev(arr, mu) {
  if (!arr.length) return 0;
  const m = mu !== undefined ? mu : mean(arr);
  return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length);
}

// PDF de la normal
function normalPdf(x, mu, sigma) {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
}

// CDF de la normal (aprox)
function normalCdf(x, mu, sigma) {
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
}

// Error function (aprox)
function erf(x) {
  // Abramowitz and Stegun formula 7.1.26
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

// Genera datos para graficar la campana (array de {x, y})
function generateGaussianCurve(mu, sigma, min, max, steps = 50) {
  const data = [];
  // Si todos los valores son iguales o sigma es 0, graficar un solo pico en la media
  if (sigma === 0 || min === max) {
    data.push({ x: mu, y: 1 });
    return data;
  }
  const step = (max - min) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = min + i * step;
    data.push({ x, y: normalPdf(x, mu, sigma) });
  }
  return data;
}

// Reconstruye un array de valores individuales a partir de histogramas (data_points)
function reconstructValuesFromHistogram(dataPoints) {
  if (!Array.isArray(dataPoints)) return [];
  let arr = [];
  for (const d of dataPoints) {
    // x: valor, y: frecuencia
    const value = d.x ?? d.value ?? d.valor ?? d.amount ?? d[Object.keys(d)[0]];
    const freq = d.y ?? d.freq ?? d.frequency ?? d.count ?? d[Object.keys(d)[1]] ?? 1;
    if (typeof value === 'number' && !isNaN(value) && typeof freq === 'number' && freq > 0) {
      for (let i = 0; i < freq; i++) arr.push(value);
    }
  }
  return arr;
}

// Calcula todo lo necesario para la campana y probabilidad
// Permite pasar un array de valores individuales o un histograma (data_points)
export function calculateGaussianStats(valuesOrHistogram, target) {
  let values = [];
  if (Array.isArray(valuesOrHistogram) && valuesOrHistogram.length > 0) {
    if (typeof valuesOrHistogram[0] === 'object' && ('x' in valuesOrHistogram[0] || 'y' in valuesOrHistogram[0])) {
      // Es histograma
      values = reconstructValuesFromHistogram(valuesOrHistogram);
    } else {
      // Es array de valores crudos
      values = valuesOrHistogram.filter(v => typeof v === 'number' && !isNaN(v));
    }
  }
  // Si no hay datos, devolver valores por defecto
  if (values.length === 0) {
    return {
      mean: 0,
      stddev: 0,
      min: 0,
      max: 0,
      data_points: [{ x: 0, y: 1 }],
      probabilityAboveTarget: 0,
      probabilityBelowTarget: 1,
      target: target ?? 0
    };
  }
  // Si hay un solo dato, la curva es un pico en ese valor
  if (values.length === 1) {
    const v = values[0];
    return {
      mean: v,
      stddev: 0,
      min: v,
      max: v,
      data_points: [{ x: v, y: 1 }],
      probabilityAboveTarget: v < target ? 0 : 1,
      probabilityBelowTarget: v < target ? 1 : 0,
      target: target ?? v
    };
  }
  const mu = mean(values);
  const sigma = stddev(values, mu);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const data_points = generateGaussianCurve(mu, sigma, min, max);
  const prob = 1 - normalCdf(target, mu, sigma); // Probabilidad de superar el target
  return {
    mean: mu,
    stddev: sigma,
    min,
    max,
    data_points,
    probabilityAboveTarget: prob,
    probabilityBelowTarget: 1 - prob,
    target
  };
}
