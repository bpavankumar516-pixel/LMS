import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCoursesFromMockApi, saveCoursesToStorage } from '../services/courseApi';
import { toast } from 'react-toastify';

const LMSContext = createContext();

export const useLMS = () => useContext(LMSContext);

export const LMSProvider = ({ children }) => {
  // Course State
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [errorCourses, setErrorCourses] = useState(null);

  // Stats matching UI screenshot
  const [stats, setStats] = useState({
    totalCourses: 12,
    totalCoursesChange: '+ 12% from last month',
    totalStudents: 248,
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

  // Initial Course Load from MockAPI / Storage
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoadingCourses(true);
    setErrorCourses(null);
    try {
      const data = await getCoursesFromMockApi();
      setCourses(data);
      setStats((prev) => ({ ...prev, totalCourses: data.length }));
      setLoadingCourses(false);
    } catch (err) {
      setErrorCourses('Failed to load courses from MockAPI.');
      setLoadingCourses(false);
    }
  };

  // Add Course Handler
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

  // Update Course Handler
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

  // Delete Course Handler
  const deleteCourse = (id) => {
    const courseToDelete = courses.find((c) => c.id.toString() === id.toString());
    const updated = courses.filter((c) => c.id.toString() !== id.toString());
    setCourses(updated);
    saveCoursesToStorage(updated);
    setStats((prev) => ({ ...prev, totalCourses: updated.length }));
    toast.info(`Course "${courseToDelete?.title || ''}" deleted.`);
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
    addActivity
  };

  return <LMSContext.Provider value={value}>{children}</LMSContext.Provider>;
};
