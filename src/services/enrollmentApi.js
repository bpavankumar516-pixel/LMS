export const getEnrollmentsFromStorage = async (students = [], courses = []) => {
  try {
    const saved = localStorage.getItem('lms_enrollments');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        return parsed;
      }
    }

    // Dynamically generate initial seed enrollments using REAL student, course & instructor data
    if (students.length > 0 && courses.length > 0) {
      const seedEnrollments = [
        {
          id: 'enr-pavan-1',
          studentId: 'st-pavan',
          studentName: 'Pavan Kumar',
          studentEmail: 'pavan@gmail.com',
          studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          courseId: courses[0]?.id || '1',
          courseTitle: courses[0]?.title || 'Full Stack Web Development',
          courseCategory: courses[0]?.category || 'Programming',
          coursePrice: courses[0]?.price || 49.99,
          instructorId: 'inst-1',
          instructorName: 'Dr. Emily Carter',
          enrollmentDate: '2026-07-01',
          status: 'Active',
          progress: 70,
          completedLessons: 7,
          pendingLessons: 3
        },
        {
          id: 'enr-pavan-2',
          studentId: 'st-pavan',
          studentName: 'Pavan Kumar',
          studentEmail: 'pavan@gmail.com',
          studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          courseId: courses[1]?.id || '2',
          courseTitle: courses[1]?.title || 'Data Science & AI Masterclass',
          courseCategory: courses[1]?.category || 'Data Science',
          coursePrice: courses[1]?.price || 39.99,
          instructorId: 'inst-2',
          instructorName: 'Sarah Wilson',
          enrollmentDate: '2026-07-05',
          status: 'Completed',
          progress: 100,
          completedLessons: 10,
          pendingLessons: 0
        },
        {
          id: 'enr-101',
          studentId: students[0]?.id || '1',
          studentName: students[0]?.name || 'Rahul Sharma',
          studentEmail: students[0]?.email || 'rahul@gmail.com',
          studentAvatar: students[0]?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          courseId: courses[0]?.id || '1',
          courseTitle: courses[0]?.title || 'Web Development Bootcamp',
          courseCategory: courses[0]?.category || 'Programming',
          coursePrice: courses[0]?.price || 49.99,
          instructorId: 'inst-1',
          instructorName: 'Dr. Emily Carter',
          enrollmentDate: '2026-06-12',
          status: 'Active',
          progress: 45
        },
        {
          id: 'enr-102',
          studentId: students[1]?.id || '2',
          studentName: students[1]?.name || 'Priya Patel',
          studentEmail: students[1]?.email || 'priya@gmail.com',
          studentAvatar: students[1]?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          courseId: courses[1]?.id || '2',
          courseTitle: courses[1]?.title || 'Data Science with Python',
          courseCategory: courses[1]?.category || 'Data Science',
          coursePrice: courses[1]?.price || 39.99,
          instructorId: 'inst-2',
          instructorName: 'Sarah Wilson',
          enrollmentDate: '2026-06-15',
          status: 'Active',
          progress: 80
        },
        {
          id: 'enr-103',
          studentId: students[2]?.id || '3',
          studentName: students[2]?.name || 'Ananya Reddy',
          studentEmail: students[2]?.email || 'ananya@gmail.com',
          studentAvatar: students[2]?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
          courseId: courses[2]?.id || '3',
          courseTitle: courses[2]?.title || 'UI/UX Design Fundamentals',
          courseCategory: courses[2]?.category || 'Design',
          coursePrice: courses[2]?.price || 30.99,
          instructorId: 'inst-3',
          instructorName: 'Mike Chen',
          enrollmentDate: '2026-06-18',
          status: 'Active',
          progress: 25
        },
        {
          id: 'enr-104',
          studentId: students[3]?.id || '4',
          studentName: students[3]?.name || 'Aarav Verma',
          studentEmail: students[3]?.email || 'aarav@gmail.com',
          studentAvatar: students[3]?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          courseId: courses[3]?.id || '4',
          courseTitle: courses[3]?.title || 'Machine Learning Essentials',
          courseCategory: courses[3]?.category || 'AI/ML',
          coursePrice: courses[3]?.price || 89.99,
          instructorId: 'inst-2',
          instructorName: 'Sarah Wilson',
          enrollmentDate: '2026-06-20',
          status: 'Active',
          progress: 60
        }
      ];

      localStorage.setItem('lms_enrollments', JSON.stringify(seedEnrollments));
      return seedEnrollments;
    }

    return [];
  } catch (err) {
    return [];
  }
};

export const saveEnrollmentsToStorage = (enrollments) => {
  localStorage.setItem('lms_enrollments', JSON.stringify(enrollments));
};
