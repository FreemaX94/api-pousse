// Shared Components and Utilities
export { default as NavBar } from './components/NavBar';
export { default as Modal } from './components/Modal';
export { default as SidebarFilters } from './components/SidebarFilters';
export { default as ExcelUploader } from './components/ExcelUploader';
export { default as SyncManager } from './components/SyncManager';
export { default as FormulaireMain } from './components/FormulaireMain';
export { default as AssignModal } from './components/AssignModal';
export { default as AddClientModal } from './components/AddClientModal';
export { default as AdminPage } from './components/AdminPage';
export { default as NotFound } from './components/NotFound';

// Providers
export { default as QueryProvider } from './providers/QueryProvider';

// Utils
export * from './utils/logger';
export * from './utils/sanitizeHtml';
export * from './utils/securityHeaders';

// API
export * from './api/domains/inventory/clientApi';
export * from './api/config';
export * from './api/domains/inventory/livraisonApi';
export * from './api/domains/catalog/produits';
export * from './api/domains/inventory/syncApi';