import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill pour IntersectionObserver
global.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill pour window.btoa (si besoin)
global.window = global.window || {};
global.window.btoa = global.window.btoa || (str => Buffer.from(str).toString('base64'));
