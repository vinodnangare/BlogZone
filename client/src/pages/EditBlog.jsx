import React, { useEffect, useState } from 'react'
import '../index.css';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [state, setState] = useState('draft');

  const fetchBlogForEdit = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_DB_URL}/blogs/${id}`);
      if (response.data.sucess) {
        const blog = response.data.data;
        setTitle(blog.title || '');
        setContent(blog.content || '');
        setState(blog.state || 'draft');
      } else {
        alert('Failed to fetch blog for edit');
      }
    } catch (err) {
      console.error('fetchBlogForEdit error', err);
      alert('Failed to fetch blog');
    }
  }

  useEffect(() => {
    fetchBlogForEdit();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, content, state };
       const response = await axios.patch(`${import.meta.env.VITE_DB_URL}/edit/${id}`, payload);
      if (response.data.sucess) {
        navigate(`/blog/${id}`);
      } else {
        alert('Update failed');
      }
    } catch (err) {
      console.error('update error', err);
      alert('Update error');
    }
  }

  return (
    <>
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2" />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" rows={8} className="border p-2" />
          <select value={state} onChange={e => setState(e.target.value)} className="border p-2 w-40">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <div>
            <button type="submit" className="mt-3 p-2 bg-amber-300 rounded-[10px] cursor-pointer">Save</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EditBlog