import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function DetailedBlog() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("user"));
  } catch {
    currentUser = null;
  }

  const apiBase = import.meta.env.VITE_DB_URL || import.meta.env.VITE_API_URL || "";

  const fetchCommentsById = async (id) => {
    if (!id) return;
    try {
      const res = await axios.get(`${apiBase}/blogs/${id}/comments`);
      if (res?.data?.sucess) setComments(res.data.data);
    } catch {}
  };

  const fetchBySlugOrId = async (value) => {
    if (!value) return;
    setLoading(true);
    try {
      let res = null;
      if (apiBase) {
        res = await axios.get(`${apiBase}/blogs/slug/${value}`).catch(() => null);
      }
      if (res?.data?.sucess && res.data.data) {
        setBlogData(res.data.data);
        fetchCommentsById(res.data.data._id);
        setError(null);
        return;
      }
      if (apiBase) {
        res = await axios.get(`${apiBase}/blogs/${value}`).catch(() => null);
      }
      if (res?.data?.sucess && res.data.data) {
        setBlogData(res.data.data);
        fetchCommentsById(res.data.data._id);
        setError(null);
        return;
      }
      setError("Blog not found");
    } catch {
      setError("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUser || !blogData) {
      alert("Login to comment");
      return;
    }
    if (!newComment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    setCommentLoading(true);
    try {
      const res = await axios.post(
        `${apiBase}/blogs/${blogData._1d || blogData._id}/comments`,
        { content: newComment, userId: currentUser._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res?.data?.sucess) {
        setComments((s) => [res.data.data, ...s]);
        setNewComment("");
      }
    } catch {
      alert("Failed to post comment");
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchBySlugOrId(slug);
  }, [slug]);

  if (loading) {
    return (
      <>
        
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      </>
    );
  }

  if (error || !blogData) {
    return (
      <>
      

        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-red-600 mb-4">{error || "Blog not found"}</div>
          <button onClick={() => navigate("/blogs")} className="px-4 py-2 bg-blue-500 text-white rounded">
            Back
          </button>
        </div>
      </>
    );
  }

  const author = blogData.author || blogData.authorId || {};
  const isPublished = blogData.state === "published" || blogData.status === "published";

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <article className="bg-white rounded-xl shadow p-6 sm:p-8 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{blogData.title}</h1>
          <div className="text-sm text-gray-500 mb-4">
            By {author.name || author.username || author.email || "Unknown"} • {new Date(blogData.createdAt || blogData.publishedAt || blogData.updatedAt).toLocaleDateString()}
          </div>
          <div className="mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">{blogData.type || "Other"}</span>
          </div>
          <div className="prose prose-lg whitespace-pre-wrap">{blogData.content}</div>
        </article>

        {isPublished && (
          <>
            {currentUser ? (
              <section className="bg-white rounded-xl shadow p-6 sm:p-8 mb-6">
                <h2 className="text-xl font-bold mb-4">Comments</h2>
                <form onSubmit={handleAddComment} className="mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    rows="4"
                    required
                  />
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <button type="submit" disabled={commentLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                      {commentLoading ? "Posting..." : "Post Comment"}
                    </button>
                    <button type="button" onClick={() => setNewComment('')} className="px-4 py-2 bg-gray-200 rounded-lg">
                      Clear
                    </button>
                  </div>
                </form>

                <div className="space-y-4">
                  {comments.length === 0 && <div className="text-gray-500 text-center py-6">No comments yet.</div>}
                  {comments.map((c) => (
                    <div key={c._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-800">{c.userId?.username || c.user?.name || "Anonymous"}</div>
                        <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-gray-700">{c.content}</div>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <section className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <p className="text-gray-700 mb-3">Want to join the discussion?</p>
                <button onClick={() => navigate("/login")} className="px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer">
                  Sign In to Comment
                </button>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default DetailedBlog;