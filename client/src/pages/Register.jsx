import React from 'react'
import '../index.css'
import axios from 'axios';
import {useState } from 'react';
import md5 from 'md5';

function Register() {

  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

const RegisterUSer=async(e)=>{
  e.preventDefault();
  try {
      const response = await axios.post(`${import.meta.env.VITE_DB_URL}/register`, {
        username,
        email,
        password: md5(password)
      });
    console.log(response.data);
    
  if(response.data.sucess){
    alert("User Registered Successfully");
    window.location.href="/login"
  }
  else{
    alert("Failed to register user");
  }
  
  }

  catch(e){
    console.log(e);
  }
}

  return (
    <>
  
       
          <div className='flex flex-col gap-5 w-[500px] border-1 border-black p-10 items-center justify-center mx-auto mt-20'>
          <div className='text-center text-5xl'>Register</div>
          
          
            <input type="text" placeholder=' username' name='username' value={username} onChange={(e)=>setUsername(e.target.value)} className='border-1 border-black w-[250px] h-10 rounded-2xl' />
            <input type="email" placeholder=' email' name='email' value={email} onChange={(e)=>setEmail(e.target.value)} className='border-1 border-black w-[250px] h-10 rounded-2xl'/>
            <input type="password" placeholder=' password' name='password' value={password} onChange={(e)=>setPassword(e.target.value)} className='border-1 border-black w-[250px] h-10 rounded-2xl'/>
            <button type='submit' className='border-2 border-amber-200 bg-black text-amber-50 p-1 rounded-2xl p-2 cursor-pointer' onClick={RegisterUSer}>Register</button>
      
    </div>

    </>
  )
}

export default Register