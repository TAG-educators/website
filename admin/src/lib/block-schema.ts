// ============================================================
// TAG CMS — Block Schema
// The single contract between the admin Page Builder and the
// public website renderers. Both sides import from here.
// ============================================================

import type { LucideIcon } from "lucide-react";
import {
  Sparkles, Type, Image as ImageIcon, BookOpen, Users, Star,
  Video, BarChart3, HelpCircle, Megaphone, FolderOpen, Timer,
  Images, Trophy, Minus, LayoutGrid,
} from "lucide-react";

// ---------- Field types ----------

export type FieldType =
  | "string"      // text input
  | "text"        // textarea
  | "richtext"    // rich text editor (sanitized on render)
  | "boolean"     // toggle
  | "select"      // dropdown
  | "media"       // media picker
  | "cta"         // label + href pair
  | "list"        // repeatable sub-fields
  | "reference"   // picks from another entity
  | "fileUpload"; // upload file to Supabase Storage

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  default?: unknown;
  options?: { label: string; value: string }[]; // for select
  reference?: "course" | "teacher" | "testimonial" | "resource" | "examTimer" | "result" | "faq";
  subFields?: FieldDef[]; // for list
  help?: string;
}

// ---------- Block type registry ----------

export type BlockType =
  | "hero"
  | "richText"
  | "cardGrid"
  | "imageText"
  | "courseGrid"
  | "teacherGrid"
  | "testimonialGrid"
  | "testimonialReel"
  | "video"
  | "statistics"
  | "faq"
  | "cta"
  | "resourceGrid"
  | "resourceLibrary"
  | "examCountdown"
  | "gallery"
  | "resultsGrid"
  | "spacer";

export interface BlockDef {
  type: BlockType;
  label: string;
  description: string;
  icon: LucideIcon;
  fields: FieldDef[];
}

// ---------- Block definitions ----------

export const BLOCKS: Record<BlockType, BlockDef> = {
  hero: {
    type: "hero",
    label: "Hero",
    description: "Page opening with headline and CTAs",
    icon: Sparkles,
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "string", help: "Small label above the title" },
      { key: "title", label: "Title", type: "text", required: true, help: "Press Enter to break onto a new line (second line is gradient)" },
      { key: "description", label: "Description", type: "text" },
      { key: "primaryCta", label: "Primary CTA", type: "cta" },
      { key: "secondaryCta", label: "Secondary CTA", type: "cta" },
      { key: "image", label: "Background image", type: "media" },
    ],
  },

  richText: {
    type: "richText",
    label: "Rich Text",
    description: "Free-form editorial content",
    icon: Type,
    fields: [
      { key: "body", label: "Content", type: "richtext", required: true },
    ],
  },

  cardGrid: {
    type: "cardGrid",
    label: "Card Grid",
    description: "Structured cards without HTML",
    icon: LayoutGrid,
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "string" },
      { key: "title", label: "Section title", type: "string" },
      { key: "description", label: "Section description", type: "text" },
      {
        key: "cards",
        label: "Cards",
        type: "list",
        required: true,
        subFields: [
          { key: "icon", label: "Icon name", type: "string", help: "Optional Lucide icon name, e.g. Users or Award" },
          { key: "title", label: "Card title", type: "string", required: true },
          { key: "description", label: "Card description", type: "text", required: true },
          { key: "href", label: "Optional link", type: "string", help: "e.g. /courses" },
        ],
      },
      {
        key: "columns",
        label: "Columns",
        type: "select",
        default: "3",
        options: [
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
        ],
      },
    ],
  },

  imageText: {
    type: "imageText",
    label: "Image + Text",
    description: "Image on one side, text on the other",
    icon: ImageIcon,
    fields: [
      { key: "image", label: "Image", type: "media", required: true },
      { key: "eyebrow", label: "Eyebrow", type: "string", help: "Small label above heading" },
      { key: "heading", label: "Heading", type: "string" },
      { key: "body", label: "Body", type: "richtext" },
      {
        key: "layout",
        label: "Image position",
        type: "select",
        default: "right",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
        ],
      },
      { key: "cta", label: "CTA", type: "cta" },
    ],
  },

  courseGrid: {
    type: "courseGrid",
    label: "Course Grid",
    description: "Show selected courses as cards",
    icon: BookOpen,
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "string", help: "Small label above title" },
      { key: "title", label: "Section title", type: "string" },
      { key: "description", label: "Section description", type: "text" },
      { key: "courseIds", label: "Courses", type: "list", reference: "course", required: true },
      {
        key: "columns",
        label: "Columns",
        type: "select",
        default: "3",
        options: [
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
        ],
      },
      { key: "showAll", label: "Show all courses", type: "boolean", default: false },
    ],
  },

  teacherGrid: {
    type: "teacherGrid",
    label: "Teacher Grid",
    description: "Show selected teachers",
    icon: Users,
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "string", help: "Small label above title" },
      { key: "title", label: "Section title", type: "string" },
      { key: "description", label: "Section description", type: "text" },
      { key: "teacherIds", label: "Teachers", type: "list", reference: "teacher", required: true },
      {
        key: "columns",
        label: "Columns",
        type: "select",
        default: "3",
        options: [
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
        ],
      },
      { key: "showAll", label: "Show all teachers", type: "boolean", default: false },
    ],
  },

  testimonialGrid: {
    type: "testimonialGrid",
    label: "Testimonial Grid",
    description: "Student quotes and stories",
    icon: Star,
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "string", help: "Small label above title" },
      { key: "title", label: "Section title", type: "string" },
      { key: "description", label: "Section description", type: "text" },
      { key: "testimonialIds", label: "Testimonials", type: "list", reference: "testimonial", required: true },
      {
        key: "columns",
        label: "Columns",
        type: "select",
        default: "2",
        options: [
          { label: "2", value: "2" },
          { label: "3", value: "3" },
        ],
      },
    ],
  },

  testimonialReel: {
    type: "testimonialReel",
    label: "Testimonial Reel",
    description: "Horizontal scrolling student video cards",
    icon: Video,
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "string", help: "Small label above title" },
      { key: "title", label: "Section title", type: "string" },
      { key: "testimonialIds", label: "Testimonials", type: "list", reference: "testimonial", required: true },
    ],
  },

  video: {
    type: "video",
    label: "Video",
    description: "Embedded YouTube/Vimeo video",
    icon: Video,
    fields: [
      { key: "title", label: "Title", type: "string" },
      { key: "url", label: "Video URL", type: "string", required: true, help: "YouTube, Vimeo, or direct file URL" },
      { key: "poster", label: "Poster image", type: "media" },
    ],
  },

  statistics: {
    type: "statistics",
    label: "Statistics",
    description: "Trust numbers and proof",
    icon: BarChart3,
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "string", help: "Small label above title" },
      { key: "title", label: "Section title", type: "string" },
      {
        key: "stats",
        label: "Stats",
        type: "list",
        required: true,
        subFields: [
          { key: "value", label: "Value", type: "string", required: true, help: "e.g. 500+" },
          { key: "label", label: "Label", type: "string", required: true, help: "e.g. Students taught" },
        ],
      },
    ],
  },

  faq: {
    type: "faq",
    label: "FAQ",
    description: "Accordion of questions",
    icon: HelpCircle,
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "string", help: "Small label above title" },
      { key: "title", label: "Section title", type: "string" },
      { key: "faqIds", label: "FAQs from library", type: "list", reference: "faq" },
      {
        key: "items",
        label: "Inline questions",
        type: "list",
        subFields: [
          { key: "question", label: "Question", type: "string", required: true },
          { key: "answer", label: "Answer", type: "text", required: true },
        ],
      },
    ],
  },

  cta: {
    type: "cta",
    label: "Call to Action",
    description: "Strong CTA band",
    icon: Megaphone,
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "string", help: "Small label above heading" },
      { key: "heading", label: "Heading", type: "string", required: true },
      { key: "description", label: "Description", type: "text" },
      { key: "primaryCta", label: "Primary CTA", type: "cta", required: true },
      { key: "secondaryCta", label: "Secondary CTA", type: "cta" },
    ],
  },

  resourceGrid: {
    type: "resourceGrid",
    label: "Resource Grid",
    description: "Show selected resources",
    icon: FolderOpen,
    fields: [
      { key: "title", label: "Section title", type: "string" },
      { key: "resourceIds", label: "Resources", type: "list", reference: "resource", required: true },
      {
        key: "columns",
        label: "Columns",
        type: "select",
        default: "3",
        options: [
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
        ],
      },
    ],
  },

  resourceLibrary: {
    type: "resourceLibrary",
    label: "Resource Library",
    description: "Levels, topics and PDFs for a subject",
    icon: FolderOpen,
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "string", help: "Small label above title" },
      { key: "title", label: "Section title", type: "string" },
      {
        key: "levels",
        label: "Levels",
        type: "list",
        required: true,
        subFields: [
          { key: "level", label: "Level name", type: "string", required: true, help: "e.g. O Level, AS Level, A2 Level" },
          {
            key: "topics",
            label: "Topics",
            type: "list",
            required: true,
            subFields: [
              { key: "topic", label: "Topic name", type: "string", required: true },
              {
                key: "pdfs",
                label: "PDFs / Resources",
                type: "list",
                subFields: [
                  { key: "title", label: "Title", type: "string", required: true, help: "e.g. Motion & Forces — Notes" },
                  { key: "url", label: "Upload PDF or paste link", type: "fileUpload", required: true },
                  { key: "description", label: "Description", type: "text" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  examCountdown: {
    type: "examCountdown",
    label: "Exam Countdown",
    description: "Live exam timer(s)",
    icon: Timer,
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "string", help: "Small label above title" },
      { key: "title", label: "Section title", type: "string" },
      { key: "timerIds", label: "Exam timers", type: "list", reference: "examTimer" },
      { key: "showFeatured", label: "Show all featured timers", type: "boolean", default: false },
    ],
  },

  gallery: {
    type: "gallery",
    label: "Gallery",
    description: "Image gallery grid",
    icon: Images,
    fields: [
      { key: "title", label: "Section title", type: "string" },
      {
        key: "images",
        label: "Images",
        type: "list",
        required: true,
        subFields: [
          { key: "media", label: "Image", type: "media", required: true },
          { key: "alt", label: "Alt text", type: "string" },
        ],
      },
      {
        key: "columns",
        label: "Columns",
        type: "select",
        default: "3",
        options: [
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
        ],
      },
    ],
  },

  resultsGrid: {
    type: "resultsGrid",
    label: "Student Results Grid",
    description: "Show student grades and achievements",
    icon: Trophy,
    fields: [
      { key: "title", label: "Section title", type: "string" },
      { key: "resultIds", label: "Results", type: "list", reference: "result", required: true },
      {
        key: "columns",
        label: "Columns",
        type: "select",
        default: "3",
        options: [
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
        ],
      },
      { key: "showAll", label: "Show all results", type: "boolean", default: false },
    ],
  },

  spacer: {
    type: "spacer",
    label: "Spacer / Divider",
    description: "Visual breathing room between sections",
    icon: Minus,
    fields: [
      {
        key: "height",
        label: "Height",
        type: "select",
        default: "md",
        options: [
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
          { label: "Extra large", value: "xl" },
        ],
      },
      { key: "divider", label: "Show divider line", type: "boolean", default: false },
    ],
  },
};

// ---------- Helpers ----------

export const BLOCK_LIST = Object.values(BLOCKS);

export function getBlockDef(type: BlockType): BlockDef {
  return BLOCKS[type];
}

// Default empty data for a freshly added block
export function defaultBlockData(type: BlockType): Record<string, unknown> {
  const def = BLOCKS[type];
  const data: Record<string, unknown> = {};
  for (const field of def.fields) {
    if (field.default !== undefined) {
      data[field.key] = field.default;
    } else if (field.type === "list") {
      data[field.key] = [];
    } else if (field.type === "boolean") {
      data[field.key] = false;
    } else if (field.type === "cta") {
      data[field.key] = null;
    } else {
      data[field.key] = "";
    }
  }
  return data;
}

// ---------- Page / Section types ----------

export interface Section {
  id: string;
  type: BlockType;
  hidden: boolean;
  desktopVisible?: boolean;
  mobileVisible?: boolean;
  data: Record<string, unknown>;
}

export interface PageData {
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  sections: Section[];
  parentId?: string | null;
  sortOrder?: number;
}
