"use client";

import { useEffect, useState } from "react";
import { BookOpen, Tag, Layers, ListChecks, Gift, DollarSign } from "lucide-react";
import { fetchCourses } from "@/lib/courses";
import type { Course } from "@/lib/types";

/**
 * Shows a read-only preview of the actual course data (pricing, levels,
 * topics, what you'll learn, benefits) for each course referenced in a
 * courseGrid block. This lets the admin see exactly what appears on the
 * public website when editing the content page.
 */
export function CourseDataPreview({ courseIds, showAll }: { courseIds: string[]; showAll?: boolean }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses().then(({ data, error }) => {
      console.log("[CourseDataPreview] fetchCourses returned:", data?.length, "courses, error:", error);
      if (showAll && data) {
        // When showAll is true, show ALL courses (ignore courseIds)
        console.log("[CourseDataPreview] showAll=true, showing all", data.length, "courses");
        setCourses(data);
      } else {
        const filtered = data.filter((c) => courseIds.includes(c.id));
        console.log("[CourseDataPreview] filtered:", filtered.length, "courses from", courseIds.length, "ids");
        setCourses(filtered);
      }
      setLoading(false);
    });
  }, [courseIds.join(","), showAll]);

  if (loading) {
    return (
      <div className="rounded-[8px] border border-border bg-bg-subtle p-4 text-[13px] text-ink-faint">
        Loading course data…
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-[8px] border border-dashed border-border bg-bg-subtle p-4 text-[13px] text-ink-faint">
        No courses selected. Pick courses in the "Courses" field above.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[12px] font-semibold text-ink-muted uppercase tracking-wide">
        <BookOpen size={14} /> Course Data Preview
        <span className="text-ink-faint font-normal normal-case tracking-normal">
          (edit details in Courses tab)
        </span>
      </div>
      {courses.map((course) => (
        <div key={course.id} className="rounded-[8px] border border-border bg-white p-4 space-y-3">
          {/* Title + subject */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-[14px] font-bold text-ink">{course.title}</h4>
              <p className="text-[12px] text-ink-faint">{course.subject} · {course.category}</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-bg-muted text-ink-soft capitalize">
              {course.status}
            </span>
          </div>

          {/* Short description */}
          {course.shortDescription && (
            <p className="text-[13px] text-ink-soft leading-relaxed">{course.shortDescription}</p>
          )}

          {/* Pricing */}
          <div className="flex items-center gap-3 rounded-[6px] bg-bg-subtle p-2.5">
            <DollarSign size={14} className="text-accent shrink-0" />
            <div className="flex items-baseline gap-2">
              {course.originalPrice > 0 && course.originalPrice !== course.price && (
                <span className="text-[13px] line-through text-ink-faint">
                  {course.currency} {course.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-[15px] font-bold text-ink">
                {course.currency} {course.price.toLocaleString()}
              </span>
              {course.originalPrice > 0 && course.originalPrice !== course.price && (
                <span className="text-[11px] font-semibold text-green-600">
                  Save {course.currency} {(course.originalPrice - course.price).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Levels */}
          {course.levels.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Layers size={13} className="text-ink-faint" />
                <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide">Levels</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {course.levels.map((lvl) => (
                  <span key={lvl} className="rounded-full bg-accent-soft text-accent-ink px-2.5 py-0.5 text-[11px] font-medium">
                    {lvl}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Topics */}
          {course.topics.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <ListChecks size={13} className="text-ink-faint" />
                <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide">Topics (What You'll Learn)</span>
              </div>
              <ol className="space-y-1">
                {course.topics.map((topic, i) => (
                  <li key={i} className="text-[12px] text-ink-soft flex gap-2">
                    <span className="text-ink-faint">{i + 1}.</span>
                    <span>{topic}</span>
                    {course.whatYouWillLearn[i] && (
                      <span className="text-ink-faint">— {course.whatYouWillLearn[i]}</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Benefits */}
          {course.benefits.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Gift size={13} className="text-ink-faint" />
                <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide">Benefits (Course Structure)</span>
              </div>
              <ul className="space-y-1">
                {course.benefits.map((benefit, i) => (
                  <li key={i} className="text-[12px] text-ink-soft flex gap-2">
                    <span className="text-ink-faint">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Teachers */}
          {course.teacherIds.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Tag size={13} className="text-ink-faint" />
                <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide">Assigned Teachers</span>
              </div>
              <p className="text-[12px] text-ink-faint">{course.teacherIds.length} teacher(s) assigned</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
