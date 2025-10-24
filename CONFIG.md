# Configuración de Variables de Entorno

## Archivos creados para centralizar las IPs y URLs:

### 1. `.env` - Variables de entorno
Contiene las configuraciones de URL para diferentes entornos.

### 2. `src/config/apiConfig.js` - Configuración centralizada
- Importa las variables de entorno
- Define todos los endpoints de la API
- Proporciona valores por defecto

### 3. `src/hooks/useApiConfig.js` - Hook personalizado
Hook para usar la configuración en componentes React.

## Uso en componentes:

```javascript
// Opción 1: Importar directamente
import config from '../config/apiConfig';
const url = config.endpoints.productImage('imagen.jpg');

// Opción 2: Usar el hook
import { useApiConfig } from '../hooks/useApiConfig';
const { endpoints, isLocal } = useApiConfig();
```

## Cómo cambiar entre entornos:

### Para desarrollo local:
```env
VITE_API_BASE_URL=http://localhost:3002
VITE_API_CARRITO_URL=http://127.0.0.1:3002
VITE_IMAGE_SERVER_URL=http://localhost:3000
```

### Para servidor externo:
```env
VITE_API_BASE_URL=http://35.169.179.247:3002
VITE_API_CARRITO_URL=http://35.169.179.247:3002
VITE_IMAGE_SERVER_URL=http://35.169.179.247:3001
```

## Archivos actualizados:

- ✅ `Body.jsx` - Usa config para URLs de productos e imágenes
- ✅ `analyticsService.js` - Usa config para endpoints de analytics
- 🔄 `Login.jsx` - Pendiente de actualizar
- 🔄 `Registro.jsx` - Pendiente de actualizar
- 🔄 Otros archivos con IPs hardcodeadas

## Reiniciar el servidor después de cambiar .env:
```bash
npm run dev
```
