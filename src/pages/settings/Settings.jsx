import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage platform preferences & account details</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 max-w-2xl">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">User Profile</h3>
        <div className="flex items-center gap-4">
          <img src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} alt="Avatar" className="w-16 h-16 rounded-full object-cover ring-2 ring-[#10B981]" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">{user?.name || 'Vimal S'}</h4>
            <p className="text-xs text-slate-500">{user?.email || 'vimal@edulearn.com'}</p>
            <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-semibold text-[10px] rounded-full mt-1">{user?.role || 'Admin'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
