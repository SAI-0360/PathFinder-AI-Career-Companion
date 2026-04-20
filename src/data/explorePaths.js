export const explorePaths = [
  {
    id: 'iit-jee',
    category: 'Engineering',
    title: 'IIT-JEE Preparation',
    emoji: '🏆',
    description: 'Crack JEE Main & Advanced to get into IITs, NITs, and IIITs.',
    targetAudience: 'Class 11–12 students',
    duration: '2 years',
    phases: [
      {
        id: 'jee-phase-1',
        name: 'Foundation',
        description: 'Build strong concepts in Physics, Chemistry & Math',
        duration: '6 months',
        topics: [
          {
            id: 'jee-t1',
            name: 'Mathematics – Algebra & Trigonometry',
            description: 'Functions, quadratics, sequences, trigonometric identities',
            resources: [
              { title: 'Unacademy JEE Math', url: 'https://unacademy.com/goal/jee-advanced/TEFSC', type: 'course' },
              { title: 'Khan Academy – Algebra', url: 'https://www.khanacademy.org/math/algebra', type: 'website' },
            ],
          },
          {
            id: 'jee-t2',
            name: 'Physics – Mechanics',
            description: 'Kinematics, Newton\'s laws, work-energy, rotation',
            resources: [
              { title: 'Physics Wallah – Mechanics', url: 'https://www.youtube.com/@PhysicsWallah', type: 'video' },
              { title: 'HC Verma Solutions', url: 'https://www.youtube.com/watch?v=hHKRTsIi9nI', type: 'video' },
            ],
          },
        ],
      },
      {
        id: 'jee-phase-2',
        name: 'Intermediate',
        description: 'Complete syllabus with problem-solving focus',
        duration: '8 months',
        topics: [
          {
            id: 'jee-t3',
            name: 'Chemistry – Organic & Inorganic',
            description: 'Reaction mechanisms, periodic trends, coordination compounds',
            resources: [
              { title: 'Vedantu Chemistry', url: 'https://www.youtube.com/@VedantuJEEEnglish', type: 'video' },
              { title: 'NCERT Chemistry', url: 'https://ncert.nic.in/', type: 'article' },
            ],
          },
        ],
      },
      {
        id: 'jee-phase-3',
        name: 'Mock & Revision',
        description: 'Full-length mocks, error analysis, and time management',
        duration: '4 months',
        topics: [
          {
            id: 'jee-t4',
            name: 'Mock Test Strategy',
            description: 'Attempt full papers under exam conditions',
            resources: [
              { title: 'Allen Online Test Series', url: 'https://allen.ac.in/onlinetestseries/', type: 'website' },
              { title: 'Embibe JEE Mocks', url: 'https://www.embibe.com/exams/jee-main/', type: 'website' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'neet',
    category: 'Medicine',
    title: 'NEET / MBBS Preparation',
    emoji: '🩺',
    description: 'Qualify NEET-UG to pursue MBBS, BDS, or AYUSH courses.',
    targetAudience: 'Class 11–12 (PCB)',
    duration: '2 years',
    phases: [
      {
        id: 'neet-phase-1',
        name: 'NCERT Mastery',
        description: 'NCERT is the bible for NEET — read every line',
        duration: '6 months',
        topics: [
          {
            id: 'neet-t1',
            name: 'Biology – Cell & Genetics',
            description: 'Cell structure, division, Mendelian genetics, molecular biology',
            resources: [
              { title: 'Biology by Unacademy', url: 'https://unacademy.com/goal/neet-ug/DLMSS', type: 'course' },
              { title: 'Aakash NEET Biology', url: 'https://www.youtube.com/@AakashEduServices', type: 'video' },
            ],
          },
        ],
      },
      {
        id: 'neet-phase-2',
        name: 'Advanced Topics',
        description: 'Deep dive into Human Physiology, Ecology & Biochemistry',
        duration: '6 months',
        topics: [
          {
            id: 'neet-t2',
            name: 'Human Physiology',
            description: 'All body systems — nervous, endocrine, circulatory, respiratory',
            resources: [
              { title: 'Dr. Najeeb Lectures', url: 'https://www.youtube.com/@DrNajeeb', type: 'video' },
              { title: 'NEET Prep App', url: 'https://neetprep.com/', type: 'website' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'upsc',
    category: 'Civil Services',
    title: 'UPSC Civil Services (IAS/IPS)',
    emoji: '🏛️',
    description: 'Prepare for India\'s toughest exam — Prelims, Mains & Interview.',
    targetAudience: 'Graduates (any stream)',
    duration: '2–3 years',
    phases: [
      {
        id: 'upsc-phase-1',
        name: 'Foundation',
        description: 'Understand the exam, build NCERT base, choose optional',
        duration: '8 months',
        topics: [
          {
            id: 'upsc-t1',
            name: 'NCERT Foundation (6–12)',
            description: 'History, Geography, Polity, Economy, Science NCERTs',
            resources: [
              { title: 'BYJU\'s IAS – Free Videos', url: 'https://byjus.com/free-ias-prep/', type: 'course' },
              { title: 'Study IQ UPSC', url: 'https://www.youtube.com/@StudyIQ', type: 'video' },
            ],
          },
          {
            id: 'upsc-t2',
            name: 'Current Affairs',
            description: 'Daily Hindu reading, PIB, government schemes',
            resources: [
              { title: 'Vision IAS Monthly', url: 'https://visionias.in/resources/monthly-magazine/', type: 'article' },
              { title: 'Drishti IAS Current Affairs', url: 'https://www.drishtiias.com/current-affairs', type: 'website' },
            ],
          },
        ],
      },
      {
        id: 'upsc-phase-2',
        name: 'Prelims Specific',
        description: 'GS Paper 1 + CSAT intensive practice',
        duration: '6 months',
        topics: [
          {
            id: 'upsc-t3',
            name: 'GS Paper 1 – Polity & Governance',
            description: 'Constitution, Parliament, judiciary, federalism',
            resources: [
              { title: 'Lakshmikant Indian Polity – Summary', url: 'https://www.youtube.com/watch?v=HBvNB_UGFRQ', type: 'video' },
              { title: 'PRS India – Bills & Acts', url: 'https://prsindia.org/', type: 'website' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'web-dev',
    category: 'Technology',
    title: 'Full-Stack Web Development',
    emoji: '💻',
    description: 'Go from zero to job-ready full-stack developer (MERN stack).',
    targetAudience: 'Any student / graduate',
    duration: '8–12 months',
    phases: [
      {
        id: 'web-phase-1',
        name: 'Frontend Foundation',
        description: 'HTML, CSS, JavaScript — the core of the web',
        duration: '2 months',
        topics: [
          {
            id: 'web-t1',
            name: 'HTML & CSS',
            description: 'Semantic HTML, Flexbox, Grid, responsive design',
            resources: [
              { title: 'freeCodeCamp – Responsive Web Design', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'course' },
              { title: 'Kevin Powell CSS', url: 'https://www.youtube.com/@KevinPowell', type: 'video' },
            ],
          },
          {
            id: 'web-t2',
            name: 'JavaScript Fundamentals',
            description: 'Variables, functions, DOM, async/await, fetch API',
            resources: [
              { title: 'JavaScript.info', url: 'https://javascript.info/', type: 'website' },
              { title: 'Namaste JavaScript', url: 'https://www.youtube.com/@akshaymarch7', type: 'video' },
            ],
          },
        ],
      },
      {
        id: 'web-phase-2',
        name: 'React & Node.js',
        description: 'Modern frontend with React + backend with Node/Express',
        duration: '3 months',
        topics: [
          {
            id: 'web-t3',
            name: 'React.js',
            description: 'Components, hooks, state management, React Router',
            resources: [
              { title: 'React Official Docs', url: 'https://react.dev/', type: 'website' },
              { title: 'Chai aur Code – React', url: 'https://www.youtube.com/@chaiaurcode', type: 'video' },
            ],
          },
          {
            id: 'web-t4',
            name: 'Node.js & Express',
            description: 'REST APIs, middleware, authentication with JWT',
            resources: [
              { title: 'NPTEL – Node.js Course', url: 'https://nptel.ac.in/', type: 'course' },
              { title: 'Traversy Media Node Crash Course', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', type: 'video' },
            ],
          },
        ],
      },
      {
        id: 'web-phase-3',
        name: 'Portfolio & Job Hunt',
        description: 'Build projects, GitHub, resume, interview prep',
        duration: '2 months',
        topics: [
          {
            id: 'web-t5',
            name: 'Build Projects',
            description: '3–5 full-stack projects to showcase',
            resources: [
              { title: 'Project Ideas – GitHub', url: 'https://github.com/tastejs/awesome-app-ideas', type: 'website' },
              { title: 'Roadmap.sh Full Stack', url: 'https://roadmap.sh/full-stack', type: 'website' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'data-science',
    category: 'Technology',
    title: 'Data Science & ML',
    emoji: '📊',
    description: 'Master Python, statistics, ML & deep learning for data-driven careers.',
    targetAudience: 'Students with math/CS background',
    duration: '10–14 months',
    phases: [
      {
        id: 'ds-phase-1',
        name: 'Python & Statistics',
        description: 'Programming basics + probability & stats foundations',
        duration: '3 months',
        topics: [
          {
            id: 'ds-t1',
            name: 'Python for Data Science',
            description: 'NumPy, Pandas, Matplotlib, Seaborn',
            resources: [
              { title: 'Kaggle Python Course (Free)', url: 'https://www.kaggle.com/learn/python', type: 'course' },
              { title: 'CampusX – Data Science', url: 'https://www.youtube.com/@campusx-official', type: 'video' },
            ],
          },
          {
            id: 'ds-t2',
            name: 'Statistics & Probability',
            description: 'Distributions, hypothesis tests, Bayesian thinking',
            resources: [
              { title: 'StatQuest with Josh Starmer', url: 'https://www.youtube.com/@statquest', type: 'video' },
              { title: 'Khan Academy Statistics', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'course' },
            ],
          },
        ],
      },
      {
        id: 'ds-phase-2',
        name: 'Machine Learning',
        description: 'Supervised & unsupervised learning, model evaluation',
        duration: '4 months',
        topics: [
          {
            id: 'ds-t3',
            name: 'ML Algorithms',
            description: 'Linear/logistic regression, decision trees, SVM, clustering',
            resources: [
              { title: 'Andrew Ng – ML Specialization', url: 'https://www.coursera.org/specializations/machine-learning-introduction', type: 'course' },
              { title: 'Krish Naik – ML Playlist', url: 'https://www.youtube.com/@krishnaik06', type: 'video' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ca',
    category: 'Commerce',
    title: 'Chartered Accountancy (CA)',
    emoji: '📋',
    description: 'Become a CA through ICAI\'s Foundation → Intermediate → Final route.',
    targetAudience: 'Class 12 Commerce students',
    duration: '4–5 years',
    phases: [
      {
        id: 'ca-phase-1',
        name: 'CA Foundation',
        description: '4 papers: Accounting, Maths, Mercantile Law, Economics',
        duration: '8 months',
        topics: [
          {
            id: 'ca-t1',
            name: 'Accounting Principles',
            description: 'Journal entries, ledgers, trial balance, final accounts',
            resources: [
              { title: 'ICAI Study Material', url: 'https://www.icai.org/sub-menu.html?submenu_id=1', type: 'website' },
              { title: 'CA Wallah (Foundation)', url: 'https://www.youtube.com/@CAWallah', type: 'video' },
            ],
          },
        ],
      },
      {
        id: 'ca-phase-2',
        name: 'CA Intermediate',
        description: '8 papers covering advanced accounting, taxation, auditing',
        duration: '18 months',
        topics: [
          {
            id: 'ca-t2',
            name: 'Income Tax & GST',
            description: 'Direct & indirect tax laws, returns, assessments',
            resources: [
              { title: 'CBDT e-Learning', url: 'https://www.incometax.gov.in/', type: 'website' },
              { title: 'Unacademy CA Intermediate', url: 'https://unacademy.com/goal/ca-intermediate/GTCQH', type: 'course' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'clat',
    category: 'Law',
    title: 'CLAT / Law (LLB)',
    emoji: '⚖️',
    description: 'Get into top National Law Universities through CLAT.',
    targetAudience: 'Class 12 students (any stream)',
    duration: '1–2 years',
    phases: [
      {
        id: 'law-phase-1',
        name: 'Foundation',
        description: 'English, GK, Legal Reasoning, Logical Reasoning, Maths',
        duration: '6 months',
        topics: [
          {
            id: 'law-t1',
            name: 'Legal Reasoning',
            description: 'Principles, passages, application of law',
            resources: [
              { title: 'LegalEdge CLAT', url: 'https://legaledge.in/', type: 'website' },
              { title: 'CLAT Possible – Free Videos', url: 'https://www.youtube.com/@CLATPossible', type: 'video' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'class10',
    category: 'School',
    title: 'After Class 10 – What Next?',
    emoji: '🎓',
    description: 'A guide to stream selection and career planning post-Class 10 boards.',
    targetAudience: 'Class 10 students',
    duration: 'Ongoing',
    phases: [
      {
        id: 'c10-phase-1',
        name: 'Stream Selection',
        description: 'Choose between Science (PCM/PCB), Commerce, Arts/Humanities',
        duration: '1 month',
        topics: [
          {
            id: 'c10-t1',
            name: 'Career Aptitude Assessment',
            description: 'Identify your interests and strengths',
            resources: [
              { title: 'Career Guide India – CBSE', url: 'https://cbseacademic.nic.in/careerguide.html', type: 'website' },
              { title: 'iDreamCareer Aptitude Test', url: 'https://idreamcareer.com/', type: 'website' },
            ],
          },
          {
            id: 'c10-t2',
            name: 'Understanding Streams',
            description: 'PCM, PCB, Commerce, Humanities — pros, careers, subjects',
            resources: [
              { title: 'Careers360 – Stream Guide', url: 'https://www.careers360.com/', type: 'article' },
              { title: 'Josh Talks – Career Videos', url: 'https://www.youtube.com/@JoshTalks', type: 'video' },
            ],
          },
        ],
      },
    ],
  },
];

export const categories = ['All', 'Engineering', 'Medicine', 'Civil Services', 'Technology', 'Commerce', 'Law', 'School'];
