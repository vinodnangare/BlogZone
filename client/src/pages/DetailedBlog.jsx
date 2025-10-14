import React from 'react'
import '../index.css';
import { useParams } from 'react-router';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

function DetailedBlog() {

    const {id}=useParams();
   const navigate=useNavigate();
   const [blogData,setBlogData]=useState(null);


    const fetchBlogById=async()=>{
        try{
            const response=await axios.get(`${import.meta.env.VITE_DB_URL}/blogs/${id}`);
            console.log(response.data);
            if(response.data.sucess){
                setBlogData(response.data.data);
            }

        }
        catch(e){
            console.log("Failed to fetch blog by id"+e);
        }   
    }

    useEffect(()=>{
        fetchBlogById();
    },[id])   

  return (
   <>
    <div className='border-2 border-black p-5 m-5'>
    {blogData ? (
      <>
        <h2 className='text-3xl font-bold mb-4'>{blogData.title}</h2>       
        <p className='text-gray-600 mb-4'>By: {blogData.authorId.username} ({blogData.authorId.email})</p>
        <p className='text-gray-800'>{blogData.content}</p>
      </>   
    ) : (
      <p>Loading blog...</p>
    )}
    </div>
   
   
   </>
  )
}

export default DetailedBlog