/**
 * Error Tracker Avancé - Frontend
 * Système de tracking d'erreurs intelligent avec contexte riche
 */

class ErrorTracker {
  constructor() {
    this.isInitialized = false;
    this.config = {
      environment: import.meta.env.MODE || 'development',
      maxBreadcrumbs: 50,
      maxErrors: 100,
      enableConsoleCapture: true,
      enableNetworkCapture: true,
      enableUserInteractionCapture: true,
      apiEndpoint: '/api/monitoring/errors',
      batchSize: 10,
      flushInterval: 30000 // 30 secondes
    };
    this.breadcrumbs = [];
    this.errors = [];
    this.userContext = {};
    this.sessionContext = {};
    this.performanceData = {};
    this.errorQueue = [];
    this.flushTimer = null;
    
    this.init();
  }

  /**
   * Initialiser le tracker d'erreurs
   */
  init() {
    if (this.isInitialized) return;

    try {
      // Capturer les erreurs JavaScript non gérées
      this.setupGlobalErrorHandlers();
      
      // Capturer les rejections de Promise non gérées
      this.setupUnhandledRejectionHandler();
      
      // Capturer les erreurs de ressources (images, scripts, etc.)
      this.setupResourceErrorHandler();
      
      // Capturer les interactions utilisateur
      if (this.config.enableUserInteractionCapture) {
        this.setupUserInteractionCapture();
      }
      
      // Capturer les erreurs réseau
      if (this.config.enableNetworkCapture) {
        this.setupNetworkErrorCapture();
      }
      
      // Capturer les logs console
      if (this.config.enableConsoleCapture) {
        this.setupConsoleCapture();
      }
      
      // Démarrer le flush périodique
      this.startPeriodicFlush();
      
      // Récupérer le contexte initial
      this.updateSessionContext();
      
      this.isInitialized = true;
      this.addBreadcrumb('system', 'ErrorTracker initialized', { success: true });
      
      console.log('✅ ErrorTracker initialisé');
    } catch (error) {
      console.error('❌ Erreur initialisation ErrorTracker:', error);
    }
  }

  /**
   * Configurer les handlers d'erreurs globales
   */
  setupGlobalErrorHandlers() {
    window.addEventListener('error', (event) => {
      this.captureError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        severity: 'error'
      });
    });
  }

  /**
   * Configurer le handler de rejections non gérées
   */
  setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      
      this.captureError({
        type: 'unhandled_promise_rejection',
        message: error?.message || 'Unhandled Promise Rejection',
        stack: error?.stack,
        reason: error,
        timestamp: new Date().toISOString(),
        severity: 'error'
      });
    });
  }

  /**
   * Configurer la capture d'erreurs de ressources
   */
  setupResourceErrorHandler() {
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.captureError({
          type: 'resource',
          message: `Failed to load resource: ${event.target.src || event.target.href}`,
          element: {
            tagName: event.target.tagName,
            src: event.target.src,
            href: event.target.href,
            id: event.target.id,
            className: event.target.className
          },
          timestamp: new Date().toISOString(),
          severity: 'warning'
        });
      }
    }, true);
  }

  /**
   * Configurer la capture d'interactions utilisateur
   */
  setupUserInteractionCapture() {
    // Capture des clics
    document.addEventListener('click', (event) => {
      this.addBreadcrumb('user', 'click', {
        element: this.getElementInfo(event.target),
        coordinates: { x: event.clientX, y: event.clientY }
      });
    });

    // Capture de la navigation
    window.addEventListener('popstate', () => {
      this.addBreadcrumb('navigation', 'popstate', {
        url: window.location.href,
        pathname: window.location.pathname
      });
    });

    // Capture des erreurs de formulaire
    document.addEventListener('invalid', (event) => {
      this.addBreadcrumb('validation', 'form_invalid', {
        element: this.getElementInfo(event.target),
        validationMessage: event.target.validationMessage
      });
    }, true);
  }

  /**
   * Configurer la capture d'erreurs réseau
   */
  setupNetworkErrorCapture() {
    // Intercepter fetch
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0];
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        this.addBreadcrumb('network', 'fetch', {
          url,
          method: args[1]?.method || 'GET',
          status: response.status,
          statusText: response.statusText,
          duration: Math.round(duration),
          success: response.ok
        });

        // Capturer les erreurs HTTP
        if (!response.ok) {
          this.captureError({
            type: 'network',
            message: `HTTP Error ${response.status}: ${response.statusText}`,
            url,
            method: args[1]?.method || 'GET',
            status: response.status,
            statusText: response.statusText,
            duration,
            timestamp: new Date().toISOString(),
            severity: response.status >= 500 ? 'error' : 'warning'
          });
        }
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        
        this.captureError({
          type: 'network',
          message: `Network Error: ${error.message}`,
          url,
          method: args[1]?.method || 'GET',
          error: error.message,
          duration,
          timestamp: new Date().toISOString(),
          severity: 'error'
        });
        
        throw error;
      }
    };

    // Intercepter XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this._errorTracker = { method, url, startTime: performance.now() };
      return originalXHROpen.call(this, method, url, ...args);
    };

    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(...args) {
      this.addEventListener('load', () => {
        if (this._errorTracker) {
          const duration = performance.now() - this._errorTracker.startTime;
          window.errorTracker.addBreadcrumb('network', 'xhr', {
            url: this._errorTracker.url,
            method: this._errorTracker.method,
            status: this.status,
            statusText: this.statusText,
            duration: Math.round(duration),
            success: this.status >= 200 && this.status < 300
          });
        }
      });

      this.addEventListener('error', () => {
        if (this._errorTracker) {
          const duration = performance.now() - this._errorTracker.startTime;
          window.errorTracker.captureError({
            type: 'network',
            message: `XHR Error: ${this._errorTracker.method} ${this._errorTracker.url}`,
            url: this._errorTracker.url,
            method: this._errorTracker.method,
            status: this.status,
            statusText: this.statusText,
            duration,
            timestamp: new Date().toISOString(),
            severity: 'error'
          });
        }
      });

      return originalXHRSend.call(this, ...args);
    };
  }

  /**
   * Configurer la capture des logs console
   */
  setupConsoleCapture() {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.addBreadcrumb('console', 'error', {
        message: args.join(' '),
        arguments: args.map(arg => this.serializeArgument(arg))
      });
      return originalConsoleError.apply(console, args);
    };

    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      this.addBreadcrumb('console', 'warn', {
        message: args.join(' '),
        arguments: args.map(arg => this.serializeArgument(arg))
      });
      return originalConsoleWarn.apply(console, args);
    };
  }

  /**
   * Capturer une erreur avec contexte complet
   */
  captureError(errorData) {
    try {
      const error = {
        id: this.generateErrorId(),
        ...errorData,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: errorData.timestamp || new Date().toISOString(),
        session: this.sessionContext,
        user: this.userContext,
        breadcrumbs: [...this.breadcrumbs],
        performance: this.getPerformanceSnapshot(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio
        },
        localStorage: this.getLocalStorageSnapshot(),
        sessionStorage: this.getSessionStorageSnapshot()
      };

      // Ajouter à la queue locale
      this.errors.push(error);
      if (this.errors.length > this.config.maxErrors) {
        this.errors.shift();
      }

      // Ajouter à la queue d'envoi
      this.errorQueue.push(error);

      // Flush immédiat pour les erreurs critiques
      if (errorData.severity === 'critical' || errorData.severity === 'error') {
        this.flushErrors();
      }

      // Ajouter breadcrumb pour l'erreur
      this.addBreadcrumb('error', 'captured', {
        type: errorData.type,
        message: errorData.message,
        severity: errorData.severity
      });

      console.warn('🚨 Error captured:', error.id, errorData.message);
    } catch (captureError) {
      console.error('❌ Erreur lors de la capture d\'erreur:', captureError);
    }
  }

  /**
   * Ajouter un breadcrumb
   */
  addBreadcrumb(category, message, data = {}) {
    const breadcrumb = {
      timestamp: new Date().toISOString(),
      category,
      message,
      data,
      level: 'info'
    };

    this.breadcrumbs.push(breadcrumb);
    if (this.breadcrumbs.length > this.config.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }
  }

  /**
   * Définir le contexte utilisateur
   */
  setUserContext(user) {
    this.userContext = {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      ...user
    };
    
    this.addBreadcrumb('context', 'user_updated', { userId: user.id });
  }

  /**
   * Mettre à jour le contexte de session
   */
  updateSessionContext() {
    this.sessionContext = {
      sessionId: this.getSessionId(),
      startTime: this.getSessionStartTime(),
      pageLoadTime: performance.now(),
      referrer: document.referrer,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      connection: this.getConnectionInfo()
    };
  }

  /**
   * Obtenir un snapshot des performances
   */
  getPerformanceSnapshot() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      loadTime: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      memoryUsage: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null
    };
  }

  /**
   * Envoyer les erreurs au serveur
   */
  async flushErrors() {
    if (this.errorQueue.length === 0) return;

    const errorsToSend = this.errorQueue.splice(0, this.config.batchSize);
    
    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          errors: errorsToSend,
          metadata: {
            timestamp: new Date().toISOString(),
            environment: this.config.environment,
            version: __APP_VERSION__ || '1.0.0'
          }
        })
      });

      if (response.ok) {
        console.log(`✅ ${errorsToSend.length} erreurs envoyées au serveur`);
      } else {
        // Remettre les erreurs dans la queue en cas d'échec
        this.errorQueue.unshift(...errorsToSend);
        console.warn('⚠️ Échec envoi erreurs:', response.status);
      }
    } catch (error) {
      // Remettre les erreurs dans la queue en cas d'échec
      this.errorQueue.unshift(...errorsToSend);
      console.error('❌ Erreur envoi erreurs:', error);
    }
  }

  /**
   * Démarrer le flush périodique
   */
  startPeriodicFlush() {
    this.flushTimer = setInterval(() => {
      this.flushErrors();
    }, this.config.flushInterval);
  }

  /**
   * Arrêter le tracker
   */
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    // Flush final
    this.flushErrors();
    
    this.isInitialized = false;
  }

  /**
   * Helpers
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('errorTracker_sessionId');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('errorTracker_sessionId', sessionId);
    }
    return sessionId;
  }

  getSessionStartTime() {
    let startTime = sessionStorage.getItem('errorTracker_startTime');
    if (!startTime) {
      startTime = new Date().toISOString();
      sessionStorage.setItem('errorTracker_startTime', startTime);
    }
    return startTime;
  }

  getElementInfo(element) {
    return {
      tagName: element.tagName,
      id: element.id,
      className: element.className,
      textContent: element.textContent?.slice(0, 100),
      attributes: this.getElementAttributes(element)
    };
  }

  getElementAttributes(element) {
    const attrs = {};
    for (let attr of element.attributes) {
      attrs[attr.name] = attr.value;
    }
    return attrs;
  }

  getConnectionInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection ? {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    } : null;
  }

  getLocalStorageSnapshot() {
    try {
      const snapshot = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Ne pas inclure les tokens ou données sensibles
        if (!key.includes('token') && !key.includes('password')) {
          snapshot[key] = localStorage.getItem(key)?.slice(0, 200);
        }
      }
      return snapshot;
    } catch (error) {
      return { error: 'localStorage access denied' };
    }
  }

  getSessionStorageSnapshot() {
    try {
      const snapshot = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (!key.includes('token') && !key.includes('password')) {
          snapshot[key] = sessionStorage.getItem(key)?.slice(0, 200);
        }
      }
      return snapshot;
    } catch (error) {
      return { error: 'sessionStorage access denied' };
    }
  }

  serializeArgument(arg) {
    try {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2).slice(0, 500);
      }
      return String(arg).slice(0, 500);
    } catch (error) {
      return '[Unserializable]';
    }
  }

  /**
   * API publique pour capturer des erreurs manuellement
   */
  captureException(error, context = {}) {
    this.captureError({
      type: 'manual',
      message: error.message || String(error),
      stack: error.stack,
      name: error.name,
      severity: context.severity || 'error',
      tags: context.tags,
      extra: context.extra,
      timestamp: new Date().toISOString()
    });
  }

  captureMessage(message, level = 'info', context = {}) {
    this.addBreadcrumb('manual', message, {
      level,
      ...context
    });
  }

  /**
   * Obtenir les statistiques locales
   */
  getStats() {
    return {
      errorsCount: this.errors.length,
      breadcrumbsCount: this.breadcrumbs.length,
      queueSize: this.errorQueue.length,
      sessionId: this.sessionContext.sessionId,
      isInitialized: this.isInitialized
    };
  }
}

// Créer l'instance globale
window.errorTracker = new ErrorTracker();

export default window.errorTracker;