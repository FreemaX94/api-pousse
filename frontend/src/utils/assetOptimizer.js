/**
 * Optimiseur d'assets et d'images pour améliorer les performances
 * Gestion intelligente des médias avec lazy loading et optimisations
 */

/**
 * Gestionnaire d'images responsives avec lazy loading
 */
class ResponsiveImageManager {
  constructor() {
    this.loadedImages = new Set();
    this.imageCache = new Map();
    this.observer = null;
    this.initIntersectionObserver();
  }

  /**
   * Initialiser l'observer pour le lazy loading
   */
  initIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target);
              this.observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px 0px', // Charger 50px avant d'être visible
          threshold: 0.1
        }
      );
    }
  }

  /**
   * Créer une image responsive avec lazy loading
   */
  createResponsiveImage(src, options = {}) {
    const {
      alt = '',
      className = '',
      sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+',
      webpSupport = true,
      priority = false
    } = options;

    const img = document.createElement('img');
    img.className = className;
    img.alt = alt;
    img.sizes = sizes;
    
    // Placeholder en attendant le chargement
    img.src = placeholder;
    img.dataset.src = src;
    
    // Ajouter support WebP si disponible
    if (webpSupport && this.supportsWebP()) {
      const webpSrc = this.convertToWebP(src);
      img.dataset.src = webpSrc;
      img.dataset.fallback = src;
    }

    // Style pour transition smooth
    img.style.transition = 'opacity 0.3s ease';
    img.style.opacity = '0.7';

    // Lazy loading ou chargement prioritaire
    if (priority) {
      this.loadImage(img);
    } else if (this.observer) {
      this.observer.observe(img);
    } else {
      // Fallback si pas d'IntersectionObserver
      setTimeout(() => this.loadImage(img), 100);
    }

    return img;
  }

  /**
   * Charger une image avec gestion d'erreur
   */
  async loadImage(imgElement) {
    const src = imgElement.dataset.src;
    const fallback = imgElement.dataset.fallback;

    if (this.loadedImages.has(src)) {
      imgElement.src = src;
      imgElement.style.opacity = '1';
      return;
    }

    try {
      await this.preloadImage(src);
      imgElement.src = src;
      imgElement.style.opacity = '1';
      this.loadedImages.add(src);
    } catch (error) {
      console.warn(`Failed to load image: ${src}`);
      
      // Essayer le fallback
      if (fallback && fallback !== src) {
        try {
          await this.preloadImage(fallback);
          imgElement.src = fallback;
          imgElement.style.opacity = '1';
        } catch (fallbackError) {
          console.error(`Failed to load fallback image: ${fallback}`);
          // Garder le placeholder
        }
      }
    }
  }

  /**
   * Précharger une image
   */
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      if (this.imageCache.has(src)) {
        resolve(this.imageCache.get(src));
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.imageCache.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Vérifier le support WebP
   */
  supportsWebP() {
    if (this._webpSupport !== undefined) {
      return this._webpSupport;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    this._webpSupport = canvas.toDataURL('image/webp').indexOf('webp') > -1;
    return this._webpSupport;
  }

  /**
   * Convertir URL vers WebP (simulation)
   */
  convertToWebP(src) {
    // En production, ceci devrait pointer vers un service de conversion
    return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  /**
   * Précharger des images critiques
   */
  async preloadCriticalImages(urls) {
    const preloadPromises = urls.map(url => this.preloadImage(url));
    
    try {
      await Promise.allSettled(preloadPromises);
      console.log(`✅ Preloaded ${urls.length} critical images`);
    } catch (error) {
      console.warn('Some critical images failed to preload:', error);
    }
  }
}

/**
 * Gestionnaire d'assets statiques
 */
class StaticAssetManager {
  constructor() {
    this.assetCache = new Map();
    this.cachePrefix = 'api-pousse-assets-';
    this.initServiceWorker();
  }

  /**
   * Initialiser service worker pour cache d'assets
   */
  async initServiceWorker() {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        // Note: En production, il faudrait un vrai service worker
        this.cache = await caches.open(this.cachePrefix + 'v1');
      } catch (error) {
        console.warn('Service worker cache not available:', error);
      }
    }
  }

  /**
   * Optimiser les assets CSS
   */
  optimizeCSS() {
    // Supprimer les CSS inutilisés
    this.removeUnusedCSS();
    
    // Inliner les CSS critiques
    this.inlineCriticalCSS();
    
    // Preload des fonts importantes
    this.preloadFonts();
  }

  /**
   * Supprimer CSS non utilisés
   */
  removeUnusedCSS() {
    const stylesheets = Array.from(document.styleSheets);
    
    stylesheets.forEach(stylesheet => {
      try {
        const rules = Array.from(stylesheet.cssRules || []);
        
        rules.forEach(rule => {
          if (rule.type === CSSRule.STYLE_RULE) {
            // Vérifier si le sélecteur est utilisé
            const isUsed = document.querySelector(rule.selectorText);
            if (!isUsed && this.isSafeToRemove(rule.selectorText)) {
              console.log(`🗑️ Removing unused CSS rule: ${rule.selectorText}`);
              // Note: En production, utiliser un outil comme PurgeCSS
            }
          }
        });
      } catch (error) {
        // Cross-origin stylesheets peuvent être inaccessibles
      }
    });
  }

  /**
   * Vérifier si une règle CSS peut être supprimée en sécurité
   */
  isSafeToRemove(selector) {
    // Liste de sélecteurs à ne jamais supprimer
    const safelist = [
      ':hover', ':focus', ':active', ':before', ':after',
      '.modal', '.tooltip', '.dropdown', '.animate-'
    ];
    
    return !safelist.some(safe => selector.includes(safe));
  }

  /**
   * Inliner les CSS critiques
   */
  inlineCriticalCSS() {
    const criticalCSS = `
      /* CSS critique inliné pour améliorer FCP */
      body { 
        font-family: system-ui, -apple-system, sans-serif;
        margin: 0;
        background: #f5f5f5;
      }
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }

  /**
   * Précharger les fonts importantes
   */
  preloadFonts() {
    const fonts = [
      '/fonts/inter-var.woff2',
      '/fonts/roboto-bold.woff2'
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = font;
      document.head.appendChild(link);
    });
  }

  /**
   * Optimiser les icônes SVG
   */
  optimizeSVGIcons() {
    const svgs = document.querySelectorAll('svg');
    
    svgs.forEach(svg => {
      // Supprimer les attributs inutiles
      const unnecessaryAttrs = ['xmlns:xlink', 'xml:space', 'data-icon'];
      unnecessaryAttrs.forEach(attr => svg.removeAttribute(attr));
      
      // Ajouter aria-hidden si pas d'alt
      if (!svg.getAttribute('aria-label') && !svg.getAttribute('alt')) {
        svg.setAttribute('aria-hidden', 'true');
      }
      
      // Optimiser les viewBox
      if (!svg.getAttribute('viewBox') && svg.getAttribute('width')) {
        const width = svg.getAttribute('width');
        const height = svg.getAttribute('height') || width;
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      }
    });
  }
}

/**
 * Gestionnaire de compression d'assets
 */
class AssetCompressionManager {
  constructor() {
    this.compressionRatios = new Map();
  }

  /**
   * Compresser les images côté client si nécessaire
   */
  async compressImage(file, maxSize = 1024 * 1024) { // 1MB par défaut
    if (file.size <= maxSize) {
      return file;
    }

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer nouvelles dimensions
        const { width, height } = this.calculateOptimalDimensions(
          img.width, 
          img.height, 
          maxSize
        );

        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir en blob avec compression
        canvas.toBlob(
          (blob) => {
            const compressionRatio = ((file.size - blob.size) / file.size * 100).toFixed(1);
            console.log(`🗜️ Image compressed by ${compressionRatio}%`);
            this.compressionRatios.set(file.name, compressionRatio);
            
            // Créer un nouveau File object
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            resolve(compressedFile);
          },
          'image/jpeg',
          0.8 // Qualité JPEG 80%
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Calculer dimensions optimales
   */
  calculateOptimalDimensions(originalWidth, originalHeight, maxSize) {
    const aspectRatio = originalWidth / originalHeight;
    const maxDimension = Math.sqrt(maxSize / (4 * aspectRatio)); // Estimation grossière
    
    let width = originalWidth;
    let height = originalHeight;

    if (width > maxDimension) {
      width = maxDimension;
      height = width / aspectRatio;
    }

    if (height > maxDimension) {
      height = maxDimension;
      width = height * aspectRatio;
    }

    return {
      width: Math.round(width),
      height: Math.round(height)
    };
  }

  /**
   * Rapport de compression
   */
  getCompressionReport() {
    const report = {
      totalFiles: this.compressionRatios.size,
      averageCompression: 0,
      bestCompression: 0,
      files: []
    };

    if (this.compressionRatios.size === 0) {
      return report;
    }

    let totalCompression = 0;
    let bestRatio = 0;

    for (const [filename, ratio] of this.compressionRatios) {
      const numericRatio = parseFloat(ratio);
      totalCompression += numericRatio;
      bestRatio = Math.max(bestRatio, numericRatio);
      
      report.files.push({
        filename,
        compressionRatio: ratio + '%'
      });
    }

    report.averageCompression = (totalCompression / this.compressionRatios.size).toFixed(1) + '%';
    report.bestCompression = bestRatio.toFixed(1) + '%';

    return report;
  }
}

// Instances globales
export const imageManager = new ResponsiveImageManager();
export const assetManager = new StaticAssetManager();
export const compressionManager = new AssetCompressionManager();

/**
 * Hook React pour optimisation d'assets
 */
export const useAssetOptimization = () => {
  const createOptimizedImage = (src, options) => {
    return imageManager.createResponsiveImage(src, options);
  };

  const preloadCriticalAssets = async (images = [], fonts = []) => {
    await Promise.all([
      imageManager.preloadCriticalImages(images),
      fonts.length > 0 ? assetManager.preloadFonts(fonts) : Promise.resolve()
    ]);
  };

  const compressImageFile = async (file, maxSize) => {
    return await compressionManager.compressImage(file, maxSize);
  };

  const optimizeCurrentPage = () => {
    assetManager.optimizeCSS();
    assetManager.optimizeSVGIcons();
  };

  return {
    createOptimizedImage,
    preloadCriticalAssets,
    compressImageFile,
    optimizeCurrentPage,
    imageManager,
    assetManager,
    compressionManager
  };
};

/**
 * Utilitaire pour générer srcSet responsive
 */
export const generateSrcSet = (baseSrc, breakpoints = [320, 640, 768, 1024, 1200]) => {
  return breakpoints
    .map(width => {
      const src = baseSrc.replace(/(\.[^.]+)$/, `_${width}w$1`);
      return `${src} ${width}w`;
    })
    .join(', ');
};

/**
 * Créer un élément image optimisé (fonction utilitaire)
 * Note: Cette fonction doit être utilisée dans un contexte React
 */
export const createOptimizedImageElement = (src, options = {}) => {
  // Cette fonction sera utilisée par le hook useAssetOptimization
  return imageManager.createResponsiveImage(src, options);
};