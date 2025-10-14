import React from 'react'
import axios from 'axios'
import './index.css'
import { useState,useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import { useNavigate } from 'react-router'


function App() {
const[publishedBlogs,setPublishedBlogs]=useState([]);

const fetchPublishedBlogs=async()=>{
  try{
    const response=await axios.get(`${import.meta.env.VITE_DB_URL}/published`);
    console.log(response.data);
    if(response.data.sucess){
      setPublishedBlogs(response.data.data);
      
    }
    else{
      alert("Failed to fetch published blogs")
    }

  }
catch(e){
    console.log("Failed to fetch published blogs")
}


}

const navigate=useNavigate();

 useEffect(() => {
    fetchPublishedBlogs();
  }, []); 
  return (
    <>
    <Navbar />


{publishedBlogs.map((blog)=>(
  <div>
  <div key={blog._id} className='border-2 border-black p-5 m-5'>
    <h2 className='text-2xl font-bold'>{blog.title}</h2>
    <p className='text-gray-600'>By: {blog.authorId.username} ({blog.authorId.email})</p>
      <div>
    <button className='mt-3 p-2 bg-amber-300 rounded-[10px] cursor-pointer' onClick={()=>navigate(`blog/${blog._id}`)}  >Read More</button>
  </div>

  </div>

  </div>
 
))}
    </>
  )
}

export default App