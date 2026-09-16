import React, { createContext, useContext, useState } from 'react';

const LMSContext = createContext();

export const useLMS = () => useContext(LMSContext);

export const LMSProvider = ({ children }) => {
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

  // Recent Activities matching UI screenshot
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'user',
      title: 'New student registered',
      detail: 'Rahul Kumar',
      time: '2 hours ago',
      color: 'bg-emerald-500/10 text-emerald-600',
      icon: 'UserPlus'
    },
    {
      id: 2,
      type: 'enrollment',
      title: 'Course enrolled',
      detail: 'Web Development by Priya Sharma',
      time: '3 hours ago',
      color: 'bg-emerald-500/10 text-emerald-600',
      icon: 'BookOpen'
    },
    {
      id: 3,
      type: 'assignment',
      title: 'Assignment submitted',
      detail: 'JavaScript Basics by Arjun Reddy',
      time: '5 hours ago',
      color: 'bg-sky-500/10 text-sky-600',
      icon: 'FileText'
    },
    {
      id: 4,
      type: 'instructor',
      title: 'New Instructor added',
      detail: 'Sneha Patel',
      time: '6 hours ago',
      color: 'bg-purple-500/10 text-purple-600',
      icon: 'UserCheck'
    }
  ]);

  // Upcoming Classes matching UI screenshot
  const [upcomingClasses, setUpcomingClasses] = useState([
    {
      id: 1,
      title: 'Web Development Basics',
      time: 'Today, 10:00 AM',
      instructor: 'Dr. Emily Carter',
      link: '#'
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms',
      time: 'Today, 2:00 PM',
      instructor: 'Sarah Wilson',
      link: '#'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      time: 'Tomorrow, 11:00 AM',
      instructor: 'Mike Chen',
      link: '#'
    }
  ]);

  // Search input state across app
  const [searchQuery, setSearchQuery] = useState('');

  // Function to add activity dynamically
  const addActivity = (title, detail, type = 'user') => {
    const newAct = {
      id: Date.now(),
      type,
      title,
      detail,
      time: 'Just now',
      color: 'bg-emerald-500/10 text-emerald-600',
      icon: 'CheckCircle'
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const value = {
    stats,
    activities,
    upcomingClasses,
    searchQuery,
    setSearchQuery,
    addActivity
  };

  return <LMSContext.Provider value={value}>{children}</LMSContext.Provider>;
};
