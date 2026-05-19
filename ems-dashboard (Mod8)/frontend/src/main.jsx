/**
 * main.jsx — Punto de entrada del frontend (Grupo 8 — Dashboard de Valor)
 *
 * Monta la aplicación React en el div#root definido en index.html.
 * Puerto de desarrollo: 5180 (configurado en vite.config.js)
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
