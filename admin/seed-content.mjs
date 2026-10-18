/**
 * Seed script: creates 5 pages + 5 nav items for the TAG Educators CMS.
 *
 * Run from the admin/ folder:
 *   node seed-content.mjs
 *
 * Uses the Supabase REST API directly (no SDK dependency). Pages are
 * created with starter sections based on the static site structure.
 * Re-running is safe — it upserts nav items and skips pages that already
 * exist (matched by slug).
 */

const SUPABASE_URL = "https://gzjbduhummhvmguqbpyu.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6amJkdWh1bW1odm1ndXFicHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MzM2MDEsImV4cCI6MjEwNjEwOTYwMX0.-OZr9oF7vXNMVVWFhNBpV9aS0uHtWIElckvkF3ZsBc0";

// Authenticated access token (from the admin session). RLS requires this
// to write to pages / navigation_items. Replace if it expires.
const ACCESS_TOKEN =
  "eyJhbGciOiJFUzI1NiIsImtpZCI6ImMxNzBhYmM2LThmZjEtNGNiYS1hN2FlLWRmM2Q1OTBhNTM0MSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2d6amJkdWh1bW1odm1ndXFicHl1LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI0NWI0YjgwMy04YjQyLTRlNzktOTI3MC1lYWE5NWJmYWJlY2IiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzkwNzIxMzcxLCJpYXQiOjE3OTA3MTc3NzEsImVtYWlsIjoidGFnZWR1Y2F0b3JzQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzkwNzE3NzcxfV0sInNlc3Npb25faWQiOiIwNjM0ZWY0ZC0yMDZmLTRlZDctOTRkOS02NmI0MTJiMmFmNzYiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.GZpg6Yx-MHCf9eozcOCL_nuxq8CJLBC762w0Wh4c5GfmtAUmqtRaBBz3rCJpyNy1vfbzbtNfVGAyJPbbe9P29A";

const HEADERS = {
  apikey: ANON_KEY,
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

function newId() {
  return "s" + Math.random().toString(36).slice(2, 9);
}

// ---------- Page definitions ----------
// Each page has starter sections matching the static site's structure.
// Content is placeholder text the admin can edit later in the Page Builder.

const PAGES = [
  {
    title: "Home",
    slug: "home",
    status: "published",
    sections: [
      {
        id: newId(),
        type: "hero",
        hidden: false,
        data: {
          eyebrow: "The Ark Global Educators",
          title: "Less Sinking. More Sailing.",
          description:
            "TAG Educators matches O Level, A Level and IGCSE students with specialist tutors in small, focused batches — live online, wherever in the world you are.",
          primaryCta: { label: "View Courses", href: "/courses" },
          secondaryCta: { label: "Why Us", href: "/#why" },
          image: "",
        },
      },
      {
        id: newId(),
        type: "statistics",
        hidden: false,
        data: {
          title: "By the numbers",
          stats: [
            { value: "2", label: "Cambridge-certified tutors" },
            { value: "15+", label: "Subjects covered" },
            { value: "100%", label: "Sat these exact exams" },
            { value: "Live", label: "Online, small batches" },
          ],
        },
      },
      {
        id: newId(),
        type: "imageText",
        hidden: false,
        data: {
          heading: "What you get",
          body: "<p>Small focused batches, specialist tutors who've sat these exact exams, and live online sessions you can join from anywhere.</p>",
          layout: "right",
          image: "",
          cta: null,
        },
      },
      {
        id: newId(),
        type: "testimonialGrid",
        hidden: false,
        data: {
          title: "What our students say",
          testimonialIds: [],
          columns: "3",
        },
      },
      {
        id: newId(),
        type: "cta",
        hidden: false,
        data: {
          title: "Ready to start sailing?",
          description: "Browse our courses and book your first session today.",
          primaryCta: { label: "View Courses", href: "/courses" },
          secondaryCta: null,
        },
      },
    ],
  },
  {
    title: "Courses",
    slug: "courses",
    status: "published",
    sections: [
      {
        id: newId(),
        type: "hero",
        hidden: false,
        data: {
          eyebrow: "Our Courses",
          title: "Cambridge tutoring, done right",
          description:
            "O Level, A Level and IGCSE courses taught by specialist tutors in small, focused batches.",
          primaryCta: { label: "Register", href: "/#register" },
          secondaryCta: null,
          image: "",
        },
      },
      {
        id: newId(),
        type: "courseGrid",
        hidden: false,
        data: {
          title: "Available courses",
          courseIds: [],
          columns: "3",
        },
      },
      {
        id: newId(),
        type: "cta",
        hidden: false,
        data: {
          title: "Can't find your subject?",
          description: "We add new batches every term. Reach out and we'll help.",
          primaryCta: { label: "Ask on WhatsApp", href: "https://wa.me/923162165779" },
          secondaryCta: null,
        },
      },
    ],
  },
  {
    title: "Resources",
    slug: "resources",
    status: "published",
    sections: [
      {
        id: newId(),
        type: "hero",
        hidden: false,
        data: {
          eyebrow: "Resources",
          title: "Free study materials & past papers",
          description:
            "Curated resources to help you prepare for your Cambridge exams.",
          primaryCta: null,
          secondaryCta: null,
          image: "",
        },
      },
      {
        id: newId(),
        type: "resourceGrid",
        hidden: false,
        data: {
          title: "Latest resources",
          resourceIds: [],
          columns: "3",
        },
      },
    ],
  },
  {
    title: "Faculty",
    slug: "faculty",
    status: "published",
    sections: [
      {
        id: newId(),
        type: "hero",
        hidden: false,
        data: {
          eyebrow: "Our Faculty",
          title: "Tutors who've sat these exact exams",
          description:
            "Meet the specialist tutors behind TAG Educators — Cambridge-certified, experienced, and teaching in small focused batches.",
          primaryCta: null,
          secondaryCta: null,
          image: "",
        },
      },
      {
        id: newId(),
        type: "teacherGrid",
        hidden: false,
        data: {
          title: "Our tutors",
          teacherIds: [],
          columns: "3",
        },
      },
    ],
  },
  {
    title: "About",
    slug: "about",
    status: "published",
    sections: [
      {
        id: newId(),
        type: "hero",
        hidden: false,
        data: {
          eyebrow: "About Us",
          title: "The Ark Global Educators",
          description:
            "TAG Educators is a small-batch Cambridge tutoring service — taught by specialist tutors who've sat these exact exams.",
          primaryCta: { label: "View Courses", href: "/courses" },
          secondaryCta: null,
          image: "",
        },
      },
      {
        id: newId(),
        type: "imageText",
        hidden: false,
        data: {
          heading: "Why we started",
          body: "<p>We built TAG Educators because too many students sink through the cracks of large, impersonal classrooms. We keep batches small, pair students with tutors who've actually sat their exact exam, and teach live online so location is never a barrier.</p>",
          layout: "right",
          image: "",
          cta: null,
        },
      },
      {
        id: newId(),
        type: "statistics",
        hidden: false,
        data: {
          title: "Our story in numbers",
          stats: [
            { value: "2", label: "Cambridge-certified tutors" },
            { value: "15+", label: "Subjects" },
            { value: "100%", label: "Sat these exact exams" },
            { value: "Live", label: "Online, worldwide" },
          ],
        },
      },
      {
        id: newId(),
        type: "cta",
        hidden: false,
        data: {
          title: "Ready to join?",
          description: "Browse our courses and book your first session today.",
          primaryCta: { label: "View Courses", href: "/courses" },
          secondaryCta: { label: "WhatsApp us", href: "https://wa.me/923162165779" },
        },
      },
    ],
  },
];

// ---------- Nav items ----------
const NAV_ITEMS = [
  { label: "Home", href: "/", position: 0, visible: true },
  { label: "Courses", href: "/courses", position: 1, visible: true },
  { label: "Resources", href: "/resources", position: 2, visible: true },
  { label: "Faculty", href: "/faculty", position: 3, visible: true },
  { label: "About", href: "/about", position: 4, visible: true },
];

// ---------- Helpers ----------
async function supabase(method, path, body) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, data: json };
}

async function pageExists(slug) {
  const r = await supabase(
    "GET",
    `/rest/v1/pages?slug=eq.${encodeURIComponent(slug)}&select=id`,
  );
  return Array.isArray(r.data) && r.data.length > 0;
}

async function createPage(page) {
  const r = await supabase("POST", "/rest/v1/pages", page);
  return r;
}

async function seedPages() {
  console.log("\n=== PAGES ===");
  for (const page of PAGES) {
    const exists = await pageExists(page.slug);
    if (exists) {
      console.log(`  ✓ "${page.title}" (slug: ${page.slug}) — already exists, skipped`);
      continue;
    }
    const r = await createPage(page);
    if (r.ok) {
      console.log(`  ✓ Created "${page.title}" (slug: ${page.slug}) — ${page.sections.length} sections`);
    } else {
      console.log(`  ✗ Failed "${page.title}": ${JSON.stringify(r.data)}`);
    }
  }
}

async function seedNav() {
  console.log("\n=== NAV ITEMS ===");
  // Wipe existing nav items, then insert the new set.
  const del = await supabase(
    "DELETE",
    `/rest/v1/navigation_items?id=neq.00000000-0000-0000-0000-000000000000`,
  );
  if (!del.ok) {
    console.log(`  ✗ Failed to clear existing nav: ${JSON.stringify(del.data)}`);
    return;
  }

  const r = await supabase("POST", "/rest/v1/navigation_items", NAV_ITEMS);
  if (r.ok) {
    console.log(`  ✓ Inserted ${NAV_ITEMS.length} nav items`);
    NAV_ITEMS.forEach((n) => console.log(`    - ${n.label} → ${n.href}`));
  } else {
    console.log(`  ✗ Failed to insert nav: ${JSON.stringify(r.data)}`);
  }
}

async function main() {
  console.log("Seeding TAG Educators content…");
  await seedPages();
  await seedNav();
  console.log("\nDone. Open http://localhost:3000/admin/content to verify.\n");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
