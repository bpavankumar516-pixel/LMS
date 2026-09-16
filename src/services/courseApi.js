import axios from 'axios';

// MockAPI endpoint URL for Course Management
const MOCK_API_URL = 'https://67b8480451192bd378d8a7c6.mockapi.io/api/v1/courses';

// 20 Realistic LMS Courses
const DEFAULT_COURSES = [
  {
    id: '1',
    title: 'Web Development Bootcamp',
    instructor: 'John Doe',
    category: 'Programming',
    duration: '4 weeks',
    level: 'Beginner',
    price: 49.99,
    rating: 4.8,
    reviewsCount: 120,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    description: 'Learn modern web development with React.js, HTML5, CSS3, and JavaScript from scratch. Build real-world projects and gain hands-on experience.'
  },
  {
    id: '2',
    title: 'Data Science with Python',
    instructor: 'Sarah Wilson',
    category: 'Data Science',
    duration: '8 weeks',
    level: 'Intermediate',
    price: 39.99,
    rating: 4.7,
    reviewsCount: 98,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    description: 'Master data analysis, pandas, numpy, data visualization, and machine learning models with Python in this comprehensive course.'
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    instructor: 'Mike Chen',
    category: 'Design',
    duration: '6 weeks',
    level: 'Beginner',
    price: 30.99,
    rating: 4.6,
    reviewsCount: 76,
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=80',
    description: 'Understand user research, wireframing, prototyping, Figma design systems, and visual design principles to create beautiful user interfaces.'
  },
  {
    id: '4',
    title: 'Machine Learning Essentials',
    instructor: 'Dr. Emily Carter',
    category: 'AI/ML',
    duration: '10 weeks',
    level: 'Advanced',
    price: 89.99,
    rating: 4.9,
    reviewsCount: 150,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    description: 'Deep dive into supervised and unsupervised algorithms, neural networks, TensorFlow, and practical artificial intelligence models.'
  },
  {
    id: '5',
    title: 'Digital Marketing Course',
    instructor: 'Alec Johnson',
    category: 'Marketing',
    duration: '6 weeks',
    level: 'Beginner',
    price: 59.99,
    rating: 4.5,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    description: 'Learn search engine optimization (SEO), social media strategy, content marketing, email campaigns, and Google Analytics.'
  },
  {
    id: '6',
    title: 'Business Communication',
    instructor: 'Lisa Brown',
    category: 'Business',
    duration: '4 weeks',
    level: 'Beginner',
    price: 34.99,
    rating: 4.3,
    reviewsCount: 32,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
    description: 'Develop strong verbal, written, and presentation skills essential for corporate leadership and professional career growth.'
  },
  {
    id: '7',
    title: 'Full Stack Node.js & Express',
    instructor: 'David Miller',
    category: 'Programming',
    duration: '8 weeks',
    level: 'Intermediate',
    price: 64.99,
    rating: 4.8,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&auto=format&fit=crop&q=80',
    description: 'Build fast, scalable backend APIs and web applications using Node.js, Express, MongoDB, and RESTful architecture.'
  },
  {
    id: '8',
    title: 'Cloud Computing & AWS Architect',
    instructor: 'Robert Taylor',
    category: 'Cloud',
    duration: '12 weeks',
    level: 'Advanced',
    price: 99.99,
    rating: 4.9,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    description: 'Prepare for AWS Certified Solutions Architect exam. Master EC2, S3, Lambda, VPC, IAM, and cloud infrastructure deployment.'
  },
  {
    id: '9',
    title: 'Cyber Security & Ethical Hacking',
    instructor: 'Jessica Alba',
    category: 'Security',
    duration: '10 weeks',
    level: 'Intermediate',
    price: 79.99,
    rating: 4.7,
    reviewsCount: 145,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    description: 'Learn penetration testing, network security, threat analysis, cryptography, and vulnerability assessment techniques.'
  },
  {
    id: '10',
    title: 'iOS App Development with Swift',
    instructor: 'Kevin Anderson',
    category: 'Programming',
    duration: '8 weeks',
    level: 'Intermediate',
    price: 69.99,
    rating: 4.6,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
    description: 'Build native iPhone and iPad applications using Swift, SwiftUI, and Xcode with real-world app store deployment.'
  },
  {
    id: '11',
    title: 'DevOps & Docker Kubernetes',
    instructor: 'Michael Scott',
    category: 'DevOps',
    duration: '9 weeks',
    level: 'Advanced',
    price: 84.99,
    rating: 4.9,
    reviewsCount: 175,
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=80',
    description: 'Automate CI/CD pipelines, containerize applications with Docker, and orchestrate scalable microservices with Kubernetes.'
  },
  {
    id: '12',
    title: 'React Native Mobile Apps',
    instructor: 'Amanda Seyfried',
    category: 'Programming',
    duration: '6 weeks',
    level: 'Intermediate',
    price: 54.99,
    rating: 4.7,
    reviewsCount: 92,
    image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=600&auto=format&fit=crop&q=80',
    description: 'Create cross-platform Android and iOS mobile applications with single React JavaScript codebase and Expo CLI.'
  },
  {
    id: '13',
    title: 'Deep Learning & Computer Vision',
    instructor: 'Dr. Emily Carter',
    category: 'AI/ML',
    duration: '12 weeks',
    level: 'Advanced',
    price: 109.99,
    rating: 4.9,
    reviewsCount: 160,
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600&auto=format&fit=crop&q=80',
    description: 'Master convolutional neural networks (CNNs), PyTorch, OpenCV, image classification, and object detection systems.'
  },
  {
    id: '14',
    title: 'Figma System Design Masterclass',
    instructor: 'Mike Chen',
    category: 'Design',
    duration: '4 weeks',
    level: 'Intermediate',
    price: 44.99,
    rating: 4.8,
    reviewsCount: 82,
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    description: 'Design component libraries, auto-layout tokens, interactive prototypes, and design systems for enterprise product teams.'
  },
  {
    id: '15',
    title: 'Financial Analysis & Modeling',
    instructor: 'James Warren',
    category: 'Business',
    duration: '7 weeks',
    level: 'Intermediate',
    price: 59.99,
    rating: 4.5,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80',
    description: 'Master Excel modeling, valuation, corporate finance, financial statements, and investment decision frameworks.'
  },
  {
    id: '16',
    title: 'Social Media Strategy & Ads',
    instructor: 'Alec Johnson',
    category: 'Marketing',
    duration: '5 weeks',
    level: 'Beginner',
    price: 39.99,
    rating: 4.4,
    reviewsCount: 50,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80',
    description: 'Create viral social content, run Meta Facebook Ads, Instagram campaigns, and measure conversion analytics.'
  },
  {
    id: '17',
    title: 'GraphQL & Apollo Client',
    instructor: 'David Miller',
    category: 'Programming',
    duration: '5 weeks',
    level: 'Intermediate',
    price: 49.99,
    rating: 4.7,
    reviewsCount: 70,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    description: 'Modern API development using GraphQL queries, mutations, subscriptions, Apollo Server, and React client integration.'
  },
  {
    id: '18',
    title: 'SQL & Relational Database Design',
    instructor: 'Sarah Wilson',
    category: 'Data Science',
    duration: '5 weeks',
    level: 'Beginner',
    price: 34.99,
    rating: 4.6,
    reviewsCount: 105,
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    description: 'Master PostgreSQL and MySQL queries, joins, indexes, normalization, and complex database management.'
  },
  {
    id: '19',
    title: 'Agile & Scrum Project Management',
    instructor: 'Lisa Brown',
    category: 'Business',
    duration: '4 weeks',
    level: 'Beginner',
    price: 29.99,
    rating: 4.5,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80',
    description: 'Learn Scrum Master practices, sprint planning, Jira board workflows, and agile team facilitation.'
  },
  {
    id: '20',
    title: 'TypeScript for Professional Engineers',
    instructor: 'John Doe',
    category: 'Programming',
    duration: '6 weeks',
    level: 'Intermediate',
    price: 54.99,
    rating: 4.9,
    reviewsCount: 130,
    image: 'https://images.unsplash.com/photo-1516116211223-4c714cf9966d?w=600&auto=format&fit=crop&q=80',
    description: 'Master static typing, generics, decorators, utility types, and advanced TypeScript design patterns for web apps.'
  }
];

export const getCoursesFromMockApi = async () => {
  try {
    // Reset/update storage if less than 20 courses stored to ensure all 20 load
    const saved = localStorage.getItem('lms_courses');
    if (saved) {
      const parsed = JSON.parse(saved);
      const isLegacyProductsData = parsed.some((c) =>
        ['beauty', 'groceries', 'fragrances', 'furniture', 'mascara', 'lipstick'].includes(
          (c.category || '').toLowerCase()
        )
      );

      if (!isLegacyProductsData && parsed.length >= 20) {
        return parsed;
      }
      localStorage.removeItem('lms_courses');
    }

    // Try fetching from MockAPI course endpoint
    try {
      const response = await axios.get(MOCK_API_URL, { timeout: 4000 });
      if (response.data && Array.isArray(response.data) && response.data.length >= 20) {
        const mockCourses = response.data.map((c, i) => ({
          id: c.id || String(i + 1),
          title: c.name || c.title || DEFAULT_COURSES[i % 20].title,
          instructor: c.instructor || DEFAULT_COURSES[i % 20].instructor,
          category: c.category || DEFAULT_COURSES[i % 20].category,
          duration: c.duration || DEFAULT_COURSES[i % 20].duration,
          level: c.level || DEFAULT_COURSES[i % 20].level,
          price: parseFloat(c.price) || DEFAULT_COURSES[i % 20].price,
          rating: parseFloat(c.rating) || DEFAULT_COURSES[i % 20].rating,
          reviewsCount: c.reviewsCount || 100,
          image: c.avatar || c.image || c.thumbnail || DEFAULT_COURSES[i % 20].image,
          description: c.description || DEFAULT_COURSES[i % 20].description
        }));
        localStorage.setItem('lms_courses', JSON.stringify(mockCourses));
        return mockCourses;
      }
    } catch (apiError) {
      console.info('MockAPI course fallback:', apiError.message);
    }

    localStorage.setItem('lms_courses', JSON.stringify(DEFAULT_COURSES));
    return DEFAULT_COURSES;
  } catch (err) {
    localStorage.setItem('lms_courses', JSON.stringify(DEFAULT_COURSES));
    return DEFAULT_COURSES;
  }
};

export const saveCoursesToStorage = (courses) => {
  localStorage.setItem('lms_courses', JSON.stringify(courses));
};
