import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  X,
  Check,
  Trash2,
  Sparkles,
  BookOpen,
  User,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  GraduationCap,
  FileText,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import { toast } from 'react-toastify';

const getInitials = (name = '') => {
  if (!name) return 'AM';
  const parts = name.trim().split(' ').filter(Boolean);
  const cleanParts = parts.filter(
    (p) => !['dr.', 'dr', 'mr.', 'mr', 'mrs.', 'mrs', 'prof.', 'prof'].includes(p.toLowerCase())
  );
  const targetParts = cleanParts.length > 0 ? cleanParts : parts;
  if (targetParts.length === 1) {
    return targetParts[0].substring(0, 2).toUpperCase();
  }
  const first = targetParts[0]?.[0] || '';
  const last = targetParts[targetParts.length - 1]?.[0] || '';
  return (first + last).toUpperCase() || 'AM';
};

const getActivityBadge = (item) => {
  const type = (item.type || '').toLowerCase();
  const title = (item.title || '').toLowerCase();

  if (title.includes('removed') || title.includes('deleted')) {
    return {
      icon: <Trash2 className="w-4 h-4 text-rose-600" />,
      bg: 'bg-rose-100 border-rose-200 text-rose-700'
    };
  }

  if (title.includes('updated') || title.includes('edited') || title.includes('profile')) {
    return {
      icon: <FileText className="w-4 h-4 text-amber-600" />,
      bg: 'bg-amber-100 border-amber-200 text-amber-700'
    };
  }

  if (type === 'instructor') {
    return {
      icon: <GraduationCap className="w-4 h-4 text-purple-600" />,
      bg: 'bg-purple-100 border-purple-200 text-purple-700'
    };
  }

  if (type === 'course') {
    return {
      icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
      bg: 'bg-emerald-100 border-emerald-200 text-emerald-700'
    };
  }

  if (type === 'enrollment') {
    return {
      icon: <UserCheck className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-100 border-blue-200 text-blue-700'
    };
  }

  if (type === 'assignment' || type === 'quiz') {
    return {
      icon: <Award className="w-4 h-4 text-indigo-600" />,
      bg: 'bg-indigo-100 border-indigo-200 text-indigo-700'
    };
  }

  return {
    icon: <User className="w-4 h-4 text-emerald-600" />,
    bg: 'bg-emerald-100 border-emerald-200 text-emerald-700'
  };
};

const Navbar = ({ onOpenMobile }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery, activities = [], removeActivity, clearActivities } = useLMS();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadList, setUnreadList] = useState([1, 2, 3]);

  const navRef = useRef(null);

  const userName = user?.name || 'Alex Morgan';
  const userRole = user?.role || 'Administrator';
  const userInitials = getInitials(userName);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setUnreadList([]);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const unreadCount = unreadList.length;

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
        <div className="flex items-center gap-3 sm:gap-4 relative" ref={navRef}>
          {/* Notification Bell Button */}
          <button
            onClick={() => {
              setShowProfileMenu(false);
              setShowNotifications(!showNotifications);
            }}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#10B981] border-2 border-white rounded-full animate-pulse" />
            )}
          </button>

          {/* Notification Popover Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-emerald-400 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {activities.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">No recent notifications</p>
                  </div>
                ) : (
                  activities.map((item, idx) => {
                    const isUnread = unreadList.includes(item.id || idx);
                    const badge = getActivityBadge(item);
                    return (
                      <div
                        key={item.id || idx}
                        className={`p-3.5 flex items-start gap-3 transition-colors group ${
                          isUnread ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-2 rounded-xl border shrink-0 ${badge.bg}`}>
                          {badge.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                          <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{item.detail}</p>
                          <span className="text-[10px] text-slate-400 font-medium block mt-1">
                            {item.time || 'Just now'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {isUnread && (
                            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeActivity(item.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {activities.length > 0 && (
                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={clearActivities}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Activity History
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile Badge Button */}
          <button
            onClick={() => {
              setShowNotifications(false);
              setShowProfileMenu(!showProfileMenu);
            }}
            className="flex items-center gap-3 pl-1 hover:bg-slate-50 p-1.5 rounded-2xl transition-colors cursor-pointer select-none"
            title="User Account Menu"
          >
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0B2522] via-[#047857] to-[#10B981] text-white flex items-center justify-center font-extrabold text-xs tracking-wider shadow-xs ring-2 ring-emerald-500/30 shrink-0"
            >
              {userInitials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                {userName}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </p>
              <p className="text-[11px] text-slate-500 font-medium">{userRole}</p>
            </div>
          </button>

          {/* User Profile Popover Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0B2522] via-[#047857] to-[#10B981] text-white flex items-center justify-center font-black text-sm tracking-wider ring-2 ring-emerald-500/40 shrink-0 select-none">
                  {userInitials}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{userName}</p>
                  <p className="text-[11px] text-emerald-400 truncate">{user?.email || 'user@edulearn.com'}</p>
                  <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md text-[10px] font-semibold mt-1">
                    {userRole}
                  </span>
                </div>
              </div>

              {/* Profile Menu Actions */}
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  My Profile
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-emerald-600" />
                  Account Settings
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
