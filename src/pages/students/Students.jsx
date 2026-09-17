import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useLMS } from '../../context/LMSContext';
import {
  Users,
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
  GraduationCap,
  MapPin,
  Calendar,
  UserCheck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const Students = () => {
  const {
    students,
    loadingStudents,
    errorStudents,
    loadStudents,
    addStudent,
    updateStudent,
    deleteStudent
  } = useLMS();

  // Search & Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQualification, setSelectedQualification] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudentId, setDeletingStudentId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Unique Qualifications List
  const qualifications = useMemo(() => {
    const set = new Set(students.map((s) => s.qualification));
    return ['All', ...Array.from(set)];
  }, [students]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.mobile.includes(searchTerm) ||
        s.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesQual =
        selectedQualification === 'All' ||
        s.qualification.toLowerCase() === selectedQualification.toLowerCase();
      return matchesSearch && matchesQual;
    });
  }, [students, searchTerm, selectedQualification]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  // Open Add Student Modal
  const handleOpenAdd = () => {
    setEditingStudent(null);
    reset({
      name: '',
      email: '',
      mobile: '',
      address: '',
      qualification: 'B.Tech',
      enrollmentDate: new Date().toISOString().split('T')[0]
    });
    setIsAddEditOpen(true);
  };

  // Open Edit Student Modal
  const handleOpenEdit = (s) => {
    setEditingStudent(s);
    reset({
      name: s.name,
      email: s.email,
      mobile: s.mobile,
      address: s.address,
      qualification: s.qualification,
      enrollmentDate: s.enrollmentDate
    });
    setIsAddEditOpen(true);
  };

  // Submit Form (Add or Edit)
  const onFormSubmit = (data) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, data);
    } else {
      addStudent(data);
    }
    setIsAddEditOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (deletingStudentId) {
      deleteStudent(deletingStudentId);
      setDeletingStudentId(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage student records, enrollments, qualifications, and profiles.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 self-start sm:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, mobile, or address..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#10B981] focus:bg-white transition-all"
          />
        </div>

        {/* Qualification Dropdown Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedQualification}
            onChange={(e) => {
              setSelectedQualification(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#10B981] font-semibold w-full md:w-auto"
          >
            {qualifications.map((q) => (
              <option key={q} value={q}>
                Qualification: {q}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Skeleton Loading State */}
      {loadingStudents && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-12 bg-slate-200 rounded-xl w-full"></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {errorStudents && !loadingStudents && (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-rose-900">{errorStudents}</h3>
          <button
            onClick={loadStudents}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Loading</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loadingStudents && !errorStudents && paginatedStudents.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Students Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No student records match your search criteria "{searchTerm}".
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedQualification('All');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Student List Table */}
      {!loadingStudents && !errorStudents && paginatedStudents.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-4 pl-6">Student Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Qualification</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Enrollment Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Name & Avatar */}
                    <td className="p-4 pl-6 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={st.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={st.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20 shrink-0"
                      />
                      <span>{st.name}</span>
                    </td>

                    {/* Email */}
                    <td className="p-4 text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {st.email}
                      </span>
                    </td>

                    {/* Mobile */}
                    <td className="p-4 text-slate-600 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {st.mobile}
                      </span>
                    </td>

                    {/* Qualification */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-[#10B981] font-bold text-[10px] rounded-lg">
                        {st.qualification}
                      </span>
                    </td>

                    {/* Address */}
                    <td className="p-4 text-slate-500 max-w-xs truncate">
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{st.address}</span>
                      </span>
                    </td>

                    {/* Enrollment Date */}
                    <td className="p-4 font-semibold text-emerald-700">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        {st.enrollmentDate}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(st)}
                          title="Edit Student"
                          className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingStudentId(st.id)}
                          title="Delete Student"
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!loadingStudents && !errorStudents && totalPages > 1 && (
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

      {/* Add / Edit Student Modal */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingStudent ? 'Edit Student Record' : 'Add New Student'}
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
                  placeholder="e.g. Rahul Sharma"
                  {...register('name', { required: 'Full name is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
              </div>

              {/* Grid: Email & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="student@gmail.com"
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email format'
                      }
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
                    placeholder="9876543210"
                    {...register('mobile', {
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Must be a 10-digit mobile number'
                      }
                    })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden font-mono"
                  />
                  {errors.mobile && <p className="text-xs text-rose-500 mt-1">{errors.mobile.message}</p>}
                </div>
              </div>

              {/* Grid: Qualification & Enrollment Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Qualification *
                  </label>
                  <select
                    {...register('qualification', { required: 'Qualification required' })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden font-medium"
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="MCA">MCA</option>
                    <option value="BCA">BCA</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MBA">MBA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Enrollment Date *
                  </label>
                  <input
                    type="date"
                    {...register('enrollmentDate', { required: 'Enrollment date required' })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                  />
                  {errors.enrollmentDate && <p className="text-xs text-rose-500 mt-1">{errors.enrollmentDate.message}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Address *
                </label>
                <textarea
                  rows="2"
                  placeholder="Enter student address..."
                  {...register('address', { required: 'Address is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                ></textarea>
                {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address.message}</p>}
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
                  {editingStudent ? 'Save Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Student Record?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete this student record? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingStudentId(null)}
                className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
