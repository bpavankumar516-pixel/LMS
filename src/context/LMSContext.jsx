import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCoursesFromMockApi, saveCoursesToStorage } from '../services/courseApi';
import {
  getStudentsFromApi,
  addStudentApi,
  updateStudentApi,
  deleteStudentApi
} from '../services/studentApi';
import { getEnrollmentsFromStorage, saveEnrollmentsToStorage } from '../services/enrollmentApi';
import { getInstructorsFromStorage, saveInstructorsToStorage } from '../services/instructorApi';
import {
  getAssignmentsFromStorage,
  saveAssignmentsToStorage,
  getSubmissionsFromStorage,
  saveSubmissionsToStorage
} from '../services/assignmentApi';
import {
  getQuizzesFromStorage,
  saveQuizzesToStorage,
  getQuizAttemptsFromStorage,
  saveQuizAttemptsToStorage
} from '../services/quizApi';
import { toast } from 'react-toastify';

const LMSContext = createContext();

export const useLMS = () => useContext(LMSContext);

export const LMSProvider = ({ children }) => {
  // Course State
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [errorCourses, setErrorCourses] = useState(null);

  // Student State (Module 4)
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [errorStudents, setErrorStudents] = useState(null);

  // Instructor State (Module 6)
  const [instructors, setInstructors] = useState([]);
  const [loadingInstructors, setLoadingInstructors] = useState(true);
  const [errorInstructors, setErrorInstructors] = useState(null);

  // Enrollment State (Module 5)
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [errorEnrollments, setErrorEnrollments] = useState(null);

  // Assignment State (Module 8)
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  // Quiz & Exam State (Module 8)
  const [quizzes, setQuizzes] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalCourses: 12,
    totalCoursesChange: '+ 12% from last month',
    totalStudents: 30,
    totalStudentsChange: '+ 10% from last month',
    totalInstructors: 8,
    totalInstructorsChange: '+ 15% from last month',
    enrolledCourses: 186,
    enrolledCoursesChange: '+ 14% from last month',
  });

  // Recent Activities
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'user',
      title: 'New student registered',
      detail: 'Rahul Sharma',
      time: '15 mins ago',
      color: 'bg-emerald-500/10 text-emerald-600'
    },
    {
      id: 2,
      type: 'enrollment',
      title: 'Course Enrolled',
      detail: 'Full Stack Web Development',
      time: '1 hour ago',
      color: 'bg-teal-500/10 text-teal-600'
    },
    {
      id: 3,
      type: 'instructor',
      title: 'Instructor Profile Verified',
      detail: 'Dr. Emily Carter (Full Stack)',
      time: '3 hours ago',
      color: 'bg-purple-500/10 text-purple-600'
    },
    {
      id: 4,
      type: 'course',
      title: 'New Course Published',
      detail: 'Data Science & AI Masterclass',
      time: '5 hours ago',
      color: 'bg-sky-500/10 text-sky-600'
    }
  ]);

  // Upcoming Classes
  const [upcomingClasses, setUpcomingClasses] = useState([
    {
      id: 1,
      title: 'Web Development Basics',
      time: 'Today, 10:00 AM',
      instructor: 'Dr. Emily Carter'
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms',
      time: 'Today, 2:00 PM',
      instructor: 'Sarah Wilson'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      time: 'Tomorrow, 11:00 AM',
      instructor: 'Mike Chen'
    }
  ]);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Data Load
  useEffect(() => {
    initLmsData();
  }, []);

  const initLmsData = async () => {
    setLoadingCourses(true);
    setLoadingStudents(true);
    setLoadingInstructors(true);
    setLoadingEnrollments(true);
    setLoadingAssignments(true);
    setLoadingQuizzes(true);

    try {
      const loadedCourses = await getCoursesFromMockApi();
      setCourses(loadedCourses);
      setStats((prev) => ({ ...prev, totalCourses: loadedCourses.length }));
      setLoadingCourses(false);

      const loadedStudents = await getStudentsFromApi();
      setStudents(loadedStudents);
      setStats((prev) => ({ ...prev, totalStudents: loadedStudents.length }));
      setLoadingStudents(false);

      const loadedInstructors = await getInstructorsFromStorage();
      setInstructors(loadedInstructors);
      setStats((prev) => ({ ...prev, totalInstructors: loadedInstructors.length }));
      setLoadingInstructors(false);

      const loadedEnrollments = await getEnrollmentsFromStorage(loadedStudents, loadedCourses);
      setEnrollments(loadedEnrollments);
      setStats((prev) => ({ ...prev, enrolledCourses: loadedEnrollments.length }));
      setLoadingEnrollments(false);

      const loadedAssignments = await getAssignmentsFromStorage(loadedCourses);
      setAssignments(loadedAssignments);
      const loadedSubmissions = await getSubmissionsFromStorage();
      setSubmissions(loadedSubmissions);
      setLoadingAssignments(false);

      const loadedQuizzes = await getQuizzesFromStorage(loadedCourses);
      setQuizzes(loadedQuizzes);
      const loadedAttempts = await getQuizAttemptsFromStorage();
      setQuizAttempts(loadedAttempts);
      setLoadingQuizzes(false);
    } catch (err) {
      console.error('Error initializing LMS data:', err);
      setLoadingCourses(false);
      setLoadingStudents(false);
      setLoadingInstructors(false);
      setLoadingEnrollments(false);
      setLoadingAssignments(false);
      setLoadingQuizzes(false);
    }
  };

  const loadCourses = async () => {
    try {
      const data = await getCoursesFromMockApi();
      setCourses(data);
      setStats((prev) => ({ ...prev, totalCourses: data.length }));
    } catch (err) {
      setErrorCourses('Failed to load courses.');
    }
  };

  const loadStudents = async () => {
    try {
      const data = await getStudentsFromApi();
      setStudents(data);
      setStats((prev) => ({ ...prev, totalStudents: data.length }));
    } catch (err) {
      setErrorStudents('Failed to load student records.');
    }
  };

  const loadInstructors = async () => {
    try {
      const data = await getInstructorsFromStorage();
      setInstructors(data);
      setStats((prev) => ({ ...prev, totalInstructors: data.length }));
    } catch (err) {
      setErrorInstructors('Failed to load instructors.');
    }
  };

  const loadEnrollments = async () => {
    try {
      const data = await getEnrollmentsFromStorage(students, courses);
      setEnrollments(data);
      setStats((prev) => ({ ...prev, enrolledCourses: data.length }));
    } catch (err) {
      setErrorEnrollments('Failed to load enrollment records.');
    }
  };

  // Course CRUD Handlers
  const addCourse = (courseData) => {
    const newCourse = {
      id: String(Date.now()),
      title: courseData.title,
      instructor: courseData.instructor || 'Alex Morgan',
      category: courseData.category || 'Programming',
      duration: courseData.duration || '6 weeks',
      level: courseData.level || 'Beginner',
      price: parseFloat(courseData.price) || 29.99,
      rating: parseFloat(courseData.rating) || 4.8,
      reviewsCount: 1,
      image: courseData.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      description: courseData.description || 'Comprehensive learning course with projects.'
    };

    const updated = [newCourse, ...courses];
    setCourses(updated);
    saveCoursesToStorage(updated);
    setStats((prev) => ({ ...prev, totalCourses: updated.length }));

    addActivity('New Course Created', newCourse.title, 'course');
    toast.success(`Course "${newCourse.title}" added successfully!`);
    return newCourse;
  };

  const updateCourse = (id, updatedFields) => {
    const targetCourse = courses.find((c) => c.id.toString() === id.toString());
    const updated = courses.map((c) =>
      c.id.toString() === id.toString()
        ? { ...c, ...updatedFields, price: parseFloat(updatedFields.price) || c.price }
        : c
    );
    setCourses(updated);
    saveCoursesToStorage(updated);
    addActivity('Course Updated', updatedFields.title || targetCourse?.title || 'Course Details Updated', 'course');
    toast.success('Course updated successfully!');
  };

  const deleteCourse = (id) => {
    const courseToDelete = courses.find((c) => c.id.toString() === id.toString());
    const updated = courses.filter((c) => c.id.toString() !== id.toString());
    setCourses(updated);
    saveCoursesToStorage(updated);
    setStats((prev) => ({ ...prev, totalCourses: updated.length }));
    addActivity('Course Deleted', courseToDelete?.title || 'Course Removed', 'course');
    toast.info(`Course "${courseToDelete?.title || ''}" deleted.`);
  };

  // Module 4: Student CRUD Handlers
  const addStudent = async (studentData) => {
    try {
      const newStudent = await addStudentApi(studentData);
      const updated = [newStudent, ...students];
      setStudents(updated);
      localStorage.setItem('lms_students', JSON.stringify(updated));
      setStats((prev) => ({ ...prev, totalStudents: updated.length }));

      addActivity('New Student Registered', newStudent.name, 'user');
      toast.success(`Student "${newStudent.name}" registered successfully!`);
      return newStudent;
    } catch (err) {
      toast.error('Failed to register student.');
    }
  };

  const updateStudent = async (id, updatedFields) => {
    try {
      const targetStudent = students.find((s) => s.id.toString() === id.toString());
      await updateStudentApi(id, updatedFields);
      const updated = students.map((s) =>
        s.id.toString() === id.toString() ? { ...s, ...updatedFields } : s
      );
      setStudents(updated);
      localStorage.setItem('lms_students', JSON.stringify(updated));
      addActivity('Student Updated', updatedFields.name || targetStudent?.name || 'Student Profile Updated', 'user');
      toast.success('Student record updated successfully!');
    } catch (err) {
      toast.error('Failed to update student.');
    }
  };

  const deleteStudent = async (id) => {
    try {
      const studentToDelete = students.find((s) => s.id.toString() === id.toString());
      await deleteStudentApi(id);
      const updated = students.filter((s) => s.id.toString() !== id.toString());
      setStudents(updated);
      localStorage.setItem('lms_students', JSON.stringify(updated));
      setStats((prev) => ({ ...prev, totalStudents: updated.length }));

      // Clean up associated enrollments safely to maintain data integrity
      if (studentToDelete) {
        const cleanedEnrollments = enrollments.filter(
          (e) => String(e.studentId) !== String(id) && e.studentEmail?.toLowerCase() !== studentToDelete.email?.toLowerCase()
        );
        setEnrollments(cleanedEnrollments);
        saveEnrollmentsToStorage(cleanedEnrollments);
      }

      addActivity('Student Removed', studentToDelete?.name || 'Student Record Removed', 'user');
      toast.info(`Student "${studentToDelete?.name || ''}" deleted.`);
    } catch (err) {
      toast.error('Failed to delete student.');
    }
  };

  // Module 6: Instructor CRUD & Course Assignment Handlers
  const addInstructor = (data) => {
    const newInstructor = {
      id: `inst-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '+1 (555) 000-0000',
      experience: data.experience || '3 Years',
      specialization: data.specialization || 'Full Stack Development',
      rating: parseFloat(data.rating) || 4.8,
      studentsTaught: parseInt(data.studentsTaught) || 120,
      image: data.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: data.bio || 'Professional LMS Instructor dedicated to excellence in teaching.',
      assignedCourseIds: Array.isArray(data.assignedCourseIds) ? data.assignedCourseIds : []
    };

    const updated = [newInstructor, ...instructors];
    setInstructors(updated);
    saveInstructorsToStorage(updated);
    setStats((prev) => ({ ...prev, totalInstructors: updated.length }));
    addActivity('New Instructor Added', newInstructor.name, 'instructor');
    toast.success(`Instructor "${newInstructor.name}" added successfully!`);
    return newInstructor;
  };

  const updateInstructor = (id, updatedFields) => {
    const targetInst = instructors.find((i) => i.id.toString() === id.toString());
    const updated = instructors.map((inst) =>
      inst.id.toString() === id.toString()
        ? { ...inst, ...updatedFields }
        : inst
    );
    setInstructors(updated);
    saveInstructorsToStorage(updated);
    addActivity('Instructor Profile Updated', updatedFields.name || targetInst?.name || 'Faculty Member Updated', 'instructor');
    toast.success('Instructor profile updated!');
  };

  const deleteInstructor = (id) => {
    const instToDelete = instructors.find((inst) => inst.id.toString() === id.toString());
    const updated = instructors.filter((inst) => inst.id.toString() !== id.toString());
    setInstructors(updated);
    saveInstructorsToStorage(updated);
    setStats((prev) => ({ ...prev, totalInstructors: updated.length }));
    addActivity('Instructor Removed', instToDelete?.name || 'Faculty Member Removed', 'instructor');
    toast.info(`Instructor "${instToDelete?.name || ''}" removed.`);
  };

  const assignCoursesToInstructor = (instructorId, courseIds = []) => {
    const updated = instructors.map((inst) => {
      if (inst.id.toString() === instructorId.toString()) {
        return { ...inst, assignedCourseIds: courseIds };
      }
      return inst;
    });
    setInstructors(updated);
    saveInstructorsToStorage(updated);
    toast.success('Assigned courses updated for instructor!');
  };

  // Module 5: Course Enrollment Handlers & Status Updates
  const isAlreadyEnrolled = (studentId, courseId, studentEmail = '') => {
    return enrollments.some(
      (e) =>
        String(e.courseId) === String(courseId) &&
        (String(e.studentId) === String(studentId) ||
          (studentEmail && e.studentEmail?.toLowerCase() === studentEmail.toLowerCase()))
    );
  };

  const enrollStudent = (studentDataOrId, courseId, enrollmentDate, status = 'Active', progress = 0) => {
    let student = null;
    let studentId = '';
    let studentEmail = '';

    if (typeof studentDataOrId === 'object' && studentDataOrId !== null) {
      student = studentDataOrId;
      studentId = student.id || student.studentId || 'st-pavan';
      studentEmail = student.email || '';
    } else {
      studentId = studentDataOrId;
      student = students.find((s) => String(s.id) === String(studentId) || s.email?.toLowerCase() === String(studentId).toLowerCase());
      if (!student) {
        student = { id: studentId, name: 'Student Member', email: String(studentId) };
      }
      studentEmail = student.email || '';
    }

    const course = courses.find((c) => String(c.id) === String(courseId));

    if (!course) {
      toast.error('Selected course was not found.');
      return false;
    }

    if (isAlreadyEnrolled(studentId, courseId, studentEmail)) {
      toast.warning(`You are ALREADY enrolled in "${course.title}". Duplicate enrollment prevented!`);
      return false;
    }

    // Automatically resolve assigned instructor for the selected course
    const inst = instructors.find((i) => i.assignedCourseIds?.includes(course.id.toString())) ||
                 instructors.find((i) => i.name.toLowerCase() === course.instructor?.toLowerCase()) ||
                 { id: 'inst-1', name: course.instructor || 'Dr. Emily Carter' };

    const newEnrollment = {
      id: `enr-${Date.now()}`,
      studentId: student.id || studentId,
      studentName: student.name || 'Student Member',
      studentEmail: student.email || studentEmail || 'student@gmail.com',
      studentAvatar: student.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      courseId: course.id,
      courseTitle: course.title,
      courseCategory: course.category,
      coursePrice: course.price,
      instructorId: inst.id,
      instructorName: inst.name,
      enrollmentDate: enrollmentDate || new Date().toISOString().split('T')[0],
      status: status || 'Active',
      progress: parseInt(progress) || 0
    };

    const updated = [newEnrollment, ...enrollments];
    setEnrollments(updated);
    saveEnrollmentsToStorage(updated);
    setStats((prev) => ({ ...prev, enrolledCourses: updated.length }));

    addActivity('Course Enrollment', `${newEnrollment.studentName} enrolled in ${course.title}`, 'enrollment');
    toast.success(`Successfully enrolled in "${course.title}"!`);
    return true;
  };

  // Edit Enrollment Handler
  const updateEnrollment = (id, updatedFields, silent = false) => {
    const updated = enrollments.map((e) => {
      if (e.id.toString() === id.toString()) {
        const newProgress = parseInt(updatedFields.progress) || e.progress || 0;
        let newStatus = updatedFields.status || e.status;
        if (newProgress === 100 && newStatus === 'Active') {
          newStatus = 'Completed';
        }
        return {
          ...e,
          ...updatedFields,
          progress: newProgress,
          status: newStatus
        };
      }
      return e;
    });

    setEnrollments(updated);
    saveEnrollmentsToStorage(updated);
    if (!silent) {
      toast.success('Enrollment details updated!');
    }
  };

  const removeEnrollment = (enrollmentId) => {
    const enrToDelete = enrollments.find((e) => e.id.toString() === enrollmentId.toString());
    const updated = enrollments.filter((e) => e.id.toString() !== enrollmentId.toString());
    setEnrollments(updated);
    saveEnrollmentsToStorage(updated);
    setStats((prev) => ({ ...prev, enrolledCourses: updated.length }));
    toast.info(`Enrollment for "${enrToDelete?.studentName || ''}" in "${enrToDelete?.courseTitle || ''}" removed.`);
  };

  // Activity Helper
  const addActivity = (title, detail, type = 'user') => {
    const newAct = {
      id: Date.now(),
      type,
      title,
      detail,
      time: 'Just now',
      color: 'bg-emerald-500/10 text-emerald-600'
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const removeActivity = (id) => {
    const updated = activities.filter((act) => act.id !== id);
    setActivities(updated);
    toast.info('Activity item removed from log.');
  };

  const clearActivities = () => {
    setActivities([]);
    toast.info('Recent activity log cleared.');
  };

  // --- Module 8: Assignment Handlers ---
  const addAssignment = (data) => {
    const newAssignment = {
      id: `asg-${Date.now()}`,
      title: data.title,
      courseId: data.courseId,
      courseTitle: data.courseTitle || 'General Course',
      instructorName: data.instructorName || 'Dr. Emily Carter',
      deadline: data.deadline || '2026-10-15',
      totalMarks: Number(data.totalMarks) || 100,
      status: 'Active',
      instructions: data.instructions || '',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newAssignment, ...assignments];
    setAssignments(updated);
    saveAssignmentsToStorage(updated);
    addActivity('New Assignment Published', `"${newAssignment.title}" for ${newAssignment.courseTitle}`, 'course');
    toast.success('Assignment created successfully!');
  };

  const updateAssignment = (id, updatedData) => {
    const updated = assignments.map((asg) => (asg.id === id ? { ...asg, ...updatedData } : asg));
    setAssignments(updated);
    saveAssignmentsToStorage(updated);
    toast.success('Assignment updated successfully!');
  };

  const deleteAssignment = (id) => {
    const updated = assignments.filter((asg) => asg.id !== id);
    setAssignments(updated);
    saveAssignmentsToStorage(updated);
    toast.info('Assignment removed.');
  };

  const submitAssignment = (subData) => {
    const existingIndex = submissions.findIndex(
      (s) => s.assignmentId === subData.assignmentId && (s.studentEmail === subData.studentEmail || s.studentId === subData.studentId)
    );

    const newSub = {
      id: subData.id || `sub-${Date.now()}`,
      assignmentId: subData.assignmentId,
      studentId: subData.studentId,
      studentName: subData.studentName,
      studentEmail: subData.studentEmail,
      submissionText: subData.submissionText || '',
      fileUrl: subData.fileUrl || '',
      submittedAt: new Date().toLocaleString(),
      status: 'Submitted',
      marksAwarded: null,
      totalMarks: subData.totalMarks || 100,
      feedback: ''
    };

    let updated;
    if (existingIndex >= 0) {
      updated = [...submissions];
      updated[existingIndex] = newSub;
    } else {
      updated = [newSub, ...submissions];
    }

    setSubmissions(updated);
    saveSubmissionsToStorage(updated);
    addActivity('Assignment Submitted', `${subData.studentName} submitted work for assignment`, 'user');
    toast.success('Assignment submitted successfully!');
  };

  const gradeSubmission = (submissionId, marksAwarded, feedback) => {
    const updated = submissions.map((sub) => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          status: 'Graded',
          marksAwarded: Number(marksAwarded),
          feedback: feedback || 'Graded by instructor'
        };
      }
      return sub;
    });
    setSubmissions(updated);
    saveSubmissionsToStorage(updated);
    toast.success('Submission graded successfully!');
  };

  // --- Module 8: Quiz & Exam Handlers ---
  const addQuiz = (data) => {
    const newQuiz = {
      id: `qz-${Date.now()}`,
      title: data.title,
      courseId: data.courseId,
      courseTitle: data.courseTitle || 'General Course',
      instructorName: data.instructorName || 'Dr. Emily Carter',
      durationMinutes: Number(data.durationMinutes) || 15,
      passingMarks: Number(data.passingMarks) || 70,
      totalQuestions: data.questions?.length || 0,
      published: data.published ?? true,
      description: data.description || '',
      questions: data.questions || []
    };
    const updated = [newQuiz, ...quizzes];
    setQuizzes(updated);
    saveQuizzesToStorage(updated);
    addActivity('New Exam Created', `"${newQuiz.title}" published with ${newQuiz.questions.length} questions`, 'course');
    toast.success('Quiz/Exam created successfully!');
  };

  const updateQuiz = (id, updatedData) => {
    const updated = quizzes.map((qz) =>
      qz.id === id
        ? {
            ...qz,
            ...updatedData,
            totalQuestions: updatedData.questions ? updatedData.questions.length : qz.totalQuestions
          }
        : qz
    );
    setQuizzes(updated);
    saveQuizzesToStorage(updated);
    toast.success('Quiz updated successfully!');
  };

  const deleteQuiz = (id) => {
    const updated = quizzes.filter((qz) => qz.id !== id);
    setQuizzes(updated);
    saveQuizzesToStorage(updated);
    toast.info('Quiz removed.');
  };

  const togglePublishQuiz = (id) => {
    const updated = quizzes.map((qz) => (qz.id === id ? { ...qz, published: !qz.published } : qz));
    setQuizzes(updated);
    saveQuizzesToStorage(updated);
    const target = updated.find((q) => q.id === id);
    toast.success(`Quiz status changed to ${target?.published ? 'Published' : 'Draft'}`);
  };

  const submitQuizAttempt = (attemptData) => {
    const newAttempt = {
      id: `att-${Date.now()}`,
      quizId: attemptData.quizId,
      quizTitle: attemptData.quizTitle,
      studentId: attemptData.studentId,
      studentName: attemptData.studentName,
      studentEmail: attemptData.studentEmail,
      scorePercentage: attemptData.scorePercentage,
      correctAnswersCount: attemptData.correctAnswersCount,
      totalQuestions: attemptData.totalQuestions,
      passed: attemptData.passed,
      timeTakenSeconds: attemptData.timeTakenSeconds,
      submittedAt: new Date().toLocaleString()
    };

    const updated = [newAttempt, ...quizAttempts];
    setQuizAttempts(updated);
    saveQuizAttemptsToStorage(updated);

    addActivity(
      'Exam Attempt Completed',
      `${attemptData.studentName} scored ${attemptData.scorePercentage}% on ${attemptData.quizTitle}`,
      attemptData.passed ? 'enrollment' : 'user'
    );

    return newAttempt;
  };

  const value = {
    stats,
    activities,
    upcomingClasses,
    searchQuery,
    setSearchQuery,
    courses,
    loadingCourses,
    errorCourses,
    loadCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    students,
    loadingStudents,
    errorStudents,
    loadStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    instructors,
    loadingInstructors,
    errorInstructors,
    loadInstructors,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    assignCoursesToInstructor,
    enrollments,
    loadingEnrollments,
    errorEnrollments,
    loadEnrollments,
    enrollStudent,
    updateEnrollment,
    removeEnrollment,
    isAlreadyEnrolled,
    assignments,
    submissions,
    loadingAssignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    gradeSubmission,
    quizzes,
    quizAttempts,
    loadingQuizzes,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    togglePublishQuiz,
    submitQuizAttempt,
    addActivity,
    removeActivity,
    clearActivities
  };

  return <LMSContext.Provider value={value}>{children}</LMSContext.Provider>;
};
