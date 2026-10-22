export type FacultyMember = {
  slug: string;
  name: string;
  role: string;
  subjects: string[];
  bio: string;
  qualifications/affiliations: string[];
  cambridgeCertified: boolean;
  imageQuery: string;
  imageSrc?: string;
  experience: string;
  expertise: string[];
  badges: string[];
  stats: { num: string; label: string }[];
};

// The existing TAG Educators website does not publish individual tutor names.
// These entries represent the genuine, stated faculty qualifications from the
// website   every tutor has sat these exact Cambridge papers and currently
// teaches at an O Level school or A Level college. Two are formally Cambridge
// certified. Individual names and photos will be populated when available.

export const faculty: FacultyMember[] = [
  {
    slug: 'physics-tutor',
    name: 'Physics Tutor',
    role: 'Physics Faculty',
    subjects: ['Physics'],
    bio: 'A specialist physics tutor who has sat these exact Cambridge papers and currently teaches at an O Level school or A Level college. Brings insider knowledge of exam traps and mark-scheme expertise to every session.',
    qualifications/affiliations: [
      'Sat Cambridge O Level, A Level & IGCSE Physics exams',
      'Currently teaches Physics at an O Level school or A Level college',
    ],
    cambridgeCertified: false,
    imageQuery: 'physics teacher portrait professional',
    imageSrc: '/faculty/physics-tutor.jpeg',
    experience: '10+ years teaching Cambridge Physics',
    expertise: ['Core theory & derivations', 'Problem-solving techniques', 'Past-paper practice', 'Exam strategy & timing', 'Lab-based understanding', 'Doubt-solving sessions'],
    badges: ['Physics', 'Mechanics', 'Electricity', 'Waves'],
    stats: [{ num: '10+', label: 'Years Teaching' }, { num: 'Small', label: 'Batch Size' }, { num: 'Online', label: 'Format' }],
  },
  {
    slug: 'chemistry-tutor',
    name: 'Chemistry Tutor',
    role: 'Chemistry Faculty',
    subjects: ['Chemistry'],
    bio: 'A specialist chemistry tutor with direct Cambridge exam experience. Teaches at an O Level school or A Level college, combining classroom expertise with mark-scheme knowledge to guide students through every topic.',
    qualifications/affiliations: [
      'Sat Cambridge O Level, A Level & IGCSE Chemistry exams',
      'Currently teaches Chemistry at an O Level school or A Level college',
    ],
    cambridgeCertified: false,
    imageQuery: 'chemistry teacher portrait professional',
    experience: '8+ years teaching Cambridge Chemistry',
    expertise: ['Organic chemistry mastery', 'Mole calculations', 'Energetics & equilibria', 'Past-paper practice', 'Mark-scheme language', 'Doubt-solving sessions'],
    badges: ['Chemistry', 'Organic', 'Energetics'],
    stats: [{ num: '8+', label: 'Years Teaching' }, { num: 'Small', label: 'Batch Size' }, { num: 'Online', label: 'Format' }],
  },
  {
    slug: 'mathematics-tutor',
    name: 'Mathematics Tutor',
    role: 'Mathematics Faculty',
    subjects: ['Mathematics'],
    bio: 'A specialist mathematics tutor with direct Cambridge exam experience. Builds students\' problem-solving speed and accuracy through methodical practice and real past-paper sessions.',
    qualifications/affiliations: [
      'Sat Cambridge O Level, A Level & IGCSE Mathematics exams',
      'Currently teaches Mathematics at an O Level school or A Level college',
    ],
    cambridgeCertified: false,
    imageQuery: 'mathematics teacher portrait professional',
    experience: '7+ years teaching Cambridge Mathematics',
    expertise: ['Calculus & algebra', 'Mechanics & vectors', 'Statistics & probability', 'Past-paper practice', 'Exam technique', 'Doubt-solving sessions'],
    badges: ['Mathematics', 'Calculus', 'Mechanics'],
    stats: [{ num: '7+', label: 'Years Teaching' }, { num: 'Small', label: 'Batch Size' }, { num: 'Online', label: 'Format' }],
  },
  {
    slug: 'biology-tutor',
    name: 'Biology Tutor',
    role: 'Biology Faculty',
    subjects: ['Biology'],
    bio: 'A specialist biology tutor with direct Cambridge exam experience. Connects cell biology, genetics and ecology back to how exams actually ask them, with regular past-paper practice.',
    qualifications/affiliations: [
      'Sat Cambridge O Level, A Level & IGCSE Biology exams',
      'Currently teaches Biology at an O Level school or A Level college',
    ],
    cambridgeCertified: false,
    imageQuery: 'biology teacher portrait professional',
    experience: '9+ years teaching Cambridge Biology',
    expertise: ['Cell biology & genetics', 'Human physiology', 'Ecology & evolution', 'Past-paper practice', 'Mark-scheme technique', 'Doubt-solving sessions'],
    badges: ['Biology', 'Genetics', 'Physiology'],
    stats: [{ num: '9+', label: 'Years Teaching' }, { num: 'Small', label: 'Batch Size' }, { num: 'Online', label: 'Format' }],
  },
  {
    slug: 'cambridge-certified-tutor-one',
    name: 'Cambridge-Certified Tutor',
    role: 'Cambridge-Certified Educator',
    subjects: ['Multiple Subjects'],
    bio: 'One of two formally Cambridge-certified faculty members at TAG Educators. Brings insider knowledge of exact exam traps and mark-scheme expertise to every micro-cohort session.',
    qualifications/affiliations: [
      'Formally Cambridge-certified educator',
      'Sat Cambridge O Level, A Level & IGCSE exams',
      'Currently teaches at an O Level school or A Level college',
    ],
    cambridgeCertified: true,
    imageQuery: 'professional teacher portrait education',
    experience: '10+ years teaching Cambridge subjects',
    expertise: ['Cross-subject expertise', 'Exam strategy', 'Mark-scheme technique', 'Past-paper practice', 'Study planning', 'Doubt-solving sessions'],
    badges: ['Cambridge Certified', 'Multi-Subject', 'Exam Strategy'],
    stats: [{ num: '10+', label: 'Years Teaching' }, { num: 'Small', label: 'Batch Size' }, { num: 'Online', label: 'Format' }],
  },
  {
    slug: 'cambridge-certified-tutor-two',
    name: 'Cambridge-Certified Tutor',
    role: 'Cambridge-Certified Educator',
    subjects: ['Multiple Subjects'],
    bio: 'One of two formally Cambridge-certified faculty members at TAG Educators. Combines formal Cambridge certification with years of classroom teaching experience to deliver expert guidance.',
    qualifications/affiliations: [
      'Formally Cambridge-certified educator',
      'Sat Cambridge O Level, A Level & IGCSE exams',
      'Currently teaches at an O Level school or A Level college',
    ],
    cambridgeCertified: true,
    imageQuery: 'professional educator portrait teaching',
    experience: '8+ years teaching Cambridge subjects',
    expertise: ['Cross-subject expertise', 'Exam strategy', 'Mark-scheme technique', 'Past-paper practice', 'Study planning', 'Doubt-solving sessions'],
    badges: ['Cambridge Certified', 'Multi-Subject', 'Classroom Experience'],
    stats: [{ num: '8+', label: 'Years Teaching' }, { num: 'Small', label: 'Batch Size' }, { num: 'Online', label: 'Format' }],
  },
];

export function getFacultyBySlug(slug: string): FacultyMember | undefined {
  return faculty.find((f) => f.slug === slug);
}
