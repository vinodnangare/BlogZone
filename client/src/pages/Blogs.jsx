import React from 'react'
import '../index.css';
import axios from 'axios';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router';

function Blogs() {
const navigate=useNavigate();
const [blogData,setBlogData]=useState([]);
if(!localStorage.getItem("user")){
  window.location.href="/login"
}


const blogs=JSON.parse(localStorage.getItem("user"));
const slug=blogs._id;

console.log(slug)


const deleteBlog=async(id)=>{
  try{
    const response=await axios.delete(`${import.meta.env.VITE_DB_URL}/blogs/${id}`);
    console.log(response.data);
    if(response.data.sucess){
      alert("Blog Deleted Successfully");
      window.location.reload();
    }
    else{
      alert("Failed to delete blog");
    }
  }
  catch(e){
    console.log("Failed to delete blog"+e);
  }
}

const fetchBlogs=async()=>{
  try{
    const response=await axios.get(`${import.meta.env.VITE_DB_URL}/blogs/user/${slug}`);
    console.log(response.data);
      if(response.data.sucess)  {
    setBlogData(response.data.data);
  }
  }


  catch(e){
    console.log("Failed to fetch blogs"+e); 
  }
}

useEffect(()=>{
  fetchBlogs();
},[]) 


  return (
  <>
  <h1>All Blogs</h1>

{blogData.map((blog)=>(
  <div key={blog._id} className='border border-black p-5 m-5 rounded-lg shadow-md'>
  <div className='flex justify-between items-center ' >
    <h2 className='text-2xl font-bold mb-2'>{blog.title}</h2> 
    {blog.state==="published" ? <p className=' py-1 px-2 border-[1px] border-amber-200 bg-green-300 rounded-[10px] text-[10px] '>{blog.state}</p> :
  <p className=' py-1 px-2 border-[1px] border-amber-200 bg-yellow-300 rounded-[10px] text-[10px] '>{blog.state}</p>
}

    </div>

    <p className='text-sm text-gray-500'>By: {blog.authorId.username} ({blog.authorId.email})</p>
    <p className='text-sm text-gray-500'>Created At: {new Date(blog.createdAt).toLocaleString()}</p>
    <button className='bg-red-200 cursor-pointer rounded-2xl p-2 border-2 border-green-400' onClick={()=>deleteBlog(blog._id)}>Delete</button>
    <button className='mt-3 p-2 bg-amber-300 rounded-[10px] cursor-pointer' onClick={()=>navigate(`/blog/${blog._id}`)}  >Read More</button>
  </div>
))}
  </>
  )
}

export default Blogs