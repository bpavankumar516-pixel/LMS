export const getInstructorsFromStorage = async () => {
  try {
    const saved = localStorage.getItem('lms_instructors');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length >= 15) {
        // Enforce all instructors have studentsTaught <= 30 (based on 30 total students in LMS)
        const realistic30Values = [28, 24, 26, 18, 30, 22, 25, 19, 29, 27, 21, 28, 16, 23, 20];
        const updated = parsed.map((inst, idx) => {
          let st = parseInt(inst.studentsTaught) || 20;
          if (st > 30) {
            st = realistic30Values[idx % realistic30Values.length];
          }
          return { ...inst, studentsTaught: st };
        });
        localStorage.setItem('lms_instructors', JSON.stringify(updated));
        return updated;
      }
    }

    // Default Seed 15 Instructors with realistic profiles (studentsTaught strictly <= 30 based on 30 LMS students)
    const seedInstructors = [
      {
        id: 'inst-1',
        name: 'Dr. Emily Carter',
        email: 'emily.carter@edulearn.com',
        phone: '+1 (555) 234-5678',
        experience: '10 Years',
        specialization: 'Full Stack Development',
        rating: 4.9,
        studentsTaught: 28,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        bio: 'Senior Software Architect and Ph.D. in Computer Science with over a decade of teaching experience in React, Node.js, and Cloud Infrastructure.',
        assignedCourseIds: ['1', '5']
      },
      {
        id: 'inst-2',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@edulearn.com',
        phone: '+1 (555) 345-6789',
        experience: '8 Years',
        specialization: 'Data Science & AI',
        rating: 4.85,
        studentsTaught: 24,
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
        bio: 'Former Lead Data Scientist at TechCorp specializing in Machine Learning, Python Data Science Ecosystem, and Deep Learning Neural Networks.',
        assignedCourseIds: ['2', '4']
      },
      {
        id: 'inst-3',
        name: 'Mike Chen',
        email: 'mike.chen@edulearn.com',
        phone: '+1 (555) 456-7890',
        experience: '7 Years',
        specialization: 'UI/UX Design',
        rating: 4.92,
        studentsTaught: 26,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        bio: 'Product Designer and UX Strategist with a passion for designing scalable, accessible user interfaces and modern design systems.',
        assignedCourseIds: ['3']
      },
      {
        id: 'inst-4',
        name: 'Sneha Patel',
        email: 'sneha.patel@edulearn.com',
        phone: '+1 (555) 567-8901',
        experience: '6 Years',
        specialization: 'Mobile App Development',
        rating: 4.78,
        studentsTaught: 18,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
        bio: 'Mobile Engineer specializing in React Native and Flutter cross-platform applications with high-performance animations and native bridges.',
        assignedCourseIds: ['6']
      },
      {
        id: 'inst-5',
        name: 'Arjun Reddy',
        email: 'arjun.reddy@edulearn.com',
        phone: '+1 (555) 678-9012',
        experience: '12 Years',
        specialization: 'Cloud & DevOps',
        rating: 4.95,
        studentsTaught: 30,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        bio: 'AWS Certified Solutions Architect & DevOps Consultant teaching Docker, Kubernetes, CI/CD Pipelines, and Microservices Architecture.',
        assignedCourseIds: ['7']
      },
      {
        id: 'inst-6',
        name: 'Priya Sharma',
        email: 'priya.sharma@edulearn.com',
        phone: '+1 (555) 789-0123',
        experience: '5 Years',
        specialization: 'Cybersecurity',
        rating: 4.82,
        studentsTaught: 22,
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
        bio: 'Certified Ethical Hacker & Information Security Specialist focusing on Web Security, Penetration Testing, and Cryptography.',
        assignedCourseIds: ['8']
      },
      {
        id: 'inst-7',
        name: 'David Miller',
        email: 'david.miller@edulearn.com',
        phone: '+1 (555) 890-1234',
        experience: '9 Years',
        specialization: 'Full Stack Development',
        rating: 4.88,
        studentsTaught: 25,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
        bio: 'Full Stack Engineer with expertise in Next.js, GraphQL, PostgreSQL, and scalable microservices architectures.',
        assignedCourseIds: ['9']
      },
      {
        id: 'inst-8',
        name: 'Jessica Taylor',
        email: 'jessica.taylor@edulearn.com',
        phone: '+1 (555) 901-2345',
        experience: '6 Years',
        specialization: 'Data Science & AI',
        rating: 4.79,
        studentsTaught: 19,
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
        bio: 'AI Researcher specializing in Natural Language Processing (NLP), Large Language Models (LLMs), and PyTorch model training.',
        assignedCourseIds: ['10']
      },
      {
        id: 'inst-9',
        name: 'Alex Vance',
        email: 'alex.vance@edulearn.com',
        phone: '+1 (555) 012-3456',
        experience: '8 Years',
        specialization: 'Game Development',
        rating: 4.91,
        studentsTaught: 29,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
        bio: 'Unreal Engine 5 and Unity 3D Developer with years of experience building AAA physics engines and interactive VR/AR environments.',
        assignedCourseIds: ['11']
      },
      {
        id: 'inst-10',
        name: 'Nikhil Verma',
        email: 'nikhil.verma@edulearn.com',
        phone: '+1 (555) 123-4567',
        experience: '11 Years',
        specialization: 'Database Architecture',
        rating: 4.86,
        studentsTaught: 27,
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
        bio: 'Database Administrator and Enterprise Data Engineer specializing in MongoDB, PostgreSQL indexing, and distributed Redis caching.',
        assignedCourseIds: ['12']
      },
      {
        id: 'inst-11',
        name: 'Elena Rostova',
        email: 'elena.rostova@edulearn.com',
        phone: '+1 (555) 234-5679',
        experience: '7 Years',
        specialization: 'UI/UX Design',
        rating: 4.93,
        studentsTaught: 21,
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
        bio: 'Figma Community Creator and Design Systems Architect focusing on user research, wireframing, and interactive prototyping.',
        assignedCourseIds: ['13']
      },
      {
        id: 'inst-12',
        name: 'Robert Lang',
        email: 'robert.lang@edulearn.com',
        phone: '+1 (555) 345-6780',
        experience: '10 Years',
        specialization: 'Cloud & DevOps',
        rating: 4.87,
        studentsTaught: 28,
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
        bio: 'Google Cloud Certified Professional teaching Terraform infrastructure as code, Serverless Cloud Functions, and Linux administration.',
        assignedCourseIds: ['14']
      },
      {
        id: 'inst-13',
        name: 'Kavita Krishnan',
        email: 'kavita.krishnan@edulearn.com',
        phone: '+1 (555) 456-7891',
        experience: '5 Years',
        specialization: 'Data Science & AI',
        rating: 4.84,
        studentsTaught: 16,
        image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80',
        bio: 'Computer Vision Specialist working on OpenCV, TensorFlow, and real-time object detection models for autonomous systems.',
        assignedCourseIds: ['15']
      },
      {
        id: 'inst-14',
        name: 'Carlos Mendez',
        email: 'carlos.mendez@edulearn.com',
        phone: '+1 (555) 567-8902',
        experience: '8 Years',
        specialization: 'Mobile App Development',
        rating: 4.90,
        studentsTaught: 23,
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
        bio: 'iOS & Swift Lead Engineer with extensive experience in SwiftUI, CoreData, and App Store publishing pipelines.',
        assignedCourseIds: ['16']
      },
      {
        id: 'inst-15',
        name: 'Hannah Abbott',
        email: 'hannah.abbott@edulearn.com',
        phone: '+1 (555) 678-9013',
        experience: '6 Years',
        specialization: 'Full Stack Development',
        rating: 4.81,
        studentsTaught: 20,
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
        bio: 'Frontend Architect specializing in Vue.js, React, Tailwind CSS, and Web Accessibility (WCAG) compliance.',
        assignedCourseIds: ['17']
      }
    ];

    localStorage.setItem('lms_instructors', JSON.stringify(seedInstructors));
    return seedInstructors;
  } catch (err) {
    console.error('Error reading instructors from LocalStorage:', err);
    return [];
  }
};

export const saveInstructorsToStorage = (instructors) => {
  localStorage.setItem('lms_instructors', JSON.stringify(instructors));
};
