export type Resource = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  icon: string;
};

// The existing TAG Educators website does not yet publish a resources library.
// These entries represent the types of resources TAG Educators offers based on
// their stated features   past papers, study guides and exam preparation.
// Individual resource content will be populated from the CMS when available.

export const resources: Resource[] = [
  {
    slug: 'past-paper-masterclass',
    title: 'Past Paper Masterclass',
    excerpt:
      'Our flagship programme   regular sessions built entirely around solving real, timed past papers. Available across all subjects.',
    category: 'Exam Preparation',
    date: '2026-01-15',
    readTime: '5 min read',
    icon: 'FileText',
  },
  {
    slug: 'exam-technique-guide',
    title: 'Cambridge Exam Technique Guide',
    excerpt:
      'Learn the mark-scheme language and examiner expectations that turn good knowledge into top grades.',
    category: 'Study Guide',
    date: '2026-01-10',
    readTime: '8 min read',
    icon: 'BookOpen',
  },
  {
    slug: 'revision-timetable-template',
    title: 'Revision Timetable Template',
    excerpt:
      'A structured weekly revision template designed around Cambridge exam windows and small-batch session schedules.',
    category: 'Download',
    date: '2026-01-05',
    readTime: '3 min read',
    icon: 'CalendarDays',
  },
  {
    slug: 'physics-mechanics-checklist',
    title: 'Physics Mechanics Checklist',
    excerpt:
      'A topic-by-topic checklist for Cambridge O Level and A Level mechanics   know exactly what to revise.',
    category: 'Study Guide',
    date: '2025-12-28',
    readTime: '4 min read',
    icon: 'CheckSquare',
  },
  {
    slug: 'maths-formula-sheet',
    title: 'Mathematics Formula Sheet',
    excerpt:
      'Every formula you need for Cambridge O Level, A Level and IGCSE Mathematics, organised by topic.',
    category: 'Download',
    date: '2025-12-20',
    readTime: '2 min read',
    icon: 'Sigma',
  },
];
