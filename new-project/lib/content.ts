export type Feature = {
  title: string;
  description: string;
  icon: string;
};

export const features: Feature[] = [
  {
    title: 'Small-batch classes',
    description:
      'Tutor-led micro-cohorts, kept small enough that every student still gets real attention.',
    icon: 'Users',
  },
  {
    title: 'Past-paper sessions',
    description:
      'Regular sessions built entirely around solving real, timed past papers   not just theory.',
    icon: 'FileText',
  },
  {
    title: 'WhatsApp support',
    description:
      'Direct WhatsApp access to your tutor between sessions for quick questions.',
    icon: 'MessageCircle',
  },
  {
    title: 'Attendance & progress reports',
    description:
      'Parents get regular attendance and progress updates   not silence between report cards.',
    icon: 'ClipboardCheck',
  },
  {
    title: 'Recorded sessions',
    description:
      'Every session is recorded, so students can rewatch anything that didn\'t stick the first time.',
    icon: 'Video',
  },
  {
    title: 'Quizzes & tests',
    description:
      'Short quizzes and periodic tests to check what\'s actually sticking, not just what\'s been covered.',
    icon: 'GraduationCap',
  },
];

export type Step = {
  number: string;
  title: string;
  description: string;
};

export const steps: Step[] = [
  {
    number: '01',
    title: 'Browse a subject',
    description:
      'Each subject page shows its tutor, current batch timings and a short registration form.',
  },
  {
    number: '02',
    title: 'Register or message us',
    description:
      'Fill the form, or message us on WhatsApp first if you\'d rather ask questions before registering.',
  },
  {
    number: '03',
    title: 'Start small-batch sessions',
    description:
      'Sessions run live online, scheduled around your family\'s time zone and week.',
  },
];

export type FAQ = {
  question: string;
  answer: string;
};

export const faqs: FAQ[] = [
  {
    question: 'Who are the tutors?',
    answer:
      'Every tutor has sat these exact Cambridge papers and currently teaches at an O Level school or A Level college   two of our faculty are also formally Cambridge certified. Not a generalist matched to a subject list.',
  },
  {
    question: 'How big are the batches?',
    answer:
      'We keep batches deliberately small and tutor-led, so every student still gets real attention from their tutor throughout the course.',
  },
  {
    question: 'Which curricula do you cover?',
    answer:
      'Cambridge O Level, A Level and IGCSE, mapped to the current syllabus for each subject.',
  },
];

export type WhyItem = {
  title: string;
  description: string;
  icon: string;
};

export const whyItems: WhyItem[] = [
  {
    title: 'Expert Faculty',
    description:
      'Learn from experienced educators who have sat these exact Cambridge exams and teach at O & A Level schools.',
    icon: 'Award',
  },
  {
    title: 'Practical Learning',
    description:
      'Focus on useful and applicable knowledge   real past-paper practice, not just theory.',
    icon: 'Target',
  },
  {
    title: 'Structured Courses',
    description:
      'Clear learning paths mapped to the current Cambridge syllabus for each subject.',
    icon: 'Map',
  },
  {
    title: 'Supportive Environment',
    description:
      'A learning experience designed around students   small batches, WhatsApp support, recorded sessions.',
    icon: 'HeartHandshake',
  },
];
