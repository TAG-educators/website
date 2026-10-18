// ============================================================
// TAG Admin — Mock data layer
// Every screen imports from here. Later we swap these
// implementations for Supabase queries — the UI won't change.
// ============================================================

import type {
  Course, Teacher, Page, Registration, ExamTimer,
  Resource, Testimonial, Faq, MediaAsset, DashboardStat, Level, Status,
} from "./types";
import type { PageData, Section, BlockType } from "./block-schema";

// ---------- Dashboard ----------

export function getDashboardStats(): DashboardStat[] {
  return [
    { label: "Total Courses", value: 24, hint: "6 drafts", trend: { dir: "up", text: "+3 this month" } },
    { label: "Active Teachers", value: 11, trend: { dir: "flat", text: "no change" } },
    { label: "Published Pages", value: 9, hint: "2 drafts", trend: { dir: "up", text: "+1" } },
    { label: "New Registrations", value: 38, hint: "this week", trend: { dir: "up", text: "+12" } },
  ];
}

export function getRecentRegistrations(): Registration[] {
  return [
    { id: "r1", studentName: "Aisha Rahman", parentName: "Imran Rahman", email: "aisha@example.com", phone: "+92 300 1234567", location: "", parentPhone: "", courses: ["Physics O Level", "Chemistry O Level"], createdAt: "2026-09-27T14:20:00Z", status: "new" },
    { id: "r2", studentName: "Bilal Khan", parentName: "Sadia Khan", email: "bilal@example.com", phone: "+92 321 9876543", location: "", parentPhone: "", courses: ["Mathematics A Level"], createdAt: "2026-09-27T09:05:00Z", status: "contacted" },
    { id: "r3", studentName: "Zara Sheikh", parentName: "Farhan Sheikh", email: "zara@example.com", phone: "+92 333 5550000", location: "", parentPhone: "", courses: ["Biology IGCSE", "Chemistry IGCSE"], createdAt: "2026-09-26T18:40:00Z", status: "enrolled" },
    { id: "r4", studentName: "Hamza Ali", parentName: "Nadia Ali", email: "hamza@example.com", phone: "+92 345 1112222", location: "", parentPhone: "", courses: ["Physics A Level"], createdAt: "2026-09-26T11:15:00Z", status: "new" },
  ];
}

export function getUpcomingExams(): ExamTimer[] {
  return [
    { id: "e1", title: "Physics Paper 2", board: "Cambridge", level: "O Level", subject: "Physics", examDate: "2026-10-15T09:00:00Z", active: true, featured: true },
    { id: "e2", title: "Mathematics P1", board: "Cambridge", level: "A Level", subject: "Mathematics", examDate: "2026-10-18T09:00:00Z", active: true, featured: false },
    { id: "e3", title: "Chemistry MCQ", board: "Edexcel", level: "IGCSE", subject: "Chemistry", examDate: "2026-10-22T13:00:00Z", active: true, featured: false },
  ];
}

// ---------- Courses ----------

export function getCourses(): Course[] {
  return [
    ...[
      ["c1", "Physics O Level", "physics-o-level", "O Level", "Physics", ["t1"], 120, "published", true, "2026-10-01", 12],
      ["c2", "Chemistry O Level", "chemistry-o-level", "O Level", "Chemistry", ["t2"], 120, "published", false, "2026-10-01", 12],
      ["c3", "Mathematics A Level", "mathematics-a-level", "A Level", "Mathematics", ["t3"], 180, "published", true, "2026-10-08", 10],
      ["c4", "Biology IGCSE", "biology-igcse", "IGCSE", "Biology", ["t2"], 110, "draft", false, null, 15],
    ].map(([id, title, slug, level, subject, teacherIds, price, status, featured, startDate, batchSize], index) => ({
      id: id as string, title: title as string, slug: slug as string,
      shortDescription: "", longDescription: "", levels: [level as Level], level: level as Level,
      subject: subject as string, icon: "BookOpen", imageQuery: "", category: "Sciences",
      topics: [], whatYouWillLearn: [], benefits: [], teacherIds: teacherIds as string[],
      price: price as number, originalPrice: 0, currency: "USD", status: status as Status, featured: featured as boolean,
      startDate: startDate as string | null, batchSize: batchSize as number,
      updatedAt: `2026-09-${25 - index}T10:00:00Z`,
    })),
  ];
}

// ---------- Teachers ----------

export function getTeachers(): Teacher[] {
  return [
    ...[
      ["t1", "Dr. Sana Mahmood", "sana-mahmood", "PhD in Physics with 12 years of coaching Cambridge and Edexcel students.", ["Physics", "Mathematics"], ["O Level", "A Level"], 12, true],
      ["t2", "Mr. Usman Tariq", "usman-tariq", "MSc Chemistry with 9 years of teaching experience.", ["Chemistry", "Biology"], ["O Level", "IGCSE"], 9, false],
      ["t3", "Ms. Hira Jalal", "hira-jalal", "Mathematics specialist with 7 years of coaching A Level students.", ["Mathematics"], ["A Level"], 7, true],
    ].map(([id, name, slug, description, subjects, levels, yearsExperience, featured]) => ({
      id: id as string, name: name as string, slug: slug as string, photo: null,
      role: "", description: description as string, qualifications: [],
      subjects: subjects as string[], levels: levels as Level[], yearsExperience: yearsExperience as number,
      cambridgeCertified: false, imageQuery: "", experience: "", expertise: [], badges: [], stats: [],
      featured: featured as boolean, updatedAt: "2026-09-22T10:00:00Z",
    })),
  ];
}

// ---------- Pages ----------

export function getPages(): Page[] {
  return [
    { id: "p1", title: "Home", slug: "home", status: "published", sections: 14, updatedAt: "2026-09-27T16:00:00Z" },
    { id: "p2", title: "About Us", slug: "about", status: "published", sections: 6, updatedAt: "2026-09-26T12:00:00Z" },
    { id: "p3", title: "Why TAG", slug: "why-tag", status: "draft", sections: 4, updatedAt: "2026-09-25T09:00:00Z" },
    { id: "p4", title: "Results", slug: "results", status: "published", sections: 5, updatedAt: "2026-09-24T15:00:00Z" },
  ];
}

// ---------- Page detail (for Page Builder) ----------

// Mock sections for the Home page so the builder has real content.
const HOME_SECTIONS: Section[] = [
  {
    id: "s1",
    type: "hero",
    hidden: false,
    data: {
      eyebrow: "Ark Global Educators",
      title: "Where O & A Level students learn to score",
      description: "Small batches, expert teachers, and a track record of A* results across Cambridge and Edexcel.",
      primaryCta: { label: "Explore Courses", href: "/courses" },
      secondaryCta: { label: "Book a Free Trial", href: "/contact" },
      image: "/media/physics-hero.jpg",
    },
  },
  {
    id: "s2",
    type: "statistics",
    hidden: false,
    data: {
      title: "By the numbers",
      stats: [
        { value: "500+", label: "Students taught" },
        { value: "87%", label: "A*–A grades" },
        { value: "12", label: "Years of coaching" },
        { value: "8–15", label: "Batch size" },
      ],
    },
  },
  {
    id: "s3",
    type: "courseGrid",
    hidden: false,
    data: {
      title: "Featured Courses",
      courseIds: ["c1", "c3"],
      columns: "3",
      showAll: false,
    },
  },
  {
    id: "s4",
    type: "testimonialGrid",
    hidden: false,
    data: {
      title: "What our students say",
      testimonialIds: ["tm1", "tm2"],
      columns: "2",
    },
  },
  {
    id: "s5",
    type: "cta",
    hidden: false,
    data: {
      heading: "Ready to start your journey?",
      description: "Book a free trial class and see the TAG difference for yourself.",
      primaryCta: { label: "Book a Free Trial", href: "/contact" },
      secondaryCta: null,
    },
  },
];

const PAGE_DETAILS: Record<string, PageData> = {
  p1: { title: "Home", slug: "home", status: "published", sections: HOME_SECTIONS },
  p2: {
    title: "About Us",
    slug: "about",
    status: "published",
    sections: [
      { id: "s1", type: "hero", hidden: false, data: { eyebrow: "About", title: "Meet Ark Global Educators", description: "A small team obsessed with O & A Level results.", primaryCta: null, secondaryCta: null, image: "" } },
      { id: "s2", type: "richText", hidden: false, data: { body: "Founded in 2014, TAG began as a single Physics batch..." } },
      { id: "s3", type: "teacherGrid", hidden: false, data: { title: "Our Teachers", teacherIds: ["t1", "t2", "t3"], columns: "3" } },
      { id: "s4", type: "statistics", hidden: false, data: { title: "", stats: [{ value: "12", label: "Years" }] } },
      { id: "s5", type: "faq", hidden: false, data: { title: "Common Questions", faqIds: ["f1", "f2"], items: [] } },
      { id: "s6", type: "cta", hidden: false, data: { heading: "Join us", description: "", primaryCta: { label: "Contact", href: "/contact" }, secondaryCta: null } },
    ],
  },
  p3: {
    title: "Why TAG",
    slug: "why-tag",
    status: "draft",
    sections: [
      { id: "s1", type: "hero", hidden: false, data: { eyebrow: "Why TAG", title: "Why students choose us", description: "", primaryCta: null, secondaryCta: null, image: "" } },
      { id: "s2", type: "imageText", hidden: false, data: { image: "/media/physics-hero.jpg", heading: "Small batches", body: "8–15 students per batch.", layout: "right", cta: null } },
      { id: "s3", type: "imageText", hidden: false, data: { image: "/media/results-banner.jpg", heading: "Past-paper focus", body: "We drill past papers.", layout: "left", cta: null } },
      { id: "s4", type: "cta", hidden: false, data: { heading: "See it for yourself", description: "", primaryCta: { label: "Book a Trial", href: "/contact" }, secondaryCta: null } },
    ],
  },
  p4: {
    title: "Results",
    slug: "results",
    status: "published",
    sections: [
      { id: "s1", type: "hero", hidden: false, data: { eyebrow: "Results", title: "Our students' achievements", description: "", primaryCta: null, secondaryCta: null, image: "" } },
      { id: "s2", type: "statistics", hidden: false, data: { title: "", stats: [{ value: "87%", label: "A*–A grades" }] } },
      { id: "s3", type: "resultsGrid", hidden: false, data: { title: "Recent Results", resultIds: [], columns: "3", showAll: true } },
      { id: "s4", type: "testimonialGrid", hidden: false, data: { title: "", testimonialIds: ["tm1"], columns: "2" } },
      { id: "s5", type: "cta", hidden: false, data: { heading: "Be the next success story", description: "", primaryCta: { label: "Enroll Now", href: "/contact" }, secondaryCta: null } },
    ],
  },
};

export function getPage(id: string): PageData | null {
  return PAGE_DETAILS[id] ?? null;
}

export function getNewPage(): PageData {
  return { title: "Untitled Page", slug: "untitled-page", status: "draft", sections: [] };
}

// ---------- Resources ----------

export function getResources(): Resource[] {
  return [
    { id: "res1", title: "Physics Motion Notes", slug: "physics-motion-notes", excerpt: "", type: "Notes", subject: "Physics", level: "O Level", topic: "", date: "", readTime: "", icon: "FileText", url: null, featured: true, updatedAt: "2026-09-20T10:00:00Z" },
    { id: "res2", title: "Chemistry May 2025 Paper", slug: "chem-may-2025", excerpt: "", type: "Past Paper", subject: "Chemistry", level: "O Level", topic: "", date: "", readTime: "", icon: "FileText", url: null, featured: false, updatedAt: "2026-09-18T10:00:00Z" },
    { id: "res3", title: "Math Differentiation Guide", slug: "math-diff-guide", excerpt: "", type: "Guide", subject: "Mathematics", level: "A Level", topic: "", date: "", readTime: "", icon: "FileText", url: null, featured: true, updatedAt: "2026-09-15T10:00:00Z" },
  ];
}

// ---------- Testimonials ----------

export function getTestimonials(): Testimonial[] {
  return [
    { id: "tm1", studentName: "Mariam Q.", course: "Physics O Level", result: "A*", quote: "Small batches made all the difference - I could actually ask questions.", featured: true, videoUrl: null, poster: null },
    { id: "tm2", studentName: "Daniyal R.", course: "Mathematics A Level", result: "A", quote: "Past-paper sessions were the key to my grade.", featured: false, videoUrl: "https://youtu.be/example", poster: null },
  ];
}

// ---------- FAQs ----------

export function getFaqs(): Faq[] {
  return [
    { id: "f1", question: "How big are the batches?", answer: "We keep batches between 8 and 15 students.", category: "Classes", sortOrder: 1 },
    { id: "f2", question: "Are sessions recorded?", answer: "Yes, every live session is recorded and shared with enrolled students.", category: "Classes", sortOrder: 2 },
    { id: "f3", question: "How do I pay?", answer: "Our team will contact you after registration to confirm payment options.", category: "Registration", sortOrder: 3 },
  ];
}

// ---------- Media ----------

export function getMedia(): MediaAsset[] {
  return [
    { id: "m1", name: "physics-hero.jpg", url: "/media/physics-hero.jpg", alt: "Physics lab", sizeKb: 240, width: 1600, height: 900, updatedAt: "2026-09-20T10:00:00Z" },
    { id: "m2", name: "sana-portrait.jpg", url: "/media/sana-portrait.jpg", alt: "Dr. Sana Mahmood", sizeKb: 180, width: 800, height: 1000, updatedAt: "2026-09-19T10:00:00Z" },
    { id: "m3", name: "results-banner.jpg", url: "/media/results-banner.jpg", alt: "Student results", sizeKb: 320, width: 1920, height: 600, updatedAt: "2026-09-18T10:00:00Z" },
  ];
}

// ============================================================
// Single-record getters (for detail/edit pages)
// Return null when not found so the page can show "not found".
// ============================================================

export function getCourse(id: string): Course | null {
  return getCourses().find((c) => c.id === id) ?? null;
}
export function getTeacher(id: string): Teacher | null {
  return getTeachers().find((t) => t.id === id) ?? null;
}
export function getResource(id: string): Resource | null {
  return getResources().find((r) => r.id === id) ?? null;
}
export function getTestimonial(id: string): Testimonial | null {
  return getTestimonials().find((t) => t.id === id) ?? null;
}
export function getFaq(id: string): Faq | null {
  return getFaqs().find((f) => f.id === id) ?? null;
}
export function getRegistration(id: string): Registration | null {
  return getRecentRegistrations().find((r) => r.id === id) ?? null;
}
export function getExamTimer(id: string): ExamTimer | null {
  return getUpcomingExams().find((e) => e.id === id) ?? null;
}

// ---------- Blank records for "New" create pages ----------

export function getNewCourse(): Course {
  return {
    id: "",
    title: "",
    slug: "",
    shortDescription: "",
    longDescription: "",
    levels: ["O Level"],
    level: "O Level",
    subject: "",
    icon: "BookOpen",
    imageQuery: "",
    category: "Sciences",
    topics: [],
    whatYouWillLearn: [],
    benefits: [],
    teacherIds: [],
    price: 0,
    originalPrice: 0,
    currency: "USD",
    status: "draft",
    featured: false,
    startDate: null,
    batchSize: 12,
    updatedAt: new Date().toISOString(),
  };
}

export function getNewTeacher(): Teacher {
  return {
    id: "",
    name: "",
    slug: "",
    photo: null,
    role: "",
    description: "",
    qualifications: [],
    subjects: [],
    levels: [],
    yearsExperience: 0,
    cambridgeCertified: false,
    imageQuery: "",
    experience: "",
    expertise: [],
    badges: [],
    stats: [],
    featured: false,
    updatedAt: new Date().toISOString(),
  };
}

export function getNewResource(): Resource {
  return {
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    type: "Notes",
    subject: "",
    level: "O Level",
    topic: "",
    date: "",
    readTime: "",
    icon: "FileText",
    url: null,
    featured: false,
    updatedAt: new Date().toISOString(),
  };
}

export function getNewTestimonial(): Testimonial {
  return {
    id: "",
    studentName: "",
    course: "",
    result: "",
    quote: "",
    featured: false,
    videoUrl: null,
    poster: null,
  };
}

export function getNewFaq(): Faq {
  return {
    id: "",
    question: "",
    answer: "",
    category: "Classes",
    sortOrder: 1,
  };
}

export function getNewRegistration(): Registration {
  return {
    id: "",
    studentName: "",
    parentName: "",
    email: "",
    phone: "",
    location: "",
    parentPhone: "",
    courses: [],
    createdAt: new Date().toISOString(),
    status: "new",
  };
}

export function getNewExamTimer(): ExamTimer {
  return {
    id: "",
    title: "",
    board: "Cambridge",
    level: "O Level",
    subject: "",
    examDate: new Date().toISOString(),
    active: true,
    featured: false,
  };
}
