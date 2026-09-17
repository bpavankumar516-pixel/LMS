import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';

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

const Navbar = ({ onOpenMobile }) => {
  const { user } = useAuth();
  const { searchQuery, setSearchQuery } = useLMS();

  const userName = user?.name || 'Alex Morgan';
  const userRole = user?.role || 'Administrator';
  const userInitials = getInitials(userName);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 lg:px-8 flex items-center shadow-2xs">
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Left Side: Mobile Drawer Button & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {/* Mobile Menu Button */}
          <button
            onClick={onOpenMobile}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden focus:outline-hidden cursor-pointer"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses, students, instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#10B981] focus:bg-white focus:ring-2 focus:ring-[#10B981]/20 transition-all"
            />
          </div>
        </div>

        {/* Right Side: Notifications & Profile Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#10B981] border-2 border-white rounded-full"></span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile Badge (Name-Based Initials Avatar - No Image) */}
          <div className="flex items-center gap-3 pl-1 cursor-default">
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0B2522] via-[#047857] to-[#10B981] text-white flex items-center justify-center font-extrabold text-xs tracking-wider shadow-xs ring-2 ring-emerald-500/30 select-none shrink-0"
              title={userName}
            >
              {userInitials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{userName}</p>
              <p className="text-[11px] text-slate-500 font-medium">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
