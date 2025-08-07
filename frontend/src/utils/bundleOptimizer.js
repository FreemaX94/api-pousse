/**
 * Optimiseur de bundle et analyseur de performance
 * Outils pour analyser et optimiser la taille des bundles
 */

/**
 * Analyseur de bundle en temps réel
 */
class BundleAnalyzer {
  constructor() {
    this.loadedModules = new Set();
    this.moduleLoadTimes = new Map();
    this.bundleMetrics = {
      totalSize: 0,
      loadedChunks: 0,
      failedChunks: 0,
      cacheHits: 0
    };
  }

  /**
   * Enregistrer le chargement d'un module
   */
  recordModuleLoad(moduleName, size, loadTime) {
    this.loadedModules.add(moduleName);
    this.moduleLoadTimes.set(moduleName, loadTime);
    this.bundleMetrics.totalSize += size;
    this.bundleMetrics.loadedChunks++;

    // Log si module lent
    if (loadTime > 1000) {
      console.warn(`🐌 Module lent: ${moduleName} (${loadTime}ms, ${size}B)`);
    }
  }

  /**
   * Analyser les modules inutilisés
   */
  findUnusedModules() {
    // Simuler la détection de modules non utilisés
    const allModules = [
      'vendor-core', 'vendor-ui', 'vendor-utils',
      'business-stock', 'business-catalog', 'business-finance',
      'business-planning', 'business-auth', 'shared-ui'
    ];

    const unusedModules = allModules.filter(module => !this.loadedModules.has(module));
    
    if (unusedModules.length > 0) {
      console.info('📊 Modules non chargés:', unusedModules);
    }

    return unusedModules;
  }

  /**
   * Rapport de performance
   */
  getPerformanceReport() {
    const sortedModules = Array.from(this.moduleLoadTimes.entries())
      .sort(([,a], [,b]) => b - a);

    return {
      metrics: this.bundleMetrics,
      slowestModules: sortedModules.slice(0, 5),
      totalModules: this.loadedModules.size,
      avgLoadTime: sortedModules.reduce((sum, [,time]) => sum + time, 0) / sortedModules.length || 0,
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * Générer des recommandations d'optimisation
   */
  generateRecommendations() {
    const recommendations = [];
    const report = this.getPerformanceReport();

    // Bundle trop lourd
    if (this.bundleMetrics.totalSize > 2 * 1024 * 1024) { // 2MB
      recommendations.push({
        type: 'warning',
        message: 'Bundle principal trop lourd (>2MB)',
        action: 'Diviser en chunks plus petits'
      });
    }

    // Modules lents
    if (report.avgLoadTime > 500) {
      recommendations.push({
        type: 'performance',
        message: 'Temps de chargement moyen élevé',
        action: 'Optimiser les modules les plus lents'
      });
    }

    // Taux d'échec élevé
    if (this.bundleMetrics.failedChunks > 0) {
      recommendations.push({
        type: 'error',
        message: 'Échecs de chargement détectés',
        action: 'Vérifier la connectivité et retry logic'
      });
    }

    return recommendations;
  }
}

/**
 * Optimiseur de chargement conditionnel
 */
class ConditionalLoader {
  constructor() {
    this.conditions = new Map();
    this.loadQueue = [];
  }

  /**
   * Enregistrer une condition de chargement
   */
  registerCondition(moduleName, condition) {
    this.conditions.set(moduleName, condition);
  }

  /**
   * Vérifier si un module doit être chargé
   */
  shouldLoad(moduleName, context = {}) {
    const condition = this.conditions.get(moduleName);
    if (!condition) return true;

    if (typeof condition === 'function') {
      return condition(context);
    }

    return condition;
  }

  /**
   * Chargement basé sur les fonctionnalités utilisateur
   */
  loadByFeature(userFeatures = []) {
    const featureModuleMap = {
      'stock_management': ['business-stock'],
      'catalog_management': ['business-catalog'],
      'financial_management': ['business-finance'],
      'planning': ['business-planning'],
      'admin': ['admin-components']
    };

    const modulesToLoad = [];
    userFeatures.forEach(feature => {
      const modules = featureModuleMap[feature] || [];
      modulesToLoad.push(...modules);
    });

    return [...new Set(modulesToLoad)];
  }

  /**
   * Chargement basé sur le rôle utilisateur
   */
  loadByRole(userRole) {
    const roleModuleMap = {
      'admin': ['business-stock', 'business-catalog', 'business-finance', 'business-planning'],
      'manager': ['business-stock', 'business-catalog', 'business-finance'],
      'user': ['business-stock', 'business-catalog']
    };

    return roleModuleMap[userRole] || roleModuleMap['user'];
  }
}

/**
 * Gestionnaire de cache intelligent pour les chunks
 */
class ChunkCacheManager {
  constructor() {
    this.cacheStorage = null;
    this.cachePrefix = 'api-pousse-chunks-';
    this.maxAge = 24 * 60 * 60 * 1000; // 24 heures
    this.initCache();
  }

  async initCache() {
    if ('caches' in window) {
      this.cacheStorage = await caches.open(this.cachePrefix + 'v1');
    }
  }

  /**
   * Vérifier si un chunk est en cache
   */
  async isChunkCached(chunkUrl) {
    if (!this.cacheStorage) return false;

    try {
      const response = await this.cacheStorage.match(chunkUrl);
      if (!response) return false;

      // Vérifier l'âge du cache
      const cachedDate = response.headers.get('cached-date');
      if (cachedDate) {
        const age = Date.now() - new Date(cachedDate).getTime();
        if (age > this.maxAge) {
          await this.cacheStorage.delete(chunkUrl);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.warn('Cache check failed:', error);
      return false;
    }
  }

  /**
   * Mettre en cache un chunk
   */
  async cacheChunk(chunkUrl, response) {
    if (!this.cacheStorage) return;

    try {
      // Cloner la response et ajouter timestamp
      const responseToCache = response.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set('cached-date', new Date().toISOString());

      const cachedResponse = new Response(await responseToCache.blob(), {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });

      await this.cacheStorage.put(chunkUrl, cachedResponse);
    } catch (error) {
      console.warn('Cache storage failed:', error);
    }
  }

  /**
   * Précharger les chunks critiques
   */
  async preloadCriticalChunks(chunkUrls) {
    const preloadPromises = chunkUrls.map(async (url) => {
      try {
        if (await this.isChunkCached(url)) {
          return; // Déjà en cache
        }

        const response = await fetch(url);
        if (response.ok) {
          await this.cacheChunk(url, response);
          console.log(`✅ Chunk préchargé: ${url}`);
        }
      } catch (error) {
        console.warn(`❌ Échec préchargement: ${url}`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
  }
}

/**
 * Moniteur de Core Web Vitals pour les bundles
 */
class WebVitalsMonitor {
  constructor() {
    this.metrics = {};
    this.thresholds = {
      FCP: 1800, // First Contentful Paint
      LCP: 2500, // Largest Contentful Paint
      FID: 100,  // First Input Delay
      CLS: 0.1   // Cumulative Layout Shift
    };
  }

  /**
   * Mesurer le First Contentful Paint
   */
  measureFCP() {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            this.metrics.FCP = fcpEntry.startTime;
            observer.disconnect();
            resolve(fcpEntry.startTime);
          }
        });
        observer.observe({ entryTypes: ['paint'] });
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Mesurer le Largest Contentful Paint
   */
  measureLCP() {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.LCP = lastEntry.startTime;
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });

        // Résoudre après 5 secondes max
        setTimeout(() => {
          observer.disconnect();
          resolve(this.metrics.LCP);
        }, 5000);
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Rapport Web Vitals
   */
  async getWebVitalsReport() {
    await Promise.all([
      this.measureFCP(),
      this.measureLCP()
    ]);

    const report = {
      metrics: this.metrics,
      scores: {},
      recommendations: []
    };

    // Calculer les scores
    Object.keys(this.thresholds).forEach(metric => {
      if (this.metrics[metric] !== undefined) {
        const value = this.metrics[metric];
        const threshold = this.thresholds[metric];
        
        report.scores[metric] = {
          value,
          threshold,
          status: value <= threshold ? 'good' : value <= threshold * 1.5 ? 'needs-improvement' : 'poor'
        };

        // Recommandations
        if (report.scores[metric].status !== 'good') {
          report.recommendations.push({
            metric,
            message: `${metric} trop élevé (${value.toFixed(2)}ms)`,
            suggestion: this.getMetricSuggestion(metric)
          });
        }
      }
    });

    return report;
  }

  getMetricSuggestion(metric) {
    const suggestions = {
      FCP: 'Réduire la taille du bundle principal et utiliser le lazy loading',
      LCP: 'Optimiser les images et précharger les ressources critiques',
      FID: 'Réduire le JavaScript bloquant et utiliser des web workers',
      CLS: 'Définir des dimensions fixes pour les éléments dynamiques'
    };

    return suggestions[metric] || 'Optimiser les performances générales';
  }
}

/**
 * Factory pour créer des composants optimisés
 */
export const createOptimizedComponent = (importFn, options = {}) => {
  const {
    critical = false,
    preload = false,
    condition = null,
    bundleName = 'unknown'
  } = options;

  const analyzer = new BundleAnalyzer();
  
  return {
    component: async () => {
      const startTime = performance.now();
      
      try {
        const module = await importFn();
        const loadTime = performance.now() - startTime;
        
        analyzer.recordModuleLoad(bundleName, 0, loadTime); // Size unknown in runtime
        
        return module;
      } catch (error) {
        analyzer.bundleMetrics.failedChunks++;
        throw error;
      }
    },
    
    analyzer,
    preload: preload ? () => importFn() : null,
    condition
  };
};

// Instances globales
export const bundleAnalyzer = new BundleAnalyzer();
export const conditionalLoader = new ConditionalLoader();
export const chunkCache = new ChunkCacheManager();
export const webVitalsMonitor = new WebVitalsMonitor();

/**
 * Hook d'optimisation pour React
 */
export const useBundleOptimization = () => {
  const analyzeCurrentBundle = () => {
    return bundleAnalyzer.getPerformanceReport();
  };

  const preloadForRoute = async (route) => {
    const routeChunks = {
      '/nieuwkoop': ['/assets/business-catalog-*.js'],
      '/admin': ['/assets/business-admin-*.js'],
      '/finance': ['/assets/business-finance-*.js']
    };

    const chunks = routeChunks[route] || [];
    await chunkCache.preloadCriticalChunks(chunks);
  };

  const measureWebVitals = async () => {
    return await webVitalsMonitor.getWebVitalsReport();
  };

  return {
    analyzeCurrentBundle,
    preloadForRoute,
    measureWebVitals,
    bundleAnalyzer,
    conditionalLoader
  };
};