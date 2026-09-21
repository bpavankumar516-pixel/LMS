export const getAssignmentsFromStorage = async (courses = []) => {
  try {
    const saved = localStorage.getItem('lms_assignments');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        return parsed;
      }
    }

    // Default Seed Assignments
    const seedAssignments = [
      {
        id: 'asg-101',
        title: 'React Single Page Application Capstone',
        courseId: courses[0]?.id || '1',
        courseTitle: courses[0]?.title || 'Full Stack Web Development',
        instructorName: 'Dr. Emily Carter',
        deadline: '2026-09-30',
        totalMarks: 100,
        status: 'Active',
        instructions: 'Build a fully responsive React SPA using React Router, Context API, and Tailwind CSS. Implement client-side routing, state management, and submit your GitHub repository URL along with a live demo link.',
        createdAt: '2026-09-01'
      },
      {
        id: 'asg-102',
        title: 'Data Cleaning & Exploratory Data Analysis in Python',
        courseId: courses[1]?.id || '2',
        courseTitle: courses[1]?.title || 'Data Science & AI Masterclass',
        instructorName: 'Sarah Wilson',
        deadline: '2026-10-05',
        totalMarks: 100,
        status: 'Active',
        instructions: 'Load the provided sales dataset using Pandas. Clean missing values, handle outliers, calculate descriptive statistics, and generate at least 4 visual charts using Matplotlib or Seaborn.',
        createdAt: '2026-09-05'
      },
      {
        id: 'asg-103',
        title: 'Mobile App Wireframing & High-Fidelity Figma Prototype',
        courseId: courses[2]?.id || '3',
        courseTitle: courses[2]?.title || 'UI/UX Design Fundamentals',
        instructorName: 'Mike Chen',
        deadline: '2026-09-25',
        totalMarks: 50,
        status: 'Active',
        instructions: 'Design an 8-screen mobile e-commerce onboarding flow. Create low-fidelity wireframes first, followed by interactive high-fidelity components with auto-layout in Figma.',
        createdAt: '2026-09-10'
      },
      {
        id: 'asg-104',
        title: 'Machine Learning Model Hyperparameter Tuning',
        courseId: courses[3]?.id || '4',
        courseTitle: courses[3]?.title || 'Machine Learning Essentials',
        instructorName: 'Sarah Wilson',
        deadline: '2026-10-12',
        totalMarks: 100,
        status: 'Active',
        instructions: 'Train Random Forest and XGBoost classifiers on the customer churn dataset. Perform Grid Search CV to find optimal hyperparameters and plot ROC-AUC curve comparisons.',
        createdAt: '2026-09-12'
      }
    ];

    localStorage.setItem('lms_assignments', JSON.stringify(seedAssignments));
    return seedAssignments;
  } catch (err) {
    console.error('Error loading assignments from storage:', err);
    return [];
  }
};

export const saveAssignmentsToStorage = (assignments) => {
  localStorage.setItem('lms_assignments', JSON.stringify(assignments));
};

export const getSubmissionsFromStorage = async () => {
  try {
    const saved = localStorage.getItem('lms_submissions');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        return parsed;
      }
    }

    // Default Seed Submissions
    const seedSubmissions = [
      {
        id: 'sub-pavan-1',
        assignmentId: 'asg-101',
        studentId: 'st-pavan',
        studentName: 'Pavan Kumar',
        studentEmail: 'pavan@gmail.com',
        submissionText: 'Completed the React SPA Capstone using React Router v6 and Tailwind CSS. Hosted on Vercel.',
        fileUrl: 'https://github.com/pavan-kumar/react-lms-capstone',
        submittedAt: '2026-09-15 14:30',
        status: 'Graded',
        marksAwarded: 95,
        totalMarks: 100,
        feedback: 'Excellent component hierarchy and clean responsive design. Great job Pavan!'
      },
      {
        id: 'sub-rahul-1',
        assignmentId: 'asg-101',
        studentId: '1',
        studentName: 'Rahul Sharma',
        studentEmail: 'rahul@gmail.com',
        submissionText: 'Here is my GitHub repository link for the React capstone assignment.',
        fileUrl: 'https://github.com/rahulsharma/react-app',
        submittedAt: '2026-09-14 11:20',
        status: 'Graded',
        marksAwarded: 88,
        totalMarks: 100,
        feedback: 'Good work on state management. Consider refactoring duplicate components.'
      },
      {
        id: 'sub-priya-1',
        assignmentId: 'asg-102',
        studentId: '2',
        studentName: 'Priya Patel',
        studentEmail: 'priya@gmail.com',
        submissionText: 'Python Pandas EDA notebook submitted with all Seaborn visualizations attached.',
        fileUrl: 'https://colab.research.google.com/drive/priya-eda-notebook',
        submittedAt: '2026-09-16 09:45',
        status: 'Submitted',
        marksAwarded: null,
        totalMarks: 100,
        feedback: ''
      }
    ];

    localStorage.setItem('lms_submissions', JSON.stringify(seedSubmissions));
    return seedSubmissions;
  } catch (err) {
    console.error('Error loading submissions from storage:', err);
    return [];
  }
};

export const saveSubmissionsToStorage = (submissions) => {
  localStorage.setItem('lms_submissions', JSON.stringify(submissions));
};
