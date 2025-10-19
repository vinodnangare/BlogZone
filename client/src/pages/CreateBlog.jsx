import React, { useState } from 'react';
import axios from 'axios';
import '../index.css';

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [state, setState] = useState("draft");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const authorId = user._id;

    try {
      const response = await axios.post(`${import.meta.env.VITE_DB_URL}/blogs`, {
        title,
        content,
        state,
        authorId
      });

      if (response.data.sucess) {
        alert("Blog Created Successfully");
        window.location.href = "/blogs";
      } else {
        alert("Failed to create blog");
      }
    } catch (error) {
      console.log("Failed to create blog", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-2xl border border-gray-300">
      <h1 className="text-2xl font-semibold mb-4 text-center">Create New Blog</h1>

      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-400 px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500"
      />

      <textarea
        placeholder="Write your blog content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="6"
        className="w-full border border-gray-400 px-4 py-2 mt-4 rounded-xl focus:outline-none focus:border-blue-500"
      ></textarea>

      <select
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="w-full border border-gray-400 px-4 py-2 mt-4 rounded-xl focus:outline-none focus:border-blue-500"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-medium transition-all cursor-pointer"
      >
        Create Blog
      </button>
    </div>
  );
}

export default CreateBlog;
