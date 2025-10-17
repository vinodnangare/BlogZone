import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Blogs from './pages/Blogs.jsx'
import DetailedBlog from './pages/DetailedBlog.jsx'

import { Router, Routes, Route } from 'react-router'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router navigator={history} location={history.location}>
      <Routes>
        <Route path="/blog/:id" element={<DetailedBlog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/" element={<App />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  </React.StrictMode>
)
