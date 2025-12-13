import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import './index.css';

const apiBase =
  import.meta.env.VITE_DB_URL ||
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '');

if (apiBase) {
  axios.defaults.baseURL = apiBase;
}

const token = localStorage.getItem('token');
if (token && token !== 'undefined' && token !== 'null') {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
