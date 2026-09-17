import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLMS } from '../../context/LMSContext';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  BookOpen,
  Star,
  Award,
  Users,
  Grid,
  List,
  Eye,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Briefcase,
  Layers,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { toast } from 'react-toastify';

const Instructors = () => {
  const navigate = useNavigate();
  const {
    instructors,
    loadingInstructors,
    errorInstructors,
    loadInstructors,
    courses,
    students,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    assignCoursesToInstructor
  } = useLMS();

  // Search, Filter, Sort & View Mode State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [deletingInstructorId, setDeletingInstructorId] = useState(null);

  // Profile View Modal State
  const [profileInstructor, setProfileInstructor] = useState(null);

  // Assign Courses Modal State
  const [assigningInstructor, setAssigningInstructor] = useState(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);

  // React Hook Form for Add/Edit Instructor
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const watchImage = watch('image', '');

  // Sample Avatar Presets for Quick Selection
  const avatarPresets = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80'
  ];

  // Unique Specializations List
  const specializations = useMemo(() => {
    const set = new Set(instructors.map((i) => i.specialization));
    return ['All', ...Array.from(set)];
  }, [instructors]);

  // Filtered Instructors
  const filteredInstructors = useMemo(() => {
    return instructors.filter((inst) => {
      const matchesSearch =
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpec =
        selectedSpecialization === 'All' ||
        inst.specialization.toLowerCase() === selectedSpecialization.toLowerCase();
      return matchesSearch && matchesSpec;
    });
  }, [instructors, searchTerm, selectedSpecialization]);

  // Summary Metrics Calculation
  const metrics = useMemo(() => {
    const totalCount = instructors.length;
    const avgRating = totalCount > 0 ? (instructors.reduce((acc, curr) => acc + (curr.rating || 0), 0) / totalCount).toFixed(2) : 0;
    const totalSystemStudents = students.length || 30;
    const avgStudentsTaught = totalCount > 0 ? Math.round(instructors.reduce((acc, curr) => acc + (curr.studentsTaught || 0), 0) / totalCount) : 0;
    const totalAssignedCourses = instructors.reduce((acc, curr) => acc + (curr.assignedCourseIds?.length || 0), 0);
    return { totalCount, avgRating, totalSystemStudents, avgStudentsTaught, totalAssignedCourses };
  }, [instructors, students]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage) || 1;
  const paginatedInstructors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInstructors.slice(start, start + itemsPerPage);
  }, [filteredInstructors, currentPage]);

  // Open Add Instructor Modal
  const handleOpenAdd = () => {
    setEditingInstructor(null);
    reset({
      name: '',
      email: '',
      phone: '',
      experience: '5 Years',
      specialization: 'Full Stack Development',
      rating: 4.8,
      studentsTaught: 24,
      image: avatarPresets[0],
      bio: '',
      assignedCourseIds: []
    });
    setIsAddEditOpen(true);
  };

  // Open Edit Instructor Modal
  const handleOpenEdit = (inst) => {
    setEditingInstructor(inst);
    reset({
      name: inst.name,
      email: inst.email,
      phone: inst.phone,
      experience: inst.experience,
      specialization: inst.specialization,
      rating: inst.rating,
      studentsTaught: inst.studentsTaught,
      image: inst.image,
      bio: inst.bio,
      assignedCourseIds: inst.assignedCourseIds || []
    });
    setIsAddEditOpen(true);
  };

  // Open Assign Courses Modal
  const handleOpenAssignModal = (inst) => {
    setAssigningInstructor(inst);
    setSelectedCourseIds(inst.assignedCourseIds || []);
  };

  // Toggle course assignment checkbox in modal
  const handleToggleCourseSelection = (courseId) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Confirm Course Assignment
  const handleSaveAssignedCourses = () => {
    if (assigningInstructor) {
      assignCoursesToInstructor(assigningInstructor.id, selectedCourseIds);
      setAssigningInstructor(null);
    }
  };

  // Submit Add/Edit Form
  const onFormSubmit = (data) => {
    if (editingInstructor) {
      updateInstructor(editingInstructor.id, data);
    } else {
      addInstructor(data);
    }
    setIsAddEditOpen(false);
  };

  // Confirm Delete Instructor
  const handleConfirmDelete = () => {
    if (deletingInstructorId) {
      deleteInstructor(deletingInstructorId);
      setDeletingInstructorId(null);
    }
  };

  // Helper to resolve course details from course IDs
  const getInstructorCourses = (courseIds = []) => {
    return courses.filter((c) => courseIds.includes(c.id.toString()));
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Instructor Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage instructors, assign courses, view instructor ratings, specializations, and detailed profile statistics.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Instructor</span>
        </button>
      </div>

      {/* Summary Metrics Banner (4 Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Instructors */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Instructors</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{metrics.totalCount}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-[#10B981] rounded-2xl">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Avg Instructor Rating</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1 flex items-center gap-1">
              <span>{metrics.avgRating}</span>
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </h3>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl">
            <Star className="w-6 h-6" />
          </div>
        </div>

        {/* Total System Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">System Students</p>
            <h3 className="text-2xl font-extrabold text-sky-600 mt-1 flex items-baseline gap-1.5">
              <span>{metrics.totalSystemStudents}</span>
              <span className="text-[11px] font-semibold text-slate-400">Total Registered</span>
            </h3>
          </div>
          <div className="p-3 bg-sky-500/10 text-sky-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Assigned Courses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Assigned Courses</p>
            <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">{metrics.totalAssignedCourses}</h3>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Specialization Filter & View Mode Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by instructor name, email, specialization..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#10B981] focus:bg-white transition-all"
          />
        </div>

        {/* Controls: Specialization Filter & View Toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Specialization Dropdown Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedSpecialization}
              onChange={(e) => {
                setSelectedSpecialization(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#10B981] font-semibold w-full sm:w-auto"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  Specialization: {spec}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle Buttons (Grid vs Table) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-end sm:self-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-[#10B981] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-[#10B981] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loadingInstructors && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white h-64 rounded-3xl border border-slate-200/80 p-6"></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {errorInstructors && !loadingInstructors && (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-rose-900">{errorInstructors}</h3>
          <button
            onClick={loadInstructors}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Loading</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loadingInstructors && !errorInstructors && paginatedInstructors.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Instructors Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No instructor records match your search criteria "{searchTerm}". Click "Add New Instructor" to add one.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#10B981] text-white rounded-xl text-xs font-semibold mt-2 cursor-pointer"
          >
            Add Instructor
          </button>
        </div>
      )}

      {/* Instructor Cards Grid View */}
      {!loadingInstructors && !errorInstructors && viewMode === 'grid' && paginatedInstructors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedInstructors.map((inst) => {
            const assignedCourses = getInstructorCourses(inst.assignedCourseIds);
            return (
              <div
                key={inst.id}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Top Cover Banner */}
                  <div className="h-20 bg-gradient-to-r from-[#0B2522] to-emerald-800 relative p-4 flex justify-between items-start">
                    <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md text-white font-bold text-[10px] rounded-full border border-white/20">
                      {inst.experience} Exp
                    </span>
                    <span className="px-2.5 py-1 bg-amber-500 text-white font-extrabold text-[10px] rounded-full flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-white" />
                      {inst.rating}
                    </span>
                  </div>

                  {/* Avatar & Header Profile Info */}
                  <div className="px-6 relative pb-4 border-b border-slate-100">
                    <div className="-mt-10 mb-3 flex items-end justify-between">
                      <img
                        src={inst.image}
                        alt={inst.name}
                        className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
                      />
                      <span className="px-3 py-1 bg-emerald-50 text-[#10B981] font-bold text-xs rounded-xl border border-emerald-200/60">
                        {inst.specialization}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#10B981] transition-colors">
                      {inst.name}
                    </h3>

                    {/* Email & Phone */}
                    <div className="mt-2 space-y-1 text-xs text-slate-500">
                      <p className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{inst.email}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{inst.phone}</span>
                      </p>
                    </div>

                    {/* Stats Pill Row */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Students Taught</p>
                        <p className="font-extrabold text-slate-800 text-sm">{inst.studentsTaught?.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned Courses</p>
                        <p className="font-extrabold text-indigo-600 text-sm">{assignedCourses.length} Courses</p>
                      </div>
                    </div>

                    {/* Assigned Courses Chips */}
                    <div className="mt-4 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Courses:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {assignedCourses.length > 0 ? (
                          assignedCourses.map((c) => (
                            <span
                              key={c.id}
                              className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold text-[10px] rounded-md border border-indigo-100 truncate max-w-[140px]"
                            >
                              {c.title}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No courses assigned yet.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-50/80 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/instructors/${inst.id}`)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Profile</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenAssignModal(inst)}
                      title="Assign LMS Courses"
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(inst)}
                      title="Edit Instructor Profile"
                      className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingInstructorId(inst.id)}
                      title="Delete Instructor"
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instructor Table View */}
      {!loadingInstructors && !errorInstructors && viewMode === 'table' && paginatedInstructors.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-4 pl-6">Instructor Name</th>
                  <th className="p-4">Contact Details</th>
                  <th className="p-4">Specialization</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Assigned Courses</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedInstructors.map((inst) => {
                  const assignedCount = inst.assignedCourseIds?.length || 0;
                  return (
                    <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Name & Avatar */}
                      <td className="p-4 pl-6 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={inst.image}
                            alt={inst.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{inst.name}</p>
                            <p className="text-[11px] text-slate-400">{inst.studentsTaught} Students Taught</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="p-4 text-slate-600">
                        <div className="space-y-0.5">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {inst.email}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                            <Phone className="w-3 h-3" />
                            {inst.phone}
                          </span>
                        </div>
                      </td>

                      {/* Specialization Badge */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-emerald-50 text-[#10B981] font-bold text-[10px] rounded-lg">
                          {inst.specialization}
                        </span>
                      </td>

                      {/* Experience */}
                      <td className="p-4 font-semibold text-slate-800">
                        {inst.experience}
                      </td>

                      {/* Rating */}
                      <td className="p-4 font-extrabold text-amber-600">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {inst.rating}
                        </span>
                      </td>

                      {/* Assigned Courses Count */}
                      <td className="p-4 font-bold text-indigo-600">
                        <span className="px-2.5 py-1 bg-indigo-50 rounded-lg inline-flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-indigo-600" />
                          {assignedCount} Courses
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/instructors/${inst.id}`)}
                            title="View Profile"
                            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenAssignModal(inst)}
                            title="Assign Courses"
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(inst)}
                            title="Edit Profile"
                            className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingInstructorId(inst.id)}
                            title="Delete Instructor"
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
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
      {!loadingInstructors && !errorInstructors && totalPages > 1 && (
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

      {/* Add / Edit Instructor Modal */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingInstructor ? 'Edit Instructor Profile' : 'Add New Instructor'}
              </h3>
              <button
                onClick={() => setIsAddEditOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              {/* Full Name */}
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

              {/* Email & Phone */}
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
                  {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 234-5678"
                    {...register('phone', { required: 'Phone number is required' })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                  />
                  {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Specialization & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specialization *
                  </label>
                  <select
                    {...register('specialization', { required: 'Specialization required' })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:border-[#10B981] focus:outline-hidden"
                  >
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="Data Science & AI">Data Science & AI</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Database Architecture">Database Architecture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Experience *
                  </label>
                  <select
                    {...register('experience', { required: 'Experience required' })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:border-[#10B981] focus:outline-hidden"
                  >
                    <option value="1 Year">1 Year</option>
                    <option value="3 Years">3 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="8 Years">8 Years</option>
                    <option value="10 Years">10 Years</option>
                    <option value="12+ Years">12+ Years</option>
                  </select>
                </div>
              </div>

              {/* Rating & Students Taught */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Rating (out of 5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    {...register('rating')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-amber-600 focus:border-[#10B981] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Students Taught (Max 30)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    {...register('studentsTaught', {
                      max: { value: 30, message: 'Students taught cannot exceed total system students (30)' }
                    })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-[#10B981] focus:outline-hidden"
                  />
                  {errors.studentsTaught && <p className="text-xs text-rose-500 mt-1">{errors.studentsTaught.message}</p>}
                </div>
              </div>

              {/* Profile Image & Avatar Preset Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Profile Image URL *
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  {...register('image', { required: 'Profile image URL is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#10B981] focus:outline-hidden mb-2"
                />

                {/* Preset Avatar Selection Pills */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Presets:</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {avatarPresets.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt="Preset"
                        onClick={() => setValue('image', imgUrl)}
                        className={`w-7 h-7 rounded-full object-cover cursor-pointer ring-2 transition-all ${
                          watchImage === imgUrl ? 'ring-emerald-500 scale-110' : 'ring-transparent opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio / Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Instructor Bio / Summary *
                </label>
                <textarea
                  rows="3"
                  placeholder="Write a brief professional summary about the instructor's expertise and background..."
                  {...register('bio', { required: 'Bio is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#10B981] focus:outline-hidden"
                ></textarea>
                {errors.bio && <p className="text-xs text-rose-500 mt-1">{errors.bio.message}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 px-4 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingInstructor ? 'Save Changes' : 'Add Instructor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Courses Modal */}
      {assigningInstructor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Assign Courses to Instructor</h3>
                <p className="text-xs text-slate-500 mt-0.5">{assigningInstructor.name} &bull; {assigningInstructor.specialization}</p>
              </div>
              <button
                onClick={() => setAssigningInstructor(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Course Checkboxes List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {courses.map((c) => {
                const isSelected = selectedCourseIds.includes(c.id.toString());
                return (
                  <div
                    key={c.id}
                    onClick={() => handleToggleCourseSelection(c.id.toString())}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-300 text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected ? 'bg-[#10B981] border-[#10B981] text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">{c.title}</p>
                        <p className="text-[10px] text-slate-400">{c.category} &bull; ${c.price}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {c.duration}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAssigningInstructor(null)}
                className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssignedCourses}
                className="w-1/2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Save Assigned Courses</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructor Profile View Modal */}
      {profileInstructor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-100 my-8 space-y-6">
            {/* Cover Banner */}
            <div className="h-28 bg-gradient-to-r from-[#0B2522] via-emerald-900 to-teal-800 rounded-2xl relative p-4 flex justify-between items-start shadow-inner">
              <button
                onClick={() => setProfileInstructor(null)}
                className="p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-xl backdrop-blur-md transition-colors cursor-pointer ml-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Avatar & Title */}
            <div className="-mt-16 px-4 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                <img
                  src={profileInstructor.image}
                  alt={profileInstructor.name}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-white shrink-0"
                />
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{profileInstructor.name}</h2>
                  <p className="text-xs text-[#10B981] font-bold mt-0.5">{profileInstructor.specialization}</p>
                </div>
              </div>

              <span className="px-3 py-1 bg-amber-50 text-amber-700 font-extrabold text-xs rounded-full border border-amber-200 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {profileInstructor.rating} Instructor Rating
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Experience</p>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{profileInstructor.experience}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Students Taught</p>
                <p className="font-extrabold text-sky-600 text-sm mt-0.5">{profileInstructor.studentsTaught?.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned Courses</p>
                <p className="font-extrabold text-indigo-600 text-sm mt-0.5">
                  {profileInstructor.assignedCourseIds?.length || 0} Courses
                </p>
              </div>
            </div>

            {/* Contact Details & Biography */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-4 text-slate-600 border-b border-slate-200/80 pb-3 font-medium">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  {profileInstructor.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  {profileInstructor.phone}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Biography / Summary</p>
                <p className="text-slate-700 leading-relaxed">{profileInstructor.bio}</p>
              </div>
            </div>

            {/* Assigned Courses List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Assigned Courses ({profileInstructor.assignedCourseIds?.length || 0})</span>
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {getInstructorCourses(profileInstructor.assignedCourseIds).length > 0 ? (
                  getInstructorCourses(profileInstructor.assignedCourseIds).map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{c.title}</p>
                        <p className="text-[10px] text-slate-400">{c.category} &bull; {c.duration}</p>
                      </div>
                      <span className="font-bold text-emerald-600 text-xs">${c.price}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No assigned courses currently.</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProfileInstructor(null)}
                className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const inst = profileInstructor;
                  setProfileInstructor(null);
                  handleOpenAssignModal(inst);
                }}
                className="w-1/2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Manage Assigned Courses</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {deletingInstructorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Remove Instructor?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete this instructor record? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingInstructorId(null)}
                className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
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

export default Instructors;
