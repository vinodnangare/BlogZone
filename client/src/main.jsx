import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Blogs from './pages/Blogs.jsx'
import DetailedBlog from './pages/DetailedBlog.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/blog/:id' element={<DetailedBlog />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/blogs' element={<Blogs />} />
      <Route path='/' element={<App />} />
      <Route path='*' element={<div>404 Not Found</div>} />
    </Routes>
  </BrowserRouter>
)
