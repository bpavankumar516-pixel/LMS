export const getQuizzesFromStorage = async (courses = []) => {
  try {
    const saved = localStorage.getItem('lms_quizzes');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        return parsed;
      }
    }

    // Default Seed Quizzes & Exams
    const seedQuizzes = [
      {
        id: 'qz-101',
        title: 'React & Modern JavaScript Core Quiz',
        courseId: courses[0]?.id || '1',
        courseTitle: courses[0]?.title || 'Full Stack Web Development',
        instructorName: 'Dr. Emily Carter',
        durationMinutes: 10,
        passingMarks: 70, // percentage
        totalQuestions: 5,
        published: true,
        description: 'Comprehensive quiz covering React Hooks (useEffect, useState, useMemo), virtual DOM reconciliation, ES6 syntax, and Context API.',
        questions: [
          {
            id: 'q-1',
            questionText: 'What is the primary purpose of the React `useMemo` hook?',
            options: [
              'To handle asynchronous HTTP network requests',
              'To memoize the result of an expensive calculation between renders',
              'To manipulate DOM elements directly',
              'To manage global routing in Single Page Applications'
            ],
            correctOptionIndex: 1,
            explanation: 'useMemo stores and returns a memoized value, recomputing it only when specified dependencies change.'
          },
          {
            id: 'q-2',
            questionText: 'Which lifecycle event does `useEffect(() => {}, [])` with an empty dependency array mimic?',
            options: [
              'componentDidUpdate',
              'componentDidMount',
              'componentWillUnmount only',
              'shouldComponentUpdate'
            ],
            correctOptionIndex: 1,
            explanation: 'Passing an empty array [] tells React that your effect does not depend on any values, so it runs only once after mount.'
          },
          {
            id: 'q-3',
            questionText: 'How does React maintain fast UI updates in Single Page Applications?',
            options: [
              'By reloading the HTML page on every state update',
              'By utilizing a lightweight Virtual DOM to compute minimal real DOM diffs',
              'By rendering all components directly on the backend server',
              'By bypassing JavaScript execution'
            ],
            correctOptionIndex: 1,
            explanation: 'React compares Virtual DOM snapshots and applies efficient batch updates (diffing algorithm) to the actual DOM.'
          },
          {
            id: 'q-4',
            questionText: 'Which array method in JavaScript creates a new array populated with the results of calling a function on every element?',
            options: ['filter()', 'forEach()', 'map()', 'reduce()'],
            correctOptionIndex: 2,
            explanation: '`map()` transforms each element and returns a brand new array without mutating the original.'
          },
          {
            id: 'q-5',
            questionText: 'What does the Context API in React resolve?',
            options: [
              'Slow CSS rendering',
              'Prop drilling across deeply nested component hierarchies',
              'Database schema migration',
              'CORS errors in API calls'
            ],
            correctOptionIndex: 1,
            explanation: 'Context provides a way to share values like user authentication or theme state without explicitly passing props through every level.'
          }
        ]
      },
      {
        id: 'qz-102',
        title: 'Python Data Science & Pandas Fundamentals Exam',
        courseId: courses[1]?.id || '2',
        courseTitle: courses[1]?.title || 'Data Science & AI Masterclass',
        instructorName: 'Sarah Wilson',
        durationMinutes: 15,
        passingMarks: 60,
        totalQuestions: 4,
        published: true,
        description: 'Midterm assessment on Dataframes, Series manipulation, null value handling, and grouping operations in Python Pandas.',
        questions: [
          {
            id: 'q-10',
            questionText: 'Which Pandas method is used to fill missing NaN values in a DataFrame?',
            options: ['df.dropna()', 'df.fillna()', 'df.replace_null()', 'df.clean()'],
            correctOptionIndex: 1,
            explanation: '`fillna()` fills NA/NaN values using specified values, forward fill, or backward fill strategies.'
          },
          {
            id: 'q-11',
            questionText: 'What does `df.groupby("category").mean()` calculate?',
            options: [
              'The total count of rows per category',
              'The average value of numeric columns grouped by category',
              'The maximum score in the dataset',
              'The standard deviation across all columns'
            ],
            correctOptionIndex: 1,
            explanation: '`groupby()` splits data into groups and `.mean()` aggregates numerical columns by computing their arithmetic mean.'
          },
          {
            id: 'q-12',
            questionText: 'In Python, which library provides the underlying numerical matrix operations for Pandas?',
            options: ['Numpy', 'Requests', 'Flask', 'BeautifulSoup'],
            correctOptionIndex: 0,
            explanation: 'Pandas is built on top of NumPy for fast N-dimensional array processing.'
          },
          {
            id: 'q-13',
            questionText: 'How do you select rows by integer-location indexing in Pandas?',
            options: ['df.loc[]', 'df.iloc[]', 'df.at[]', 'df.query()'],
            correctOptionIndex: 1,
            explanation: '`iloc[]` uses zero-based positional integer indices, whereas `loc[]` relies on index labels.'
          }
        ]
      },
      {
        id: 'qz-103',
        title: 'UI Design Principles & Accessibility Assessment',
        courseId: courses[2]?.id || '3',
        courseTitle: courses[2]?.title || 'UI/UX Design Fundamentals',
        instructorName: 'Mike Chen',
        durationMinutes: 10,
        passingMarks: 75,
        totalQuestions: 3,
        published: true,
        description: 'Test your understanding of WCAG color contrast ratios, visual hierarchy, typography, and micro-interactions.',
        questions: [
          {
            id: 'q-20',
            questionText: 'What is the minimum recommended WCAG AA contrast ratio for standard body text?',
            options: ['3.0 : 1', '4.5 : 1', '7.0 : 1', '2.0 : 1'],
            correctOptionIndex: 1,
            explanation: 'WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.'
          },
          {
            id: 'q-21',
            questionText: 'Which Gestalt principle states that objects located close to each other tend to be perceived as a group?',
            options: ['Principle of Closure', 'Principle of Proximity', 'Principle of Continuity', 'Principle of Symmetry'],
            correctOptionIndex: 1,
            explanation: 'Proximity causes human eyes to group elements that are positioned near each other.'
          },
          {
            id: 'q-22',
            questionText: 'What is the primary benefit of responsive fluid design grids?',
            options: ['Faster database query times', 'Seamless layout adaptation across different screen sizes and device viewports', 'Automatic language translation', 'Encrypted data transmission'],
            correctOptionIndex: 1,
            explanation: 'Fluid grids dynamically scale UI elements so interfaces look optimal on phones, tablets, and desktops.'
          }
        ]
      }
    ];

    localStorage.setItem('lms_quizzes', JSON.stringify(seedQuizzes));
    return seedQuizzes;
  } catch (err) {
    console.error('Error loading quizzes from storage:', err);
    return [];
  }
};

export const saveQuizzesToStorage = (quizzes) => {
  localStorage.setItem('lms_quizzes', JSON.stringify(quizzes));
};

export const getQuizAttemptsFromStorage = async () => {
  try {
    const saved = localStorage.getItem('lms_quiz_attempts');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        return parsed;
      }
    }

    // Default Seed Attempts
    const seedAttempts = [
      {
        id: 'att-pavan-1',
        quizId: 'qz-101',
        quizTitle: 'React & Modern JavaScript Core Quiz',
        studentId: 'st-pavan',
        studentName: 'Pavan Kumar',
        studentEmail: 'pavan@gmail.com',
        scorePercentage: 100,
        correctAnswersCount: 5,
        totalQuestions: 5,
        passed: true,
        timeTakenSeconds: 340,
        submittedAt: '2026-09-14 16:20'
      },
      {
        id: 'att-rahul-1',
        quizId: 'qz-101',
        quizTitle: 'React & Modern JavaScript Core Quiz',
        studentId: '1',
        studentName: 'Rahul Sharma',
        studentEmail: 'rahul@gmail.com',
        scorePercentage: 80,
        correctAnswersCount: 4,
        totalQuestions: 5,
        passed: true,
        timeTakenSeconds: 420,
        submittedAt: '2026-09-15 10:15'
      }
    ];

    localStorage.setItem('lms_quiz_attempts', JSON.stringify(seedAttempts));
    return seedAttempts;
  } catch (err) {
    console.error('Error loading quiz attempts from storage:', err);
    return [];
  }
};

export const saveQuizAttemptsToStorage = (attempts) => {
  localStorage.setItem('lms_quiz_attempts', JSON.stringify(attempts));
};
