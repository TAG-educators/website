export const siteConfig = {
  name: 'TAG Educators',
  fullName: 'The Ark Global Educators',
  tagline: 'Less Sinking. More Sailing.',
  shortDescription:
    'TAG Educators matches O Level, A Level and IGCSE students with specialist tutors in small, focused batches   live online, wherever in the world you are.',
  longDescription:
    'Premium Cambridge O Level, A Level and IGCSE tutoring in small tutor-led batches. Taught by someone who has already sat this exact exam.',
  url: 'https://tageducators.com',
  whatsapp: '923162165779',
  whatsappDisplay: '+92 316 216 5779',
  whatsappUrl: 'https://wa.me/923162165779',
  email: 'info@tageducators.com',
  levels: ['O Level', 'A Level', 'IGCSE'],
  credentials: [
    'Sat these exact exams',
    'Teach at O & A Level schools',
    '2 Cambridge-certified tutors',
  ],
  results: {
    total: 37,
    aStarAndA: 25,
    b: 10,
    c: 2,
  },
} as const;

export type SiteConfig = typeof siteConfig;
