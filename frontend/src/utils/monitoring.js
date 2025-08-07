/**
 * Frontend Monitoring Utilities pour API Pousse
 * Intégration avec New Relic Browser et métriques personnalisées
 */

// 📊 New Relic Browser API wrapper
class FrontendMonitoring {
  constructor() {
    this.isNewRelicAvailable = typeof window !== 'undefined' && window.newrelic;
    this.startTimes = new Map();
  }

  // 🎯 Core Web Vitals tracking
  trackWebVitals() {
    if (!this.isNewRelicAvailable) return;

    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            window.newrelic.addPageAction('CoreWebVital', {
              metric: 'FCP',
              value: entry.startTime,
              page: window.location.pathname
            });
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        window.newrelic.addPageAction('CoreWebVital', {
          metric: 'LCP', 
          value: lastEntry.startTime,
          page: window.location.pathname,
          element: lastEntry.element?.tagName || 'unknown'
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        
        window.newrelic.addPageAction('CoreWebVital', {
          metric: 'CLS',
          value: clsValue,
          page: window.location.pathname
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  // 🚀 Lazy Loading Performance
  trackLazyLoading(componentName) {
    const startTime = performance.now();
    
    return {
      end: () => {
        const loadTime = performance.now() - startTime;
        
        this.recordCustomEvent('LazyLoad', {
          component: componentName,
          loadTime,
          page: window.location.pathname
        });

        // Alert si le lazy loading est trop lent
        if (loadTime > 1000) {
          this.recordCustomEvent('SlowLazyLoad', {
            component: componentName,
            loadTime,
            page: window.location.pathname
          });
        }
      }
    };
  }

  // 📦 Bundle Performance
  trackBundleLoad(chunkName, size) {
    this.recordCustomEvent('BundleLoad', {
      chunk: chunkName,
      size,
      page: window.location.pathname,
      userAgent: navigator.userAgent
    });

    // Métriques de performance bundle
    if (this.isNewRelicAvailable) {
      window.newrelic.setCustomAttribute('bundleSize', size);
      window.newrelic.setCustomAttribute('chunkCount', chunkName);
    }
  }

  // 🎯 User Actions Tracking spécifique à api-pousse
  trackUserAction(action, data = {}) {
    const actionTypes = {
      // Nieuwkoop module
      'nieuwkoop_search': 'high',
      'nieuwkoop_add_to_stock': 'critical',
      'nieuwkoop_view_item': 'medium',
      
      // Stock management
      'stock_entry': 'critical',
      'stock_exit': 'critical', 
      'stock_movement': 'high',
      
      // Navigation
      'page_view': 'medium',
      'menu_click': 'low',
      
      // Errors
      'error_boundary': 'critical',
      'api_error': 'high'
    };

    const priority = actionTypes[action] || 'low';

    this.recordCustomEvent('UserAction', {
      action,
      priority,
      ...data,
      timestamp: Date.now(),
      page: window.location.pathname,
      sessionId: this.getSessionId()
    });
  }

  // 📈 API Call Performance
  trackApiCall(endpoint, method, duration, status) {
    this.recordCustomEvent('FrontendAPICall', {
      endpoint,
      method,
      duration,
      status,
      page: window.location.pathname,
      network: navigator.connection?.effectiveType || 'unknown'
    });

    // Alertes pour les appels API lents
    if (duration > 2000) {
      this.recordCustomEvent('SlowAPICall', {
        endpoint,
        duration,
        page: window.location.pathname
      });
    }
  }

  // 🚨 Error Tracking avec contexte
  trackError(error, context = {}) {
    if (this.isNewRelicAvailable) {
      window.newrelic.noticeError(error, {
        ...context,
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        sessionId: this.getSessionId()
      });
    }

    this.recordCustomEvent('FrontendError', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...context,
      page: window.location.pathname
    });

    // Log local pour debugging
    console.error('Frontend Error Tracked:', error, context);
  }

  // 🎨 React Component Performance
  trackComponentRender(componentName, renderTime, props = {}) {
    this.recordCustomEvent('ComponentRender', {
      component: componentName,
      renderTime,
      propsSize: JSON.stringify(props).length,
      page: window.location.pathname
    });

    // Alert pour les rendus lents
    if (renderTime > 100) {
      this.recordCustomEvent('SlowComponentRender', {
        component: componentName,
        renderTime,
        page: window.location.pathname
      });
    }
  }

  // 🔄 Route Change Performance
  trackRouteChange(from, to, loadTime) {
    this.recordCustomEvent('RouteChange', {
      from,
      to,
      loadTime,
      timestamp: Date.now()
    });

    if (this.isNewRelicAvailable) {
      window.newrelic.setCustomAttribute('currentRoute', to);
    }
  }

  // 🛠 Utility Methods
  recordCustomEvent(eventType, attributes) {
    if (this.isNewRelicAvailable) {
      window.newrelic.addPageAction(eventType, attributes);
    }
    
    // Fallback: local storage pour analysis offline
    if (!this.isNewRelicAvailable && localStorage) {
      const events = JSON.parse(localStorage.getItem('monitoring_events') || '[]');
      events.push({
        type: eventType,
        attributes,
        timestamp: Date.now()
      });
      
      // Garder seulement les 100 derniers événements
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('monitoring_events', JSON.stringify(events));
    }
  }

  startTimer(name) {
    this.startTimes.set(name, performance.now());
  }

  endTimer(name, metadata = {}) {
    const startTime = this.startTimes.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.startTimes.delete(name);
      
      this.recordCustomEvent('CustomTimer', {
        name,
        duration,
        ...metadata,
        page: window.location.pathname
      });
      
      return duration;
    }
    return null;
  }

  getSessionId() {
    if (!sessionStorage.getItem('monitoring_session_id')) {
      sessionStorage.setItem('monitoring_session_id', 
        Date.now().toString(36) + Math.random().toString(36).substr(2));
    }
    return sessionStorage.getItem('monitoring_session_id');
  }

  // 📱 Device & Performance Info
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      connection: navigator.connection?.effectiveType || 'unknown',
      memory: navigator.deviceMemory || 'unknown',
      cores: navigator.hardwareConcurrency || 'unknown',
      screenSize: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`
    };
  }
}

// Singleton instance
const monitoring = new FrontendMonitoring();

// Auto-start Core Web Vitals tracking
if (typeof window !== 'undefined') {
  monitoring.trackWebVitals();
  
  // Track initial page load
  window.addEventListener('load', () => {
    monitoring.recordCustomEvent('PageLoad', {
      loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
      ...monitoring.getDeviceInfo()
    });
  });
}

export default monitoring;

// Named exports pour facilité d'utilisation
export const {
  trackUserAction,
  trackApiCall, 
  trackError,
  trackLazyLoading,
  trackComponentRender,
  trackRouteChange,
  startTimer,
  endTimer
} = monitoring;