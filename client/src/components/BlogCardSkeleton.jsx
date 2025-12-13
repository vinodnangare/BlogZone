import React from 'react';

function BlogCardSkeleton() {
  return (
    <article className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full animate-pulse">
      {/* Card Header */}
      <div className="h-2 bg-slate-200"></div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title and Status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
        </div>

        {/* Badge */}
        <div className="h-6 w-24 bg-slate-200 rounded-lg mb-3"></div>

        {/* Content Preview */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>

        {/* Meta Info */}
        <div className="space-y-2 border-t pt-3 mb-4">
          <div className="h-3 bg-slate-200 rounded w-32"></div>
          <div className="h-3 bg-slate-200 rounded w-40"></div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-slate-200 rounded-lg"></div>
          <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    </article>
  );
}

export default BlogCardSkeleton;
