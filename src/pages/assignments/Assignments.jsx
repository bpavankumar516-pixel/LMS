import React, { useState, useMemo, useEffect } from 'react';
import {
  FileCheck,
  HelpCircle,
  Clock,
  Award,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Send,
  ExternalLink,
  BookOpen,
  UserCheck,
  Eye,
  Trash2,
  Edit,
  Play,
  RotateCcw,
  Download,
  Printer,
  ChevronRight,
  ChevronLeft,
  Flag,
  FileText,
  Sparkles,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { toast } from 'react-toastify';

const Assignments = () => {
  const { user } = useAuth();
  const {
    courses = [],
    assignments = [],
    submissions = [],
    loadingAssignments,
    addAssignment,
    deleteAssignment,
    submitAssignment,
    gradeSubmission,
    quizzes = [],
    quizAttempts = [],
    loadingQuizzes,
    addQuiz,
    deleteQuiz,
    togglePublishQuiz,
    submitQuizAttempt
  } = useLMS();

  const isStudent = user?.role === 'Student';
  const currentStudentEmail = (user?.email || '').toLowerCase();
  const currentStudentId = user?.studentId || user?.id || 'st-pavan';
  const currentStudentName = user?.name || 'Pavan Kumar';

  // Active Tab: 'assignments' | 'quizzes'
  const [activeTab, setActiveTab] = useState('assignments');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modal States
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignmentForSubmit, setSelectedAssignmentForSubmit] = useState(null);
  const [submissionTextInput, setSubmissionTextInput] = useState('');
  const [submissionUrlInput, setSubmissionUrlInput] = useState('');

  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmissionForGrade, setSelectedSubmissionForGrade] = useState(null);
  const [gradeMarksInput, setGradeMarksInput] = useState(100);
  const [gradeFeedbackInput, setGradeFeedbackInput] = useState('');

  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [quizFormTitle, setQuizFormTitle] = useState('');
  const [quizFormCourseId, setQuizFormCourseId] = useState('');
  const [quizFormDuration, setQuizFormDuration] = useState(10);
  const [quizFormPassMarks, setQuizFormPassMarks] = useState(70);
  const [quizFormDescription, setQuizFormDescription] = useState('');
  const [quizFormQuestions, setQuizFormQuestions] = useState([
    {
      id: `q-${Date.now()}-1`,
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      explanation: ''
    }
  ]);

  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedQuizForResults, setSelectedQuizForResults] = useState(null);

  // Live Exam State
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [activeQuizToAttempt, setActiveQuizToAttempt] = useState(null);
  const [isExamLive, setIsExamLive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: optionIndex }
  const [flaggedQuestions, setFlaggedQuestions] = useState({}); // { questionId: true }
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [examResult, setExamResult] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Live Timer Effect for Exam
  useEffect(() => {
    let timerInterval = null;
    if (isExamLive && timeLeftSeconds > 0) {
      timerInterval = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            handleAutoSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isExamLive, timeLeftSeconds]);

  // Form Reset Helpers
  const resetAssignmentForm = () => {
    setShowCreateAssignmentModal(false);
  };

  const handleCreateAssignmentSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const courseId = formData.get('courseId');
    const targetCourse = courses.find((c) => String(c.id) === String(courseId));

    addAssignment({
      title: formData.get('title'),
      courseId,
      courseTitle: targetCourse?.title || 'General Course',
      instructorName: targetCourse?.instructor || 'Dr. Emily Carter',
      deadline: formData.get('deadline'),
      totalMarks: formData.get('totalMarks'),
      instructions: formData.get('instructions')
    });
    resetAssignmentForm();
  };

  const handleStudentSubmitWork = (e) => {
    e.preventDefault();
    if (!selectedAssignmentForSubmit) return;

    submitAssignment({
      assignmentId: selectedAssignmentForSubmit.id,
      studentId: currentStudentId,
      studentName: currentStudentName,
      studentEmail: currentStudentEmail,
      submissionText: submissionTextInput,
      fileUrl: submissionUrlInput,
      totalMarks: selectedAssignmentForSubmit.totalMarks
    });

    setShowSubmitModal(false);
    setSelectedAssignmentForSubmit(null);
    setSubmissionTextInput('');
    setSubmissionUrlInput('');
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    if (!selectedSubmissionForGrade) return;

    gradeSubmission(
      selectedSubmissionForGrade.id,
      gradeMarksInput,
      gradeFeedbackInput
    );
    setShowGradeModal(false);
    setSelectedSubmissionForGrade(null);
  };

  const handleAddQuestionField = () => {
    setQuizFormQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}-${prev.length + 1}`,
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        explanation: ''
      }
    ]);
  };

  const handleRemoveQuestionField = (index) => {
    if (quizFormQuestions.length <= 1) {
      toast.warn('Quiz must contain at least 1 question.');
      return;
    }
    setQuizFormQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateQuizSubmit = (e) => {
    e.preventDefault();
    if (!quizFormTitle || !quizFormCourseId) {
      toast.error('Please enter a Quiz Title and select a Course.');
      return;
    }

    const invalidQuestions = quizFormQuestions.some(
      (q) => !q.questionText.trim() || q.options.some((opt) => !opt.trim())
    );

    if (invalidQuestions) {
      toast.error('Please complete all question titles and option fields.');
      return;
    }

    const targetCourse = courses.find((c) => String(c.id) === String(quizFormCourseId));

    addQuiz({
      title: quizFormTitle,
      courseId: quizFormCourseId,
      courseTitle: targetCourse?.title || 'General Course',
      instructorName: targetCourse?.instructor || 'Dr. Emily Carter',
      durationMinutes: quizFormDuration,
      passingMarks: quizFormPassMarks,
      description: quizFormDescription,
      questions: quizFormQuestions,
      published: true
    });

    setShowCreateQuizModal(false);
    setQuizFormTitle('');
    setQuizFormCourseId('');
    setQuizFormDuration(10);
    setQuizFormPassMarks(70);
    setQuizFormDescription('');
    setQuizFormQuestions([
      {
        id: `q-${Date.now()}-1`,
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        explanation: ''
      }
    ]);
  };

  // Exam Launcher Handlers
  const startExam = (quiz) => {
    setActiveQuizToAttempt(quiz);
    setShowInstructionsModal(true);
  };

  const confirmStartExam = () => {
    if (!activeQuizToAttempt) return;
    setShowInstructionsModal(false);
    setIsExamLive(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setTimeLeftSeconds((activeQuizToAttempt.durationMinutes || 10) * 60);
    setExamResult(null);
  };

  const handleAutoSubmitExam = () => {
    if (!activeQuizToAttempt || !isExamLive) return;

    let correctCount = 0;
    const questions = activeQuizToAttempt.questions || [];
    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected !== undefined && Number(selected) === Number(q.correctOptionIndex)) {
        correctCount += 1;
      }
    });

    const scorePercentage = Math.round((correctCount / (questions.length || 1)) * 100);
    const passed = scorePercentage >= (activeQuizToAttempt.passingMarks || 70);
    const totalDurationSeconds = (activeQuizToAttempt.durationMinutes || 10) * 60;
    const timeTakenSeconds = Math.max(0, totalDurationSeconds - timeLeftSeconds);

    const savedAttempt = submitQuizAttempt({
      quizId: activeQuizToAttempt.id,
      quizTitle: activeQuizToAttempt.title,
      studentId: currentStudentId,
      studentName: currentStudentName,
      studentEmail: currentStudentEmail,
      scorePercentage,
      correctAnswersCount: correctCount,
      totalQuestions: questions.length,
      passed,
      timeTakenSeconds
    });

    setIsExamLive(false);
    setExamResult({
      ...savedAttempt,
      quiz: activeQuizToAttempt,
      userAnswers: selectedAnswers
    });
    toast.success('Exam submitted! Results calculated.');
  };

  // Filtered Assignments Data
  const filteredAssignments = useMemo(() => {
    return assignments.filter((asg) => {
      const matchesSearch =
        asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asg.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse =
        selectedCourseId === 'ALL' || String(asg.courseId) === String(selectedCourseId);
      return matchesSearch && matchesCourse;
    });
  }, [assignments, searchQuery, selectedCourseId]);

  // Filtered Quizzes Data
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((qz) => {
      const matchesSearch =
        qz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qz.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse =
        selectedCourseId === 'ALL' || String(qz.courseId) === String(selectedCourseId);
      const matchesPublished = isStudent ? qz.published !== false : true;
      return matchesSearch && matchesCourse && matchesPublished;
    });
  }, [quizzes, searchQuery, selectedCourseId, isStudent]);

  // Format Helper for Timers
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-[#0B2522] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold mb-3 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              MODULE 8: ASSIGNMENTS & QUIZZES
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isStudent ? 'My Assignments & Exams Portal' : 'Assignments & Quiz Assessment Manager'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {isStudent
                ? 'Review assigned coursework, submit your GitHub repositories, and attempt live timed quizzes to earn official completion certificates.'
                : 'Create online exams, publish question banks, manage student submissions, and grade coursework with instant feedback.'}
            </p>
          </div>

          {!isStudent && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setShowCreateAssignmentModal(true)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Assignment
              </button>
              <button
                onClick={() => setShowCreateQuizModal(true)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold flex items-center gap-2 backdrop-blur-xs transition-all border border-white/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create Quiz/Exam
              </button>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-white/10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'assignments'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            Course Assignments ({assignments.length})
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'quizzes'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Online Quizzes & Exams ({quizzes.length})
          </button>
        </div>
      </div>

      {/* Search & Course Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'assignments' ? 'assignments...' : 'quizzes...'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ASSIGNMENTS VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Total Assignments</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{assignments.length}</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {isStudent ? 'My Submissions' : 'Submissions Received'}
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {isStudent
                    ? submissions.filter(
                        (s) =>
                          s.studentEmail?.toLowerCase() === currentStudentEmail ||
                          String(s.studentId) === String(currentStudentId)
                      ).length
                    : submissions.length}
                </h3>
              </div>
              <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Graded Work</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {submissions.filter((s) => s.status === 'Graded').length}
                </h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Average Grade Score</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {submissions.filter((s) => s.status === 'Graded').length > 0
                    ? `${Math.round(
                        submissions
                          .filter((s) => s.status === 'Graded')
                          .reduce((acc, curr) => acc + (curr.marksAwarded || 0), 0) /
                          submissions.filter((s) => s.status === 'Graded').length
                      )}%`
                    : 'N/A'}
                </h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>

          {loadingAssignments ? (
            <SkeletonLoader type={viewMode === 'grid' ? 'card' : 'table'} count={4} />
          ) : filteredAssignments.length === 0 ? (
            <EmptyState
              icon={FileCheck}
              title="No Assignments Found"
              description="No assignments matched your search query or selected course filter."
              actionButtonText={!isStudent ? 'Create Assignment' : ''}
              onActionClick={!isStudent ? () => setShowCreateAssignmentModal(true) : null}
            />
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map((asg) => {
                const mySubmission = submissions.find(
                  (s) =>
                    s.assignmentId === asg.id &&
                    (s.studentEmail?.toLowerCase() === currentStudentEmail ||
                      String(s.studentId) === String(currentStudentId))
                );

                return (
                  <div
                    key={asg.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg">
                          {asg.courseTitle}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Due: {asg.deadline}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                        {asg.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{asg.instructions}</p>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-slate-700">
                          Total Marks: {asg.totalMarks}
                        </span>
                        {isStudent && (
                          <div className="mt-1">
                            {mySubmission ? (
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  mySubmission.status === 'Graded'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {mySubmission.status === 'Graded'
                                  ? `Graded: ${mySubmission.marksAwarded}/${asg.totalMarks}`
                                  : 'Submitted - Pending Grade'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                                Not Submitted
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isStudent ? (
                          <button
                            onClick={() => {
                              setSelectedAssignmentForSubmit(asg);
                              setSubmissionTextInput(mySubmission?.submissionText || '');
                              setSubmissionUrlInput(mySubmission?.fileUrl || '');
                              setShowSubmitModal(true);
                            }}
                            className="px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            {mySubmission ? 'Edit Submission' : 'Submit Work'}
                          </button>
                        ) : (
                          <button
                            onClick={() => deleteAssignment(asg.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Assignment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Assignment Details</th>
                      <th className="py-4 px-6">Course & Instructor</th>
                      <th className="py-4 px-6">Deadline</th>
                      <th className="py-4 px-6">Total Marks</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredAssignments.map((asg) => {
                      const mySubmission = submissions.find(
                        (s) =>
                          s.assignmentId === asg.id &&
                          (s.studentEmail?.toLowerCase() === currentStudentEmail ||
                            String(s.studentId) === String(currentStudentId))
                      );

                      const totalSubsForAsg = submissions.filter((s) => s.assignmentId === asg.id);

                      return (
                        <tr key={asg.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-bold text-slate-900">{asg.title}</p>
                            <p className="text-xs text-slate-500 line-clamp-1">{asg.instructions}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-slate-800">{asg.courseTitle}</p>
                            <p className="text-xs text-slate-500">{asg.instructorName}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              {asg.deadline}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-semibold text-slate-800">{asg.totalMarks} pts</td>
                          <td className="py-4 px-6">
                            {isStudent ? (
                              mySubmission ? (
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                    mySubmission.status === 'Graded'
                                      ? 'bg-purple-100 text-purple-700'
                                      : 'bg-emerald-100 text-emerald-700'
                                  }`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {mySubmission.status === 'Graded'
                                    ? `Graded: ${mySubmission.marksAwarded}/${asg.totalMarks}`
                                    : 'Submitted'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-200">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  Pending Submission
                                </span>
                              )
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-bold">
                                {totalSubsForAsg.length} Submissions
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            {isStudent ? (
                              <button
                                onClick={() => {
                                  setSelectedAssignmentForSubmit(asg);
                                  setSubmissionTextInput(mySubmission?.submissionText || '');
                                  setSubmissionUrlInput(mySubmission?.fileUrl || '');
                                  setShowSubmitModal(true);
                                }}
                                className="px-3.5 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                              >
                                {mySubmission ? 'View / Edit' : 'Submit Work'}
                              </button>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    const subToGrade = totalSubsForAsg[0];
                                    if (!subToGrade) {
                                      toast.info('No student submissions received for this assignment yet.');
                                      return;
                                    }
                                    setSelectedSubmissionForGrade(subToGrade);
                                    setGradeMarksInput(subToGrade.marksAwarded || asg.totalMarks);
                                    setGradeFeedbackInput(subToGrade.feedback || '');
                                    setShowGradeModal(true);
                                  }}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                                >
                                  Grade Submissions
                                </button>
                                <button
                                  onClick={() => deleteAssignment(asg.id)}
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: QUIZZES & EXAMS VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Available Quizzes</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{quizzes.length}</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <HelpCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Published Status</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {quizzes.filter((q) => q.published).length} Active
                </h3>
              </div>
              <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Total Attempts</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {isStudent
                    ? quizAttempts.filter(
                        (a) =>
                          a.studentEmail?.toLowerCase() === currentStudentEmail ||
                          String(a.studentId) === String(currentStudentId)
                      ).length
                    : quizAttempts.length}
                </h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <RotateCcw className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Exam Pass Rate</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {quizAttempts.length > 0
                    ? `${Math.round(
                        (quizAttempts.filter((a) => a.passed).length / quizAttempts.length) * 100
                      )}%`
                    : '100%'}
                </h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>

          {loadingQuizzes ? (
            <SkeletonLoader type="card" count={3} />
          ) : filteredQuizzes.length === 0 ? (
            <EmptyState
              icon={HelpCircle}
              title="No Quizzes Available"
              description="No exams or quizzes are available for the selected criteria."
              actionButtonText={!isStudent ? 'Create New Quiz' : ''}
              onActionClick={!isStudent ? () => setShowCreateQuizModal(true) : null}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => {
                const myAttempts = quizAttempts.filter(
                  (a) =>
                    a.quizId === quiz.id &&
                    (a.studentEmail?.toLowerCase() === currentStudentEmail ||
                      String(a.studentId) === String(currentStudentId))
                );
                const latestAttempt = myAttempts[0];

                return (
                  <div
                    key={quiz.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg">
                          {quiz.courseTitle}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          {quiz.durationMinutes} mins
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{quiz.description}</p>

                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-slate-600">
                        <span>Questions: {quiz.questions?.length || quiz.totalQuestions || 0}</span>
                        <span>Pass Score: {quiz.passingMarks}%</span>
                      </div>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                      {isStudent ? (
                        <div>
                          {latestAttempt ? (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                latestAttempt.passed
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              {latestAttempt.passed ? 'PASSED' : 'FAILED'}: {latestAttempt.scorePercentage}%
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-slate-500">Not Attempted</span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => togglePublishQuiz(quiz.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                            quiz.published
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {quiz.published ? 'Published' : 'Draft'}
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        {isStudent ? (
                          <button
                            onClick={() => startExam(quiz)}
                            className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            {latestAttempt ? 'Re-attempt Quiz' : 'Start Exam'}
                          </button>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setSelectedQuizForResults(quiz);
                                setShowResultsModal(true);
                              }}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                              title="View Student Results"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteQuiz(quiz.id)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer"
                              title="Delete Quiz"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE ASSIGNMENT MODAL (Admin) */}
      {/* ========================================================================= */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create New Assignment</h2>
            <p className="text-xs text-slate-500 mb-6">Assign coursework with deadlines and instructions for students.</p>

            <form onSubmit={handleCreateAssignmentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. React Single Page Application Capstone"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Course *</label>
                  <select
                    name="courseId"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                  >
                    <option value="">Select Course...</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deadline Date *</label>
                  <input
                    type="date"
                    name="deadline"
                    required
                    defaultValue="2026-10-15"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Marks *</label>
                <input
                  type="number"
                  name="totalMarks"
                  defaultValue={100}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructions & Guidelines</label>
                <textarea
                  name="instructions"
                  rows={3}
                  placeholder="Detailed guidelines on what students need to complete and submit..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateAssignmentModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-sm font-bold shadow-md cursor-pointer"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: STUDENT SUBMIT WORK MODAL */}
      {/* ========================================================================= */}
      {showSubmitModal && selectedAssignmentForSubmit && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Submit Assignment Work</h2>
            <p className="text-xs text-slate-500 mb-4">{selectedAssignmentForSubmit.title}</p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 text-xs text-slate-600 space-y-1">
              <p><strong>Course:</strong> {selectedAssignmentForSubmit.courseTitle}</p>
              <p><strong>Deadline:</strong> {selectedAssignmentForSubmit.deadline}</p>
              <p><strong>Total Marks:</strong> {selectedAssignmentForSubmit.totalMarks}</p>
            </div>

            <form onSubmit={handleStudentSubmitWork} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GitHub Repository / File Demo URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/project-repo"
                  value={submissionUrlInput}
                  onChange={(e) => setSubmissionUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes / Work Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide a brief summary of your solution and features implemented..."
                  value={submissionTextInput}
                  onChange={(e) => setSubmissionTextInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-sm font-bold shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: GRADE SUBMISSION MODAL (Admin) */}
      {/* ========================================================================= */}
      {showGradeModal && selectedSubmissionForGrade && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Grade Student Submission</h2>
            <p className="text-xs text-slate-500 mb-4">
              Student: <strong>{selectedSubmissionForGrade.studentName}</strong> ({selectedSubmissionForGrade.studentEmail})
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 text-xs space-y-2">
              <p className="font-semibold text-slate-800">Submission Link / Repository:</p>
              <a
                href={selectedSubmissionForGrade.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 underline font-mono flex items-center gap-1 break-all"
              >
                {selectedSubmissionForGrade.fileUrl}
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
              <p className="font-semibold text-slate-800 mt-2">Student Notes:</p>
              <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 italic">
                "{selectedSubmissionForGrade.submissionText || 'No notes provided.'}"
              </p>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Marks Awarded (Out of {selectedSubmissionForGrade.totalMarks}) *
                </label>
                <input
                  type="number"
                  max={selectedSubmissionForGrade.totalMarks}
                  min={0}
                  required
                  value={gradeMarksInput}
                  onChange={(e) => setGradeMarksInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructor Feedback</label>
                <textarea
                  rows={3}
                  placeholder="Provide constructive feedback for the student..."
                  value={gradeFeedbackInput}
                  onChange={(e) => setGradeFeedbackInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowGradeModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-md cursor-pointer"
                >
                  Save Grade & Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CREATE QUIZ / QUESTION BUILDER MODAL (Admin) */}
      {/* ========================================================================= */}
      {showCreateQuizModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create Online Exam & Question Builder</h2>
            <p className="text-xs text-slate-500 mb-6">Build questions, option choices, timer duration, and passing threshold.</p>

            <form onSubmit={handleCreateQuizSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quiz Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React & JS Core Quiz"
                    value={quizFormTitle}
                    onChange={(e) => setQuizFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Course *</label>
                  <select
                    required
                    value={quizFormCourseId}
                    onChange={(e) => setQuizFormCourseId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                  >
                    <option value="">Select Course...</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Minutes) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={quizFormDuration}
                    onChange={(e) => setQuizFormDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Passing Mark % *</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={quizFormPassMarks}
                    onChange={(e) => setQuizFormPassMarks(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quiz Overview Description</label>
                <input
                  type="text"
                  placeholder="Brief summary of what this assessment covers..."
                  value={quizFormDescription}
                  onChange={(e) => setQuizFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                />
              </div>

              {/* Dynamic Question Builder List */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Questions Builder ({quizFormQuestions.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddQuestionField}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Question
                  </button>
                </div>

                {quizFormQuestions.map((q, qIndex) => (
                  <div key={q.id || qIndex} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-700">Question #{qIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestionField(qIndex)}
                        className="text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Enter question text here..."
                      value={q.questionText}
                      onChange={(e) => {
                        const updated = [...quizFormQuestions];
                        updated[qIndex].questionText = e.target.value;
                        setQuizFormQuestions(updated);
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={Number(q.correctOptionIndex) === optIndex}
                            onChange={() => {
                              const updated = [...quizFormQuestions];
                              updated[qIndex].correctOptionIndex = optIndex;
                              setQuizFormQuestions(updated);
                            }}
                            className="text-[#10B981] focus:ring-[#10B981] cursor-pointer"
                          />
                          <input
                            type="text"
                            placeholder={`Option ${optIndex + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const updated = [...quizFormQuestions];
                              updated[qIndex].options[optIndex] = e.target.value;
                              setQuizFormQuestions(updated);
                            }}
                            className="w-full bg-transparent text-xs text-slate-800 focus:outline-hidden"
                          />
                        </div>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Explanation for correct answer..."
                      value={q.explanation}
                      onChange={(e) => {
                        const updated = [...quizFormQuestions];
                        updated[qIndex].explanation = e.target.value;
                        setQuizFormQuestions(updated);
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-hidden"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateQuizModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-sm font-bold shadow-md cursor-pointer"
                >
                  Publish Quiz/Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: QUIZ INSTRUCTIONS PRE-EXAM MODAL (Student) */}
      {/* ========================================================================= */}
      {showInstructionsModal && activeQuizToAttempt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <Clock className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-1">{activeQuizToAttempt.title}</h2>
            <p className="text-xs text-slate-500 mb-6">{activeQuizToAttempt.courseTitle}</p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5 mb-6">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Duration Limit:</span>
                <span className="font-bold text-slate-900">{activeQuizToAttempt.durationMinutes} Minutes</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Total Questions:</span>
                <span className="font-bold text-slate-900">
                  {activeQuizToAttempt.questions?.length || 0} Questions
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Passing Score:</span>
                <span className="font-bold text-emerald-600">{activeQuizToAttempt.passingMarks}% Score</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmStartExam}
                className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                Start Quiz Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: LIVE TIMED EXAM ENGINE MODAL */}
      {/* ========================================================================= */}
      {isExamLive && activeQuizToAttempt && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Exam Header */}
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-bold truncate">{activeQuizToAttempt.title}</h2>
                <p className="text-xs text-emerald-400">Live Student Assessment Mode</p>
              </div>

              <div
                className={`px-4 py-1.5 rounded-xl font-mono text-sm font-extrabold flex items-center gap-2 shadow-inner ${
                  timeLeftSeconds < 120
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                <Clock className="w-4 h-4" />
                {formatTime(timeLeftSeconds)}
              </div>
            </div>

            {/* Exam Body (Questions + Palette) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Main Question Box */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {activeQuizToAttempt.questions?.[currentQuestionIndex] && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">
                        Question {currentQuestionIndex + 1} of{' '}
                        {activeQuizToAttempt.questions.length}
                      </span>
                      <button
                        onClick={() => {
                          const qId = activeQuizToAttempt.questions[currentQuestionIndex].id;
                          setFlaggedQuestions((prev) => ({
                            ...prev,
                            [qId]: !prev[qId]
                          }));
                        }}
                        className={`text-xs font-bold flex items-center gap-1 px-3 py-1 rounded-lg border cursor-pointer ${
                          flaggedQuestions[activeQuizToAttempt.questions[currentQuestionIndex].id]
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        <Flag className="w-3.5 h-3.5" />
                        {flaggedQuestions[activeQuizToAttempt.questions[currentQuestionIndex].id]
                          ? 'Flagged for Review'
                          : 'Flag Question'}
                      </button>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {activeQuizToAttempt.questions[currentQuestionIndex].questionText}
                    </h3>

                    <div className="space-y-3 pt-2">
                      {activeQuizToAttempt.questions[currentQuestionIndex].options.map(
                        (opt, optIdx) => {
                          const qId = activeQuizToAttempt.questions[currentQuestionIndex].id;
                          const isSelected = Number(selectedAnswers[qId]) === optIdx;

                          return (
                            <button
                              key={optIdx}
                              onClick={() => {
                                setSelectedAnswers((prev) => ({
                                  ...prev,
                                  [qId]: optIdx
                                }));
                              }}
                              className={`w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-50 border-[#10B981] text-emerald-900 font-bold shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                                  isSelected
                                    ? 'border-[#10B981] bg-[#10B981] text-white'
                                    : 'border-slate-300 text-slate-400'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </div>
                              <span>{opt}</span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Question Palette Drawer */}
              <div className="w-full md:w-64 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-4 shrink-0 overflow-y-auto">
                <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                  Question Palette
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {activeQuizToAttempt.questions?.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isFlagged = flaggedQuestions[q.id];
                    const isCurrent = currentQuestionIndex === idx;

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          isCurrent
                            ? 'ring-2 ring-emerald-500 ring-offset-2'
                            : ''
                        } ${
                          isFlagged
                            ? 'bg-amber-400 text-slate-900'
                            : isAnswered
                            ? 'bg-[#10B981] text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-2 text-[11px] text-slate-600 border-t border-slate-200 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#10B981] rounded-full" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-amber-400 rounded-full" />
                    <span>Flagged for Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-slate-200 rounded-full" />
                    <span>Unanswered</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Footer Controls */}
            <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={handleAutoSubmitExam}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Exam
              </button>

              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min((activeQuizToAttempt.questions?.length || 1) - 1, prev + 1)
                  )
                }
                disabled={
                  currentQuestionIndex === (activeQuizToAttempt.questions?.length || 1) - 1
                }
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: INSTANT EXAM RESULT SCORECARD MODAL */}
      {/* ========================================================================= */}
      {examResult && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-8 ${
                  examResult.passed
                    ? 'bg-emerald-100 text-emerald-600 ring-emerald-50'
                    : 'bg-rose-100 text-rose-600 ring-rose-50'
                }`}
              >
                {examResult.passed ? (
                  <Award className="w-8 h-8" />
                ) : (
                  <XCircle className="w-8 h-8" />
                )}
              </div>

              <h2 className="text-2xl font-black text-slate-900">
                {examResult.passed ? 'Congratulations! You Passed 🎉' : 'Assessment Failed'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">{examResult.quizTitle}</p>

              <div className="my-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Final Score</p>
                  <p
                    className={`text-2xl font-black mt-0.5 ${
                      examResult.passed ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {examResult.scorePercentage}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Correct Answers</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {examResult.correctAnswersCount} / {examResult.totalQuestions}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Time Taken</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {formatTime(examResult.timeTakenSeconds || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Explanations Review */}
            <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar pr-1 mb-6">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Question Review & Explanations
              </h4>
              {examResult.quiz?.questions?.map((q, idx) => {
                const userAns = examResult.userAnswers?.[q.id];
                const isCorrect = Number(userAns) === Number(q.correctOptionIndex);

                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                      isCorrect ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                    }`}
                  >
                    <p className="font-bold text-slate-900">
                      {idx + 1}. {q.questionText}
                    </p>
                    <p className="text-slate-700">
                      <strong>Your Answer:</strong>{' '}
                      {userAns !== undefined ? q.options[userAns] : 'Not Answered'}
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-700 font-semibold">
                        <strong>Correct Answer:</strong> {q.options[q.correctOptionIndex]}
                      </p>
                    )}
                    <p className="text-slate-500 italic pt-1 border-t border-slate-200/50">
                      💡 {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setExamResult(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Scorecard
              </button>

              {examResult.passed && (
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  Download Quiz Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: QUIZ COMPLETION CERTIFICATE MODAL */}
      {/* ========================================================================= */}
      {showCertificateModal && examResult && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border-4 border-emerald-600 text-center relative overflow-hidden">
            <div className="border-2 border-dashed border-emerald-300 p-8 rounded-2xl bg-gradient-to-b from-white via-emerald-50/20 to-white">
              <Award className="w-16 h-16 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-extrabold tracking-widest text-emerald-700 uppercase">
                Certificate of Academic Achievement
              </p>
              <h2 className="text-3xl font-black text-slate-900 mt-2 font-serif">
                Official Quiz Distinction
              </h2>

              <p className="text-xs text-slate-500 mt-4">This certifies that</p>
              <h3 className="text-2xl font-bold text-emerald-900 my-1 underline decoration-emerald-500">
                {currentStudentName}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                has successfully passed the online examination for
              </p>
              <h4 className="text-lg font-bold text-slate-800 mt-1">{examResult.quizTitle}</h4>
              <p className="text-xs text-slate-500 mt-1">
                Score Secured: <strong>{examResult.scorePercentage}%</strong> | Date: {new Date().toLocaleDateString()}
              </p>

              <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-200 text-left text-xs text-slate-500">
                <div>
                  <p className="font-bold text-slate-800">EduLearn Academic Board</p>
                  <p>Verified Online Assessor</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[10px] text-slate-400">ID: CERT-{Date.now().toString().slice(-6)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
