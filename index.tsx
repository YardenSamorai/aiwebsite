
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Admin from './Admin';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Simple routing - check URL path, hash or query parameter
const isAdmin = window.location.pathname === '/admin' ||
               window.location.pathname.startsWith('/admin/') ||
               window.location.hash === '#admin' || 
               window.location.search.includes('admin=true');

root.render(
  <React.StrictMode>
    {isAdmin ? <Admin /> : <App />}
  </React.StrictMode>
);
