import React, { useState, useEffect } from 'react';
import '../index.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BlogCardSkeleton from '../components/BlogCardSkeleton';

function Blogs() {
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const blogTypes = ['All', 'Technology', 'Health', 'Education', 'Travel', 'Animal', 'Lifestyle', 'Business', 'Other'];

  const filteredData = filterType === 'All'
    ? blogData
    : blogData.filter((blog) => blog.type === filterType);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const deleteBlog = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized');
      return;
    }
    const confirmDelete = window.confirm('Delete this blog? This cannot be undone.');
    if (!confirmDelete) return;
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

  const handleShare = (blog, platform) => {
    const url = `${window.location.origin}/blog/${blog.slug || blog._id}`;
    const title = encodeURIComponent(blog.title);
    const text = encodeURIComponent(`Check out this article: ${blog.title}`);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      copy: url,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-16 border-b border-slate-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Explore Articles</h1>
          <p className="text-slate-400 text-lg">Discover insights, stories, and ideas from our community</p>
        </div>
      </div>

      <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Filter by:</span>
            <div className="flex gap-2">
              {blogTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    filterType === type
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No blogs found</p>
            <p className="text-gray-400 text-sm mt-1">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((blog) => {
              const authorId = blog.authorId?._id || blog.authorId;
              const isAuthor = currentUser && authorId && String(authorId) === String(currentUser._id);
              if (blog.state === 'draft' && !isAuthor) return null;

              return (
                <article
                  key={blog._id}
                  className="group bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                >
                  <div className="h-2 bg-gradient-to-r from-teal-500 to-cyan-500"></div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors duration-200 line-clamp-2 flex-1">
                        {blog.title}
                      </h2>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                          blog.state === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {blog.state}
                      </span>
                    </div>

                    <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg text-xs font-semibold mb-3 w-fit">
                      {blog.type || 'Other'}
                    </span>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">{blog.content}</p>

                    <div className="space-y-1 text-xs text-gray-500 border-t pt-3 mb-4">
                      <p className="font-semibold text-gray-700">By {blog.authorId?.username || 'Unknown'}</p>
                      <p>
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'}
                      </p>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => navigate(`/blog/${blog.slug || blog._id}`)}
                        className="flex-1 bg-teal-500 hover:bg-teal-600 text-white text-sm py-2.5 px-4 rounded-lg font-medium transition-all duration-200 shadow-sm cursor-pointer"
                      >
                        Read Article
                      </button>
                      {isAuthor && (
                        <>
                          <button
                            onClick={() => navigate(`/edit/${blog._id}`)}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg font-medium transition-colors duration-200 cursor-pointer"
                            title="Edit blog"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteBlog(blog._id)}
                            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm rounded-lg font-medium transition-colors duration-200 cursor-pointer"
                            title="Delete blog"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">Share:</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleShare(blog, 'twitter')}
                          className="p-1.5 hover:bg-slate-100 rounded transition-colors duration-200 cursor-pointer"
                          title="Share on Twitter"
                        >
                          <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleShare(blog, 'linkedin')}
                          className="p-1.5 hover:bg-slate-100 rounded transition-colors duration-200 cursor-pointer"
                          title="Share on LinkedIn"
                        >
                          <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleShare(blog, 'facebook')}
                          className="p-1.5 hover:bg-slate-100 rounded transition-colors duration-200 cursor-pointer"
                          title="Share on Facebook"
                        >
                          <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleShare(blog, 'whatsapp')}
                          className="p-1.5 hover:bg-slate-100 rounded transition-colors duration-200 cursor-pointer"
                          title="Share on WhatsApp"
                        >
                          <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleShare(blog, 'copy')}
                          className="p-1.5 hover:bg-slate-100 rounded transition-colors duration-200 cursor-pointer"
                          title="Copy link"
                        >
                          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Blogs;
