export type Course = {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  levels: string[];
  subLevels?: Record<string, string[]>;
  icon: string;
  imageQuery: string;
  category: 'Sciences' | 'Mathematics' | 'Humanities' | 'Commerce';
  topics: string[];
  whatYouWillLearn: string[];
  benefits: string[];
  originalPrice: number;
  price: number;
};

export const courses: Course[] = [
  {
    slug: 'physics',
    name: 'Physics',
    shortDescription:
      'Mechanics, waves and electricity, built around exam technique, not just theory.',
    longDescription:
      'Our Physics course covers the full Cambridge O Level, A Level and IGCSE syllabus   from mechanics and motion to waves, electricity and fields. Every concept is taught with real past-paper practice, so students learn not just how physics works, but how exams actually ask it.',
    levels: ['O Level/IGCSE', 'AS Level', 'A2 Level'],
    icon: 'Atom',
    imageQuery: 'physics science laboratory',
    category: 'Sciences',
    topics: [
      'Mechanics & Motion',
      'Waves & Optics',
      'Electricity & Magnetism',
      'Thermal Physics',
      'Fields & Nuclear Physics',
    ],
    whatYouWillLearn: [
      'Apply core physics principles to solve exam-style problems',
      'Master the mark scheme language examiners look for',
      'Tackle numerical problems with confidence and accuracy',
      'Interpret data and graph questions under timed conditions',
    ],
    benefits: [
      'Small-batch, tutor-led sessions with real attention',
      'Regular timed past-paper practice',
      'Direct WhatsApp access to your tutor between sessions',
      'Every session recorded for rewatching',
    ],
    originalPrice: 35000,
    price: 21000,
  },
  {
    slug: 'chemistry',
    name: 'Chemistry',
    shortDescription:
      'From the periodic table to organic reactions, taught with real past-paper practice.',
    longDescription:
      'Our Chemistry course takes students from the foundations of atomic structure and the periodic table through to organic reactions and analytical chemistry. Taught with a strong emphasis on past-paper practice, students develop both conceptual understanding and exam technique.',
    levels: ['O Level/IGCSE', 'AS Level', 'A2 Level'],
    icon: 'FlaskConical',
    imageQuery: 'chemistry laboratory experiment',
    category: 'Sciences',
    topics: [
      'Atomic Structure & Periodic Table',
      'Chemical Bonding',
      'Stoichiometry & Moles',
      'Organic Chemistry',
      'Analytical Chemistry',
    ],
    whatYouWillLearn: [
      'Understand and apply chemical bonding and reaction principles',
      'Balance equations and solve mole calculations quickly',
      'Approach organic chemistry questions systematically',
      'Write answers in the format examiners expect',
    ],
    benefits: [
      'Small-batch, tutor-led sessions with real attention',
      'Regular timed past-paper practice',
      'Direct WhatsApp access to your tutor between sessions',
      'Every session recorded for rewatching',
    ],
    originalPrice: 35000,
    price: 21000,
  },
  {
    slug: 'mathematics',
    name: 'Mathematics',
    shortDescription:
      'Algebra through calculus, with steady, methodical problem-solving practice.',
    longDescription:
      'Our Mathematics course covers the full Cambridge syllabus from algebra and geometry through to calculus and mechanics at A Level. The focus is on steady, methodical problem-solving   building the speed and accuracy that exams demand.',
    levels: ['O Level/IGCSE', 'A Level'],
    subLevels: {
      'A Level': ['Math P1', 'Math P3', 'Math M1', 'Math S1', 'Math S2'],
    },
    icon: 'Sigma',
    imageQuery: 'mathematics equations chalkboard',
    category: 'Mathematics',
    topics: [
      'Algebra & Functions',
      'Geometry & Trigonometry',
      'Calculus & Differentiation',
      'Statistics & Probability',
      'Mechanics',
    ],
    whatYouWillLearn: [
      'Solve complex algebraic and calculus problems methodically',
      'Develop speed and accuracy under timed exam conditions',
      'Approach word problems and modelling questions confidently',
      'Identify common exam traps and avoid losing marks',
    ],
    benefits: [
      'Small-batch, tutor-led sessions with real attention',
      'Regular timed past-paper practice',
      'Direct WhatsApp access to your tutor between sessions',
      'Every session recorded for rewatching',
    ],
    originalPrice: 40000,
    price: 24000,
  },
  {
    slug: 'biology',
    name: 'Biology',
    shortDescription:
      'Cell biology, genetics and ecology, connected back to how exams actually ask it.',
    longDescription:
      'Our Biology course covers cell biology, genetics, physiology and ecology   mapped to the current Cambridge syllabus. Concepts are connected back to how exams actually ask them, with regular past-paper sessions to build exam-ready understanding.',
    levels: ['O Level/IGCSE', 'AS Level', 'A2 Level'],
    icon: 'Dna',
    imageQuery: 'biology microscope cells',
    category: 'Sciences',
    topics: [
      'Cell Biology & Transport',
      'Genetics & Evolution',
      'Human Physiology',
      'Ecology & Environment',
      'Biotechnology',
    ],
    whatYouWillLearn: [
      'Explain biological processes using correct terminology',
      'Interpret data, graphs and experimental scenarios',
      'Structure long-answer questions to maximise marks',
      'Apply concepts to unfamiliar exam contexts',
    ],
    benefits: [
      'Small-batch, tutor-led sessions with real attention',
      'Regular timed past-paper practice',
      'Direct WhatsApp access to your tutor between sessions',
      'Every session recorded for rewatching',
    ],
    originalPrice: 35000,
    price: 21000,
  },
  {
    slug: 'computer-science',
    name: 'Computer Science',
    shortDescription:
      'Programming fundamentals and theory, taught with real code, not just diagrams.',
    longDescription:
      'Our Computer Science course covers programming fundamentals, data structures, algorithms and theory   taught with real code, not just diagrams. Students build practical programming skills while mastering the theoretical concepts that Cambridge exams test.',
    levels: ['O Level/IGCSE', 'AS Level', 'A2 Level'],
    icon: 'Code2',
    imageQuery: 'computer science programming code',
    category: 'Mathematics',
    topics: [
      'Programming Fundamentals',
      'Data Structures & Algorithms',
      'Computer Architecture',
      'Networks & Databases',
      'Software Development',
    ],
    whatYouWillLearn: [
      'Write and debug programs confidently under exam conditions',
      'Understand computer architecture and data representation',
      'Trace algorithms and solve pseudocode questions',
      'Apply theory to scenario-based exam questions',
    ],
    benefits: [
      'Small-batch, tutor-led sessions with real attention',
      'Regular timed past-paper practice',
      'Direct WhatsApp access to your tutor between sessions',
      'Every session recorded for rewatching',
    ],
    originalPrice: 38000,
    price: 22000,
  },
  {
    slug: 'business-studies',
    name: 'Business Studies',
    shortDescription:
      'How real businesses operate, market and grow, framed around the syllabus.',
    longDescription:
      'Our Business Studies course covers how real businesses operate, market and grow   framed around the Cambridge syllabus. Students learn to analyse business scenarios, apply theory to real-world cases, and structure exam answers that earn full marks.',
    levels: ['O Level/IGCSE', 'AS Level', 'A2 Level'],
    icon: 'Briefcase',
    imageQuery: 'business studies meeting office',
    category: 'Commerce',
    topics: [
      'Business Organisation & Structure',
      'Marketing & Strategy',
      'Operations & Production',
      'Finance & Accounting Basics',
      'Human Resource Management',
    ],
    whatYouWillLearn: [
      'Analyse business scenarios using correct terminology',
      'Evaluate strategies and justify recommendations',
      'Structure essay-style answers for maximum marks',
      'Apply business theory to real-world case studies',
    ],
    benefits: [
      'Small-batch, tutor-led sessions with real attention',
      'Regular timed past-paper practice',
      'Direct WhatsApp access to your tutor between sessions',
      'Every session recorded for rewatching',
    ],
    originalPrice: 32000,
    price: 19000,
  },
  {
    slug: 'economics',
    name: 'Economics',
    shortDescription:
      'Micro and macro concepts made concrete with real-world examples.',
    longDescription:
      'Our Economics course makes micro and macro concepts concrete with real-world examples. From supply and demand to fiscal policy and international trade, students learn to analyse economic situations and construct exam answers that demonstrate deep understanding.',
    levels: ['O Level/IGCSE', 'AS Level', 'A2 Level'],
    icon: 'TrendingUp',
    imageQuery: 'economics finance charts graph',
    category: 'Commerce',
    topics: [
      'Supply & Demand',
      'Market Structures',
      'Macroeconomic Indicators',
      'Fiscal & Monetary Policy',
      'International Trade',
    ],
    whatYouWillLearn: [
      'Analyse economic situations using diagrams and data',
      'Evaluate policy options with balanced arguments',
      'Interpret economic indicators and trends',
      'Structure essay responses that earn top marks',
    ],
    benefits: [
      'Small-batch, tutor-led sessions with real attention',
      'Regular timed past-paper practice',
      'Direct WhatsApp access to your tutor between sessions',
      'Every session recorded for rewatching',
    ],
    originalPrice: 35000,
    price: 21000,
  },
  {
    slug: 'accounts',
    name: 'Accounts',
    shortDescription:
      'Ledgers, statements and adjustments, practiced the way examiners mark them.',
    longDescription:
      'Our Accounts course covers ledgers, financial statements and adjustments   practiced the way examiners mark them. Students build precision and speed in double-entry bookkeeping, trial balances, and final accounts, with regular timed past-paper practice.',
    levels: ['O Level/IGCSE', 'AS Level', 'A2 Level'],
    icon: 'Calculator',
    imageQuery: 'accounting ledger finance documents',
    category: 'Commerce',
    topics: [
      'Double-Entry Bookkeeping',
      'Trial Balance & Corrections',
      'Financial Statements',
      'Partnership & Company Accounts',
      'Costing & Budgeting',
    ],
    whatYouWillLearn: [
      'Maintain accurate ledger accounts and trial balances',
      'Prepare financial statements with correct adjustments',
      'Interpret and analyse accounting information',
      'Work through exam papers with speed and precision',
    ],
    benefits: [
      'Small-batch, tutor-led sessions with real attention',
      'Regular timed past-paper practice',
      'Direct WhatsApp access to your tutor between sessions',
      'Every session recorded for rewatching',
    ],
    originalPrice: 32000,
    price: 19000,
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getRelatedCourses(slug: string, count = 3): Course[] {
  const course = getCourseBySlug(slug);
  if (!course) return [];
  return courses
    .filter((c) => c.slug !== slug && c.category === course.category)
    .concat(courses.filter((c) => c.slug !== slug && c.category !== course.category))
    .slice(0, count);
}
