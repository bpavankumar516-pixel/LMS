import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import {
  ArrowLeft,
  Clock,
  BarChart,
  User,
  Star,
  CheckCircle,
  BookOpen,
  DollarSign,
  TrendingUp,
  Award,
  CheckSquare,
  Square,
  Lock,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Printer,
  X,
  RotateCcw,
  CheckCircle2,
  XCircle,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertTriangle,
  Send
} from 'lucide-react';
import { toast } from 'react-toastify';

const COURSE_LESSONS = [
  { id: 1, title: 'Module 1: Course Overview & Environment Setup', duration: '35 mins' },
  { id: 2, title: 'Module 2: Core Concepts, Syntax & Principles', duration: '1 hr 10 mins' },
  { id: 3, title: 'Module 3: Advanced Architecture & Data Flow', duration: '50 mins' },
  { id: 4, title: 'Module 4: Real-Time API Integration & State Persistence', duration: '1 hr 25 mins' },
  { id: 5, title: 'Module 5: Hands-On Portfolio Project Implementation', duration: '2 hrs 00 mins' }
];

const QUIZ_QUESTIONS = {
  Programming: [
    {
      id: 1,
      question: 'What is the primary benefit of component-based architecture in modern Web Development?',
      options: ['Slower rendering', 'Reusability and modular code structure', 'Requires no CSS styling', 'Only works on desktop screens'],
      answer: 1
    },
    {
      id: 2,
      question: 'Which React hook is used for managing side effects like API calls and subscriptions?',
      options: ['useState', 'useContext', 'useEffect', 'useReducer'],
      answer: 2
    },
    {
      id: 3,
      question: 'What is the average time complexity of a Binary Search algorithm?',
      options: ['O(n)', 'O(1)', 'O(n^2)', 'O(log n)'],
      answer: 3
    },
    {
      id: 4,
      question: 'Which HTTP status code signifies a successful request response?',
      options: ['200 OK', '404 Not Found', '500 Internal Error', '301 Moved Permanently'],
      answer: 0
    },
    {
      id: 5,
      question: 'Which JavaScript method converts a JavaScript object into a JSON string format?',
      options: ['JSON.parse()', 'JSON.stringify()', 'Object.toJSON()', 'String.serialize()'],
      answer: 1
    }
  ],
  Design: [
    {
      id: 1,
      question: 'What does the acronym UX stand for in product design?',
      options: ['Universal Extension', 'User Experience', 'Unit Execution', 'User Interface'],
      answer: 1
    },
    {
      id: 2,
      question: 'Which color scheme utilizes colors located directly opposite each other on the color wheel?',
      options: ['Analogous', 'Monochromatic', 'Complementary', 'Triadic'],
      answer: 2
    },
    {
      id: 3,
      question: 'What is the recommended minimum touch target size for mobile UI elements?',
      options: ['12x12 px', '24x24 px', '48x48 px', '100x100 px'],
      answer: 2
    },
    {
      id: 4,
      question: 'Which principle creates a clear visual order of importance among screen elements?',
      options: ['Visual Hierarchy', 'Rasterization', 'Grid Padding', 'Opacity Scaling'],
      answer: 0
    },
    {
      id: 5,
      question: 'Which file format supports vector graphic scaling without quality loss?',
      options: ['JPG', 'PNG', 'SVG', 'GIF'],
      answer: 2
    }
  ],
  'Data Science': [
    {
      id: 1,
      question: 'Which Python library is primary for numerical data structures and matrix operations?',
      options: ['React', 'NumPy', 'Flask', 'Django'],
      answer: 1
    },
    {
      id: 2,
      question: 'What type of machine learning algorithm trains models using labeled input data?',
      options: ['Unsupervised Learning', 'Supervised Learning', 'Reinforcement Learning', 'Clustering'],
      answer: 1
    },
    {
      id: 3,
      question: 'Which SQL command retrieves data records from a database table?',
      options: ['UPDATE', 'DELETE', 'SELECT', 'ALTER'],
      answer: 2
    },
    {
      id: 4,
      question: 'What occurs when a model learns training data noise too closely and fails on new data?',
      options: ['Underfitting', 'Overfitting', 'Cross-validation', 'Normalization'],
      answer: 1
    },
    {
      id: 5,
      question: 'Which chart best displays continuous data distribution trends over time?',
      options: ['Pie Chart', 'Line Chart', 'Scatter Plot', 'Venn Diagram'],
      answer: 1
    }
  ]
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, enrollStudent, isAlreadyEnrolled, enrollments = [], updateEnrollment } = useLMS();

  // Exam Workspace States (Unconditionally declared at top level for Rules of Hooks)
  const [isTakingExam, setIsTakingExam] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [examTimeLeft, setExamTimeLeft] = useState(300); // 5 mins
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [examResult, setExamResult] = useState(null);

  // Custom React Dialog States (No native alerts/window.confirm)
  const [showSubmitConfirmDialog, setShowSubmitConfirmDialog] = useState(false);
  const [showExitConfirmDialog, setShowExitConfirmDialog] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const course = courses.find((c) => c.id.toString() === id?.toString());

  const isAdmin = user?.role === 'Administrator';
  const studentId = user?.studentId || user?.id || 'st-pavan';
  const studentEmail = user?.email || 'pavan@gmail.com';
  const enrolled = course ? isAlreadyEnrolled(studentId, course.id, studentEmail) : false;

  const myEnrollmentRecord = enrollments.find(
    (e) =>
      course &&
      String(e.courseId) === String(course.id) &&
      (String(e.studentId) === String(studentId) || e.studentEmail?.toLowerCase() === studentEmail.toLowerCase())
  );

  const currentCompletedCount = myEnrollmentRecord?.completedLessons || 
    Math.round(((myEnrollmentRecord?.progress || 0) / 100) * COURSE_LESSONS.length);

  const lessonStates = myEnrollmentRecord?.lessonStates || COURSE_LESSONS.map((_, idx) => idx < currentCompletedCount);

  // Check if all 5 lessons completed
  const allLessonsCompleted = lessonStates.filter(Boolean).length === COURSE_LESSONS.length;
  const quizQuestions = QUIZ_QUESTIONS[course?.category] || QUIZ_QUESTIONS['Programming'];

  // Sync initial examResult from enrollment record
  useEffect(() => {
    if (myEnrollmentRecord?.examResult) {
      setExamResult(myEnrollmentRecord.examResult);
    }
  }, [myEnrollmentRecord?.examResult]);

  const calculateAndSaveExamResult = () => {
    let correctCount = 0;
    quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) {
        correctCount += 1;
      }
    });

    const totalQ = quizQuestions.length;
    const scorePct = Math.round((correctCount / totalQ) * 100);
    const passed = scorePct >= 70;

    const resultPayload = {
      scorePct,
      correctCount,
      totalQ,
      passed,
      attemptDate: new Date().toLocaleDateString()
    };

    setExamResult(resultPayload);
    setIsTakingExam(false);
    setShowSubmitConfirmDialog(false);

    if (myEnrollmentRecord) {
      updateEnrollment(
        myEnrollmentRecord.id,
        {
          progress: passed ? 100 : 90,
          status: passed ? 'Completed' : 'Active',
          examResult: resultPayload,
          examPassed: passed
        },
        true
      );
    }

    if (passed) {
      toast.success(`🎉 PASSED! Score: ${scorePct}%. Congratulations, you earned your Certificate!`);
      setShowCertificateModal(true);
    } else {
      toast.error(`❌ FAILED. Score: ${scorePct}% (Passing Score: 70%). You can retake the assessment.`);
    }
  };

  const handleAutoSubmitExam = () => {
    toast.warn('Exam time expired! Auto-submitting your quiz answers...');
    calculateAndSaveExamResult();
  };

  // Exam Timer Effect
  useEffect(() => {
    let timer = null;
    if (isTakingExam && examTimeLeft > 0) {
      timer = setInterval(() => {
        setExamTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTakingExam && examTimeLeft === 0) {
      handleAutoSubmitExam();
    }
    return () => clearInterval(timer);
  }, [isTakingExam, examTimeLeft]);

  // EARLY RETURN FOR MISSING COURSE (MUST BE AFTER ALL HOOKS)
  if (!course) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Course Not Found</h2>
        <p className="text-xs text-slate-500">The course you are looking for does not exist or was deleted.</p>
        <button
          onClick={() => navigate('/courses')}
          className="px-4 py-2 bg-[#10B981] text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const handleEnroll = () => {
    if (enrolled) {
      navigate('/progress');
      return;
    }

    const currentStudentPayload = {
      id: studentId,
      name: user?.name || 'Pavan Kumar',
      email: studentEmail
    };

    const success = enrollStudent(currentStudentPayload, course.id);
    if (success) {
      toast.success(`Welcome to ${course.title}! Start completing modules below.`);
    }
  };

  const handleToggleLesson = (idx) => {
    if (isAdmin) {
      toast.info('Admin View Only: Lesson progress is updated in real time by enrolled students.');
      return;
    }

    if (!enrolled || !myEnrollmentRecord) {
      toast.warn('Please enroll in this course first to track your progress!');
      return;
    }

    const updatedStates = [...lessonStates];
    updatedStates[idx] = !updatedStates[idx];

    const completedCount = updatedStates.filter(Boolean).length;
    const totalCount = COURSE_LESSONS.length;
    const newProgressPct = Math.round((completedCount / totalCount) * 80); // Lessons count for 80%, quiz for 20%
    const isAllDone = completedCount === totalCount;

    updateEnrollment(myEnrollmentRecord.id, {
      progress: isAllDone && myEnrollmentRecord?.examResult?.passed ? 100 : newProgressPct,
      completedLessons: completedCount,
      pendingLessons: totalCount - completedCount,
      lessonStates: updatedStates,
      status: myEnrollmentRecord?.examResult?.passed ? 'Completed' : 'Active'
    });

    if (isAllDone) {
      toast.success(`🎉 All 5 modules completed! Final Certification Assessment is now UNLOCKED!`);
    } else {
      toast.info(updatedStates[idx] ? `Module ${idx + 1} completed!` : `Module ${idx + 1} marked incomplete.`);
    }
  };

  const handleStartExam = () => {
    if (isAdmin) {
      toast.info('Admin View Only: Course exam is taken by enrolled students.');
      return;
    }

    if (!allLessonsCompleted) {
      toast.warn('Complete Modules 1-5 first to unlock the Final Certification Quiz!');
      return;
    }

    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIdx(0);
    setExamTimeLeft(300);
    setIsTakingExam(true);
  };

  const handleSelectAnswer = (qId, optionIdx) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleToggleFlag = (qId) => {
    setFlaggedQuestions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQ = quizQuestions[currentQuestionIdx];
  const answeredCount = Object.keys(selectedAnswers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  // --- DEDICATED STANDALONE FULL-SCREEN REAL-TIME EXAM WORKSPACE VIEW (Light Theme, No Sidebar/Navbar) ---
  if (isTakingExam) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-900 animate-fadeIn">
        {/* Top Header Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-[#10B981] rounded-xl border border-emerald-100">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#10B981]">Official Certification Examination</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">{course.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer Badge */}
            <div className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 border shadow-2xs ${
              examTimeLeft < 60 ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' : 'bg-slate-900 text-emerald-400 border-slate-900'
            }`}>
              <Clock className="w-4 h-4" />
              <span>Time Remaining: {formatTimer(examTimeLeft)}</span>
            </div>

            <button
              onClick={() => setShowExitConfirmDialog(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Exit Exam</span>
            </button>
          </div>
        </div>

        {/* Main Examination Workspace Grid (8 Cols Main / 4 Cols Palette) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Main Question Card Area (8 Cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[480px] shadow-xs">
            <div>
              {/* Question Header Status */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <span className="text-xs font-extrabold text-[#10B981] uppercase tracking-wider">
                  Question {currentQuestionIdx + 1} of {quizQuestions.length}
                </span>

                <button
                  onClick={() => handleToggleFlag(currentQ.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border ${
                    flaggedQuestions[currentQ.id]
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5 text-amber-500" />
                  <span>{flaggedQuestions[currentQ.id] ? 'Flagged for Review' : 'Flag Question'}</span>
                </button>
              </div>

              {/* Question Prompt Text */}
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed mb-6">
                {currentQ.question}
              </h3>

              {/* Options Radio List */}
              <div className="space-y-3">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectAnswer(currentQ.id, optIdx)}
                      className={`w-full p-4 rounded-2xl text-left font-medium text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-3.5 border ${
                        isSelected
                          ? 'bg-emerald-50/80 border-[#10B981] text-emerald-950 font-bold shadow-xs'
                          : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center shrink-0 border ${
                        isSelected ? 'bg-[#10B981] text-white border-[#10B981]' : 'bg-white text-slate-600 border-slate-300'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Question Controls Toolbar */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-8">
              <button
                onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIdx === 0}
                className="px-4 py-2.5 bg-slate-100 disabled:opacity-40 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQuestionIdx < quizQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx((prev) => Math.min(quizQuestions.length - 1, prev + 1))}
                  className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitConfirmDialog(true)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 cursor-pointer transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Assessment Test</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Question Palette & Status Sidebar (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-xs space-y-6">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3 mb-4">
                Question Palette Navigator
              </h4>

              {/* Status Summary Pills */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold mb-6">
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
                  <p className="text-base font-black text-emerald-700">{answeredCount}</p>
                  <span>Answered</span>
                </div>
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
                  <p className="text-base font-black text-amber-700">{flaggedCount}</p>
                  <span>Flagged</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
                  <p className="text-base font-black text-slate-800">{quizQuestions.length - answeredCount}</p>
                  <span>Pending</span>
                </div>
              </div>

              {/* Question Number Palette Grid */}
              <div className="grid grid-cols-5 gap-2.5">
                {quizQuestions.map((q, idx) => {
                  const isAns = selectedAnswers[q.id] !== undefined;
                  const isFlag = flaggedQuestions[q.id];
                  const isCurrent = idx === currentQuestionIdx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`h-11 rounded-xl text-xs font-black transition-all cursor-pointer border flex flex-col items-center justify-center relative ${
                        isCurrent
                          ? 'ring-2 ring-[#10B981] border-[#10B981] scale-105 shadow-xs'
                          : ''
                      } ${
                        isFlag
                          ? 'bg-amber-500 text-white border-amber-600'
                          : isAns
                          ? 'bg-[#10B981] text-white border-emerald-600'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <span>{idx + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setShowSubmitConfirmDialog(true)}
              className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Assessment Test</span>
            </button>
          </div>
        </div>

        {/* CUSTOM REACT SUBMIT CONFIRMATION DIALOG (No native window.confirm) */}
        {showSubmitConfirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6 text-slate-900 animate-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 text-emerald-600">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <Send className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Submit Assessment Test</h3>
                  <p className="text-xs text-slate-500">Confirm your examination submission</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Total Questions:</span>
                  <span className="font-bold">{quizQuestions.length}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Answered Questions:</span>
                  <span>{answeredCount}</span>
                </div>
                <div className="flex justify-between text-amber-700 font-bold">
                  <span>Flagged Questions:</span>
                  <span>{flaggedCount}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Unanswered Questions:</span>
                  <span>{quizQuestions.length - answeredCount}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitConfirmDialog(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Review Answers
                </button>
                <button
                  onClick={calculateAndSaveExamResult}
                  className="flex-1 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Confirm Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM REACT EXIT CONFIRMATION DIALOG (No native window.confirm) */}
        {showExitConfirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6 text-slate-900 animate-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Exit Examination?</h3>
                  <p className="text-xs text-slate-500">Unsaved answers will be lost</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to exit the exam? Your progress on this attempt will not be saved and you will need to restart.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowExitConfirmDialog(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Resume Exam
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirmDialog(false);
                    setIsTakingExam(false);
                    toast.info('Exam attempt cancelled.');
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Confirm Exit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- STANDARD COURSE DETAILS & CURRICULUM VIEW ---
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => navigate('/courses')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#10B981] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Course Catalog</span>
      </button>

      {/* Main Course Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
        {/* Left Thumbnail Banner (5 Cols) */}
        <div className="lg:col-span-5 relative min-h-[260px] bg-slate-900">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-emerald-500 text-white font-bold text-[11px] rounded-full shadow-md">
              {course.category}
            </span>
            <span className="px-3 py-1 bg-slate-900/80 text-emerald-300 font-semibold text-[11px] rounded-full backdrop-blur-xs">
              {course.level}
            </span>
          </div>
        </div>

        {/* Right Info Section (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 mb-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{course.rating}</span>
              <span className="text-slate-400 font-normal">({course.reviewsCount || 120} student reviews)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              {course.description}
            </p>

            {/* Course Meta Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-[#10B981] rounded-xl">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Instructor</p>
                  <p className="text-xs font-bold text-slate-800">{course.instructor}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Duration</p>
                  <p className="text-xs font-bold text-slate-800">{course.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <BarChart className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Level</p>
                  <p className="text-xs font-bold text-slate-800">{course.level}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Action Footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Course Price</p>
              <p className="text-2xl font-extrabold text-[#10B981]">${course.price}</p>
            </div>
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Admin Catalog View
                </span>
                <button
                  onClick={() => navigate('/enrollments')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  Manage Enrollments
                </button>
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                className={`px-6 py-3 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                  enrolled
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
                    : 'bg-[#10B981] hover:bg-[#059669] text-white shadow-emerald-600/20'
                }`}
              >
                {enrolled ? (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Enrolled ({myEnrollmentRecord?.progress || 0}%) - Continue Learning
                  </>
                ) : (
                  'Enroll Now'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum & Lesson Management Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Course Curriculum & Certification Assessment</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isAdmin
                ? 'Real-time student progress monitor. Lesson completion and exam attempts are completed by enrolled students.'
                : enrolled
                ? 'Complete Modules 1-5 to unlock your Final Course Assessment Quiz!'
                : 'Enroll in this course to unlock interactive lessons and the Final Assessment Exam.'}
            </p>
          </div>

          {enrolled && !isAdmin && (
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-right">
              <p className="text-[10px] text-emerald-700 uppercase font-extrabold">Your Overall Status</p>
              <p className="text-base font-black text-emerald-800">
                {myEnrollmentRecord?.progress || 0}% {examResult?.passed ? '🏆 Certified' : 'In Progress'}
              </p>
            </div>
          )}
        </div>

        {/* Admin Warning Banner */}
        {isAdmin && (
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-center gap-3 text-xs text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>Admin Read-Only View:</strong> Administrators can monitor course structure and student completion rates, but cannot complete student lessons or quiz exams.</span>
          </div>
        )}

        {/* Lessons List Grid (Modules 1-5) */}
        <div className="space-y-3">
          {COURSE_LESSONS.map((lesson, idx) => {
            const isDone = lessonStates[idx];
            return (
              <div
                key={lesson.id}
                onClick={() => handleToggleLesson(idx)}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  !enrolled && !isAdmin
                    ? 'bg-slate-50 border-slate-200 opacity-75'
                    : isDone
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {!enrolled && !isAdmin ? (
                    <Lock className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : isDone ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <p className={`text-xs sm:text-sm font-bold ${isDone ? 'line-through text-emerald-800' : 'text-slate-900'}`}>
                      {lesson.title}
                    </p>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {lesson.duration}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                    !enrolled && !isAdmin
                      ? 'bg-slate-200 text-slate-600'
                      : isDone
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {!enrolled && !isAdmin ? 'Locked' : isDone ? 'Completed' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>

        {/* FINAL QUIZ / EXAM CARD */}
        <div className={`p-6 rounded-2xl border-2 transition-all ${
          !allLessonsCompleted
            ? 'bg-slate-50 border-slate-200 opacity-80'
            : examResult?.passed
            ? 'bg-emerald-900 text-white border-emerald-500 shadow-xl'
            : 'bg-gradient-to-r from-slate-900 via-emerald-950 to-[#0B2522] text-white border-emerald-500/50 shadow-lg'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Award className={`w-5 h-5 ${examResult?.passed ? 'text-amber-400' : 'text-emerald-400'}`} />
                <h4 className="text-base font-extrabold">
                  Final Course Certification Assessment (5 Questions)
                </h4>
              </div>
              <p className="text-xs text-slate-300 max-w-xl">
                {!allLessonsCompleted
                  ? 'Locked: Complete all 5 course modules above to unlock your final assessment quiz.'
                  : examResult?.passed
                  ? `🎉 PASSED! Final Assessment Score: ${examResult.scorePct}% - Official distinction certificate awarded!`
                  : examResult
                  ? `❌ Attempt Result: ${examResult.scorePct}% (Passing Score: 70%). You can retake the assessment to pass!`
                  : '🎉 All 5 Modules Completed! You are now eligible to take your Final Course Assessment Exam (Passing Score: 70%).'}
              </p>
            </div>

            <div className="shrink-0 flex flex-wrap items-center gap-2">
              {!allLessonsCompleted ? (
                <span className="px-4 py-2 bg-slate-200 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  Locked (Complete 5 Modules)
                </span>
              ) : examResult?.passed ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Certificate</span>
                  </button>
                  <button
                    onClick={() => navigate('/certificates')}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    My Certificates Page
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartExam}
                  className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{examResult ? 'Retake Assessment Test' : 'Start Quiz Exam'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* POST-EXAM QUESTION REVIEW CARD */}
        {examResult && (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Post-Exam Question-by-Question Review</h4>
                <p className="text-xs text-slate-500">Review correct answers, explanations, and your submitted choices.</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                examResult.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {examResult.passed ? 'Passed (70%+)' : 'Failed (<70%)'}
              </span>
            </div>

            <div className="space-y-4">
              {quizQuestions.map((q, idx) => {
                const myAns = selectedAnswers[q.id];
                const isCorrect = myAns === q.answer;

                return (
                  <div key={q.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900">
                        Q{idx + 1}. {q.question}
                      </p>
                      {isCorrect ? (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold rounded-md flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-extrabold rounded-md flex items-center gap-1 shrink-0">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = myAns === optIdx;
                        const isRightOpt = q.answer === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                              isRightOpt
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                : isChosen
                                ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                            {isRightOpt && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* PRINTABLE CERTIFICATE MODAL */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-2xl w-full shadow-2xl border-4 border-amber-300 my-8 space-y-6 text-center relative bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:16px_16px] animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header Badge */}
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-amber-300">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-amber-600">Official Distinction Certificate of Completion</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">EduLearn Online Learning Management System</h2>
            </div>

            <div className="py-4 space-y-2 border-y border-slate-200">
              <p className="text-xs text-slate-500">This certifies that</p>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-700 underline decoration-emerald-300 underline-offset-4">
                {user?.name || 'Pavan Kumar'}
              </h3>
              <p className="text-xs text-slate-500">has successfully completed all 5 course modules and passed the Final Certification Quiz in</p>
              <h4 className="text-lg font-bold text-slate-900">{course.title}</h4>
              <p className="text-xs text-slate-400 pt-1">Instructor: {course.instructor} &bull; Score: {examResult?.scorePct || 100}% &bull; Issued Date: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span>Certificate ID: CERT-{course.id}-{Date.now().toString().slice(-6)}</span>
              <span className="font-bold text-emerald-600">Verified Distinction Completion</span>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  window.print();
                  toast.success('Printing official certificate...');
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

export default CourseDetails;
