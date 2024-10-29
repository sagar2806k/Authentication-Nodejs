// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js'; // Add the .js extension
import './index.css'; // This will be fixed in the next step

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);