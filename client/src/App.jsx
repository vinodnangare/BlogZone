import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'
import Navbar from './components/Navbar.jsx'
import { useNavigate } from 'react-router'

function App() {
  const [publishedBlogs, setPublishedBlogs] = useState([])
  const navigate = useNavigate()

  const fetchPublishedBlogs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DB_URL}/published`)
      console.log(response.data)
      if (response.data.sucess) {
        setPublishedBlogs(response.data.data)
      } else {
        alert('Failed to fetch published blogs')
      }
    } catch (e) {
      console.log('Failed to fetch published blogs')
    }
  }

  useEffect(() => {
    fetchPublishedBlogs()
  }, [])

  return (
    <>
      <Navbar />

      {publishedBlogs.map((blog) => (
        <div key={blog._id} className="border-2 border-black p-5 m-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold static ">{blog.title}</h2>
            <p className="text-gray-800 border-2 border-amber-200 w-fit px-2 py-0 rounded-2xl bg-green-400 text-[10px]">
              {blog.state}
            </p>
          </div>

          <p className="text-gray-600">
            By: {blog.authorId.username} ({blog.authorId.email})
          </p>

          <div className="flex flex-row-reverse relative mt-0 "></div>

          <div>
            <button
              className="mt-3 p-2 bg-amber-300 rounded-[10px] cursor-pointer"
              onClick={() => navigate(`blog/${blog._id}`)}
            >
              Read More
            </button>
          </div>
        </div>
      ))}
    </>
  )
}

export default App
