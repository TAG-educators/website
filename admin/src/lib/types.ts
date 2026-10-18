// ============================================================
// TAG Admin — Shared types
// These mirror the Supabase schema we'll create later.
// Keep them here so UI and data layer share one source of truth.
// ============================================================

export type Status = "draft" | "published" | "archived";

export type Level = "O Level" | "A Level" | "AS Level" | "A2 Level" | "IGCSE";

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  levels: Level[];
  level: Level;
  subject: string;
  icon: string;
  imageQuery: string;
  category: string;
  topics: string[];
  whatYouWillLearn: string[];
  benefits: string[];
  teacherIds: string[];
  price: number;
  originalPrice: number;
  currency: string;
  status: Status;
  featured: boolean;
  startDate: string | null;
  batchSize: number;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  slug: string;
  photo: string | null;
  role: string;
  description: string;
  qualifications: string[];
  subjects: string[];
  levels: Level[];
  yearsExperience: number;
  cambridgeCertified: boolean;
  imageQuery: string;
  experience: string;
  expertise: string[];
  badges: string[];
  stats: { num: string; label: string }[];
  featured: boolean;
  updatedAt: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  status: Status;
  sections: number;
  updatedAt: string;
}

export interface Registration {
  id: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  location: string;
  parentPhone: string;
  courses: string[];
  createdAt: string;
  status: "new" | "contacted" | "enrolled";
}

export interface ExamTimer {
  id: string;
  title: string;
  board: string;
  level: Level;
  subject: string;
  examDate: string; // ISO
  active: boolean;
  featured: boolean;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  type: "Notes" | "Past Paper" | "Solved Paper" | "Video" | "Guide" | "Link";
  subject: string;
  level: Level;
  topic: string;
  date: string;
  readTime: string;
  icon: string;
  url: string | null;
  featured: boolean;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  studentName: string;
  course: string;
  result: string;
  quote: string;
  featured: boolean;
  videoUrl: string | null;
  poster: string | null;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  alt: string;
  sizeKb: number;
  width: number;
  height: number;
  updatedAt: string;
}

export interface DashboardStat {
  label: string;
  value: string | number;
  hint?: string;
  trend?: { dir: "up" | "down" | "flat"; text: string };
}
