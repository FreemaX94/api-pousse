// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';

// Ant Design styles
import 'antd/dist/reset.css';

// Global styles
import './index.css';

// Main App component
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
