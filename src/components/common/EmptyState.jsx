import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No Data Found',
  description = 'There are no items matching your criteria at the moment.',
  actionButtonText = '',
  onActionClick = null
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs flex flex-col items-center justify-center my-6">
      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4 ring-8 ring-slate-50">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionButtonText && onActionClick && (
        <button
          onClick={onActionClick}
          className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
        >
          {actionButtonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
