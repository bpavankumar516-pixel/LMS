import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Award,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  Printer,
  X,
  FileCheck,
  GraduationCap,
  Table,
  LayoutGrid
} from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { toast } from 'react-toastify';

// Default 10-lesson syllabus template for courses
const DEFAULT_SYLLABUS = [
  { id: 1, title: 'Lesson 1: Course Introduction & Setup', duration: '45 mins' },
  { id: 2, title: 'Lesson 2: Core Foundations & Basic Concepts', duration: '1 hr 10 mins' },
  { id: 3, title: 'Lesson 3: Intermediate Architecture & Patterns', duration: '55 mins' },
  { id: 4, title: 'Lesson 4: Data Structures & State Management', duration: '1 hr 30 mins' },
  { id: 5, title: 'Lesson 5: Async Logic & API Integration', duration: '1 hr 15 mins' },
  { id: 6, title: 'Lesson 6: Component Design & Dynamic Layouts', duration: '50 mins' },
  { id: 7, title: 'Lesson 7: Advanced Optimization & Performance', duration: '1 hr 05 mins' },
  { id: 8, title: 'Lesson 8: Testing & Debugging Best Practices', duration: '40 mins' },
  { id: 9, title: 'Lesson 9: Production Build & Deployment', duration: '1 hr 20 mins' },
  { id: 10, title: 'Lesson 10: Final Capstone Portfolio Project', duration: '2 hrs 00 mins' }
];

const LearningProgress = () => {
  const navigate = useNavigate();
  const { enrollments = [], updateEnrollment, loadEnrollments } = useLMS();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'students'

  // Pagination State (Matching Enrollments & Courses pattern)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal States
  const [selectedEnrollment, setSelectedEnrollment] = useState(null); // For lesson manager
  const [certificateEnrollment, setCertificateEnrollment] = useState(null); // For completion certificate

  // Calculated Progress Analytics per Enrollment
  const processedEnrollments = useMemo(() => {
    return enrollments.map((enr) => {
      const totalLessons = enr.totalLessons || 10;
      const progressPct = enr.progress || 0;
      
      const completedCount = enr.completedLessons !== undefined 
        ? enr.completedLessons 
        : Math.round((progressPct / 100) * totalLessons);
      
      const pendingCount = Math.max(0, totalLessons - completedCount);
      const lessonStates = enr.lessonStates || DEFAULT_SYLLABUS.map((l, index) => index < completedCount);

      return {
        ...enr,
        totalLessons,
        completedLessons: completedCount,
        pendingLessons: pendingCount,
        lessonStates,
        status: progressPct === 100 ? 'Completed' : progressPct > 0 ? 'Active' : 'Pending'
      };
    });
  }, [enrollments]);

  // Overall Aggregated Statistics
  const stats = useMemo(() => {
    if (processedEnrollments.length === 0) {
      return { avgProgress: 0, totalCompleted: 0, totalPending: 0, certifiedCount: 0 };
    }

    const totalProgress = processedEnrollments.reduce((sum, e) => sum + e.progress, 0);
    const avgProgress = Math.round(totalProgress / processedEnrollments.length);
    const totalCompleted = processedEnrollments.reduce((sum, e) => sum + e.completedLessons, 0);
    const totalPending = processedEnrollments.reduce((sum, e) => sum + e.pendingLessons, 0);
    const certifiedCount = processedEnrollments.filter((e) => e.progress === 100).length;

    return { avgProgress, totalCompleted, totalPending, certifiedCount };
  }, [processedEnrollments]);

  // Filtered Enrollments List
  const filteredEnrollments = useMemo(() => {
    return processedEnrollments.filter((enr) => {
      const matchesSearch =
        enr.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enr.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enr.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enr.instructorName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Completed' && enr.progress === 100) ||
        (statusFilter === 'In Progress' && enr.progress > 0 && enr.progress < 100) ||
        (statusFilter === 'Not Started' && enr.progress === 0);

      const matchesCategory =
        categoryFilter === 'All' || enr.courseCategory === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [processedEnrollments, searchTerm, statusFilter, categoryFilter]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage) || 1;
  const paginatedEnrollments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEnrollments.slice(start, start + itemsPerPage);
  }, [filteredEnrollments, currentPage]);

  // Group by Student for Student-wise View
  const studentGrouped = useMemo(() => {
    const map = {};
    filteredEnrollments.forEach((enr) => {
      if (!map[enr.studentId]) {
        map[enr.studentId] = {
          studentId: enr.studentId,
          studentName: enr.studentName,
          studentEmail: enr.studentEmail,
          studentAvatar: enr.studentAvatar,
          courses: []
        };
      }
      map[enr.studentId].courses.push(enr);
    });
    return Object.values(map);
  }, [filteredEnrollments]);

  // Categories list for dropdown
  const categories = useMemo(() => {
    const set = new Set(processedEnrollments.map((e) => e.courseCategory).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [processedEnrollments]);

  // Handle Lesson Checkbox Toggle inside Modal
  const handleToggleLesson = (lessonIndex) => {
    if (!selectedEnrollment) return;

    const currentStates = [...(selectedEnrollment.lessonStates || DEFAULT_SYLLABUS.map((_, i) => i < selectedEnrollment.completedLessons))];
    currentStates[lessonIndex] = !currentStates[lessonIndex];

    const newCompletedCount = currentStates.filter(Boolean).length;
    const totalLessons = selectedEnrollment.totalLessons || 10;
    const newProgress = Math.round((newCompletedCount / totalLessons) * 100);
    const newStatus = newProgress === 100 ? 'Completed' : 'Active';

    // Update in context & localStorage
    updateEnrollment(selectedEnrollment.id, {
      progress: newProgress,
      completedLessons: newCompletedCount,
      pendingLessons: totalLessons - newCompletedCount,
      lessonStates: currentStates,
      status: newStatus
    });

    // Update local modal state
    setSelectedEnrollment((prev) => ({
      ...prev,
      progress: newProgress,
      completedLessons: newCompletedCount,
      pendingLessons: totalLessons - newCompletedCount,
      lessonStates: currentStates,
      status: newStatus
    }));

    toast.success(`Lesson ${lessonIndex + 1} updated! Progress: ${newProgress}%`);
  };

  // CSV Report Exporter
  const handleExportCSV = () => {
    if (filteredEnrollments.length === 0) {
      toast.warn('No student progress data to export');
      return;
    }

    const headers = [
      'Enrollment ID',
      'Student Name',
      'Student Email',
      'Course Title',
      'Category',
      'Instructor',
      'Progress (%)',
      'Completed Lessons',
      'Pending Lessons',
      'Status'
    ];

    const rows = filteredEnrollments.map((e) => [
      `"${e.id}"`,
      `"${e.studentName}"`,
      `"${e.studentEmail}"`,
      `"${e.courseTitle}"`,
      `"${e.courseCategory}"`,
      `"${e.instructorName}"`,
      e.progress,
      e.completedLessons,
      e.pendingLessons,
      `"${e.status}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LMS_Student_Learning_Progress_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Learning Progress CSV exported successfully!');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. STANDARD HEADER BANNER (MATCHING ENROLLMENTS, COURSES, STUDENTS PAGE PATTERN) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Learning Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track student course completion percentages, syllabus lesson progress, and generate official completion certificates.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={loadEnrollments}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Refresh Progress Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Progress CSV</span>
          </button>
        </div>
      </div>

      {/* 2. STANDARD STAT CARDS ROW (MATCHING LMS DASHBOARD & ENROLLMENTS PATTERN) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Avg Completion Rate */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Completion Rate</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stats.avgProgress}%</h3>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-[#10B981] rounded-2xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 2: Completed Lessons */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Completed Lessons</p>
            <h3 className="text-2xl font-extrabold text-teal-600 mt-1">{stats.totalCompleted}</h3>
          </div>
          <div className="p-2.5 bg-teal-500/10 text-teal-600 rounded-2xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 3: Pending Lessons */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Pending Lessons</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{stats.totalPending}</h3>
          </div>
          <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-2xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 4: Course Certificates */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Course Certificates</p>
            <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">{stats.certifiedCount}</h3>
          </div>
          <div className="p-2.5 bg-indigo-500/10 text-indigo-600 rounded-2xl">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. STANDARD SEARCH & CONTROL BAR (MATCHING COURSES & ENROLLMENTS PATTERN) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search Box */}
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, email, or course..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#10B981] transition-all"
          />
        </div>

        {/* Filters & View Switcher */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Progress</option>
              <option value="Completed">Completed (100%)</option>
              <option value="In Progress">In Progress (1-99%)</option>
              <option value="Not Started">Not Started (0%)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Domain:</span>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Switcher: Icon Only */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              title="Course Table View"
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('students')}
              title="Student Cards View"
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'students'
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN DATA CONTENT CONTAINER */}
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Student Progress Directory</h2>
              <p className="text-xs text-slate-500">Showing {filteredEnrollments.length} enrollment progress records</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Student</th>
                  <th className="py-3.5 px-6">Enrolled Course</th>
                  <th className="py-3.5 px-6">Category & Instructor</th>
                  <th className="py-3.5 px-6">Progress Track</th>
                  <th className="py-3.5 px-6 text-center">Completed</th>
                  <th className="py-3.5 px-6 text-center">Pending</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {paginatedEnrollments.length > 0 ? (
                  paginatedEnrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Student Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={enr.studentAvatar}
                            alt={enr.studentName}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 shrink-0"
                          />
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-xs">{enr.studentName}</h4>
                            <p className="text-[11px] text-slate-400">{enr.studentEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Course Title */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 text-xs">{enr.courseTitle}</span>
                          <p className="text-[10px] text-slate-400">{enr.enrollmentDate}</p>
                        </div>
                      </td>

                      {/* Category & Instructor */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded-md">
                            {enr.courseCategory}
                          </span>
                          <p className="text-[11px] text-slate-500">{enr.instructorName}</p>
                        </div>
                      </td>

                      {/* Progress Track & Bar */}
                      <td className="py-4 px-6 min-w-[180px]">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span
                              className={
                                enr.progress === 100
                                  ? 'text-indigo-600'
                                  : enr.progress > 0
                                  ? 'text-[#10B981]'
                                  : 'text-slate-400'
                              }
                            >
                              {enr.progress}%
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                enr.progress === 100
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : enr.progress > 0
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {enr.status}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                enr.progress === 100 ? 'bg-indigo-600' : 'bg-[#10B981]'
                              }`}
                              style={{ width: `${enr.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Completed Lessons */}
                      <td className="py-4 px-6 text-center">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-xl border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {enr.completedLessons} / {enr.totalLessons}
                        </span>
                      </td>

                      {/* Pending Lessons */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`px-2.5 py-1 font-extrabold text-xs rounded-xl border inline-flex items-center gap-1 ${
                            enr.pendingLessons === 0
                              ? 'bg-slate-50 text-slate-400 border-slate-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {enr.pendingLessons} Lessons
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedEnrollment(enr)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-[#10B981] hover:text-white text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>Manage Lessons</span>
                          </button>

                          {enr.progress === 100 && (
                            <button
                              onClick={() => setCertificateEnrollment(enr)}
                              className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
                              title="View Completion Certificate"
                            >
                              <Award className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="space-y-2">
                        <TrendingUp className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="font-bold text-slate-600 text-sm">No Progress Records Found</p>
                        <p className="text-xs text-slate-400">Try adjusting your search query or filter options.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Standard Pagination Bar matching Courses & Enrollments */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Page <strong className="text-slate-800">{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredEnrollments.length} Total Records)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-xl font-bold transition-all cursor-pointer ${
                      currentPage === pg
                        ? 'bg-[#10B981] text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* STUDENT-WISE CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studentGrouped.map((st) => {
            const totalCourses = st.courses.length;
            const avgStudentProgress = Math.round(
              st.courses.reduce((sum, c) => sum + c.progress, 0) / (totalCourses || 1)
            );

            return (
              <div
                key={st.studentId}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 hover:shadow-md transition-all"
              >
                {/* Student Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={st.studentAvatar}
                      alt={st.studentName}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/20 shrink-0"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{st.studentName}</h3>
                      <p className="text-xs text-slate-400">{st.studentEmail}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-extrabold text-xs rounded-full border border-emerald-200">
                      Avg: {avgStudentProgress}%
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{totalCourses} Enrolled Course(s)</p>
                  </div>
                </div>

                {/* Enrolled Courses Progress Cards */}
                <div className="space-y-3">
                  {st.courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-md">
                            {course.courseCategory}
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-900 mt-1">{course.courseTitle}</h4>
                          <p className="text-[11px] text-slate-500">Instructor: {course.instructorName}</p>
                        </div>
                        <span className="font-extrabold text-[#10B981] text-sm">{course.progress}%</span>
                      </div>

                      {/* Progress track */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#10B981] h-full rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>

                      {/* Lesson Counters & Action */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-700 font-bold text-[11px]">
                            ✓ {course.completedLessons} Completed
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-amber-700 font-bold text-[11px]">
                            ⌛ {course.pendingLessons} Pending
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedEnrollment(course)}
                          className="px-3 py-1 bg-white hover:bg-[#10B981] hover:text-white text-slate-700 font-bold text-[11px] rounded-xl border border-slate-200 transition-colors cursor-pointer"
                        >
                          Manage Lessons
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. INTERACTIVE LESSON MANAGER MODAL */}
      {selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 my-8 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-lg">
                  {selectedEnrollment.courseCategory}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">{selectedEnrollment.courseTitle}</h3>
                <p className="text-xs text-slate-500">
                  Student: <strong className="text-slate-800">{selectedEnrollment.studentName}</strong> ({selectedEnrollment.studentEmail})
                </p>
              </div>
              <button
                onClick={() => setSelectedEnrollment(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Summary Header inside Modal */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Course Completion</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-extrabold text-[#10B981]">{selectedEnrollment.progress}%</span>
                  <span className="text-xs text-slate-500">
                    ({selectedEnrollment.completedLessons} / {selectedEnrollment.totalLessons} Lessons)
                  </span>
                </div>
              </div>
              <div className="w-24 bg-slate-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#10B981] h-full rounded-full transition-all duration-300"
                  style={{ width: `${selectedEnrollment.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Syllabus Lessons Checkbox List */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Syllabus Lessons Checklist ({selectedEnrollment.completedLessons} Finished, {selectedEnrollment.pendingLessons} Pending)
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {DEFAULT_SYLLABUS.map((lesson, idx) => {
                  const isDone = selectedEnrollment.lessonStates?.[idx];

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleToggleLesson(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isDone
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isDone ? (
                          <CheckSquare className="w-5 h-5 text-[#10B981] shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                        <div>
                          <p className={`text-xs font-bold ${isDone ? 'line-through text-emerald-800' : 'text-slate-800'}`}>
                            {lesson.title}
                          </p>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {lesson.duration}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isDone ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isDone ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-end border-t border-slate-100">
              <button
                onClick={() => setSelectedEnrollment(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. PRINTABLE CERTIFICATE MODAL */}
      {certificateEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 sm:p-10 max-w-2xl w-full shadow-2xl border-4 border-amber-300 my-8 space-y-6 text-center relative bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px]">
            <button
              onClick={() => setCertificateEnrollment(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header Badge */}
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-amber-300">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-amber-600">Official Certificate of Completion</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">EduLearn Learning Management System</h2>
            </div>

            <div className="py-4 space-y-2 border-y border-slate-200">
              <p className="text-xs text-slate-500">This certifies that</p>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-700 underline decoration-emerald-300 underline-offset-4">
                {certificateEnrollment.studentName}
              </h3>
              <p className="text-xs text-slate-500">has successfully completed 100% of all required lessons in</p>
              <h4 className="text-lg font-bold text-slate-900">{certificateEnrollment.courseTitle}</h4>
              <p className="text-xs text-slate-400 pt-1">Instructor: {certificateEnrollment.instructorName} &bull; Issued Date: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span>Certificate ID: CERT-{certificateEnrollment.id.toUpperCase()}</span>
              <span className="font-bold text-emerald-600">Verified 100% Curriculum Completion</span>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setCertificateEnrollment(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  window.print();
                  toast.success('Printing certificate...');
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningProgress;
