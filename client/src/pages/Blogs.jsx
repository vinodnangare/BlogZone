import React, { useState, useEffect } from 'react';
import '../index.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Blogs() {
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const deleteBlog = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_DB_URL}/blogs/${id}`);
      if (response.data && response.data.sucess) {
        setBlogData((prev) => prev.filter((b) => b._id !== id));
        alert('Blog Deleted Successfully');
      } else {
        alert('Failed to delete blog');
      }
    } catch (error) {
      alert('Failed to delete blog');
    }
  };

  const fetchPublishedBlogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_DB_URL}/published`);
      return res.data && res.data.sucess ? res.data.data : [];
    } catch (e) {
      return [];
    }
  };

  const fetchUserBlogs = async (userId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_DB_URL}/blogs/user/${userId}`);
      return res.data && res.data.sucess ? res.data.data : [];
    } catch (e) {
      return [];
    }
  };

  const loadBlogs = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const [published, myBlogs] = await Promise.all([fetchPublishedBlogs(), fetchUserBlogs(currentUser._id)]);
      const myDrafts = Array.isArray(myBlogs) ? myBlogs.filter((b) => b.state === 'draft') : [];
      const combined = [...(Array.isArray(published) ? published : []), ...myDrafts];
      const uniqueMap = new Map();
      combined.forEach((b) => uniqueMap.set(String(b._id), b));
      const unique = Array.from(uniqueMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBlogData(unique);
    } catch (error) {
      setBlogData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [currentUser]);

  if (!currentUser) return null;
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 gap-6">
        {blogData.map((blog) => {
          const authorId = blog.authorId?._id || blog.authorId;
          const isAuthor = currentUser && authorId && String(authorId) === String(currentUser._id);
          if (blog.state === 'draft' && !isAuthor) return null;

          return (
            <div key={blog._id} className="flex flex-col justify-between bg-white border rounded-lg shadow-sm p-4">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h2 className="text-lg sm:text-xl font-bold">{blog.title}</h2>
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {blog.type || 'Other'}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs ${blog.state === 'published' ? 'bg-green-300' : 'bg-yellow-300'}`}>
                    {blog.state}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  By: {blog.authorId?.username || 'Unknown'}
                </p>
                <p className="text-xs text-gray-500">
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleString() : '—'}
                </p>

                <p className="mt-3 text-sm line-clamp-3 text-gray-700">{blog.content}</p>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => navigate(`/blog/${blog.slug || blog._id}`)}
                  className="w-full sm:w-auto text-center bg-amber-300 hover:bg-amber-400 text-sm py-2 px-3 rounded-lg"
                >
                  Read More
                </button>

                {isAuthor && (
                  <>
                    <button onClick={() => navigate(`/edit/${blog._id}`)} className="w-full sm:w-auto bg-blue-300 hover:bg-blue-350 text-sm py-2 px-3 rounded-lg">
                      Edit
                    </button>
                    <button onClick={() => deleteBlog(blog._id)} className="w-full sm:w-auto bg-red-200 hover:bg-red-300 text-sm py-2 px-3 rounded-lg">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Blogs;
