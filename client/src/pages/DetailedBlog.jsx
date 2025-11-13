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
    } catch (e) {
      console.error("Comments fetch:", e);
    }
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
    } catch (e) {
      console.error(e);
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
        `${apiBase}/blogs/${blogData._id}/comments`,
        { content: newComment, userId: currentUser._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res?.data?.sucess) {
        setComments((s) => [res.data.data, ...s]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Add comment:", err);
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
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      </>
    );
  }

  if (error || !blogData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
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
      <div className="max-w-3xl mx-auto p-6">
        <article className="bg-white rounded-xl shadow p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">{blogData.title}</h1>
          <div className="text-sm text-gray-500 mb-6">
            By {author.name || author.username || author.email || "Unknown"} • {new Date(blogData.createdAt || blogData.publishedAt || blogData.updatedAt).toLocaleDateString()}
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            {blogData.type || "Other"}
          </span>
          <div className="prose prose-lg whitespace-pre-wrap mt-6">{blogData.content}</div>
        </article>

        {currentUser && isPublished && (
          <section className="bg-white rounded-xl shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Comments</h2>

            <form onSubmit={handleAddComment} className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Add a Comment</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                rows="4"
                required
              />
              <button
                type="submit"
                disabled={commentLoading}
                className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {commentLoading ? "Posting..." : "Post Comment"}
              </button>
            </form>

            <div className="space-y-4">
              {comments.length === 0 && <div className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</div>}
              {comments.map((c) => (
                <div key={c._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-800">{c.userId?.username || c.user?.name || "Anonymous"}</div>
                    <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-gray-700">{c.content}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!currentUser && isPublished && (
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
            <p className="text-gray-700 mb-4">Want to join the discussion?</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
            >
              Sign In to Comment
            </button>
          </section>
        )}
      </div>
    </>
  );
}

export default DetailedBlog;