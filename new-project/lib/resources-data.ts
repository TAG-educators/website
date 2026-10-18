export type ResourcePDF = {
  title: string;
  url: string;
  description?: string;
};

export type TopicResource = {
  topic: string;
  pdfs: ResourcePDF[];
};

export type LevelResources = {
  level: string;
  topics: TopicResource[];
};

export type CourseResources = {
  slug: string;
  name: string;
  icon: string;
  levels: LevelResources[];
};

// Placeholder PDF URLs   replace with real PDF links when available.
const placeholderPdf = (course: string, level: string, topic: string, num: number) =>
  `#${course}-${level}-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${num}`;

export const courseResources: CourseResources[] = [
  {
    slug: 'physics',
    name: 'Physics',
    icon: 'Atom',
    levels: [
      {
        level: 'O Level',
        topics: [
          {
            topic: 'Mechanics & Motion',
            pdfs: [
              { title: 'Motion & Forces   Notes', url: placeholderPdf('physics', 'olevel', 'mechanics', 1) },
              { title: 'Motion & Forces   Past Papers', url: placeholderPdf('physics', 'olevel', 'mechanics', 2) },
            ],
          },
          {
            topic: 'Waves & Optics',
            pdfs: [
              { title: 'Wave Properties   Notes', url: placeholderPdf('physics', 'olevel', 'waves', 1) },
              { title: 'Light & Optics   Past Papers', url: placeholderPdf('physics', 'olevel', 'waves', 2) },
            ],
          },
          {
            topic: 'Electricity & Magnetism',
            pdfs: [
              { title: 'Circuits   Notes', url: placeholderPdf('physics', 'olevel', 'electricity', 1) },
              { title: 'Magnetism   Past Papers', url: placeholderPdf('physics', 'olevel', 'electricity', 2) },
            ],
          },
          {
            topic: 'Thermal Physics',
            pdfs: [
              { title: 'Heat & Temperature   Notes', url: placeholderPdf('physics', 'olevel', 'thermal', 1) },
            ],
          },
        ],
      },
      {
        level: 'A Level',
        topics: [
          {
            topic: 'Mechanics & Motion',
            pdfs: [
              { title: 'Advanced Mechanics   Notes', url: placeholderPdf('physics', 'alevel', 'mechanics', 1) },
              { title: 'Advanced Mechanics   Past Papers', url: placeholderPdf('physics', 'alevel', 'mechanics', 2) },
            ],
          },
          {
            topic: 'Waves & Optics',
            pdfs: [
              { title: 'Wave Superposition   Notes', url: placeholderPdf('physics', 'alevel', 'waves', 1) },
            ],
          },
          {
            topic: 'Electricity & Magnetism',
            pdfs: [
              { title: 'Electromagnetic Fields   Notes', url: placeholderPdf('physics', 'alevel', 'electricity', 1) },
              { title: 'Electromagnetic Fields   Past Papers', url: placeholderPdf('physics', 'alevel', 'electricity', 2) },
            ],
          },
          {
            topic: 'Fields & Nuclear Physics',
            pdfs: [
              { title: 'Gravitational Fields   Notes', url: placeholderPdf('physics', 'alevel', 'fields', 1) },
              { title: 'Nuclear Physics   Past Papers', url: placeholderPdf('physics', 'alevel', 'fields', 2) },
            ],
          },
        ],
      },
      {
        level: 'IGCSE',
        topics: [
          {
            topic: 'Mechanics & Motion',
            pdfs: [
              { title: 'IGCSE Motion   Notes', url: placeholderPdf('physics', 'igcse', 'mechanics', 1) },
            ],
          },
          {
            topic: 'Waves & Optics',
            pdfs: [
              { title: 'IGCSE Waves   Notes', url: placeholderPdf('physics', 'igcse', 'waves', 1) },
            ],
          },
          {
            topic: 'Electricity & Magnetism',
            pdfs: [
              { title: 'IGCSE Circuits   Notes', url: placeholderPdf('physics', 'igcse', 'electricity', 1) },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'chemistry',
    name: 'Chemistry',
    icon: 'FlaskConical',
    levels: [
      {
        level: 'O Level',
        topics: [
          {
            topic: 'Atomic Structure & Periodic Table',
            pdfs: [
              { title: 'Atomic Structure   Notes', url: placeholderPdf('chemistry', 'olevel', 'atomic', 1) },
              { title: 'Periodic Table   Past Papers', url: placeholderPdf('chemistry', 'olevel', 'atomic', 2) },
            ],
          },
          {
            topic: 'Chemical Bonding',
            pdfs: [
              { title: 'Bonding Types   Notes', url: placeholderPdf('chemistry', 'olevel', 'bonding', 1) },
            ],
          },
          {
            topic: 'Stoichiometry & Moles',
            pdfs: [
              { title: 'Mole Calculations   Notes', url: placeholderPdf('chemistry', 'olevel', 'moles', 1) },
              { title: 'Mole Calculations   Past Papers', url: placeholderPdf('chemistry', 'olevel', 'moles', 2) },
            ],
          },
          {
            topic: 'Organic Chemistry',
            pdfs: [
              { title: 'Organic Reactions   Notes', url: placeholderPdf('chemistry', 'olevel', 'organic', 1) },
            ],
          },
        ],
      },
      {
        level: 'A Level',
        topics: [
          {
            topic: 'Atomic Structure & Periodic Table',
            pdfs: [
              { title: 'A Level Atomic Structure   Notes', url: placeholderPdf('chemistry', 'alevel', 'atomic', 1) },
            ],
          },
          {
            topic: 'Chemical Bonding',
            pdfs: [
              { title: 'Advanced Bonding   Notes', url: placeholderPdf('chemistry', 'alevel', 'bonding', 1) },
              { title: 'Advanced Bonding   Past Papers', url: placeholderPdf('chemistry', 'alevel', 'bonding', 2) },
            ],
          },
          {
            topic: 'Stoichiometry & Moles',
            pdfs: [
              { title: 'Advanced Moles   Notes', url: placeholderPdf('chemistry', 'alevel', 'moles', 1) },
            ],
          },
          {
            topic: 'Organic Chemistry',
            pdfs: [
              { title: 'Organic Mechanisms   Notes', url: placeholderPdf('chemistry', 'alevel', 'organic', 1) },
              { title: 'Organic Mechanisms   Past Papers', url: placeholderPdf('chemistry', 'alevel', 'organic', 2) },
            ],
          },
          {
            topic: 'Analytical Chemistry',
            pdfs: [
              { title: 'Spectroscopy   Notes', url: placeholderPdf('chemistry', 'alevel', 'analytical', 1) },
            ],
          },
        ],
      },
      {
        level: 'IGCSE',
        topics: [
          {
            topic: 'Atomic Structure & Periodic Table',
            pdfs: [
              { title: 'IGCSE Atomic Structure   Notes', url: placeholderPdf('chemistry', 'igcse', 'atomic', 1) },
            ],
          },
          {
            topic: 'Chemical Bonding',
            pdfs: [
              { title: 'IGCSE Bonding   Notes', url: placeholderPdf('chemistry', 'igcse', 'bonding', 1) },
            ],
          },
          {
            topic: 'Stoichiometry & Moles',
            pdfs: [
              { title: 'IGCSE Moles   Notes', url: placeholderPdf('chemistry', 'igcse', 'moles', 1) },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'mathematics',
    name: 'Mathematics',
    icon: 'Sigma',
    levels: [
      {
        level: 'O Level',
        topics: [
          {
            topic: 'Algebra & Functions',
            pdfs: [
              { title: 'Algebra Basics   Notes', url: placeholderPdf('math', 'olevel', 'algebra', 1) },
              { title: 'Algebra   Past Papers', url: placeholderPdf('math', 'olevel', 'algebra', 2) },
            ],
          },
          {
            topic: 'Geometry & Trigonometry',
            pdfs: [
              { title: 'Geometry   Notes', url: placeholderPdf('math', 'olevel', 'geometry', 1) },
              { title: 'Trigonometry   Past Papers', url: placeholderPdf('math', 'olevel', 'geometry', 2) },
            ],
          },
          {
            topic: 'Statistics & Probability',
            pdfs: [
              { title: 'Statistics   Notes', url: placeholderPdf('math', 'olevel', 'statistics', 1) },
            ],
          },
        ],
      },
      {
        level: 'A Level',
        topics: [
          {
            topic: 'Algebra & Functions',
            pdfs: [
              { title: 'Advanced Algebra   Notes', url: placeholderPdf('math', 'alevel', 'algebra', 1) },
              { title: 'Advanced Algebra   Past Papers', url: placeholderPdf('math', 'alevel', 'algebra', 2) },
            ],
          },
          {
            topic: 'Calculus & Differentiation',
            pdfs: [
              { title: 'Differentiation   Notes', url: placeholderPdf('math', 'alevel', 'calculus', 1) },
              { title: 'Integration   Notes', url: placeholderPdf('math', 'alevel', 'calculus', 2) },
              { title: 'Calculus   Past Papers', url: placeholderPdf('math', 'alevel', 'calculus', 3) },
            ],
          },
          {
            topic: 'Mechanics',
            pdfs: [
              { title: 'Mechanics   Notes', url: placeholderPdf('math', 'alevel', 'mechanics', 1) },
            ],
          },
          {
            topic: 'Statistics & Probability',
            pdfs: [
              { title: 'Probability Distributions   Notes', url: placeholderPdf('math', 'alevel', 'statistics', 1) },
            ],
          },
        ],
      },
      {
        level: 'IGCSE',
        topics: [
          {
            topic: 'Algebra & Functions',
            pdfs: [
              { title: 'IGCSE Algebra   Notes', url: placeholderPdf('math', 'igcse', 'algebra', 1) },
            ],
          },
          {
            topic: 'Geometry & Trigonometry',
            pdfs: [
              { title: 'IGCSE Geometry   Notes', url: placeholderPdf('math', 'igcse', 'geometry', 1) },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'biology',
    name: 'Biology',
    icon: 'Dna',
    levels: [
      {
        level: 'O Level',
        topics: [
          {
            topic: 'Cell Biology & Transport',
            pdfs: [
              { title: 'Cell Structure   Notes', url: placeholderPdf('biology', 'olevel', 'cell', 1) },
              { title: 'Cell Transport   Past Papers', url: placeholderPdf('biology', 'olevel', 'cell', 2) },
            ],
          },
          {
            topic: 'Genetics & Evolution',
            pdfs: [
              { title: 'Genetics   Notes', url: placeholderPdf('biology', 'olevel', 'genetics', 1) },
            ],
          },
          {
            topic: 'Human Physiology',
            pdfs: [
              { title: 'Digestion & Respiration   Notes', url: placeholderPdf('biology', 'olevel', 'physiology', 1) },
            ],
          },
        ],
      },
      {
        level: 'A Level',
        topics: [
          {
            topic: 'Cell Biology & Transport',
            pdfs: [
              { title: 'Advanced Cell Biology   Notes', url: placeholderPdf('biology', 'alevel', 'cell', 1) },
            ],
          },
          {
            topic: 'Genetics & Evolution',
            pdfs: [
              { title: 'Advanced Genetics   Notes', url: placeholderPdf('biology', 'alevel', 'genetics', 1) },
              { title: 'Genetics   Past Papers', url: placeholderPdf('biology', 'alevel', 'genetics', 2) },
            ],
          },
          {
            topic: 'Human Physiology',
            pdfs: [
              { title: 'Nervous System   Notes', url: placeholderPdf('biology', 'alevel', 'physiology', 1) },
            ],
          },
          {
            topic: 'Ecology & Environment',
            pdfs: [
              { title: 'Ecosystems   Notes', url: placeholderPdf('biology', 'alevel', 'ecology', 1) },
            ],
          },
        ],
      },
      {
        level: 'IGCSE',
        topics: [
          {
            topic: 'Cell Biology & Transport',
            pdfs: [
              { title: 'IGCSE Cells   Notes', url: placeholderPdf('biology', 'igcse', 'cell', 1) },
            ],
          },
          {
            topic: 'Human Physiology',
            pdfs: [
              { title: 'IGCSE Physiology   Notes', url: placeholderPdf('biology', 'igcse', 'physiology', 1) },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'computer-science',
    name: 'Computer Science',
    icon: 'Code2',
    levels: [
      {
        level: 'O Level',
        topics: [
          {
            topic: 'Programming Fundamentals',
            pdfs: [
              { title: 'Programming Basics   Notes', url: placeholderPdf('cs', 'olevel', 'programming', 1) },
            ],
          },
          {
            topic: 'Computer Architecture',
            pdfs: [
              { title: 'Architecture   Notes', url: placeholderPdf('cs', 'olevel', 'architecture', 1) },
            ],
          },
        ],
      },
      {
        level: 'A Level',
        topics: [
          {
            topic: 'Programming Fundamentals',
            pdfs: [
              { title: 'Advanced Programming   Notes', url: placeholderPdf('cs', 'alevel', 'programming', 1) },
              { title: 'Programming   Past Papers', url: placeholderPdf('cs', 'alevel', 'programming', 2) },
            ],
          },
          {
            topic: 'Data Structures & Algorithms',
            pdfs: [
              { title: 'Data Structures   Notes', url: placeholderPdf('cs', 'alevel', 'datastructures', 1) },
            ],
          },
          {
            topic: 'Networks & Databases',
            pdfs: [
              { title: 'Networks   Notes', url: placeholderPdf('cs', 'alevel', 'networks', 1) },
            ],
          },
        ],
      },
      {
        level: 'IGCSE',
        topics: [
          {
            topic: 'Programming Fundamentals',
            pdfs: [
              { title: 'IGCSE Programming   Notes', url: placeholderPdf('cs', 'igcse', 'programming', 1) },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'business-studies',
    name: 'Business Studies',
    icon: 'Briefcase',
    levels: [
      {
        level: 'O Level',
        topics: [
          {
            topic: 'Business Organisation & Structure',
            pdfs: [
              { title: 'Business Structure   Notes', url: placeholderPdf('business', 'olevel', 'structure', 1) },
            ],
          },
          {
            topic: 'Marketing & Strategy',
            pdfs: [
              { title: 'Marketing   Notes', url: placeholderPdf('business', 'olevel', 'marketing', 1) },
              { title: 'Marketing   Past Papers', url: placeholderPdf('business', 'olevel', 'marketing', 2) },
            ],
          },
        ],
      },
      {
        level: 'A Level',
        topics: [
          {
            topic: 'Business Organisation & Structure',
            pdfs: [
              { title: 'Advanced Business Structure   Notes', url: placeholderPdf('business', 'alevel', 'structure', 1) },
            ],
          },
          {
            topic: 'Marketing & Strategy',
            pdfs: [
              { title: 'Advanced Marketing   Notes', url: placeholderPdf('business', 'alevel', 'marketing', 1) },
            ],
          },
          {
            topic: 'Operations & Production',
            pdfs: [
              { title: 'Operations   Notes', url: placeholderPdf('business', 'alevel', 'operations', 1) },
            ],
          },
        ],
      },
      {
        level: 'IGCSE',
        topics: [
          {
            topic: 'Business Organisation & Structure',
            pdfs: [
              { title: 'IGCSE Business   Notes', url: placeholderPdf('business', 'igcse', 'structure', 1) },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'economics',
    name: 'Economics',
    icon: 'TrendingUp',
    levels: [
      {
        level: 'O Level',
        topics: [
          {
            topic: 'Supply & Demand',
            pdfs: [
              { title: 'Supply & Demand   Notes', url: placeholderPdf('economics', 'olevel', 'supply', 1) },
            ],
          },
          {
            topic: 'Market Structures',
            pdfs: [
              { title: 'Market Structures   Notes', url: placeholderPdf('economics', 'olevel', 'markets', 1) },
            ],
          },
        ],
      },
      {
        level: 'A Level',
        topics: [
          {
            topic: 'Supply & Demand',
            pdfs: [
              { title: 'Advanced Supply & Demand   Notes', url: placeholderPdf('economics', 'alevel', 'supply', 1) },
            ],
          },
          {
            topic: 'Macroeconomic Indicators',
            pdfs: [
              { title: 'Macro Indicators   Notes', url: placeholderPdf('economics', 'alevel', 'macro', 1) },
              { title: 'Macro Indicators   Past Papers', url: placeholderPdf('economics', 'alevel', 'macro', 2) },
            ],
          },
          {
            topic: 'Fiscal & Monetary Policy',
            pdfs: [
              { title: 'Fiscal Policy   Notes', url: placeholderPdf('economics', 'alevel', 'fiscal', 1) },
            ],
          },
          {
            topic: 'International Trade',
            pdfs: [
              { title: 'International Trade   Notes', url: placeholderPdf('economics', 'alevel', 'trade', 1) },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'accounts',
    name: 'Accounts',
    icon: 'Calculator',
    levels: [
      {
        level: 'O Level',
        topics: [
          {
            topic: 'Double-Entry Bookkeeping',
            pdfs: [
              { title: 'Bookkeeping   Notes', url: placeholderPdf('accounts', 'olevel', 'bookkeeping', 1) },
            ],
          },
          {
            topic: 'Trial Balance & Corrections',
            pdfs: [
              { title: 'Trial Balance   Notes', url: placeholderPdf('accounts', 'olevel', 'trial', 1) },
            ],
          },
          {
            topic: 'Financial Statements',
            pdfs: [
              { title: 'Financial Statements   Notes', url: placeholderPdf('accounts', 'olevel', 'financial', 1) },
              { title: 'Financial Statements   Past Papers', url: placeholderPdf('accounts', 'olevel', 'financial', 2) },
            ],
          },
        ],
      },
      {
        level: 'A Level',
        topics: [
          {
            topic: 'Double-Entry Bookkeeping',
            pdfs: [
              { title: 'Advanced Bookkeeping   Notes', url: placeholderPdf('accounts', 'alevel', 'bookkeeping', 1) },
            ],
          },
          {
            topic: 'Financial Statements',
            pdfs: [
              { title: 'Advanced Financial Statements   Notes', url: placeholderPdf('accounts', 'alevel', 'financial', 1) },
            ],
          },
          {
            topic: 'Partnership & Company Accounts',
            pdfs: [
              { title: 'Partnership Accounts   Notes', url: placeholderPdf('accounts', 'alevel', 'partnership', 1) },
            ],
          },
          {
            topic: 'Costing & Budgeting',
            pdfs: [
              { title: 'Costing   Notes', url: placeholderPdf('accounts', 'alevel', 'costing', 1) },
            ],
          },
        ],
      },
    ],
  },
];
