import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

function DetailedBlog() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const readingTime = useMemo(() => {
    if (!blogData?.content) return null;
    const words = blogData.content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  }, [blogData]);

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
        `${apiBase}/blogs/${blogData._id}/comments`,
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
    return <Loader />;
  }

  if (error || !blogData) {
    return (
      <>
      

        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-red-600 mb-4">{error || "Blog not found"}</div>
          <button onClick={() => navigate("/blogs")} className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
            Back
          </button>
        </div>
      </>
    );
  }

  const author = blogData.author || blogData.authorId || {};
  const isPublished = blogData.state === "published" || blogData.status === "published";
  const isAuthor = currentUser?._id && (author._id === currentUser._id || author.id === currentUser._id);

  const handleShare = (platform) => {
    const url = `${window.location.origin}/#/blog/${blogData.slug || blogData._id}`;
    const title = encodeURIComponent(blogData.title);
    const text = encodeURIComponent(`Check out this article: ${blogData.title}`);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      copy: url,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
      return;
    }

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 pb-16">
        <div className="bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-200 border border-teal-400/40">
                {blogData.type || "Other"}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isPublished ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40" : "bg-amber-500/20 text-amber-100 border border-amber-400/40"
              }`}>
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-white mb-3">{blogData.title}</h1>
            <div className="text-sm text-slate-300 flex flex-wrap gap-3">
              <span>By {author.name || author.username || author.email || "Unknown"}</span>
              <span className="text-slate-500">•</span>
              <span>{new Date(blogData.createdAt || blogData.publishedAt || blogData.updatedAt).toLocaleString()}</span>
              {readingTime && (
                <>
                  <span className="text-slate-500">•</span>
                  <span>{readingTime}</span>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <button
                onClick={() => handleShare("twitter")}
                className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition cursor-pointer"
              >
                Share on Twitter
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition cursor-pointer"
              >
                Share on LinkedIn
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition cursor-pointer"
              >
                Share on WhatsApp
              </button>
              <button
                onClick={() => handleShare("copy")}
                className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition cursor-pointer"
              >
                Copy Link
              </button>
              {isAuthor && (
                <button
                  onClick={() => navigate(`/edit/${blogData._id}`)}
                  className="px-3 py-2 text-sm rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition shadow-sm cursor-pointer"
                >
                  Edit Post
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <article className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
            <div className="prose prose-lg max-w-none text-slate-800 whitespace-pre-wrap leading-relaxed">
              {blogData.content}
            </div>
          </article>

          {isPublished && (
            <div className="mt-10 space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Comments</h2>
              {currentUser ? (
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <form onSubmit={handleAddComment} className="space-y-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                      rows="4"
                      required
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="submit"
                        disabled={commentLoading}
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white rounded-lg transition cursor-pointer"
                      >
                        {commentLoading ? "Posting..." : "Post Comment"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewComment("")}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 space-y-3">
                    {comments.length === 0 && <div className="text-gray-500 text-center py-6">No comments yet.</div>}
                    {comments.map((c) => (
                      <div key={c._id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/80">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-slate-800">{c.userId?.username || c.user?.name || "Anonymous"}</div>
                          <div className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="text-slate-700 whitespace-pre-wrap">{c.content}</div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="bg-teal-50 border border-teal-200 rounded-2xl p-6 text-center">
                  <p className="text-slate-700 mb-3">Want to join the discussion?</p>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg cursor-pointer transition"
                  >
                    Sign In to Comment
                  </button>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DetailedBlog;