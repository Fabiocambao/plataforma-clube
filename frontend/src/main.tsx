import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // <-- IMPORTA O CSS
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';  // Verifique se o caminho está correto

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
