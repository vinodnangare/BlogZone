import React from 'react';
import '../index.css';
import { Link } from 'react-router';

function Navbar() {
  return (
    <>
      <nav className="flex justify-between items-center px-6 py-3 bg-pink-200 border-b-2 border-gray-400 shadow-md">
       
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
          Blog<span className="text-pink-600">Zone</span>
        </h1>

        {localStorage.getItem("user") ? (
          <div className="flex gap-6 items-center">
            Logged in as <span className="font-semibold">{JSON.parse(localStorage.getItem("user")).username}</span>
            <Link 
              to="/create"  
              className="bg-white hover:bg-pink-100 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-sm"
            >
              Create Blog
            </Link>
            <Link to='/login'>
              <button
                className="cursor-pointer bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-sm"
                onClick={() => {
                  localStorage.removeItem("user");
                }
              }
              >             
                Logout
              </button> 


            </Link>
          </div>
        ) : (
 

        <div className="flex gap-6">
          <Link 
            to="/login" 
            className="bg-white hover:bg-pink-100 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-sm"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-sm"
          >
            Register
          </Link>
        </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
