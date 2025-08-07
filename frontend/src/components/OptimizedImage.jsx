import React, { useEffect, useRef } from 'react';
import { useAssetOptimization } from '../utils/assetOptimizer';

/**
 * Composant React optimisé pour images avec lazy loading intelligent
 */
const OptimizedImage = ({ 
  src, 
  alt = '', 
  className = '', 
  priority = false, 
  responsive = true,
  style = {},
  ...props 
}) => {
  const { createOptimizedImage } = useAssetOptimization();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !src) return;

    const img = createOptimizedImage(src, {
      alt,
      className,
      priority,
      ...props
    });

    // Remplacer le placeholder par l'image optimisée
    containerRef.current.appendChild(img);

    return () => {
      // Cleanup
      if (containerRef.current && img.parentNode) {
        img.parentNode.removeChild(img);
      }
    };
  }, [src, alt, className, priority]);

  return (
    <div 
      ref={containerRef}
      className={`image-container ${className}`}
      data-src={src}
      style={{
        background: '#f0f0f0',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
        ...style
      }}
      {...props}
    >
      {/* Placeholder pendant le chargement */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        color: '#999',
        fontSize: '14px'
      }}>
        <span style={{ fontSize: '24px' }}>📷</span>
        <span>Chargement...</span>
      </div>
    </div>
  );
};

export default OptimizedImage;