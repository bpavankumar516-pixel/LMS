import React from 'react';

const SkeletonLoader = ({ type = 'table', count = 3 }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
            <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-slate-100 rounded-md w-full" />
              <div className="h-3 bg-slate-100 rounded-md w-5/6" />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div className="h-6 bg-slate-200 rounded-full w-20" />
              <div className="h-8 bg-slate-200 rounded-xl w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse mb-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-slate-100 rounded-md w-1/2" />
              <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: Table skeleton
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 animate-pulse space-y-4">
      <div className="h-8 bg-slate-200 rounded-xl w-1/3 mb-6" />
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-slate-200 rounded-md w-1/3" />
              <div className="h-3 bg-slate-100 rounded-md w-1/4" />
            </div>
          </div>
          <div className="h-6 bg-slate-200 rounded-full w-24 shrink-0" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
