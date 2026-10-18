export type Testimonial = {
  quote: string;
  name: string;
  course: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      'I finished my Physics course two months before the exams... right now I\'m doing past papers and they\'re a breeze in all honesty.',
    name: 'Nubaid',
    course: 'Physics',
  },
  {
    quote:
      'I was struggling with time management, but TAG gave me the exact examiner cheat codes to fast-track my revision and master the papers.',
    name: 'Ishaq',
    course: 'Past Paper Masterclass',
  },
  {
    quote: 'From failing mocks to A* confidence. Exam anxiety is gone.',
    name: 'Daniyal',
    course: 'A Level',
  },
];
