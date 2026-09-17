import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLMS } from '../../context/LMSContext';
import {
  BookmarkCheck,
  Plus,
  Search,
  Filter,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  BookOpen,
  Calendar,
  AlertTriangle,
  Award,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Edit2,
  Printer,
  RefreshCw,
  AlertCircle,
  Check,
  Sparkles,
  Sliders,
  GraduationCap
} from 'lucide-react';
import { toast } from 'react-toastify';

const Enrollments = () => {
  const navigate = useNavigate();
  const {
    enrollments,
    loadingEnrollments,
    errorEnrollments,
    loadEnrollments,
    students,
    courses,
    instructors,
    enrollStudent,
    updateEnrollment,
    removeEnrollment,
    isAlreadyEnrolled
  } = useLMS();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal States
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [deletingEnrollmentId, setDeletingEnrollmentId] = useState(null);
  const [receiptEnrollment, setReceiptEnrollment] = useState(null);

  // Helper for dynamic progress status & color styling
  const getProgressInfo = (pct = 0) => {
    const p = Math.min(100, Math.max(0, Number(pct) || 0));
    if (p === 100) {
      return {
        label: '🎓 Completed',
        gradient: 'from-indigo-500 to-indigo-600',
        textColor: 'text-indigo-600',
        bgBadge: 'bg-indigo-50 text-indigo-700'
      };
    }
    if (p >= 75) {
      return {
        label: '🔥 Almost Finished',
        gradient: 'from-[#10B981] to-teal-600',
        textColor: 'text-teal-600',
        bgBadge: 'bg-teal-50 text-teal-700'
      };
    }
    if (p >= 50) {
      return {
        label: '⚡ Halfway There',
        gradient: 'from-emerald-400 to-[#10B981]',
        textColor: 'text-[#10B981]',
        bgBadge: 'bg-emerald-50 text-emerald-700'
      };
    }
    if (p >= 25) {
      return {
        label: '📚 In Progress',
        gradient: 'from-amber-400 to-amber-500',
        textColor: 'text-amber-600',
        bgBadge: 'bg-amber-50 text-amber-700'
      };
    }
    return {
      label: '🚀 Just Enrolled',
      gradient: 'from-slate-400 to-slate-500',
      textColor: 'text-slate-500',
      bgBadge: 'bg-slate-100 text-slate-600'
    };
  };

  // New Enrollment Form
  const {
    register: registerNew,
    handleSubmit: handleSubmitNew,
    watch: watchNew,
    reset: resetNew,
    formState: { errors: errorsNew }
  } = useForm({
    defaultValues: {
      studentId: '',
      courseId: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      progress: 0
    }
  });

  // Edit Enrollment Form
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    watch: watchEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit }
  } = useForm();

  const selectedStudentId = watchNew('studentId');
  const selectedCourseId = watchNew('courseId');
  const newProgressValue = watchNew('progress', 0);
  const editProgressValue = watchEdit('progress', 0);

  // Duplicate Check Helper for Form Validation Notice
  const isDuplicate = useMemo(() => {
    if (selectedStudentId && selectedCourseId) {
      return isAlreadyEnrolled(selectedStudentId, selectedCourseId);
    }
    return false;
  }, [selectedStudentId, selectedCourseId, isAlreadyEnrolled]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(enrollments.map((e) => e.courseCategory));
    return ['All', ...Array.from(set)];
  }, [enrollments]);

  // Statuses list
  const statuses = ['All', 'Active', 'Completed', 'Pending', 'Cancelled'];

  // Filtered Enrollments
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((e) => {
      const matchesSearch =
        e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat =
        selectedCategory === 'All' ||
        e.courseCategory.toLowerCase() === selectedCategory.toLowerCase();
      const matchesStat =
        selectedStatus === 'All' ||
        (e.status || 'Active').toLowerCase() === selectedStatus.toLowerCase();
      return matchesSearch && matchesCat && matchesStat;
    });
  }, [enrollments, searchTerm, selectedCategory, selectedStatus]);

  // Summary Metrics Calculation with Active, Completed, Pending, and Cancelled Cards
  const metrics = useMemo(() => {
    const totalCount = enrollments.length;
    const totalRevenue = enrollments.reduce((acc, curr) => acc + (curr.coursePrice || 0), 0);
    const avgProgress = totalCount > 0 ? Math.round(enrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalCount) : 0;
    const activeCount = enrollments.filter((e) => e.status === 'Active' || (!e.status && e.progress < 100)).length;
    const completedCount = enrollments.filter((e) => e.status === 'Completed' || e.progress === 100).length;
    const pendingCount = enrollments.filter((e) => e.status === 'Pending').length;
    const cancelledCount = enrollments.filter((e) => e.status === 'Cancelled').length;
    return { totalCount, totalRevenue, avgProgress, activeCount, completedCount, pendingCount, cancelledCount };
  }, [enrollments]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage) || 1;
  const paginatedEnrollments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEnrollments.slice(start, start + itemsPerPage);
  }, [filteredEnrollments, currentPage]);

  // Open New Enrollment Modal
  const handleOpenEnrollModal = () => {
    resetNew({
      studentId: students[0]?.id || '',
      courseId: courses[0]?.id || '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      progress: 0
    });
    setIsEnrollModalOpen(true);
  };

  // Open Edit Enrollment Modal
  const handleOpenEditModal = (enr) => {
    setEditingEnrollment(enr);
    resetEdit({
      enrollmentDate: enr.enrollmentDate,
      status: enr.status || 'Active',
      progress: enr.progress || 0
    });
  };

  // Direct Click on Bar Track to set exact Progress in table
  const handleBarClick = (e, enr) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newProgress = Math.round((clickX / width) * 100);
    
    let newStatus = enr.status || 'Active';
    if (newProgress === 100) {
      newStatus = 'Completed';
    } else if (newProgress > 0 && newStatus === 'Pending') {
      newStatus = 'Active';
    }

    updateEnrollment(enr.id, {
      progress: newProgress,
      status: newStatus
    });
  };

  // Submit New Enrollment Form
  const onFormSubmitNew = (data) => {
    const success = enrollStudent(
      data.studentId,
      data.courseId,
      data.enrollmentDate,
      data.status,
      data.progress
    );
    if (success) {
      setIsEnrollModalOpen(false);
    }
  };

  // Submit Edit Enrollment Form
  const onFormSubmitEdit = (data) => {
    if (editingEnrollment) {
      updateEnrollment(editingEnrollment.id, {
        enrollmentDate: data.enrollmentDate,
        status: data.status,
        progress: parseInt(data.progress) || 0
      });
      setEditingEnrollment(null);
    }
  };

  // Confirm Delete / Unenroll
  const handleConfirmRemove = () => {
    if (deletingEnrollmentId) {
      removeEnrollment(deletingEnrollmentId);
      setDeletingEnrollmentId(null);
    }
  };

  // Helper for Status Badge Styling
  const renderStatusBadge = (status = 'Active') => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
            <Award className="w-3 h-3 text-indigo-600" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            Cancelled
          </span>
        );
      case 'active':
      default:
        return (
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded-full inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
            Active
          </span>
        );
    }
  };

  // Print/Download Receipt Handler
  const handlePrintReceipt = (enr) => {
    toast.info(`Generating receipt for ${enr.studentName}...`);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Course Enrollments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enroll students, update course progress interactively, manage active statuses, and print official receipts.
          </p>
        </div>
        <button
          onClick={handleOpenEnrollModal}
          className="px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Enrollment</span>
        </button>
      </div>

      {/* Enrollment Summary Banner (6 Clean Stat Cards for All Statuses) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Enrollments */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Enrollments</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{metrics.totalCount}</h3>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-[#10B981] rounded-2xl">
            <BookmarkCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Active Enrollments */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Active</p>
            <h3 className="text-2xl font-extrabold text-[#10B981] mt-1">{metrics.activeCount}</h3>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-[#10B981] rounded-2xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Completed Courses */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Completed</p>
            <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">{metrics.completedCount}</h3>
          </div>
          <div className="p-2.5 bg-indigo-500/10 text-indigo-600 rounded-2xl">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Pending</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{metrics.pendingCount}</h3>
          </div>
          <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-2xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Cancelled Card */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Cancelled</p>
            <h3 className="text-2xl font-extrabold text-rose-600 mt-1">{metrics.cancelledCount}</h3>
          </div>
          <div className="p-2.5 bg-rose-500/10 text-rose-600 rounded-2xl">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Revenue</p>
            <h3 className="text-2xl font-extrabold text-teal-600 mt-1">${metrics.totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="p-2.5 bg-teal-500/10 text-teal-600 rounded-2xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Category/Status Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or course name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#10B981] focus:bg-white transition-all"
          />
        </div>

        {/* Filter Dropdowns: Category & Status */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#10B981] font-semibold w-full sm:w-auto"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#10B981] font-semibold w-full sm:w-auto"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loadingEnrollments && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-12 bg-slate-200 rounded-xl w-full"></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {errorEnrollments && !loadingEnrollments && (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-rose-900">{errorEnrollments}</h3>
          <button
            onClick={loadEnrollments}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Loading</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loadingEnrollments && !errorEnrollments && paginatedEnrollments.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Enrollments Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No enrollment records match your search query or filters. Click "New Enrollment" to add one.
          </p>
          <button
            onClick={handleOpenEnrollModal}
            className="px-4 py-2 bg-[#10B981] text-white rounded-xl text-xs font-semibold mt-2 cursor-pointer"
          >
            Enroll First Student
          </button>
        </div>
      )}

      {/* Enrolled Courses Table */}
      {!loadingEnrollments && !errorEnrollments && paginatedEnrollments.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-4 pl-6">Student Details</th>
                  <th className="p-4">Enrolled Course</th>
                  <th className="p-4">Category & Price</th>
                  <th className="p-4">Enrollment Date</th>
                  <th className="p-4 min-w-[200px]">Course Progress</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedEnrollments.map((enr) => {
                  const progressPct = enr.progress || 0;
                  const pInfo = getProgressInfo(progressPct);

                  return (
                    <tr key={enr.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Student Avatar & Info */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={enr.studentAvatar}
                            alt={enr.studentName}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{enr.studentName}</p>
                            <p className="text-[11px] text-slate-400">{enr.studentEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Course Title */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-slate-800">{enr.courseTitle}</span>
                        </div>
                      </td>

                      {/* Category & Price */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-0.5 bg-emerald-50 text-[#10B981] font-bold text-[10px] rounded-md self-start">
                            {enr.courseCategory}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">${enr.coursePrice}</span>
                        </div>
                      </td>

                      {/* Enrollment Date */}
                      <td className="p-4 text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {enr.enrollmentDate}
                        </span>
                      </td>

                      {/* Clean Clickable Progress Bar */}
                      <td className="p-4">
                        <div className="space-y-1.5 min-w-[180px]">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="flex items-center gap-1.5">
                              <span className="text-slate-900 font-extrabold text-xs">{progressPct}%</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${pInfo.bgBadge}`}>
                                {pInfo.label}
                              </span>
                            </span>
                          </div>

                          {/* Clickable Bar Track */}
                          <div
                            onClick={(e) => handleBarClick(e, enr)}
                            title="Click anywhere on the bar to jump progress!"
                            className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/80 relative shadow-xs cursor-pointer group/bar"
                          >
                            <div
                              className={`h-full rounded-full transition-all duration-300 bg-gradient-to-r ${pInfo.gradient}`}
                              style={{ width: `${progressPct}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">{renderStatusBadge(enr.status)}</td>

                      {/* Action Buttons */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Receipt View Button */}
                          <button
                            onClick={() => setReceiptEnrollment(enr)}
                            title="View / Print Receipt"
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditModal(enr)}
                            title="Edit Enrollment Details"
                            className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Remove Button */}
                          <button
                            onClick={() => setDeletingEnrollmentId(enr.id)}
                            title="Remove Enrollment"
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!loadingEnrollments && !errorEnrollments && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">
            Showing Page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
            <span className="font-bold text-slate-800">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 rounded-xl transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  currentPage === pg
                    ? 'bg-[#10B981] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 rounded-xl transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* New Course Enrollment Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-extrabold text-slate-900">Enroll Student into Course</h3>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNew(onFormSubmitNew)} className="space-y-4">
              {/* Select Student */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Student *
                </label>
                <select
                  {...registerNew('studentId', { required: 'Please select a student' })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:border-[#10B981] focus:outline-hidden"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.email})
                    </option>
                  ))}
                </select>
                {errorsNew.studentId && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errorsNew.studentId.message}</p>
                )}
              </div>

              {/* Select Course */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Course *
                </label>
                <select
                  {...registerNew('courseId', { required: 'Please select a course' })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:border-[#10B981] focus:outline-hidden"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} (${c.price})
                    </option>
                  ))}
                </select>
                {errorsNew.courseId && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errorsNew.courseId.message}</p>
                )}
              </div>

              {/* Duplicate Enrollment Warning Notice */}
              {isDuplicate && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 font-medium">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Warning: This student is <strong>already enrolled</strong> in the selected course! Duplicate enrollment is prevented.
                  </span>
                </div>
              )}

              {/* Grid: Enrollment Date & Initial Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Enrollment Date *
                  </label>
                  <input
                    type="date"
                    {...registerNew('enrollmentDate', { required: 'Enrollment date required' })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Initial Status
                  </label>
                  <select
                    {...registerNew('status')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:border-[#10B981] focus:outline-hidden"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Clean Range Slider Progress Control in Modal */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-[#10B981]" />
                    <span>Initial Course Progress</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getProgressInfo(newProgressValue).bgBadge}`}>
                      {getProgressInfo(newProgressValue).label}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">{newProgressValue}%</span>
                  </div>
                </div>

                {/* Range Slider Track */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  {...registerNew('progress')}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDuplicate}
                  className="w-1/2 py-2.5 px-4 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Enrollment Modal */}
      {editingEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Edit Enrollment Details</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingEnrollment.studentName} &bull; {editingEnrollment.courseTitle}
                </p>
              </div>
              <button
                onClick={() => setEditingEnrollment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit(onFormSubmitEdit)} className="space-y-4">
              {/* Enrollment Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Enrollment Date *
                </label>
                <input
                  type="date"
                  {...registerEdit('enrollmentDate', { required: 'Enrollment date required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                />
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Enrollment Status *
                </label>
                <select
                  {...registerEdit('status', { required: 'Status is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:border-[#10B981] focus:outline-hidden"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Clean Range Slider Progress Control in Modal */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-[#10B981]" />
                    <span>Course Progress</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getProgressInfo(editProgressValue).bgBadge}`}>
                      {getProgressInfo(editProgressValue).label}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">{editProgressValue}%</span>
                  </div>
                </div>

                {/* Range Slider Track */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  {...registerEdit('progress')}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingEnrollment(null)}
                  className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 px-4 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View & Print Receipt Confirmation Modal */}
      {receiptEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 my-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-lg font-extrabold text-slate-900">Official Enrollment Receipt</h3>
              </div>
              <button
                onClick={() => setReceiptEnrollment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Card Body */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 font-mono text-xs text-slate-700">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3 font-sans">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">EduLearn LMS</h4>
                  <p className="text-[11px] text-slate-400">Official Course Registration</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Receipt ID</p>
                  <p className="font-bold text-slate-800 text-xs">{receiptEnrollment.id}</p>
                </div>
              </div>

              {/* Student Details */}
              <div className="space-y-1 font-sans">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Student Information</p>
                <p className="font-bold text-slate-900 text-sm">{receiptEnrollment.studentName}</p>
                <p className="text-xs text-slate-500">{receiptEnrollment.studentEmail}</p>
              </div>

              {/* Course Details */}
              <div className="space-y-1 font-sans border-t border-slate-200 pt-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Course Information</p>
                <p className="font-bold text-slate-900 text-sm">{receiptEnrollment.courseTitle}</p>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-slate-500">Category: {receiptEnrollment.courseCategory}</span>
                  <span className="font-bold text-emerald-600">${receiptEnrollment.coursePrice}</span>
                </div>
              </div>

              {/* Dates & Status */}
              <div className="grid grid-cols-2 gap-4 font-sans border-t border-slate-200 pt-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Enrollment Date</p>
                  <p className="font-bold text-slate-800">{receiptEnrollment.enrollmentDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Status & Progress</p>
                  <p className="font-bold text-slate-800">
                    {receiptEnrollment.status} ({receiptEnrollment.progress || 0}%)
                  </p>
                </div>
              </div>

              {/* Stamp Badge */}
              <div className="pt-2 text-center border-t border-dashed border-slate-300">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-3 py-1 rounded-full">
                  <Check className="w-3 h-3 text-[#10B981]" /> Verified LMS Registration
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setReceiptEnrollment(null)}
                className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handlePrintReceipt(receiptEnrollment)}
                className="w-1/2 py-2.5 px-4 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Enrollment Confirmation Modal */}
      {deletingEnrollmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Remove Enrollment?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to un-enroll this student from the course? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingEnrollmentId(null)}
                className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="w-1/2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrollments;
