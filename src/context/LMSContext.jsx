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
      detail: 'Rahul Kumar',
      time: '2 hours ago',
      color: 'bg-emerald-500/10 text-emerald-600'
    },
    {
      id: 2,
      type: 'enrollment',
      title: 'Course enrolled',
      detail: 'Web Development by Priya Sharma',
      time: '3 hours ago',
      color: 'bg-emerald-500/10 text-emerald-600'
    },
    {
      id: 3,
      type: 'assignment',
      title: 'Assignment submitted',
      detail: 'JavaScript Basics by Arjun Reddy',
      time: '5 hours ago',
      color: 'bg-sky-500/10 text-sky-600'
    },
    {
      id: 4,
      type: 'instructor',
      title: 'New Instructor added',
      detail: 'Sneha Patel',
      time: '6 hours ago',
      color: 'bg-purple-500/10 text-purple-600'
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
    } catch (err) {
      console.error('Error initializing LMS data:', err);
      setLoadingCourses(false);
      setLoadingStudents(false);
      setLoadingInstructors(false);
      setLoadingEnrollments(false);
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
    const updated = courses.map((c) =>
      c.id.toString() === id.toString()
        ? { ...c, ...updatedFields, price: parseFloat(updatedFields.price) || c.price }
        : c
    );
    setCourses(updated);
    saveCoursesToStorage(updated);
    toast.success('Course updated successfully!');
  };

  const deleteCourse = (id) => {
    const courseToDelete = courses.find((c) => c.id.toString() === id.toString());
    const updated = courses.filter((c) => c.id.toString() !== id.toString());
    setCourses(updated);
    saveCoursesToStorage(updated);
    setStats((prev) => ({ ...prev, totalCourses: updated.length }));
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
      await updateStudentApi(id, updatedFields);
      const updated = students.map((s) =>
        s.id.toString() === id.toString() ? { ...s, ...updatedFields } : s
      );
      setStudents(updated);
      localStorage.setItem('lms_students', JSON.stringify(updated));
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
    const updated = instructors.map((inst) =>
      inst.id.toString() === id.toString()
        ? { ...inst, ...updatedFields }
        : inst
    );
    setInstructors(updated);
    saveInstructorsToStorage(updated);
    toast.success('Instructor profile updated!');
  };

  const deleteInstructor = (id) => {
    const instToDelete = instructors.find((inst) => inst.id.toString() === id.toString());
    const updated = instructors.filter((inst) => inst.id.toString() !== id.toString());
    setInstructors(updated);
    saveInstructorsToStorage(updated);
    setStats((prev) => ({ ...prev, totalInstructors: updated.length }));
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
  const isAlreadyEnrolled = (studentId, courseId) => {
    return enrollments.some(
      (e) => e.studentId.toString() === studentId.toString() && e.courseId.toString() === courseId.toString()
    );
  };

  const enrollStudent = (studentId, courseId, enrollmentDate, status = 'Active', progress = 0) => {
    const student = students.find((s) => s.id.toString() === studentId.toString());
    const course = courses.find((c) => c.id.toString() === courseId.toString());

    if (!student || !course) {
      toast.error('Please select both a valid student and a valid course.');
      return false;
    }

    if (isAlreadyEnrolled(studentId, courseId)) {
      toast.warning(`Student "${student.name}" is ALREADY enrolled in "${course.title}". Duplicate enrollment prevented!`);
      return false;
    }

    const newEnrollment = {
      id: `enr-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentAvatar: student.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      courseId: course.id,
      courseTitle: course.title,
      courseCategory: course.category,
      coursePrice: course.price,
      enrollmentDate: enrollmentDate || new Date().toISOString().split('T')[0],
      status: status || 'Active',
      progress: parseInt(progress) || 0
    };

    const updated = [newEnrollment, ...enrollments];
    setEnrollments(updated);
    saveEnrollmentsToStorage(updated);
    setStats((prev) => ({ ...prev, enrolledCourses: updated.length }));

    addActivity('Course Enrollment', `${student.name} enrolled in ${course.title}`, 'enrollment');
    toast.success(`Successfully enrolled "${student.name}" into "${course.title}"!`);
    return true;
  };

  // Edit Enrollment Handler
  const updateEnrollment = (id, updatedFields) => {
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
    toast.success('Enrollment details updated!');
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
    addActivity
  };

  return <LMSContext.Provider value={value}>{children}</LMSContext.Provider>;
};
