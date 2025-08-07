import React, { useEffect } from 'react';

// HOC pour preloader les composants lazy au survol
const withPreloading = (Component, preloadComponents = []) => {
  const PreloadedComponent = (props) => {
    useEffect(() => {
      // Preload des composants au montage
      const preloadPromises = preloadComponents.map(component => {
        if (typeof component === 'function') {
          return component();
        }
        return Promise.resolve();
      });

      Promise.all(preloadPromises).catch(console.error);
    }, []);

    return <Component {...props} />;
  };

  PreloadedComponent.displayName = `withPreloading(${Component.displayName || Component.name})`;
  
  return PreloadedComponent;
};

// Hook pour preloader des composants conditionnellement
export const usePreloader = (shouldPreload, components) => {
  useEffect(() => {
    if (shouldPreload && components.length > 0) {
      const preloadPromises = components.map(component => {
        if (typeof component === 'function') {
          return component();
        }
        return Promise.resolve();
      });

      Promise.all(preloadPromises).catch(console.error);
    }
  }, [shouldPreload, components]);
};

// Helper pour créer des preload functions
export const createPreloader = (importFunction) => {
  let componentPromise;
  
  return () => {
    if (!componentPromise) {
      componentPromise = importFunction();
    }
    return componentPromise;
  };
};

export default withPreloading;