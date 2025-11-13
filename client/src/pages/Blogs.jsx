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
      const response = await axios.delete(
        `${import.meta.env.VITE_DB_URL}/blogs/${id}`
      );
      if (response.data && response.data.sucess) {
        setBlogData((prev) => prev.filter((b) => b._id !== id));
        alert('Blog Deleted Successfully');
      } else {
        alert('Failed to delete blog');
      }
    } catch (error) {
      console.error('Delete failed:', error);
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
      const res = await axios.get(
        `${import.meta.env.VITE_DB_URL}/blogs/user/${userId}`
      );
      return res.data && res.data.sucess ? res.data.data : [];
    } catch (e) {
      return [];
    }
  };

  const loadBlogs = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const [published, myBlogs] = await Promise.all([
        fetchPublishedBlogs(),
        fetchUserBlogs(currentUser._id),
      ]);

      const myDrafts = Array.isArray(myBlogs)
        ? myBlogs.filter((b) => b.state === 'draft')
        : [];
      const combined = [
        ...(Array.isArray(published) ? published : []),
        ...myDrafts,
      ];

      const uniqueMap = new Map();
      combined.forEach((b) => uniqueMap.set(String(b._id), b));
      const unique = Array.from(uniqueMap.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setBlogData(unique);
    } catch (error) {
      console.error('Load failed:', error);
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
    <>
      
      {blogData.map((blog) => {
        const authorId = blog.authorId?._id || blog.authorId;
        const isAuthor =
          currentUser && authorId && String(authorId) === String(currentUser._id);

        if (blog.state === 'draft' && !isAuthor) return null;

        return (
          <div
            key={blog._id}
            className="border border-black p-5 m-5 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{blog.title}</h2>
                <div className="mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {blog.type || 'Other'}
                  </span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-md text-xs ${
                  blog.state === 'published' ? 'bg-green-300' : 'bg-yellow-300'
                }`}
              >
                {blog.state}
              </span>
            </div>

            <p className="text-xs text-gray-500">
              By: {blog.authorId?.username} ({blog.authorId?.email})
            </p>
            <p className="text-xs text-gray-500">
              Created At:{' '}
              {blog.createdAt ? new Date(blog.createdAt).toLocaleString() : '—'}
            </p>

            <div className="mt-3 space-x-2">
              <button
                onClick={() => {
                  console.log('Navigating to blog:', blog.slug || blog._id);
                  navigate(`/blog/${blog.slug || blog._id}`);
                }}
                className="mt-3 p-2 bg-amber-300 rounded-lg cursor-pointer"
              >
                Read More
              </button>

              {isAuthor && (
                <>
                  <button
                    className="px-3 py-1 bg-blue-300 rounded-lg cursor-pointer"
                    onClick={() => navigate(`/edit/${blog._id}`)}
                  >
                    Edit Blog
                  </button>
                  <button
                    className="px-3 py-1 bg-red-200 rounded-lg border border-red-400 cursor-pointer"
                    onClick={() => deleteBlog(blog._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Blogs;
