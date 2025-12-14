import React, { useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('Technology');
  const [state, setState] = useState('draft');
  const [loading, setLoading] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_DB_URL}/blogs`,
        { title, content, type, state },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data && res.data.sucess) {
        alert(`Blog ${state === 'published' ? 'published' : 'saved as draft'} successfully`);
        navigate('/blogs');
      } else {
        alert(res.data?.message || 'Failed to create blog');
      }
    } catch {
      alert('Error creating blog');
    }
    finally {
      setLoading(false);
    }
  };

  const titleLen = title.trim().length;
  const contentLen = content.trim().length;
  const preview = useMemo(() => ({
    title: title || 'Untitled Post',
    content: content || 'Start writing your story...'
  }), [title, content]);

  const renderMarkdown = (text) => {
    if (!text) return '';
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const withBold = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const withItalic = withBold.replace(/\*(.+?)\*/g, '<em>$1</em>');
    return withItalic.replace(/\n/g, '<br />');
  };

  const applyWrap = (prefix, suffix) => {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const before = content.slice(0, start);
    const selected = content.slice(start, end) || 'text';
    const after = content.slice(end);
    const next = `${before}${prefix}${selected}${suffix}${after}`;
    setContent(next);
    // Restore selection inside wrapped text
    setTimeout(() => {
      const pos = before.length + prefix.length;
      el.focus();
      el.setSelectionRange(pos, pos + selected.length);
    }, 0);
  };

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-10 h-48 w-48 bg-teal-200/40 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -left-10 h-56 w-56 bg-cyan-200/40 blur-3xl rounded-full" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Create Blog</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8">
              <form onSubmit={handleCreateBlog} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white focus:shadow-[0_10px_35px_rgba(45,212,191,0.15)]"
                required
              />
              <div className="mt-2 text-xs text-slate-500">{titleLen} characters</div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Blog Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Technology">Technology</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Animal">Animal</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </select>
              <p className="mt-2 text-xs text-slate-500">Choose the category that best fits your story.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <p className="mt-2 text-xs text-slate-500">Drafts are private; published posts are publicly visible.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Content</label>
              <div className="flex items-center gap-2 mb-2">
                <button type="button" onClick={() => applyWrap('**','**')} className="px-2.5 py-1 text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer">Bold</button>
                <button type="button" onClick={() => applyWrap('*','*')} className="px-2.5 py-1 text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer">Italic</button>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content here..."
                className="w-full p-3 border border-slate-200 rounded-xl h-64 sm:h-72 focus:outline-none focus:ring-2 focus:ring-teal-500 transition bg-white"
                ref={contentRef}
                required
              />
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>{contentLen} characters</span>
                <span>Tip: Write clearly; paragraphs help readability.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 font-semibold shadow-lg shadow-teal-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 transform duration-150"
              >
                {loading ? 'Saving...' : state === 'published' ? 'Publish Blog' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Live Preview</h2>
              <article className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">{type}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${state === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{state}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{preview.title}</h3>
                <div
                  className="text-slate-700 leading-relaxed border-t pt-3 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(preview.content) }}
                />
              </article>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateBlog;
