import React, { useState } from 'react';
import '../index.css';
import axios from 'axios';
import Blogs from './Blogs';
function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const getLogin = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_DB_URL}/login`, {
        email,
        password
      });
      console.log(response.data);

    if(response.data.sucess){
      localStorage.setItem("user",JSON.stringify(response.data.data))
      window.location.href="/blogs"
      
    }else{
      alert("Login Failed")
    }

      console.log("Login Successful" + response);
      return response.data;


    } catch (e) {
      console.log("Failed to Login " + e);
    }
  };

  return (
    <>
      <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getLogin();
          }}
          className='flex flex-col p-10 m-10 gap-5 border-2 border-black w-[450px] justify-center bg-white rounded-xl shadow-md'
        >
          <div className='text-center text-5xl font-bold mb-4'>Login</div>

          <input
            type="email"
            placeholder='Email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
          />

          <input
            type="password"
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
          />

          <button
            type='submit'
            className='border-2 border-green-400 bg-amber-200 cursor-pointer p-2 rounded-2xl hover:bg-amber-300 transition duration-300'
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
