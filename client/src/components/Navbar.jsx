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
    <header className="w-full bg-slate-900 border-b border-slate-800 shadow-xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-teal-500 group-hover:bg-teal-400 rounded-lg transition-all duration-300 shadow-lg shadow-teal-500/50">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Tiny<span className="text-teal-400">Blog</span></span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:gap-4">
            <Link to="/blogs" className="text-slate-300 hover:text-teal-400 px-3 py-2 text-sm font-medium transition-colors duration-200">All Blogs</Link>
            {!user && (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200">Login</Link>
                <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-medium bg-teal-500 hover:bg-teal-400 text-white shadow-lg shadow-teal-500/50 transition-all duration-200">Get Started</Link>
              </>
            )}
            {user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-300">{user.username}</span>
                </div>
                <Link to="/create" className="px-4 py-2 rounded-lg text-sm font-medium bg-teal-500 hover:bg-teal-400 text-white shadow-lg shadow-teal-500/50 transition-all duration-200">New Post</Link>
                <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all duration-200 cursor-pointer">Logout</button>
              </div>
            )}
          </div>

          <div className="sm:hidden">
            <button onClick={() => setOpen((s) => !s)} aria-expanded={open} aria-controls="mobile-menu" className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 cursor-pointer">
              {open ? (
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-menu" className={`${open ? 'block' : 'hidden'} sm:hidden bg-slate-800 border-t border-slate-700`}>
        <ul role="menu" aria-label="Mobile menu" className="px-4 pt-4 pb-6 space-y-2">
          <li role="none">
            <Link to="/blogs" role="menuitem" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-teal-400 hover:bg-slate-700 transition-colors duration-200">All Blogs</Link>
          </li>
          {!user && (
            <>
              <li role="none">
                <Link to="/login" role="menuitem" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200">Login</Link>
              </li>
              <li role="none">
                <Link to="/register" role="menuitem" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-base font-semibold bg-teal-500 text-white hover:bg-teal-400 transition-colors duration-200">Get Started</Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li role="none" className="px-3 py-2 border-t border-slate-700 pt-4">
                <div className="text-sm text-slate-400">Logged in as</div>
                <div className="font-semibold text-teal-400 text-lg">{user.username}</div>
              </li>
              <li role="none">
                <Link to="/create" role="menuitem" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium bg-teal-500 text-white hover:bg-teal-400 transition-colors duration-200">New Post</Link>
              </li>
              <li role="none">
                <button role="menuitem" onClick={() => { setOpen(false); handleLogout(); }} className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors duration-200">Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
