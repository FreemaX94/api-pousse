// vitest.setup.js

// Import des matchers personnalisés pour Testing Library
import '@testing-library/jest-dom/vitest';

// Polyfill global pour IntersectionObserver afin d'éviter l'erreur dans JSDOM
class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = IntersectionObserver;
