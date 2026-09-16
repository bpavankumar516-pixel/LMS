import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  GraduationCap,
  BookmarkCheck,
  PlusCircle,
  UserPlus,
  UserCheck,
  FilePlus,
  ArrowUpRight,
  Clock,
  Video,
  X,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, activities, upcomingClasses, addActivity } = useLMS();

  // Quick Action Modal states
  const [modalType, setModalType] = useState(null); // 'course' | 'student' | 'instructor' | 'assignment' | null
  const [formData, setFormData] = useState({ name: '', title: '', email: '' });

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleQuickAction = (type) => {
    setFormData({ name: '', title: '', email: '' });
    setModalType(type);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'course') {
      addActivity('New Course Added', formData.title || 'React Web Development', 'course');
      toast.success(`Course "${formData.title || 'React Web Development'}" created successfully!`);
    } else if (modalType === 'student') {
      addActivity('New Student Registered', formData.name || 'Ananya Sharma', 'user');
      toast.success(`Student "${formData.name || 'Ananya Sharma'}" registered!`);
    } else if (modalType === 'instructor') {
      addActivity('New Instructor Added', formData.name || 'Prof. Rajesh Rao', 'instructor');
      toast.success(`Instructor "${formData.name || 'Prof. Rajesh Rao'}" added!`);
    } else if (modalType === 'assignment') {
      addActivity('New Assignment Created', formData.title || 'JavaScript Quiz #1', 'assignment');
      toast.success(`Assignment "${formData.title || 'JavaScript Quiz #1'}" published!`);
    }
    setModalType(null);
  };

  const handleJoinClass = (title) => {
    toast.info(`Joining live session: ${title}...`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Alex'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's what's happening with your learning platform today.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {currentDateStr}
          </div>
          <button className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors">
            Today
          </button>
        </div>
      </div>

      {/* 4 Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Courses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Courses</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats.totalCourses}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-[#10B981] rounded-2xl">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>{stats.totalCoursesChange}</span>
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats.totalStudents}</h3>
            </div>
            <div className="p-3 bg-sky-500/10 text-sky-600 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>{stats.totalStudentsChange}</span>
          </div>
        </div>

        {/* Total Instructors */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Instructors</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats.totalInstructors}</h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-2xl">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>{stats.totalInstructorsChange}</span>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Courses</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{stats.enrolledCourses}</h3>
            </div>
            <div className="p-3 bg-teal-500/10 text-teal-600 rounded-2xl">
              <BookmarkCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>{stats.enrolledCoursesChange}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Activities + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities Section (2 Cols on lg) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Recent Activities</h2>
              <button className="text-xs font-bold text-[#10B981] hover:underline">View all</button>
            </div>

            <div className="space-y-4">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl ${act.color}`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{act.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{act.detail}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Grid (1 Col on lg) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3.5">
              {/* Add Course */}
              <button
                onClick={() => handleQuickAction('course')}
                className="p-4 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200/60 text-left transition-all group focus:outline-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Add Course</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Create a new course</p>
              </button>

              {/* Add Student */}
              <button
                onClick={() => handleQuickAction('student')}
                className="p-4 rounded-2xl bg-sky-50/60 hover:bg-sky-100/80 border border-sky-200/60 text-left transition-all group focus:outline-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Add Student</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Register new student</p>
              </button>

              {/* Add Instructor */}
              <button
                onClick={() => handleQuickAction('instructor')}
                className="p-4 rounded-2xl bg-purple-50/60 hover:bg-purple-100/80 border border-purple-200/60 text-left transition-all group focus:outline-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Add Instructor</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Add new instructor</p>
              </button>

              {/* Create Assignment */}
              <button
                onClick={() => handleQuickAction('assignment')}
                className="p-4 rounded-2xl bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/60 text-left transition-all group focus:outline-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-3 shadow-xs group-hover:scale-105 transition-transform">
                  <FilePlus className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Create Assignment</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Add assignment / quiz</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Classes Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Upcoming Classes</h2>
          <button className="text-xs font-bold text-[#10B981] hover:underline">View all</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingClasses.map((cls) => (
            <div
              key={cls.id}
              className="p-4 rounded-2xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">{cls.title}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cls.time}</span>
                </div>
                <p className="text-[11px] text-emerald-600 font-medium pt-0.5">{cls.instructor}</p>
              </div>
              <button
                onClick={() => handleJoinClass(cls.title)}
                className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Modal Dialog */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-scaleUp">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900 capitalize">
                {modalType === 'course' && 'Add New Course'}
                {modalType === 'student' && 'Register New Student'}
                {modalType === 'instructor' && 'Add New Instructor'}
                {modalType === 'assignment' && 'Create Assignment / Quiz'}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {modalType === 'course' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Course Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master React & Tailwind CSS"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                  />
                </div>
              )}

              {(modalType === 'student' || modalType === 'instructor') && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                    />
                  </div>
                </>
              )}

              {modalType === 'assignment' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assignment / Quiz Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Final React Basics Quiz"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 px-4 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
