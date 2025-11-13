import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import './index.css';

if (import.meta.env.VITE_DB_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_DB_URL;
}

const token = localStorage.getItem('token');
if (token && token !== 'undefined' && token !== 'null') {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
