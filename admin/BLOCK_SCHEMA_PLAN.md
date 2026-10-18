# TAG CMS — Block Schema Plan

The contract between the admin Page Builder and the public website.
The admin edits JSON via forms; the public site renders that JSON via
section components. Both sides build against this single schema.

---

## How it works

```
Page
 └─ sections: Section[]          (ordered list)
     └─ Section
        ├─ id: string             (stable, for reorder/duplicate)
        ├─ type: BlockType        (which block)
        ├─ hidden: boolean        (admin can hide without deleting)
        └─ data: { ...fields }     (type-specific, see below)
```

Every block type defines:
- `label` — shown in the "Add Section" menu
- `icon` — lucide icon name
- `fields` — the form fields the admin edits
- a matching `XxxSection` renderer on the public site (Phase 5)

---

## Block types (15 total)

### 1. Hero
The page's opening section. Used on homepage + landing pages.
```
eyebrow:        string (optional)
title:          string (required)
description:    string (optional)
primaryCta:     { label, href } (optional)
secondaryCta:   { label, href } (optional)
image:          media id (optional)
```

### 2. Rich Text
Free-form editorial content. Sanitized on render.
```
body:   rich text (required)
```

### 3. Image + Text
Image on one side, text on the other. Flippable.
```
image:      media id (required)
heading:    string (optional)
body:       rich text (optional)
layout:     "left" | "right"   (image side, default "right")
cta:        { label, href } (optional)
```

### 4. Course Grid
Shows selected courses as cards.
```
title:          string (optional, section heading)
courseIds:      string[] (required, picks from CMS courses)
columns:        2 | 3 | 4 (default 3)
showAllCourses: boolean (if true, ignores courseIds)
```

### 5. Teacher Grid
Shows selected teachers.
```
title:          string (optional)
teacherIds:     string[] (required)
columns:        2 | 3 | 4 (default 3)
showAllTeachers: boolean
```

### 6. Testimonial Grid
Student quotes/results.
```
title:            string (optional)
testimonialIds:   string[] (required)
columns:          2 | 3 (default 2)
```

### 7. Video
Embedded video (YouTube/Vimeo URL or uploaded file).
```
title:    string (optional)
url:      string (required, YouTube/Vimeo/direct)
poster:   media id (optional, thumbnail before play)
```

### 8. Statistics
Trust/proof numbers (e.g., "500+ students", "98% A*").
```
title:  string (optional)
stats:  [{ value: string, label: string }] (required, min 1)
```

### 9. FAQ
Accordion of questions.
```
title:      string (optional)
faqIds:     string[] (optional, pulls from CMS FAQs)
items:      [{ question, answer }] (optional, inline if not using CMS)
```

### 10. CTA
Strong call-to-action band.
```
heading:        string (required)
description:     string (optional)
primaryCta:     { label, href } (required)
secondaryCta:   { label, href } (optional)
```

### 11. Resource Grid
Shows selected resources.
```
title:          string (optional)
resourceIds:    string[] (required)
columns:        2 | 3 | 4 (default 3)
```

### 12. Exam Countdown
Shows one or more exam timers.
```
title:        string (optional)
timerIds:     string[] (optional, picks from CMS exam timers)
showFeatured: boolean (if true, shows all featured timers)
```

### 13. Gallery
Image gallery grid.
```
title:  string (optional)
images: [{ media id, alt }] (required, min 1)
columns: 2 | 3 | 4 (default 3)
```

### 14. Student Results Grid
Shows selected student results (grades, subjects, exam sessions).
Pairs with the `student_results` content type.
```
title:        string (optional, section heading)
resultIds:    string[] (required, picks from CMS student_results)
columns:      2 | 3 | 4 (default 3)
showAll:      boolean (if true, shows all results, ignores resultIds)
```

### 15. Spacer / Divider
Visual breathing room between sections.
```
height:   "sm" | "md" | "lg" | "xl" (default "md")
divider:  boolean (show a horizontal line, default false)
```

---

## Field types (for the form generator)

Each field in a block maps to one of these input types:

| Field type   | Admin input                          |
|--------------|--------------------------------------|
| `string`     | Text input                           |
| `text`       | Textarea                             |
| `richtext`   | Rich text editor (sanitized)         |
| `boolean`    | Toggle                               |
| `select`     | Dropdown (options defined in schema) |
| `media`      | Media picker (opens library)        |
| `cta`        | Label + href pair                    |
| `list`       | Repeatable sub-fields                |
| `reference`  | Picks from another entity (course/teacher/etc.) |

---

## What this enables

**Admin Page Builder:**
- "Add Section" menu shows all 14 blocks with icons
- Selecting a block adds it with default empty data
- Editing a block renders a form generated from its `fields` definition
- No hardcoded forms — one editor, driven by schema

**Public site (Phase 5):**
- `SectionRenderer` reads `section.type`
- Renders the matching `<XxxSection data={section.data} />`
- One component per block type, styled per the design system

**Shared contract:**
- Both sides import from `block-schema.ts`
- If we add a block type later, admin form + renderer are added in parallel
- No silent breakage — TypeScript enforces the shape

---

## Open questions for you

1. **Block list** — are these 14 the right set? Anything missing (e.g., a "Blog feed" block, a "Student Results" block, a "Logos/partners" strip)?

2. **Student Results** — the master plan has a separate "Student Results" content type. Should there also be a **Results Grid block** to display them on pages? I'd recommend yes.

3. **Blog feed** — do you want a **Blog Feed block** (shows latest N posts) for now, or leave blog out of the page builder?

4. **Rich text** — for the `richtext` field, are you okay with a simple editor (bold/italic/headings/lists/links) rather than a full Wandex-style block editor? Simpler = safer + faster.

Once you confirm, I'll write `src/lib/block-schema.ts` — the typed schema both admin and public site will import.
