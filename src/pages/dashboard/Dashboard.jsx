import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
  CheckCircle2,
  Search,
  ExternalLink,
  Sparkles,
  Activity,
  Trash2,
  TrendingUp,
  BarChart3,
  PieChart,
  Star,
  Award,
  DollarSign,
  Download,
  RefreshCw,
  Play,
  Flame,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    stats,
    activities,
    upcomingClasses,
    addCourse,
    addStudent,
    addInstructor,
    addActivity,
    removeActivity,
    clearActivities,
    courses = [],
    instructors = [],
    students = [],
    enrollments = [],
    updateEnrollment,
    addAssignment
  } = useLMS();

  // Quick Action Modal states: 'course' | 'student' | 'instructor' | 'assignment' | null
  const [modalType, setModalType] = useState(null);

  // View All Activities Modal State
  const [isAllActivitiesOpen, setIsAllActivitiesOpen] = useState(false);
  const [activitySearch, setActivitySearch] = useState('');

  // Live Class Join Modal State
  const [joiningClass, setJoiningClass] = useState(null);

  // Chart 1 Metric Toggle State: 'enrollments' | 'revenue'
  const [chartMetric, setChartMetric] = useState('enrollments');
  const [activeHoverPoint, setActiveHoverPoint] = useState(null);

  // Popular Showcase Tab State: 'courses' | 'instructors'
  const [showcaseTab, setShowcaseTab] = useState('courses');

  // React Hook Form for Quick Action Modals
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const watchImage = watch('image', '');

  // Preset Avatars
  const avatarPresets = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80'
  ];

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Chart 1: Monthly Data Analytics
  const monthlyData = [
    { month: 'Jan', enrollments: 32, revenue: 1600, growth: '+12%' },
    { month: 'Feb', enrollments: 45, revenue: 2250, growth: '+15%' },
    { month: 'Mar', enrollments: 58, revenue: 2900, growth: '+18%' },
    { month: 'Apr', enrollments: 72, revenue: 3600, growth: '+22%' },
    { month: 'May', enrollments: 65, revenue: 3250, growth: '-8%' },
    { month: 'Jun', enrollments: 88, revenue: 4400, growth: '+35%' },
    { month: 'Jul', enrollments: 104, revenue: 5200, growth: '+18%' },
    { month: 'Aug', enrollments: 120, revenue: 6000, growth: '+15%' },
    { month: 'Sep', enrollments: 142, revenue: 7100, growth: '+18%' },
    { month: 'Oct', enrollments: 165, revenue: 8250, growth: '+16%' },
    { month: 'Nov', enrollments: 190, revenue: 9500, growth: '+15%' },
    { month: 'Dec', enrollments: 220, revenue: 11000, growth: '+16%' }
  ];

  // Dynamically compute Chart 2: Category Distribution from Courses
  const categoryDistribution = useMemo(() => {
    if (!courses || courses.length === 0) {
      return [
        { category: 'Programming', count: 8, percentage: 40, color: '#10B981' },
        { category: 'Data Science', count: 5, percentage: 25, color: '#0EA5E9' },
        { category: 'Design', count: 4, percentage: 20, color: '#8B5CF6' },
        { category: 'Cloud & Mobile', count: 3, percentage: 15, color: '#F59E0B' }
      ];
    }

    const counts = {};
    courses.forEach((c) => {
      const cat = c.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const total = courses.length;
    const colors = ['#10B981', '#0EA5E9', '#8B5CF6', '#F59E0B', '#EC4899', '#6366F1'];

    return Object.keys(counts).map((cat, idx) => ({
      category: cat,
      count: counts[cat],
      percentage: Math.round((counts[cat] / total) * 100),
      color: colors[idx % colors.length]
    }));
  }, [courses]);

  // Top 4 Instructors for Showcase Widget
  const topInstructors = useMemo(() => {
    return [...instructors].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);
  }, [instructors]);

  // Top 4 Popular Courses for Showcase Widget
  const popularCourses = useMemo(() => {
    return [...courses].slice(0, 4);
  }, [courses]);

  // Open Quick Action Modal with resets
  const handleOpenQuickAction = (type) => {
    setModalType(type);
    if (type === 'course') {
      reset({
        title: '',
        instructor: instructors[0]?.name || 'Dr. Emily Carter',
        category: 'Programming',
        duration: '6 weeks',
        level: 'Beginner',
        price: 49.99,
        description: ''
      });
    } else if (type === 'student') {
      reset({
        name: '',
        email: '',
        mobile: '',
        qualification: 'B.Tech',
        city: 'Hyderabad'
      });
    } else if (type === 'instructor') {
      reset({
        name: '',
        email: '',
        phone: '',
        experience: '5 Years',
        specialization: 'Full Stack Development',
        rating: 4.8,
        image: avatarPresets[0],
        bio: ''
      });
    } else if (type === 'assignment') {
      reset({
        title: '',
        courseId: courses[0]?.id || '1',
        totalMarks: 100,
        dueDate: '2026-09-30',
        instructions: ''
      });
    }
  };

  // Submit Handler for Quick Action Modals
  const onQuickActionSubmit = async (data) => {
    if (modalType === 'course') {
      addCourse({
        title: data.title,
        instructor: data.instructor,
        category: data.category,
        duration: data.duration,
        level: data.level,
        price: parseFloat(data.price) || 49.99,
        description: data.description || `Comprehensive training module for ${data.title}.`
      });
    } else if (modalType === 'student') {
      await addStudent({
        name: data.name,
        email: data.email,
        phone: data.mobile,
        qualification: data.qualification,
        city: data.city
      });
    } else if (modalType === 'instructor') {
      addInstructor({
        name: data.name,
        email: data.email,
        phone: data.phone || '+1 (555) 234-5678',
        experience: data.experience,
        specialization: data.specialization,
        rating: parseFloat(data.rating) || 4.8,
        image: data.image,
        bio: data.bio || 'Professional faculty instructor dedicated to quality education.'
      });
    } else if (modalType === 'assignment') {
      const targetCourse = courses.find((c) => c.id.toString() === data.courseId?.toString());
      addAssignment({
        title: data.title,
        courseId: data.courseId,
        courseTitle: targetCourse?.title || 'LMS Course',
        instructorName: targetCourse?.instructor || 'Dr. Emily Carter',
        deadline: data.dueDate || '2026-09-30',
        totalMarks: data.totalMarks || 100,
        instructions: data.instructions || ''
      });
    }

    setModalType(null);
  };

  // Export Dashboard Report Mock CSV download
  const handleExportReport = () => {
    const csvContent = `Metric,Value\nTotal Courses,${stats.totalCourses}\nTotal Students,${stats.totalStudents}\nTotal Instructors,${stats.totalInstructors}\nActive Enrollments,${stats.enrolledCourses}\nReport Generated,${new Date().toLocaleString()}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EduLearn_LMS_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded official EduLearn LMS Realtime Report!');
  };

  // Filter activities in View All modal
  const filteredActivities = activities.filter(
    (act) =>
      act.title.toLowerCase().includes(activitySearch.toLowerCase()) ||
      act.detail.toLowerCase().includes(activitySearch.toLowerCase())
  );

  // Student-specific calculations when logged in as a student
  const isStudentRole = user?.role === 'Student';
  const currentStudentEmail = user?.email?.toLowerCase() || '';

  const studentEnrollments = useMemo(() => {
    if (!enrollments) return [];
    return enrollments.filter(
      (e) =>
        e.studentEmail?.toLowerCase() === currentStudentEmail ||
        String(e.studentId) === String(user?.studentId || user?.id)
    );
  }, [enrollments, currentStudentEmail, user]);

  const studentAvgProgress = useMemo(() => {
    if (studentEnrollments.length === 0) return 0;
    const sum = studentEnrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0);
    return Math.round(sum / studentEnrollments.length);
  }, [studentEnrollments]);

  const studentCompletedLessons = useMemo(() => {
    return studentEnrollments.reduce(
      (acc, curr) => acc + (curr.completedLessons !== undefined ? curr.completedLessons : Math.round(((curr.progress || 0) / 100) * 10)),
      0
    );
  }, [studentEnrollments]);

  const studentCertificatesCount = useMemo(() => {
    return studentEnrollments.filter((e) => e.progress === 100).length;
  }, [studentEnrollments]);

  // If user is logged in as a Student, render dedicated Student Dashboard
  if (isStudentRole) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
        {/* Student Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {user?.name || 'Student'}! 👋
              </h1>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full flex items-center gap-1.5 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                STUDENT PORTAL
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track your enrolled courses, lesson completion progress, upcoming live class streams, and certificates.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center">
            <div className="px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentDateStr}</span>
            </div>
            <button
              onClick={() => navigate('/progress')}
              className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>My Progress</span>
            </button>
          </div>
        </div>

        {/* 4 Student KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* My Enrolled Courses */}
          <div
            onClick={() => navigate('/courses')}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Enrolled Courses</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2 group-hover:text-[#10B981] transition-colors">
                  {studentEnrollments.length}
                </h3>
              </div>
              <div className="p-3 bg-emerald-500/10 text-[#10B981] rounded-2xl group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-emerald-600 font-medium pt-2 border-t border-slate-100">
              <span className="font-bold">Active Learning</span>
              <span className="text-[11px] font-extrabold text-slate-400 group-hover:text-[#10B981]">View &rarr;</span>
            </div>
          </div>

          {/* Overall Progress */}
          <div
            onClick={() => navigate('/progress')}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Completion</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2 group-hover:text-teal-600 transition-colors">
                  {studentAvgProgress}%
                </h3>
              </div>
              <div className="p-3 bg-teal-500/10 text-teal-600 rounded-2xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-teal-600 font-medium pt-2 border-t border-slate-100">
              <span className="font-bold">Curriculum Rate</span>
              <span className="text-[11px] font-extrabold text-slate-400 group-hover:text-teal-600">Track &rarr;</span>
            </div>
          </div>

          {/* Completed Lessons */}
          <div
            onClick={() => navigate('/progress')}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Lessons</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2 group-hover:text-amber-600 transition-colors">
                  {studentCompletedLessons}
                </h3>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-amber-600 font-medium pt-2 border-t border-slate-100">
              <span className="font-bold">Finished Modules</span>
              <span className="text-[11px] font-extrabold text-slate-400 group-hover:text-amber-600">Details &rarr;</span>
            </div>
          </div>

          {/* Certificates */}
          <div
            onClick={() => navigate('/progress')}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Certificates</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-2 group-hover:text-purple-600 transition-colors">
                  {studentCertificatesCount}
                </h3>
              </div>
              <div className="p-3 bg-purple-500/10 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-purple-600 font-medium pt-2 border-t border-slate-100">
              <span className="font-bold">100% Completed</span>
              <span className="text-[11px] font-extrabold text-slate-400 group-hover:text-purple-600">Print &rarr;</span>
            </div>
          </div>
        </div>

        {/* Student Enrolled Courses Grid & Live Class Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Enrolled Courses List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">My Enrolled Courses</h2>
                <p className="text-xs text-slate-500">Continue learning and tracking your syllabus progress</p>
              </div>
              <button
                onClick={() => navigate('/courses')}
                className="text-xs font-bold text-[#10B981] hover:text-emerald-700 transition-colors"
              >
                Browse Catalog &rarr;
              </button>
            </div>

            <div className="space-y-4">
              {studentEnrollments.length > 0 ? (
                studentEnrollments.map((enr) => (
                  <div
                    key={enr.id}
                    className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 hover:bg-emerald-50/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md">
                          {enr.courseCategory}
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-900 mt-1">{enr.courseTitle}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Faculty: {enr.instructorName}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-[#10B981] text-lg">{enr.progress}%</span>
                        <p className="text-[10px] text-slate-400">Enrolled: {enr.enrollmentDate}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#10B981] h-full rounded-full transition-all duration-500"
                        style={{ width: `${enr.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-600 font-bold">
                        {enr.completedLessons || Math.round(((enr.progress || 0) / 100) * 10)} / 10 Lessons Finished
                      </span>
                      <button
                        onClick={() => navigate('/progress')}
                        className="px-3.5 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Resume Course &rarr;
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700 text-sm">No Active Enrollments</p>
                  <p className="text-xs text-slate-400">Browse the course catalog and enroll in your first course.</p>
                  <button
                    onClick={() => navigate('/courses')}
                    className="mt-2 px-4 py-2 bg-[#10B981] text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Browse Courses
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right 1 Col: Live Class Launcher & Activity */}
          <div className="space-y-6">
            {/* Live Class Session Stream */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-emerald-600" />
                  <span>Today's Live Classes</span>
                </h2>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Ready
                </span>
              </div>

              <div className="space-y-3">
                {upcomingClasses.slice(0, 2).map((cls) => (
                  <div key={cls.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                        {cls.room || 'Room 101'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{cls.time}</span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900">{cls.title}</h4>
                    <p className="text-[11px] text-slate-500">Instructor: {cls.instructor}</p>

                    <button
                      onClick={() => setJoiningClass(cls)}
                      className="w-full mt-2 py-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Join Class Stream</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Quick Shortcuts */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-slate-900">Quick Shortcuts</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/progress')}
                  className="p-3.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 rounded-2xl text-left transition-colors cursor-pointer"
                >
                  <TrendingUp className="w-5 h-5 text-emerald-600 mb-1" />
                  <div className="font-bold text-xs text-slate-900">Syllabus Progress</div>
                  <div className="text-[10px] text-slate-500">View lessons</div>
                </button>

                <button
                  onClick={() => navigate('/assignments')}
                  className="p-3.5 bg-sky-50 hover:bg-sky-100/80 border border-sky-200/60 rounded-2xl text-left transition-colors cursor-pointer"
                >
                  <FilePlus className="w-5 h-5 text-sky-600 mb-1" />
                  <div className="font-bold text-xs text-slate-900">Quizzes</div>
                  <div className="text-[10px] text-slate-500">Submit work</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* 1. Top Hero Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Alex Morgan'}! 👋
            </h1>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full flex items-center gap-1.5 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              SYSTEMS LIVE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time interactive dashboard overview, course analytics, and activity operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          <div className="px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentDateStr}</span>
          </div>

          <button
            onClick={handleExportReport}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download CSV Executive Summary"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => toast.info('Dashboard metrics updated with latest LocalStorage sync!')}
            className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Interactive Navigable KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Courses */}
        <div
          onClick={() => navigate('/courses')}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Courses</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 group-hover:text-[#10B981] transition-colors">
                {stats.totalCourses}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-[#10B981] rounded-2xl group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-emerald-600 font-medium pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 font-bold">
              <ArrowUpRight className="w-4 h-4" />
              {stats.totalCoursesChange}
            </span>
            <span className="text-[11px] font-extrabold text-slate-400 group-hover:text-[#10B981]">Explore &rarr;</span>
          </div>
        </div>

        {/* Total Students */}
        <div
          onClick={() => navigate('/students')}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 group-hover:text-sky-600 transition-colors">
                {stats.totalStudents}
              </h3>
            </div>
            <div className="p-3 bg-sky-500/10 text-sky-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-sky-600 font-medium pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 font-bold">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              {stats.totalStudentsChange}
            </span>
            <span className="text-[11px] font-extrabold text-slate-400 group-hover:text-sky-600">View All &rarr;</span>
          </div>
        </div>

        {/* Total Instructors */}
        <div
          onClick={() => navigate('/instructors')}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Instructors</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 group-hover:text-purple-600 transition-colors">
                {stats.totalInstructors}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-purple-600 font-medium pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 font-bold">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              {stats.totalInstructorsChange}
            </span>
            <span className="text-[11px] font-extrabold text-slate-400 group-hover:text-purple-600">Faculty &rarr;</span>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div
          onClick={() => navigate('/enrollments')}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Enrollments</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2 group-hover:text-teal-600 transition-colors">
                {stats.enrolledCourses}
              </h3>
            </div>
            <div className="p-3 bg-teal-500/10 text-teal-600 rounded-2xl group-hover:scale-110 transition-transform">
              <BookmarkCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-teal-600 font-medium pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 font-bold">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              {stats.enrolledCoursesChange}
            </span>
            <span className="text-[11px] font-extrabold text-slate-400 group-hover:text-teal-600">Manage &rarr;</span>
          </div>
        </div>
      </div>

      {/* 3. ENTERPRISE BENTO GRID SYSTEM (3 ROWS x 3 COLUMNS ALIGNMENT) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= BENTO ROW 1 ================= */}
        {/* Card 1: Enrollment Growth & Revenue Analytics (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Enrollment & Revenue Analytics
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly trajectory for course enrollments and tuition revenue.
              </p>
            </div>

            {/* Metric Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-center">
              <button
                onClick={() => setChartMetric('enrollments')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  chartMetric === 'enrollments'
                    ? 'bg-[#10B981] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Enrollments
              </button>
              <button
                onClick={() => setChartMetric('revenue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  chartMetric === 'revenue'
                    ? 'bg-[#10B981] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Revenue ($)
              </button>
            </div>
          </div>

          {/* SVG Line / Bar Chart Box */}
          <div className="relative pt-4 flex-1 flex flex-col justify-end">
            {/* Interactive Tooltip Callout */}
            {activeHoverPoint !== null && (
              <div className="absolute top-0 right-4 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 animate-fadeIn z-10">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {monthlyData[activeHoverPoint].month}:{' '}
                  {chartMetric === 'revenue'
                    ? `$${monthlyData[activeHoverPoint].revenue.toLocaleString()}`
                    : `${monthlyData[activeHoverPoint].enrollments} Students`}{' '}
                  ({monthlyData[activeHoverPoint].growth})
                </span>
              </div>
            )}

            {/* Custom SVG Line Chart */}
            <div className="h-56 w-full flex items-end justify-between gap-1.5 pt-6 pb-2 px-2 border-b border-slate-100 relative">
              {/* Background Horizontal Grid Lines */}
              <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-100 text-[10px] text-slate-300 font-mono">
                {chartMetric === 'revenue' ? '$12,000' : '240'}
              </div>
              <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-slate-100 text-[10px] text-slate-300 font-mono">
                {chartMetric === 'revenue' ? '$6,000' : '120'}
              </div>

              {/* Render Bars / Points */}
              {monthlyData.map((d, i) => {
                const maxVal = chartMetric === 'revenue' ? 12000 : 240;
                const val = chartMetric === 'revenue' ? d.revenue : d.enrollments;
                const heightPct = Math.min(100, Math.max(15, (val / maxVal) * 100));

                return (
                  <div
                    key={d.month}
                    onMouseEnter={() => setActiveHoverPoint(i)}
                    onMouseLeave={() => setActiveHoverPoint(null)}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative z-10"
                  >
                    <div
                      className={`w-full rounded-t-xl transition-all duration-300 ${
                        activeHoverPoint === i
                          ? 'bg-emerald-500 shadow-md scale-y-105'
                          : i % 2 === 0
                          ? 'bg-emerald-600/80 hover:bg-[#10B981]'
                          : 'bg-teal-500/70 hover:bg-teal-600'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    ></div>
                    <span
                      className={`text-[10px] font-bold transition-colors ${
                        activeHoverPoint === i ? 'text-emerald-600 font-extrabold' : 'text-slate-400'
                      }`}
                    >
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chart Footer Summary */}
            <div className="flex items-center justify-between text-xs pt-4 text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>+28.4% Peak Year-over-Year Growth</span>
              </span>
              <span>100% Verified LMS LocalStorage Data</span>
            </div>
          </div>
        </div>

        {/* Card 2: Course Category Distribution (1 Col) */}
        <div className="lg:col-span-1 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Category Share
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Active LMS courses breakdown by domain category.
            </p>
          </div>

          {/* Interactive Donut Visualization & Progress Bars */}
          <div className="space-y-4 my-auto">
            {categoryDistribution.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span>{item.category}</span>
                  </span>
                  <span className="text-slate-900">
                    {item.count} Courses ({item.percentage}%)
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Total Active Catalog</span>
            <span className="font-extrabold text-indigo-600">{courses.length} Courses Published</span>
          </div>
        </div>

        {/* ================= BENTO ROW 2 ================= */}
        {/* Card 3: Popular Courses & Top Faculty Showcase Tabs (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowcaseTab('courses')}
                className={`text-sm font-extrabold pb-1 transition-all cursor-pointer border-b-2 ${
                  showcaseTab === 'courses'
                    ? 'border-[#10B981] text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Popular LMS Courses ({popularCourses.length})
              </button>
              <button
                onClick={() => setShowcaseTab('instructors')}
                className={`text-sm font-extrabold pb-1 transition-all cursor-pointer border-b-2 ${
                  showcaseTab === 'instructors'
                    ? 'border-[#10B981] text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Top Rated Faculty ({topInstructors.length})
              </button>
            </div>

            <button
              onClick={() => navigate(showcaseTab === 'courses' ? '/courses' : '/instructors')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              View Catalog &rarr;
            </button>
          </div>

          {/* Showcase Tab 1: Popular Courses */}
          {showcaseTab === 'courses' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 animate-fadeIn my-auto">
              {popularCourses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/courses/${c.id}`)}
                  className="p-4 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200/80 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="space-y-1 overflow-hidden pr-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md">
                      {c.category}
                    </span>
                    <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                      {c.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">{c.instructor} &bull; {c.duration}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-[#10B981] text-sm">${c.price}</span>
                    <div className="p-1.5 bg-white text-slate-400 group-hover:text-emerald-600 rounded-xl border border-slate-200 mt-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Showcase Tab 2: Top Faculty */}
          {showcaseTab === 'instructors' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 animate-fadeIn my-auto">
              {topInstructors.map((inst) => (
                <div
                  key={inst.id}
                  onClick={() => navigate(`/instructors/${inst.id}`)}
                  className="p-4 bg-slate-50 hover:bg-purple-50/50 rounded-2xl border border-slate-200/80 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 overflow-hidden pr-2">
                    <img
                      src={inst.image}
                      alt={inst.name}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/20 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                        {inst.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{inst.specialization}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-extrabold text-[10px] rounded-full border border-amber-200 inline-flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {inst.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 4: Real-Time Quick Actions Grid (1 Col) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Real-Time Quick Actions</h2>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="grid grid-cols-2 gap-3 my-auto">
            {/* Add Course */}
            <button
              onClick={() => handleOpenQuickAction('course')}
              className="p-4 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200/60 text-left transition-all group focus:outline-hidden cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-110 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Add Course</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Publish new course</p>
            </button>

            {/* Add Student */}
            <button
              onClick={() => handleOpenQuickAction('student')}
              className="p-4 rounded-2xl bg-sky-50/60 hover:bg-sky-100/80 border border-sky-200/60 text-left transition-all group focus:outline-hidden cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-110 transition-transform">
                <UserPlus className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Add Student</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Register student</p>
            </button>

            {/* Add Instructor */}
            <button
              onClick={() => handleOpenQuickAction('instructor')}
              className="p-4 rounded-2xl bg-purple-50/60 hover:bg-purple-100/80 border border-purple-200/60 text-left transition-all group focus:outline-hidden cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-110 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Add Instructor</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Add faculty member</p>
            </button>

            {/* Create Assignment */}
            <button
              onClick={() => handleOpenQuickAction('assignment')}
              className="p-4 rounded-2xl bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/60 text-left transition-all group focus:outline-hidden cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-110 transition-transform">
                <FilePlus className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Publish Quiz</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Create assignment</p>
            </button>
          </div>
        </div>

        {/* ================= BENTO ROW 3 ================= */}
        {/* Card 5: Upcoming Live Classes Widget (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-emerald-600" />
              <span>Today's Live Interactive Class Sessions</span>
            </h2>
            <span className="text-xs text-slate-400 font-bold">3 Sessions Stream Ready</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto">
            {upcomingClasses.map((cls) => (
              <div
                key={cls.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-md border border-emerald-200/60">
                    {cls.room || 'Room 101'}
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {cls.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {cls.time}
                  </p>
                </div>

                <button
                  onClick={() => setJoiningClass(cls)}
                  className="w-full py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Join Class Stream</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Card 6: Recent Activities Log Section (1 Col) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-extrabold text-slate-900">Activity Log</h2>
            </div>
            <button
              onClick={() => setIsAllActivitiesOpen(true)}
              className="text-xs font-bold text-[#10B981] hover:text-emerald-700 hover:underline transition-colors cursor-pointer"
            >
              View all ({activities.length})
            </button>
          </div>

          <div className="space-y-3 my-auto">
            {activities.length > 0 ? (
              activities.slice(0, 4).map((act) => (
                <div
                  key={act.id}
                  onClick={() => {
                    if (act.type === 'course') navigate('/courses');
                    else if (act.type === 'user') navigate('/students');
                    else if (act.type === 'instructor') navigate('/instructors');
                    else if (act.type === 'enrollment') navigate('/enrollments');
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-100 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded-xl ${act.color} group-hover:scale-105 transition-transform shrink-0`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors truncate">
                        {act.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{act.detail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-medium text-slate-400">{act.time}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeActivity(act.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
                <Activity className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No Recent Activities</p>
                <p className="text-[11px] text-slate-400">Activity log is empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTION MODALS MATCHING FULL PAGE MODALS */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-slate-900">
                {modalType === 'course' && 'Add New Course'}
                {modalType === 'student' && 'Register New Student'}
                {modalType === 'instructor' && 'Add New Instructor'}
                {modalType === 'assignment' && 'Create Assignment / Quiz'}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onQuickActionSubmit)} className="space-y-4">
              {/* Form 1: Add Course */}
              {modalType === 'course' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Modern React & Redux"
                      {...register('title', { required: 'Course title is required' })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                    />
                    {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Instructor *
                      </label>
                      <select
                        {...register('instructor')}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:border-[#10B981] focus:outline-hidden"
                      >
                        {instructors.map((inst) => (
                          <option key={inst.id} value={inst.name}>
                            {inst.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Category *
                      </label>
                      <select
                        {...register('category')}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:border-[#10B981] focus:outline-hidden"
                      >
                        <option value="Programming">Programming</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Design">Design</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Cloud">Cloud</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        placeholder="6 weeks"
                        {...register('duration')}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#10B981] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Level
                      </label>
                      <select
                        {...register('level')}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-[#10B981] focus:outline-hidden"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="49.99"
                        {...register('price')}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#10B981] focus:border-[#10B981] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Course overview and objectives..."
                      {...register('description')}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#10B981] focus:outline-hidden"
                    ></textarea>
                  </div>
                </>
              )}

              {/* Form 2: Add Student */}
              {modalType === 'student' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      {...register('name', { required: 'Student name is required' })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                    />
                    {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="rahul@example.com"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                        })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                      />
                      {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="text"
                        placeholder="10 digit mobile"
                        {...register('mobile', {
                          required: 'Mobile is required',
                          pattern: { value: /^[0-9]{10}$/, message: 'Must be 10 digits' }
                        })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                      />
                      {errors.mobile && <p className="text-xs text-rose-500 mt-1">{errors.mobile.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Qualification
                      </label>
                      <select
                        {...register('qualification')}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:border-[#10B981] focus:outline-hidden"
                      >
                        <option value="B.Tech">B.Tech</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="BCA">BCA</option>
                        <option value="MCA">MCA</option>
                        <option value="B.Sc">B.Sc</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Hyderabad"
                        {...register('city')}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Form 3: Add Instructor */}
              {modalType === 'instructor' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Emily Carter"
                      {...register('name', { required: 'Full name is required' })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                    />
                    {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="emily@edulearn.com"
                        {...register('email', { required: 'Email address is required' })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Specialization
                      </label>
                      <select
                        {...register('specialization')}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:border-[#10B981] focus:outline-hidden"
                      >
                        <option value="Full Stack Development">Full Stack Development</option>
                        <option value="Data Science & AI">Data Science & AI</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Cloud & DevOps">Cloud & DevOps</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Profile Image URL
                    </label>
                    <input
                      type="text"
                      {...register('image')}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#10B981] focus:outline-hidden mb-2"
                    />

                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {avatarPresets.map((imgUrl, idx) => (
                        <img
                          key={idx}
                          src={imgUrl}
                          alt="Preset"
                          onClick={() => setValue('image', imgUrl)}
                          className={`w-7 h-7 rounded-full object-cover cursor-pointer ring-2 ${
                            watchImage === imgUrl ? 'ring-emerald-500 scale-110' : 'ring-transparent opacity-70'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Form 4: Create Assignment */}
              {modalType === 'assignment' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Assignment / Quiz Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React Hooks Midterm Quiz"
                      {...register('title', { required: 'Assignment title is required' })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Select Course *
                      </label>
                      <select
                        {...register('courseId')}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:border-[#10B981] focus:outline-hidden"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        {...register('dueDate')}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 px-4 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Submit Realtime Trigger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ALL ACTIVITIES HISTORY MODAL */}
      {isAllActivitiesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-100 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Complete System Activity History</h3>
                <p className="text-xs text-slate-500 mt-0.5">{activities.length} System Log Events</p>
              </div>
              <button
                onClick={() => setIsAllActivitiesOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search activity log..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#10B981] focus:outline-hidden"
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${act.color}`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{act.title}</p>
                        <p className="text-[11px] text-slate-500">{act.detail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{act.time}</span>
                      <button
                        onClick={() => removeActivity(act.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">No matching activities found.</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  clearActivities();
                  setIsAllActivitiesOpen(false);
                }}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer"
              >
                Clear All Logs
              </button>
              <button
                onClick={() => setIsAllActivitiesOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE CLASS JOIN STREAM MODAL */}
      {joiningClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Video className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">{joiningClass.title}</h3>
              <p className="text-xs text-slate-500 mt-1">Instructor: {joiningClass.instructor}</p>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200 mt-2">
                Session Room ID: {joiningClass.room || 'LMS-ROOM-101'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600">
              <p className="font-bold text-slate-800">Live Interactive Stream Launcher</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Connecting audio, video HD stream & interactive classroom whiteboard...
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setJoiningClass(null)}
                className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast.success(`Connected to live session: ${joiningClass.title}!`);
                  setJoiningClass(null);
                }}
                className="w-1/2 py-2.5 px-4 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Launch Live Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
