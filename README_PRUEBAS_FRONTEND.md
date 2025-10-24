# 🧪 Evidencia de Pruebas Frontend - ApiCinema

## 1. 🎯 Objetivos de las Pruebas

- Validar la funcionalidad y estabilidad de los principales flujos del frontend.
- Garantizar que la integración con la API y los endpoints protegidos funciona correctamente.
- Verificar la experiencia de usuario en login, dashboard, gestión de órdenes, registro y visualización de estadísticas.
- Detectar y documentar errores, inconsistencias o problemas de UI/UX.

---

## 2. 🗂️ Componentes y Páginas Probadas

- **Login** (`src/pages/Login.jsx`)
- **Registro de Clientes** (`src/pages/Registro.jsx`)
- **Dashboard de Analytics** (`src/pages/Dashboard.jsx`)
- **Gestión de Órdenes NFC** (`src/pages/OrderManagement.jsx`)
- **Panel de Administración** (`src/pages/PanelAdmin.jsx`)
- **Visualización de Estadísticas** (`src/componets/Dashboard/AnalyticsDashboard.jsx`)
- **Top Productos** (`src/pages/TopProductsPage.jsx`)
- **Pago y MercadoPago** (`src/pages/Pago.jsx`, `/payment-success`, `/payment-failure`, `/payment-pending`)
- **Registro de Productos** (`src/pages/RegistroProducto.jsx`)
- **Carrito de Compras** (`src/pages/Carrito.jsx`)

---

## 3. 🧩 Ejemplos de Código de Scripts de Prueba

### 3.1. Pruebas Unitarias (Jest + React Testing Library)

```javascript
// src/__tests__/Login.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';

test('renderiza el formulario de login y valida campos', () => {
  render(<Login />);
  expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123456' } });
  fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
  // Aquí se puede mockear la respuesta y validar el flujo
});
```

### 3.2. Pruebas de Integración

```javascript
// src/__tests__/Dashboard.test.jsx
import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';

test('muestra KPIs y gráficos principales', async () => {
  render(<Dashboard />);
  expect(await screen.findByText(/total de órdenes/i)).toBeInTheDocument();
  expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
});
```

### 3.3. Pruebas End-to-End (Cypress)

```javascript
// cypress/e2e/login.cy.js
describe('Flujo de Login', () => {
  it('permite iniciar sesión y redirige al dashboard', () => {
    cy.visit('/login');
    cy.get('input[name="usuario"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Bienvenido').should('be.visible');
  });
});
```

---

## 4. 📝 Ejemplos de Pruebas Manuales Realizadas

- **Login:** Se probó el acceso con credenciales válidas e inválidas, validando mensajes de error y redirección correcta.
- **Registro:** Se verificó el registro de nuevos usuarios y la validación de campos obligatorios.
- **Dashboard:** Se probaron los filtros de período, la actualización automática de datos y la visualización de KPIs y gráficos.
- **Gestión de Órdenes:** Se probó la carga de órdenes por NFC, selección manual y dispensado automático.
- **Panel Admin:** Se validó el cambio de períodos, la visualización de ventas y productos top, y el manejo de errores.
- **Pago:** Se probó el flujo completo de MercadoPago, incluyendo los estados success, failure y pending.
- **Carrito:** Se verificó la adición, edición y eliminación de productos en el carrito.
- **Visualización de Estadísticas:** Se probó la correcta carga de datos y el manejo de estados vacíos o de error.

---

## 5. ✅ Resultados Esperados y Verificación

- Todos los flujos principales funcionan sin errores visibles.
- Los datos de la API se muestran correctamente en los componentes.
- Los endpoints protegidos incluyen el token Bearer y responden correctamente.
- Los mensajes de error y loading states aparecen cuando corresponde.
- El diseño es responsive y se adapta a diferentes dispositivos.
- Los gráficos y KPIs muestran datos reales o simulados según el estado de la API.
- El usuario puede navegar entre páginas y realizar acciones sin bloqueos.

---

## 6. 📄 Recomendaciones para Convertir a PDF

- Usa un editor Markdown compatible (VS Code, Typora, Obsidian).
- Exporta el archivo README.md a PDF usando la opción de "Exportar" o "Imprimir como PDF".
- Alternativamente, usa herramientas online como https://markdowntopdf.com/ o extensiones de VS Code.
- Si necesitas formato más formal, puedes copiar el contenido a Word y exportar como PDF.

---

## 7. 📚 Referencias de Archivos de Prueba

- `src/__tests__/Login.test.jsx` - Pruebas unitarias de login
- `src/__tests__/Dashboard.test.jsx` - Pruebas de integración de dashboard
- `cypress/e2e/login.cy.js` - Pruebas end-to-end de login
- `src/__tests__/OrderManagement.test.jsx` - Pruebas de gestión de órdenes
- `src/__tests__/PanelAdmin.test.jsx` - Pruebas de panel admin

---

**Este documento puede ser entregado como evidencia de la fase de pruebas del frontend de ApiCinema.**
