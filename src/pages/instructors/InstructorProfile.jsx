import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLMS } from '../../context/LMSContext';
import {
  ArrowLeft,
  Mail,
  Phone,
  BookOpen,
  Star,
  Users,
  Award,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  Edit2,
  Sparkles,
  Calendar,
  Layers,
  ThumbsUp,
  Check,
  X,
  Clock,
  Copy,
  Download,
  Trash2,
  MapPin,
  Globe,
  Share2,
  MessageSquare,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { toast } from 'react-toastify';

const InstructorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    instructors,
    courses,
    students,
    loadingInstructors,
    updateInstructor,
    deleteInstructor,
    assignCoursesToInstructor
  } = useLMS();

  // Active Tab State: 'overview' | 'courses' | 'reviews' | 'schedule'
  const [activeTab, setActiveTab] = useState('overview');

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected courses for assign modal
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);

  // Helpful count state for student reviews
  const [helpfulCounts, setHelpfulCounts] = useState({
    1: 14,
    2: 9,
    3: 6,
    4: 3
  });
  const [likedReviews, setLikedReviews] = useState({});

  // React Hook Form for Edit Profile
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const watchImage = watch('image', '');

  // Preset Avatar URLs for edit modal
  const avatarPresets = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80'
  ];

  // Find target instructor by ID
  const instructor = useMemo(() => {
    return instructors.find((inst) => inst.id.toString() === id?.toString());
  }, [instructors, id]);

  // Resolve assigned course objects
  const assignedCourses = useMemo(() => {
    if (!instructor || !instructor.assignedCourseIds) return [];
    return courses.filter((c) => instructor.assignedCourseIds.includes(c.id.toString()));
  }, [courses, instructor]);

  // Dummy verified student reviews generator based on instructor name
  const studentReviews = useMemo(() => {
    if (!instructor) return [];
    return [
      {
        id: 1,
        studentName: 'Aarav Sharma',
        studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        date: '2 days ago',
        courseName: assignedCourses[0]?.title || 'Full Stack Web Development',
        comment: `${instructor.name} is an exceptional mentor! Explains complex concepts with real-world industry examples that are very easy to follow.`
      },
      {
        id: 2,
        studentName: 'Priya Patel',
        studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        date: '1 week ago',
        courseName: assignedCourses[1]?.title || 'React & Redux Masterclass',
        comment: `Outstanding teaching methodology. Always available during office hours and provides super detailed feedback on project assignments.`
      },
      {
        id: 3,
        studentName: 'Rohan Verma',
        studentAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        rating: 4.5,
        date: '2 weeks ago',
        courseName: assignedCourses[0]?.title || 'Web Architecture',
        comment: `Great practical insights. Learned how real software systems are designed and deployed in production.`
      },
      {
        id: 4,
        studentName: 'Ananya Reddy',
        studentAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        date: '1 month ago',
        courseName: assignedCourses[2]?.title || 'Database Engineering',
        comment: `Very engaging lectures and hands-on coding exercises. Highly recommend taking any course taught by ${instructor.name}!`
      }
    ];
  }, [instructor, assignedCourses]);

  // Office hours schedule mock
  const officeHoursSchedule = [
    { day: 'Monday', time: '10:00 AM - 12:30 PM', topic: 'Course Doubts & Code Reviews', location: 'Lab Room 304 / Zoom' },
    { day: 'Wednesday', time: '02:00 PM - 04:30 PM', topic: 'Project Guidance & Career Mentorship', location: 'Faculty Office B-12' },
    { day: 'Friday', time: '11:00 AM - 01:00 PM', topic: 'Assignment Evaluation & Q&A', location: 'Zoom Online Suite' }
  ];

  // Open Edit Modal
  const handleOpenEditModal = () => {
    if (!instructor) return;
    reset({
      name: instructor.name,
      email: instructor.email,
      phone: instructor.phone,
      experience: instructor.experience,
      specialization: instructor.specialization,
      rating: instructor.rating,
      studentsTaught: instructor.studentsTaught,
      image: instructor.image,
      bio: instructor.bio
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit Form
  const onEditSubmit = (data) => {
    if (!instructor) return;
    updateInstructor(instructor.id, data);
    setIsEditModalOpen(false);
  };

  // Open Assign Courses Modal
  const handleOpenAssignModal = () => {
    if (!instructor) return;
    setSelectedCourseIds(instructor.assignedCourseIds || []);
    setIsAssignModalOpen(true);
  };

  // Toggle Course in Assign Modal
  const handleToggleCourse = (courseId) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  // Save Assigned Courses
  const handleSaveAssignedCourses = () => {
    if (!instructor) return;
    assignCoursesToInstructor(instructor.id, selectedCourseIds);
    setIsAssignModalOpen(false);
  };

  // Confirm Delete Instructor
  const handleConfirmDelete = () => {
    if (!instructor) return;
    deleteInstructor(instructor.id);
    setIsDeleteModalOpen(false);
    navigate('/instructors');
  };

  // Copy Email to Clipboard
  const handleCopyEmail = () => {
    if (instructor?.email) {
      navigator.clipboard.writeText(instructor.email);
      toast.success(`Copied "${instructor.email}" to clipboard!`);
    }
  };

  // Download Profile Resume/PDF mockup
  const handleDownloadCV = () => {
    toast.info(`Downloading official Faculty Profile summary for ${instructor?.name}...`);
  };

  // Toggle Helpful count for reviews
  const handleToggleHelpful = (reviewId) => {
    setLikedReviews((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
    setHelpfulCounts((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + (likedReviews[reviewId] ? -1 : 1)
    }));
  };

  if (loadingInstructors) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 animate-pulse">
        <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto"></div>
        <div className="h-6 bg-slate-200 rounded-xl w-48 mx-auto"></div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 my-8">
        <Award className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800">Instructor Profile Not Found</h3>
        <p className="text-xs text-slate-500">
          No instructor record matches ID "{id}".
        </p>
        <Link
          to="/instructors"
          className="px-4 py-2 bg-[#10B981] text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer mt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Instructors</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-10">
      {/* Top Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/instructors')}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-2xs transition-all flex items-center gap-2 cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Back to All Instructors</span>
        </button>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyEmail}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copy Email Address"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Copy Email</span>
          </button>

          <button
            onClick={handleDownloadCV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download Faculty Summary"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Download CV</span>
          </button>

          <button
            onClick={handleOpenAssignModal}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Assign Courses ({assignedCourses.length})</span>
          </button>

          <button
            onClick={handleOpenEditModal}
            className="px-3.5 py-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-200 transition-colors cursor-pointer"
            title="Delete Instructor Profile"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Cover Banner & Profile Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        {/* Cover Gradient Banner */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-[#0B2522] via-emerald-900 to-teal-800 relative p-6 flex justify-between items-start shadow-inner">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white font-bold text-xs rounded-full border border-white/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Verified Senior Faculty
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-200 font-bold text-xs rounded-full border border-emerald-400/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Active Status
            </span>
          </div>

          <span className="px-4 py-1.5 bg-amber-500 text-white font-extrabold text-xs rounded-full flex items-center gap-1.5 shadow-md">
            <Star className="w-4 h-4 fill-white" />
            {instructor.rating} Rating
          </span>
        </div>

        {/* Profile Avatar & Header Detail */}
        <div className="px-6 sm:px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-20 sm:-mt-16 pb-6 border-b border-slate-100 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              <div className="relative">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-white shrink-0"
                />
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs" title="Online & Available"></span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {instructor.name}
                  </h1>
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs font-bold text-emerald-600 flex items-center justify-center sm:justify-start gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>{instructor.specialization} Expert</span>
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-slate-500 text-xs">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {instructor.email}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {instructor.phone}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    EduLearn Main Campus
                  </span>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-2 self-center sm:self-end">
              <a
                href="#linkedin"
                onClick={(e) => { e.preventDefault(); toast.info(`Visiting ${instructor.name}'s LinkedIn profile`); }}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
                title="LinkedIn Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a
                href="#twitter"
                onClick={(e) => { e.preventDefault(); toast.info(`Visiting ${instructor.name}'s Twitter profile`); }}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
                title="Twitter / X Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="#website"
                onClick={(e) => { e.preventDefault(); toast.info(`Visiting ${instructor.name}'s Academic Portfolio`); }}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
                title="Academic Portfolio Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Key KPI Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Students Taught</p>
                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5 flex items-baseline gap-1">
                  <span>{instructor.studentsTaught}</span>
                  <span className="text-xs font-semibold text-slate-400">/ {students.length || 30} Total</span>
                </h4>
              </div>
              <div className="p-2.5 bg-sky-500/10 text-sky-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Faculty Rating</p>
                <h4 className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-0.5 flex items-center gap-1">
                  <span>{instructor.rating}</span>
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </h4>
              </div>
              <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
                <Star className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Assigned Courses</p>
                <h4 className="text-xl sm:text-2xl font-extrabold text-indigo-600 mt-0.5">{assignedCourses.length} Courses</h4>
              </div>
              <div className="p-2.5 bg-indigo-500/10 text-indigo-600 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Experience</p>
                <h4 className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-0.5">{instructor.experience}</h4>
              </div>
              <div className="p-2.5 bg-emerald-500/10 text-[#10B981] rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Overview, Assigned Courses, Student Reviews, Teaching Schedule) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'overview'
              ? 'bg-[#10B981] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Faculty Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'courses'
              ? 'bg-[#10B981] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Assigned Courses ({assignedCourses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'reviews'
              ? 'bg-[#10B981] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Student Reviews ({studentReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'schedule'
              ? 'bg-[#10B981] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Office Hours & Schedule</span>
        </button>
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {/* Contact & Professional Details */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Contact Details</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Email Address</p>
                      <p className="font-semibold text-slate-800">{instructor.email}</p>
                    </div>
                  </div>
                  <button onClick={handleCopyEmail} className="text-slate-400 hover:text-slate-700 p-1">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</p>
                      <p className="font-semibold text-slate-800">{instructor.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Department Office</p>
                    <p className="font-semibold text-slate-800">Building B, Suite 402</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialization & Badges */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Specialization & Certifications</span>
              </h3>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200">
                  {instructor.specialization}
                </span>
                <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200">
                  Certified LMS Instructor
                </span>
                <span className="px-3 py-1.5 bg-sky-50 text-sky-700 font-bold text-xs rounded-xl border border-sky-200">
                  Industry Veteran ({instructor.experience})
                </span>
                <span className="px-3 py-1.5 bg-amber-50 text-amber-700 font-bold text-xs rounded-xl border border-amber-200">
                  Top Rated Faculty (5★)
                </span>
              </div>
            </div>
          </div>

          {/* Biography & Professional Summary */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>Professional Biography & Teaching Philosophy</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {instructor.bio}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Interactive Curriculum
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Focuses on real-world projects, live coding walkthroughs, and practical hands-on exercises.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Dedicated Mentorship
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Offers regular office hours and 1-on-1 code reviews to help students master challenging subjects.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Assigned Courses Preview Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Assigned Courses Quick Summary</span>
                </h3>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View All ({assignedCourses.length}) &rarr;
                </button>
              </div>

              {assignedCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {assignedCourses.slice(0, 2).map((c) => (
                    <div key={c.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-slate-900">{c.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{c.category} &bull; {c.duration}</p>
                      </div>
                      <Link to={`/courses/${c.id}`} className="p-2 bg-white text-indigo-600 rounded-xl border border-slate-200 hover:bg-indigo-50">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No courses currently assigned.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: ASSIGNED COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Assigned LMS Courses ({assignedCourses.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Courses actively assigned to and managed by {instructor.name}.
              </p>
            </div>

            <button
              onClick={handleOpenAssignModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Manage Assigned Courses</span>
            </button>
          </div>

          {assignedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedCourses.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Course Header Image */}
                    <div className="h-40 relative overflow-hidden">
                      <img
                        src={c.image}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white font-bold text-[10px] rounded-lg">
                        {c.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                        {c.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>

                      <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                        <span className="text-slate-500 flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {c.duration}
                        </span>
                        <span className="font-extrabold text-[#10B981] text-sm">${c.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Level: {c.level || 'Beginner'}</span>
                    <Link
                      to={`/courses/${c.id}`}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>View Course</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No Courses Assigned Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click "Manage Assigned Courses" to select and assign courses from the LMS catalog to {instructor.name}.
              </p>
              <button
                onClick={handleOpenAssignModal}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer mt-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Assign Courses Now</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: STUDENT REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Ratings Overview Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-1">
              <h3 className="text-3xl font-extrabold text-slate-900 flex items-center justify-center md:justify-start gap-2">
                <span>{instructor.rating}</span>
                <Star className="w-7 h-7 fill-amber-500 text-amber-500" />
              </h3>
              <p className="text-xs font-bold text-slate-600">Faculty Satisfaction Rating</p>
              <p className="text-[11px] text-slate-400">Based on verified student evaluations across all assigned courses</p>
            </div>

            {/* Distribution Bar */}
            <div className="w-full md:w-80 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-8 font-bold text-right">5 ★</span>
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[90%] rounded-full"></div>
                </div>
                <span className="w-8 font-semibold text-slate-400">90%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 font-bold text-right">4 ★</span>
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[8%] rounded-full"></div>
                </div>
                <span className="w-8 font-semibold text-slate-400">8%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 font-bold text-right">3 ★</span>
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[2%] rounded-full"></div>
                </div>
                <span className="w-8 font-semibold text-slate-400">2%</span>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Verified Student Feedback ({studentReviews.length})
            </h4>

            <div className="space-y-4">
              {studentReviews.map((rev) => (
                <div key={rev.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.studentAvatar}
                        alt={rev.studentName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20"
                      />
                      <div>
                        <p className="font-bold text-xs text-slate-900">{rev.studentName}</p>
                        <p className="text-[10px] text-slate-400">{rev.courseName} &bull; {rev.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(rev.rating) ? 'fill-amber-500 text-amber-500' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Enrolled Student
                    </span>

                    <button
                      onClick={() => handleToggleHelpful(rev.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        likedReviews[rev.id]
                          ? 'bg-emerald-50 text-emerald-700 font-bold'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({helpfulCounts[rev.id] || 0})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: OFFICE HOURS & SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Weekly Teaching Schedule & Office Hours</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Students can visit during these dedicated hours or book a 1-on-1 mentorship session.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {officeHoursSchedule.map((slot, idx) => (
                <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200">
                      {slot.day}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Available</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-extrabold text-slate-900">{slot.time}</p>
                    <p className="text-xs font-semibold text-slate-700">{slot.topic}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {slot.location}
                    </p>
                  </div>

                  <button
                    onClick={() => toast.success(`Meeting slot requested for ${slot.day} with ${instructor.name}!`)}
                    className="w-full py-2 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
                  >
                    Request Slot
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EDIT INSTRUCTOR MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-extrabold text-slate-900">Edit Instructor Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
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
                    {...register('phone', { required: 'Phone number is required' })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#10B981] focus:outline-hidden"
                  />
                </div>
              </div>

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

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Profile Image URL *
                </label>
                <input
                  type="text"
                  {...register('image', { required: 'Profile image URL is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#10B981] focus:outline-hidden mb-2"
                />

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

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Instructor Bio / Summary *
                </label>
                <textarea
                  rows="3"
                  {...register('bio', { required: 'Bio is required' })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#10B981] focus:outline-hidden"
                ></textarea>
                {errors.bio && <p className="text-xs text-rose-500 mt-1">{errors.bio.message}</p>}
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 px-4 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN COURSES MODAL */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Assign Courses to Instructor</h3>
                <p className="text-xs text-slate-500 mt-0.5">{instructor.name} &bull; {instructor.specialization}</p>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {courses.map((c) => {
                const isSelected = selectedCourseIds.includes(c.id.toString());
                return (
                  <div
                    key={c.id}
                    onClick={() => handleToggleCourse(c.id.toString())}
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

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
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

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Remove Instructor?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete <strong>{instructor.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
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

export default InstructorProfile;
