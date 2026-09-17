import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  BookmarkCheck,
  FileCheck,
  BarChart3,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

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

const Sidebar = ({ isCollapsed, mobileOpen, onCloseMobile, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name || 'Alex Morgan';
  const userRole = user?.role || 'Administrator';
  const userInitials = getInitials(userName);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Instructors', path: '/instructors', icon: GraduationCap },
    { name: 'Enrollments', path: '/enrollments', icon: BookmarkCheck },
    { name: 'Assignments & Quizzes', path: '/assignments', icon: FileCheck },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sticky Fixed Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-[#0B2522] text-slate-300 flex flex-col justify-between transition-all duration-300 ease-in-out border-r border-emerald-900/40 select-none ${
          /* Mobile Drawer Positioning */
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${
          /* Desktop Width: Expanded (256px) vs Collapsed Mini (80px) */
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        {/* Floating Toggle Button on Border */}
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="hidden lg:flex absolute -right-3.5 top-[18px] z-50 w-7 h-7 bg-[#10B981] hover:bg-[#059669] text-white rounded-full items-center justify-center shadow-lg border-2 border-[#0B2522] transition-transform duration-200 hover:scale-110 cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Top Header & Navigation Section */}
        <div className="flex flex-col h-full min-h-0 overflow-hidden">
          {/* Header Bar - Exact 64px (h-16) Height for Alignment */}
          <div className="h-16 border-b border-emerald-900/40 px-4 flex items-center shrink-0 justify-between">
            <div
              onClick={() => isCollapsed && onToggleCollapse()}
              className={`flex items-center gap-3 w-full ${
                isCollapsed ? 'justify-center cursor-pointer' : 'justify-start'
              }`}
              title={isCollapsed ? 'Click to expand sidebar' : ''}
            >
              <div className="bg-[#10B981] p-2 rounded-xl text-white shadow-md shadow-emerald-900/30 shrink-0 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden whitespace-nowrap transition-all duration-200">
                  <h1 className="text-lg font-bold text-white tracking-tight leading-none">EduLearn</h1>
                  <p className="text-[10px] text-emerald-400/80 font-medium mt-0.5">ONLINE LEARNING</p>
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links Scrollable Body (Clean no-scrollbar) */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-3 py-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => onCloseMobile && onCloseMobile()}
                  title={isCollapsed ? item.name : ''}
                  className={({ isActive }) =>
                    `flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                      isCollapsed
                        ? 'justify-center w-11 h-11 mx-auto'
                        : 'gap-3.5 px-4 h-11'
                    } ${
                      isActive
                        ? 'bg-[#10B981] text-white font-semibold shadow-md shadow-emerald-600/30'
                        : 'text-slate-300 hover:bg-emerald-900/30 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}

                  {/* Desktop Hover Tooltip in Mini Mode */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50 whitespace-nowrap hidden lg:block">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-emerald-900/40 bg-[#0B2522] shrink-0">
          <div className={`flex items-center rounded-xl bg-emerald-950/40 border border-emerald-800/30 ${
            isCollapsed ? 'justify-center p-2' : 'justify-between p-2.5'
          }`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-[#10B981] text-white flex items-center justify-center font-extrabold text-xs tracking-wider ring-2 ring-emerald-500/50 shrink-0 select-none shadow-xs"
                title={userName}
              >
                {userInitials}
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <p className="text-xs font-semibold text-white truncate">{userName}</p>
                  <p className="text-[11px] text-emerald-400/90 truncate">{userRole}</p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
