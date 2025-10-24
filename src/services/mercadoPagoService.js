import { loadMercadoPago } from '@mercadopago/sdk-js';

/**
 * Servicio para MercadoPago SDK V2
 * Maneja la integración segura con MercadoPago
 */
class MercadoPagoService {
  constructor() {
    this.mp = null;
    this.isInitialized = false;
    this.publicKey = null;
  }

  /**
   * Inicializa el SDK de MercadoPago
   * @param {string} publicKey - Clave pública de MercadoPago
   */
  async initialize(publicKey) {
    try {
      if (this.isInitialized && this.publicKey === publicKey) {
        console.log('✅ MercadoPago SDK ya inicializado');
        return this.mp;
      }

      console.log('🔄 Inicializando MercadoPago SDK...');
      
      // Cargar el SDK
      await loadMercadoPago();
      
      // Inicializar con la clave pública
      this.mp = new window.MercadoPago(publicKey, {
        locale: 'es-MX' // Configurar idioma español México
      });
      
      this.publicKey = publicKey;
      this.isInitialized = true;
      
      console.log('✅ MercadoPago SDK inicializado correctamente');
      return this.mp;
      
    } catch (error) {
      console.error('❌ Error al inicializar MercadoPago SDK:', error);
      throw new Error('No se pudo inicializar MercadoPago SDK');
    }
  }

  /**
   * Crea un checkout usando Checkout Pro
   * @param {Object} preferenceData - Datos de la preferencia de pago
   */
  async createCheckout(preferenceData) {
    try {
      if (!this.isInitialized) {
        throw new Error('MercadoPago SDK no está inicializado');
      }

      console.log('🔄 Creando checkout con datos:', preferenceData);

      // Crear checkout
      const checkout = this.mp.checkout({
        preference: {
          id: preferenceData.preferenceId
        },
        autoOpen: true, // Abrir automáticamente el modal
        theme: {
          elementsColor: '#4f46e5', // Color personalizado
          headerColor: '#4f46e5'
        }
      });

      console.log('✅ Checkout creado exitosamente');
      return checkout;

    } catch (error) {
      console.error('❌ Error al crear checkout:', error);
      throw error;
    }
  }

  /**
   * Crea un checkout personalizado usando Checkout Bricks
   * @param {string} containerId - ID del contenedor donde se montará el checkout
   * @param {Object} preferenceData - Datos de la preferencia
   */
  async createBricks(containerId, preferenceData) {
    try {
      if (!this.isInitialized) {
        throw new Error('MercadoPago SDK no está inicializado');
      }

      console.log('🔄 Creando Checkout Bricks...');

      const bricks = this.mp.bricks();
      
      const renderCheckout = await bricks.create('wallet', containerId, {
        initialization: {
          preferenceId: preferenceData.preferenceId,
        },
        customization: {
          texts: {
            valueProp: 'smart_option',
          },
        },
        callbacks: {
          onReady: () => {
            console.log('✅ Checkout Bricks listo');
          },
          onSubmit: ({ selectedPaymentMethod, formData }) => {
            console.log('🔄 Procesando pago:', { selectedPaymentMethod, formData });
            return new Promise((resolve, reject) => {
              // Aquí puedes procesar el pago
              // Por ahora, solo resolvemos la promesa
              resolve();
            });
          },
          onError: (error) => {
            console.error('❌ Error en Checkout Bricks:', error);
          },
        },
      });

      return renderCheckout;

    } catch (error) {
      console.error('❌ Error al crear Checkout Bricks:', error);
      throw error;
    }
  }

  /**
   * Redirige a Checkout Pro usando window.open (método más seguro)
   * @param {string} initPoint - URL del init_point de MercadoPago
   */
  redirectToCheckout(initPoint) {
    try {
      console.log('🔄 Redirigiendo a MercadoPago Checkout:', initPoint);
      
      // Abrir en nueva ventana/pestaña
      const checkoutWindow = window.open(
        initPoint,
        'MercadoPagoCheckout',
        'width=800,height=600,scrollbars=yes,resizable=yes'
      );

      // Verificar si se abrió correctamente
      if (!checkoutWindow) {
        console.warn('⚠️ No se pudo abrir ventana, usando location.href');
        window.location.href = initPoint;
      } else {
        console.log('✅ Ventana de checkout abierta');
        
        // Opcional: Detectar cuando se cierra la ventana
        const checkClosed = setInterval(() => {
          if (checkoutWindow.closed) {
            clearInterval(checkClosed);
            console.log('🔄 Ventana de checkout cerrada');
            // Aquí podrías verificar el estado del pago
          }
        }, 1000);
      }

    } catch (error) {
      console.error('❌ Error al redirigir a checkout:', error);
      // Fallback a location.href
      window.location.href = initPoint;
    }
  }

  /**
   * Obtiene información del estado del SDK
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      publicKey: this.publicKey,
      sdkLoaded: !!window.MercadoPago
    };
  }

  /**
   * Reinicia el SDK (útil para cambiar de clave pública)
   */
  reset() {
    this.mp = null;
    this.isInitialized = false;
    this.publicKey = null;
    console.log('🔄 MercadoPago SDK reiniciado');
  }
}

// Exportar instancia singleton
export default new MercadoPagoService();
