import React from 'react';
import { useAuth } from '../../context/AuthContext';

const getInitials = (name = '') => {
  if (!name) return 'AM';
  const parts = name.trim().split(' ').filter(Boolean);
  const cleanParts = parts.filter((p) => !['dr.', 'dr', 'mr.', 'mr', 'mrs.', 'mrs', 'prof.', 'prof'].includes(p.toLowerCase()));
  const targetParts = cleanParts.length > 0 ? cleanParts : parts;
  if (targetParts.length === 1) {
    return targetParts[0].substring(0, 2).toUpperCase();
  }
  const first = targetParts[0]?.[0] || '';
  const last = targetParts[targetParts.length - 1]?.[0] || '';
  return (first + last).toUpperCase() || 'AM';
};

const Settings = () => {
  const { user } = useAuth();
  const userName = user?.name || 'Alex Morgan';
  const userInitials = getInitials(userName);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage platform preferences & account details</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 max-w-2xl">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">User Profile</h3>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0B2522] via-[#047857] to-[#10B981] text-white flex items-center justify-center font-extrabold text-xl tracking-wider ring-4 ring-[#10B981]/20 shadow-md select-none shrink-0"
            title={userName}
          >
            {userInitials}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{userName}</h4>
            <p className="text-xs text-slate-500">{user?.email || 'alex@edulearn.com'}</p>
            <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-semibold text-[10px] rounded-full mt-1">{user?.role || 'Administrator'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
