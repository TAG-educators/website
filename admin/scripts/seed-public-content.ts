import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { courses } from "../../new-project/lib/courses";
import { faculty } from "../../new-project/lib/faculty";
import { courseResources } from "../../new-project/lib/resources-data";
import { resources } from "../../new-project/lib/resources";
import { testimonials } from "../../new-project/lib/testimonials";
import { faqs } from "../../new-project/lib/content";

type Env = Record<string, string>;

function loadEnv(): Env {
  const file = readFileSync(".env.local", "utf8");
  return Object.fromEntries(
    file
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1).replace(/^["']|["']$/g, "")];
      }),
  );
}

function pageSections(ids: {
  courses: string[];
  teachers: string[];
  testimonials: string[];
  reelTestimonials: string[];
  faqs: string[];
}) {
  return [
    {
      id: "home-hero",
      type: "hero",
      hidden: false,
      data: {
        eyebrow: "The Ark Global Educators",
        title: "Learn From Experts.|Build Your Future.",
        description: "TAG Educators matches O Level, A Level and IGCSE students with specialist tutors in small, focused batches - live online, wherever in the world you are.",
        primaryCta: { label: "Explore Courses", href: "/courses" },
        secondaryCta: { label: "Meet Our Faculty", href: "/teachers" },
      },
    },
    {
      id: "home-courses",
      type: "courseGrid",
      hidden: false,
      data: { eyebrow: "Our courses", title: "Choose your subject", courseIds: ids.courses, columns: "3", showAll: true },
    },
    {
      id: "home-trust",
      type: "statistics",
      hidden: false,
      data: {
        eyebrow: "TAG Educators",
        title: "Built for focused progress",
        stats: [
          { value: "8", label: "Subjects Taught" },
          { value: "3", label: "Levels - O, A & IGCSE" },
          { value: "2", label: "Cambridge-Certified Tutors" },
          { value: "100%", label: "Exam-Sat Faculty" },
        ],
      },
    },
    {
      id: "home-features",
      type: "cardGrid",
      hidden: false,
      data: {
        eyebrow: "What You Get",
        title: "Not just a video call",
        description: "A full loop of practice, feedback and support around every session - designed to keep students moving forward between classes.",
        columns: "3",
        cards: [
          { icon: "Users", title: "Small-batch classes", description: "Tutor-led micro-cohorts kept small enough for real attention." },
          { icon: "FileText", title: "Past-paper sessions", description: "Regular sessions built around solving real, timed past papers." },
          { icon: "MessageCircle", title: "WhatsApp support", description: "Direct access to your tutor between sessions." },
          { icon: "ClipboardCheck", title: "Attendance & progress reports", description: "Regular updates so families can see progress." },
          { icon: "Video", title: "Recorded sessions", description: "Rewatch anything that did not stick the first time." },
          { icon: "GraduationCap", title: "Quizzes & tests", description: "Short checks to see what is actually sticking." },
        ],
      },
    },
    {
      id: "home-why",
      type: "cardGrid",
      hidden: false,
      data: {
        eyebrow: "The TAG Advantage",
        title: "Why Learn With TAG Educators?",
        description: "We are not a tutoring marketplace. We are a focused team of subject specialists who have been through these exact exams - and know how to get students through them too.",
        columns: "4",
        cards: [
          { icon: "Award", title: "Expert Faculty", description: "Experienced educators who have sat these exact Cambridge exams." },
          { icon: "Target", title: "Practical Learning", description: "Real past-paper practice, not just theory." },
          { icon: "Map", title: "Structured Courses", description: "Clear paths mapped to the current Cambridge syllabus." },
          { icon: "HeartHandshake", title: "Supportive Environment", description: "Small batches, WhatsApp support and recorded sessions." },
        ],
      },
    },
    {
      id: "home-teachers",
      type: "teacherGrid",
      hidden: false,
      data: { eyebrow: "Faculty", title: "Meet Your Educators", description: "Every tutor has sat these exact Cambridge papers and currently teaches at an O Level school or A Level college.", teacherIds: ids.teachers, columns: "3", showAll: false },
    },
    {
      id: "home-testimonials",
      type: "testimonialGrid",
      hidden: false,
      data: { eyebrow: "Student experiences", title: "Progress you can feel", testimonialIds: ids.testimonials, columns: "3" },
    },
    {
      id: "home-testimonial-reel",
      type: "testimonialReel",
      hidden: false,
      data: { eyebrow: "Student Voices", title: "Hear It From Our Students", testimonialIds: ids.reelTestimonials },
    },
    {
      id: "home-steps",
      type: "cardGrid",
      hidden: false,
      data: {
        eyebrow: "How It Works",
        title: "A clear path from first question to exam day",
        columns: "3",
        cards: [
          { title: "01 - Browse a subject", description: "Each subject page shows its tutor, batch timings and registration form." },
          { title: "02 - Register or message us", description: "Fill the form, or message us on WhatsApp before registering." },
          { title: "03 - Start small-batch sessions", description: "Live online sessions scheduled around your family's time zone and week." },
        ],
      },
    },
    {
      id: "home-faq",
      type: "faq",
      hidden: false,
      data: { eyebrow: "Questions", title: "Before you start", faqIds: ids.faqs },
    },
    {
      id: "home-cta",
      type: "cta",
      hidden: false,
      data: {
        eyebrow: "Get Started",
        heading: "Ready to Start Learning?",
        description: "Explore our courses and find the right learning path for you. Your journey to A* starts here.",
        primaryCta: { label: "Explore Courses", href: "/courses" },
        secondaryCta: { label: "Contact Us", href: "/contact" },
      },
    },
  ];
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase URL or public key in admin/.env.local");

  const rl = createInterface({ input, output });
  const email = await rl.question("Admin email: ");
  const password = await rl.question("Admin password: ");
  rl.close();

  const supabase = createClient(url, key);
  const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError) throw new Error(`Admin login failed: ${authError.message}`);

  console.log("Authenticated. Replacing CMS content...");

  const tables = ["pages", "resources", "testimonials", "faqs", "exam_timers", "media_assets", "teachers", "courses", "registrations"];
  for (const table of tables) {
    const { error } = await supabase.from(table).delete().not("id", "is", null);
    if (error) throw new Error(`Could not clear ${table}: ${error.message}`);
  }

  const teacherRows = faculty.map((teacher) => ({
    name: teacher.name,
    slug: teacher.slug,
    photo: teacher.imageSrc ?? null,
    role: teacher.role,
    description: teacher.bio,
    qualifications: teacher.qualifications,
    subjects: teacher.subjects,
    levels: ["O Level", "A Level", "IGCSE"],
    years_experience: Number.parseInt(teacher.experience, 10) || 0,
    cambridge_certified: teacher.cambridgeCertified,
    image_query: teacher.imageQuery,
    experience: teacher.experience,
    expertise: teacher.expertise,
    badges: teacher.badges,
    stats: teacher.stats,
    featured: true,
  }));
  const { data: insertedTeachers, error: teachersError } = await supabase
    .from("teachers")
    .insert(teacherRows)
    .select("id, slug");
  if (teachersError) throw new Error(`Could not seed faculty: ${teachersError.message}`);

  const teacherIds = new Map((insertedTeachers ?? []).map((teacher) => [teacher.slug, teacher.id]));
  const courseRows = courses.map((course) => ({
    title: course.name,
    slug: course.slug,
    short_description: course.shortDescription,
    long_description: course.longDescription,
    levels: course.levels,
    level: course.levels[0],
    subject: course.name,
    icon: course.icon,
    image_query: course.imageQuery,
    category: course.category,
    topics: course.topics,
    what_you_will_learn: course.whatYouWillLearn,
    benefits: course.benefits,
    teacher_ids: [],
    price: 0,
    currency: "PKR",
    status: "published",
    featured: true,
    start_date: null,
    batch_size: 10,
  }));
  const { data: insertedCourses, error: coursesError } = await supabase
    .from("courses")
    .insert(courseRows)
    .select("id, slug");
  if (coursesError) throw new Error(`Could not seed courses: ${coursesError.message}`);

  const resourceRows = resources.map((resource) => ({
    title: resource.title,
    slug: resource.slug,
    excerpt: resource.excerpt,
    type: resource.category === "Download" ? "Guide" : "Notes",
    subject: resource.title.split(" ")[0],
    level: "O Level",
    published_date: resource.date,
    read_time: resource.readTime,
    icon: resource.icon,
    url: null,
    featured: true,
  }));
  const { data: insertedResources, error: resourcesError } = await supabase
    .from("resources")
    .insert(resourceRows)
    .select("id, slug");
  if (resourcesError) throw new Error(`Could not seed resources: ${resourcesError.message}`);

  // Text testimonials (quote-based grid)
  const testimonialRows = testimonials.map((testimonial, i) => {
    const posters = [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=700&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=700&fit=crop",
    ];
    return {
      student_name: testimonial.name,
      course: testimonial.course,
      result: "Student experience",
      quote: testimonial.quote,
      featured: true,
      video_url: null,
      poster: posters[i] ?? null,
    };
  });

  // Video reel testimonials (from the public homepage "Hear It From Our Students" section)
  const reelItems = [
    { name: "Ayesha M.", subject: "Physics A*   2024", poster: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=700&fit=crop" },
    { name: "Hassan R.", subject: "Chemistry A   2024", poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop" },
    { name: "Mariam K.", subject: "Mathematics A*   2023", poster: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=700&fit=crop" },
    { name: "Bilal S.", subject: "Biology A   2024", poster: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=700&fit=crop" },
    { name: "Zainab F.", subject: "Business A*   2023", poster: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=700&fit=crop" },
    { name: "Omar T.", subject: "CS A   2024", poster: "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=400&h=700&fit=crop" },
  ];
  const reelRows = reelItems.map((item) => ({
    student_name: item.name,
    course: item.subject,
    result: "",
    quote: "",
    featured: false,
    video_url: null,
    poster: item.poster,
  }));

  const { data: insertedTestimonials, error: testimonialsError } = await supabase
    .from("testimonials")
    .insert([...testimonialRows, ...reelRows])
    .select("id");
  if (testimonialsError) throw new Error(`Could not seed testimonials: ${testimonialsError.message}`);

  // Separate reel testimonial IDs from quote testimonial IDs
  const allTestimonialIds = (insertedTestimonials ?? []).map((t) => t.id);
  const quoteTestimonialIds = allTestimonialIds.slice(0, testimonials.length);
  const reelTestimonialIds = allTestimonialIds.slice(testimonials.length);

  const faqRows = faqs.map((faq, index) => ({
    question: faq.question,
    answer: faq.answer,
    category: "General",
    sort_order: index,
  }));
  const { data: insertedFaqs, error: faqsError } = await supabase
    .from("faqs")
    .insert(faqRows)
    .select("id");
  if (faqsError) throw new Error(`Could not seed FAQs: ${faqsError.message}`);

  // Insert main pages first (without course sub-pages)
  const mainPages = [
    {
      title: "Home",
      slug: "home",
      status: "published",
      sections: pageSections({
        courses: (insertedCourses ?? []).map((course) => course.id),
        teachers: (insertedTeachers ?? []).map((teacher) => teacher.id),
        testimonials: quoteTestimonialIds,
        reelTestimonials: reelTestimonialIds,
        faqs: (insertedFaqs ?? []).map((faq) => faq.id),
      }),
    },
    { title: "Courses", slug: "courses", status: "published", sections: [
      {
        id: "courses-hero",
        type: "hero",
        hidden: false,
        data: {
          eyebrow: "Our Courses",
          title: "Every subject has its own tutor   and its own page",
          description: "Pick a subject below to meet the tutor, see current batches, and register. All courses cover Cambridge O Level, A Level and IGCSE.",
        },
      },
      { id: "courses-grid", type: "courseGrid", hidden: false, data: { title: "Courses", courseIds: (insertedCourses ?? []).map((course) => course.id), showAll: true } },
    ] },
    { title: "Faculty", slug: "faculty", status: "published", sections: [
      {
        id: "faculty-hero",
        type: "hero",
        hidden: false,
        data: {
          eyebrow: "Our Faculty",
          title: "Meet Your Educators",
          description: "Every TAG tutor has sat these exact Cambridge papers and currently teaches at an O Level school or A Level college. Not a generalist matched to a subject list   a subject specialist with real exam experience.",
        },
      },
      { id: "faculty-grid", type: "teacherGrid", hidden: false, data: { title: "Our Faculty", teacherIds: (insertedTeachers ?? []).map((teacher) => teacher.id), showAll: true } },
    ] },
    {
      title: "About",
      slug: "about",
      status: "published",
      sections: [
        {
          id: "about-hero",
          type: "hero",
          hidden: false,
          data: {
            eyebrow: "About Us",
            title: "The Ark Global Educators",
            description: "TAG Educators is a small-batch, specialist tutoring platform for Cambridge O Level, A Level and IGCSE students. We match students with tutors who've sat these exact exams — and keep batches small enough that every student still gets real attention.",
          },
        },
        {
          id: "about-points",
          type: "cardGrid",
          hidden: false,
          data: {
            eyebrow: "What Makes Us Different",
            title: "Three Things That Define TAG",
            columns: "1",
            cards: [
              { title: "1. Experienced Tutors Who've Sat These Exams", description: "Every TAG tutor has sat these exact Cambridge papers and currently teaches at an O Level school or A Level college. Two of our faculty are also formally Cambridge certified. This means insider knowledge of exact exam traps, mark-scheme language, and the specific techniques that earn marks — not just subject knowledge." },
              { title: "2. Small Batches, Real Attention", description: "We keep batches deliberately small and tutor-led. No 40-student Zoom calls. No recorded lectures pretending to be \"online learning.\" Every student gets noticed, gets questions answered, and gets real attention from their tutor throughout the course." },
              { title: "3. Built for Any Time Zone", description: "Sessions run fully online, so scheduling is built around what works for your family — wherever in the world you are. Whether you're in Karachi, Dubai, London or Toronto, we'll find a slot that works." },
            ],
          },
        },
        {
          id: "about-values",
          type: "cardGrid",
          hidden: false,
          data: {
            eyebrow: "Our Values",
            title: "What We Stand For",
            columns: "4",
            cards: [
              { icon: "Users", title: "Expert Faculty", description: "Learn from experienced educators who've sat these exact Cambridge papers." },
              { icon: "Target", title: "Practical Learning", description: "Focus on useful and applicable knowledge, built around real exam technique." },
              { icon: "Map", title: "Structured Courses", description: "Clear learning paths for students, mapped to the current syllabus." },
              { icon: "HeartHandshake", title: "Supportive Environment", description: "Small batches designed around students — real attention from your tutor." },
            ],
          },
        },
        {
          id: "about-faq",
          type: "faq",
          hidden: false,
          data: {
            eyebrow: "Questions",
            title: "What families ask us",
            faqIds: (insertedFaqs ?? []).map((faq) => faq.id),
          },
        },
      ],
    },
    { title: "Resources", slug: "resources", status: "published", sections: [{ id: "resources-grid", type: "resourceGrid", hidden: false, data: { title: "Resources" } }] },
    {
      title: "Cart",
      slug: "cart",
      status: "published",
      sections: [
        {
          id: "cart-hero",
          type: "hero",
          hidden: false,
          data: {
            eyebrow: "Registration",
            title: "Your Registration",
            description: "Review your selected courses, fill in your details, and we will confirm your batch timings on WhatsApp.",
          },
        },
      ],
    },
  ];

  // Insert main pages first
  const { data: insertedMainPages, error: mainPagesError } = await supabase
    .from("pages")
    .insert(mainPages)
    .select("id, slug");
  if (mainPagesError) throw new Error(`Could not seed main pages: ${mainPagesError.message}`);

  // Find the Courses page ID to use as parent
  const coursesPageId = (insertedMainPages ?? []).find((p: { slug: string }) => p.slug === "courses")?.id;

  // Build course sub-pages with parent_id
  const coursePages = (insertedCourses ?? []).map((course, index) => {
    const courseData = courses[index];
    return {
      title: courseData.name,
      slug: `courses/${courseData.slug}`,
      status: "published",
      parent_id: coursesPageId ?? null,
      sort_order: index,
      sections: [
        {
          id: `${courseData.slug}-hero`,
          type: "hero",
          hidden: false,
          data: {
            eyebrow: "Course Detail",
            title: courseData.name,
            description: courseData.shortDescription,
          },
        },
        {
          id: `${courseData.slug}-grid`,
          type: "courseGrid",
          hidden: false,
          data: {
            title: courseData.name,
            courseIds: [course.id],
            showAll: false,
          },
        },
      ],
    };
  });

  // Insert course sub-pages
  if (coursePages.length > 0) {
    const { error: coursePagesError } = await supabase.from("pages").insert(coursePages);
    if (coursePagesError) throw new Error(`Could not seed course pages: ${coursePagesError.message}`);
  }

  // Find the Faculty page ID to use as parent
  const facultyPageId = (insertedMainPages ?? []).find((p: { slug: string }) => p.slug === "faculty")?.id;

  // Build faculty sub-pages with parent_id
  const facultyPages = faculty.map((member, index) => {
    return {
      title: member.name,
      slug: `faculty/${member.slug}`,
      status: "published" as const,
      parent_id: facultyPageId ?? null,
      sort_order: index,
      sections: [
        {
          id: `${member.slug}-hero`,
          type: "hero",
          hidden: false,
          desktopVisible: true,
          mobileVisible: true,
          data: {
            eyebrow: member.role,
            title: member.name,
            description: member.bio,
            primaryCta: { label: "View Courses", href: "/courses" },
            secondaryCta: { label: "Register", href: "/cart" },
          },
        },
        {
          id: `${member.slug}-info`,
          type: "cardGrid",
          hidden: false,
          desktopVisible: true,
          mobileVisible: true,
          data: {
            eyebrow: "About",
            title: `${member.name} — ${member.role}`,
            columns: "2",
            cards: [
              { icon: "Award", title: "Experience", description: member.experience },
              { icon: "BookOpen", title: "Expertise", description: member.expertise.join(", ") },
              { icon: "CheckCircle", title: "Qualifications / Affiliations", description: member.qualifications.join(". ") },
              { icon: "Star", title: "Badges", description: member.badges.join(", ") },
            ],
          },
        },
      ],
    };
  });

  if (facultyPages.length > 0) {
    const { error: facultyPagesError } = await supabase.from("pages").insert(facultyPages);
    if (facultyPagesError) throw new Error(`Could not seed faculty pages: ${facultyPagesError.message}`);
  }

  // Find the Resources page ID to use as parent
  const resourcesPageId = (insertedMainPages ?? []).find((p: { slug: string }) => p.slug === "resources")?.id;

  // Build resource sub-pages with parent_id — one per subject
  const resourcePages = courseResources.map((cr, index) => {
    // Build the nested levels → topics → PDFs structure
    const levels = cr.levels.map((lr) => ({
      level: lr.level,
      topics: lr.topics.map((t) => ({
        topic: t.topic,
        pdfs: t.pdfs.map((p) => ({
          title: p.title,
          url: p.url,
          description: p.description ?? "",
        })),
      })),
    }));

    return {
      title: cr.name,
      slug: `resources/${cr.slug}`,
      status: "published" as const,
      parent_id: resourcesPageId ?? null,
      sort_order: index,
      sections: [
        {
          id: `${cr.slug}-hero`,
          type: "hero",
          hidden: false,
          desktopVisible: true,
          mobileVisible: true,
          data: {
            eyebrow: "Study Resources",
            title: `${cr.name} Resources`,
            description: `Browse ${cr.name} resources organized by level and topic. Past papers, notes, and study guides for Cambridge O Level, A Level and IGCSE.`,
            primaryCta: { label: "View Courses", href: `/courses/${cr.slug}` },
            secondaryCta: { label: "All Resources", href: "/resources" },
          },
        },
        {
          id: `${cr.slug}-library`,
          type: "resourceLibrary",
          hidden: false,
          desktopVisible: true,
          mobileVisible: true,
          data: {
            eyebrow: "By Level",
            title: `${cr.name} Resource Library`,
            levels,
          },
        },
      ],
    };
  });

  if (resourcePages.length > 0) {
    const { error: resourcePagesError } = await supabase.from("pages").insert(resourcePages);
    if (resourcePagesError) throw new Error(`Could not seed resource pages: ${resourcePagesError.message}`);
  }

  const { error: settingsError } = await supabase.from("site_settings").upsert({
    id: 1,
    site_name: "TAG Educators",
    tagline: "Learn with confidence. Prepare with purpose.",
    description: "Small-batch Cambridge tutoring built around real teaching, past-paper practice and exam technique.",
    domain: "https://tageducators.com",
  });
  if (settingsError) throw new Error(`Could not update site settings: ${settingsError.message}`);

  console.log(`CMS replacement complete: ${courses.length} courses, ${faculty.length} faculty, ${resources.length} resources, ${testimonials.length + reelItems.length} testimonials (${testimonials.length} quotes + ${reelItems.length} reel), ${faqs.length} FAQs, ${mainPages.length + coursePages.length + facultyPages.length + resourcePages.length} pages.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
