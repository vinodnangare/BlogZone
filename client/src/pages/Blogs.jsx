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

  const fetchPublishedBlogs = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_DB_URL}/published`);
      return res.data && res.data.sucess ? res.data.data : [];
    } catch {
      return [];
    }
  };

  const fetchUserBlogs = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${import.meta.env.VITE_DB_URL}/blogs/user/${userId}`, { headers });
      return res.data && res.data.sucess ? res.data.data : [];
    } catch {
      return [];
    }
  };

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const published = await fetchPublishedBlogs();
      let combined = Array.isArray(published) ? published : [];

      if (currentUser && currentUser._id) {
        const myBlogs = await fetchUserBlogs(currentUser._id);
        const myDrafts = Array.isArray(myBlogs) ? myBlogs.filter((b) => b.state === 'draft') : [];
        combined = [...combined, ...myDrafts];
      }

      const uniqueMap = new Map();
      combined.forEach((b) => uniqueMap.set(String(b._id), b));
      const unique = Array.from(uniqueMap.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBlogData(unique);
    } catch {
      setBlogData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [currentUser]);

  const deleteBlog = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized');
      return;
    }
    try {
      const res = await axios.delete(`${import.meta.env.VITE_DB_URL}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && res.data.sucess) {
        setBlogData((prev) => prev.filter((b) => b._id !== id));
      } else {
        alert(res.data?.message || 'Failed to delete');
      }
    } catch {
      alert('Failed to delete');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        {blogData.map((blog) => {
          const authorId = blog.authorId?._id || blog.authorId;
          const isAuthor = currentUser && authorId && String(authorId) === String(currentUser._id);
          if (blog.state === 'draft' && !isAuthor) return null;

          return (
            <article key={blog._id} className="bg-white border rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h2 className="text-xl font-bold">{blog.title}</h2>
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {blog.type || 'Other'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">By: {blog.authorId?.username || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{blog.createdAt ? new Date(blog.createdAt).toLocaleString() : '—'}</p>
                  <p className="mt-3 text-sm text-gray-700 line-clamp-3">{blog.content}</p>
                </div>
                <div className={`ml-4 text-xs ${blog.state === 'published' ? 'bg-green-200' : 'bg-yellow-200'} px-2 py-1 rounded-md`}>
                  {blog.state}
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button onClick={() => navigate(`/blog/${blog.slug || blog._id}`)} className="w-full sm:w-auto bg-amber-300 hover:bg-amber-400 text-sm py-2 px-3 rounded-lg">
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
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default Blogs;
