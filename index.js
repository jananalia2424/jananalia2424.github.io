import React from 'react';
import ReactDOM from 'react-dom/client';  // استخدام ReactDOM.createRoot
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));  // استخدام createRoot بدلاً من render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
