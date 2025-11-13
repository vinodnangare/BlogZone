import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('Technology');
  const [state, setState] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBase = import.meta.env.VITE_DB_URL || '';

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${apiBase}/blogs/${id}`);
        if (res?.data?.sucess && res.data.data) {
          const blog = res.data.data;
          setTitle(blog.title);
          setContent(blog.content);
          setType(blog.type || 'Technology');
          setState(blog.state || 'draft');
          setError(null);
        } else {
          setError('Blog not found');
        }
      } catch {
        setError('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id, apiBase]);

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    try {
      const res = await axios.patch(
        `${apiBase}/edit/${id}`,
        { title, content, type, state },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && res.data.sucess) {
        alert(`Blog updated and ${state === 'published' ? 'published' : 'saved as draft'} successfully`);
        navigate('/blogs');
      } else {
        alert(res.data?.message || 'Failed to update blog');
      }
    } catch {
      alert('Error updating blog');
    }
  };

  if (loading) return <><div className="min-h-screen flex items-center justify-center">Loading...</div></>;
  if (error) return <><div className="min-h-screen flex flex-col items-center justify-center px-4"><div className="text-red-600 mb-4">{error}</div><button onClick={() => navigate('/blogs')} className="px-4 py-2 bg-blue-500 text-white rounded">Back</button></div></>;

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Edit Blog</h1>
          <form onSubmit={handleUpdateBlog} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter blog title" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Blog Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Technology">Technology</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Animal">Animal</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select value={state} onChange={(e) => setState(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Content</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your blog content here..." className="w-full p-3 border rounded-lg h-48 sm:h-64 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                {state === 'published' ? 'Publish Blog' : 'Save as Draft'}
              </button>
              <button type="button" onClick={() => navigate('/blogs')} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditBlog;