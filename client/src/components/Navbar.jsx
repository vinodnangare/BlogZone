import React, { useState } from 'react';
import '../index.css';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  let user = null;
  try {
    const raw = localStorage.getItem('user');
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-pink-500 rounded-full">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-800">Tiny<span className="text-pink-500">Blog</span></span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:gap-4">
            <Link to="/blogs" className="text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium">Blogs</Link>
            {!user && (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium bg-white border hover:bg-pink-50">Login</Link>
                <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium bg-pink-500 text-white hover:bg-pink-600">Register</Link>
              </>
            )}
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">Hi, <span className="font-semibold">{user.username}</span></span>
                <Link to="/create" className="px-3 py-2 rounded-md text-sm font-medium bg-white border hover:bg-pink-50">Create</Link>
                <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium bg-pink-500 text-white hover:bg-pink-600">Logout</button>
              </div>
            )}
          </div>

          <div className="sm:hidden">
            <button onClick={() => setOpen((s) => !s)} aria-expanded={open} aria-controls="mobile-menu" className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400">
              {open ? (
                <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-menu" className={`${open ? 'block' : 'hidden'} sm:hidden`}>
        <ul role="menu" aria-label="Mobile menu" className="px-4 pt-4 pb-6 space-y-2 border-t">
          <li role="none">
            <Link to="/blogs" role="menuitem" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-pink-50">Blogs</Link>
          </li>
          {!user && (
            <>
              <li role="none">
                <Link to="/login" role="menuitem" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-pink-50">Login</Link>
              </li>
              <li role="none">
                <Link to="/register" role="menuitem" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium bg-pink-500 text-white hover:bg-pink-600">Register</Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li role="none" className="px-3 py-2">
                <div className="text-sm text-gray-700">Logged in as</div>
                <div className="font-semibold text-gray-900">{user.username}</div>
              </li>
              <li role="none">
                <Link to="/create" role="menuitem" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-pink-50">Create Blog</Link>
              </li>
              <li role="none">
                <button role="menuitem" onClick={() => { setOpen(false); handleLogout(); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-pink-500 text-white hover:bg-pink-600">Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
