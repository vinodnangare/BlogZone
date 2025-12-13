import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username.trim() || !email.trim() || !password.trim()) {
      alert('All fields are required');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_DB_URL || import.meta.env.VITE_API_URL || '';

      const payload = {
        username,
        email,
        password
      };

      const res = await axios.post(`${apiBase}/register`, payload);

      if (res.data?.sucess) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        alert(res.data?.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error:', err?.response?.data || err.message);
      alert('Error registering');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-10 h-48 w-48 bg-teal-200/40 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -left-10 h-56 w-56 bg-cyan-200/40 blur-3xl rounded-full" />
        </div>

        <div className="w-full max-w-md relative">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-teal-500 to-cyan-400 rounded-full mb-4 shadow-lg shadow-teal-500/30">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
            <p className="text-slate-600 mt-2">Join BlogZone and start writing</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Username</label>
                <div className="relative">
                  <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white focus:shadow-[0_10px_35px_rgba(45,212,191,0.15)]"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2">Public name shown on your posts.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Email Address</label>
                <div className="relative">
                  <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white focus:shadow-[0_10px_35px_rgba(45,212,191,0.15)]"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2">Use a reachable email for verification.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Password</label>
                <div className="relative">
                  <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 6 chars)"
                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white focus:shadow-[0_10px_35px_rgba(45,212,191,0.15)]"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M15.171 13.576l1.473 1.473a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.473 1.473A10.014 10.014 0 00.458 10c1.274 4.057 5.064 7 9.542 7 2.181 0 4.322-.665 6.171-1.906z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Confirm Password</label>
                <div className="relative">
                  <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white focus:shadow-[0_10px_35px_rgba(45,212,191,0.15)]"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M15.171 13.576l1.473 1.473a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.473 1.473A10.014 10.014 0 00.458 10c1.274 4.057 5.064 7 9.542 7 2.181 0 4.322-.665 6.171-1.906z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-sm text-teal-800">
                <p className="font-semibold mb-1">Password Requirements:</p>
                <ul className="text-xs space-y-1">
                  <li>✓ Minimum 6 characters</li>
                  <li>✓ Passwords must match</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-teal-500/30 hover:-translate-y-0.5 active:translate-y-0 transform duration-150 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-center text-slate-600">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="text-teal-600 hover:text-teal-700 font-semibold hover:underline cursor-pointer">
                  Sign in
                </button>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            <p>By registering, you agree to our Terms & Conditions</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;