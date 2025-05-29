// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// ← Remplacé BrowserRouter par HashRouter
import { HashRouter } from 'react-router-dom';

// Ant Design styles
import 'antd/dist/reset.css';

// Global styles
import './index.css';

// On précise bien l’extension pour éviter tout flou de résolution
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
