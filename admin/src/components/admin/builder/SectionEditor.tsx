"use client";

import { useEffect } from "react";
import { getBlockDef } from "@/lib/block-schema";
import type { Section } from "@/lib/block-schema";
import { FieldRenderer } from "./FieldRenderer";
import { ResourceLibraryEditor } from "./ResourceLibraryEditor";
import { CourseDataPreview } from "./CourseDataPreview";
import { Toggle } from "@/components/ui/Toggle";
import { fetchCourses } from "@/lib/courses";
import { fetchTeachers } from "@/lib/teachers";

export function SectionEditor({
  section,
  onChange,
  onVisibilityChange,
}: {
  section: Section;
  onChange: (data: Record<string, unknown>) => void;
  onVisibilityChange?: (visibility: Pick<Section, "desktopVisible" | "mobileVisible">) => void;
}) {
  const def = getBlockDef(section.type);

  const updateField = (key: string, value: unknown) => {
    // When showAll is toggled on for courseGrid/teacherGrid, auto-populate IDs
    if (
      (section.type === "courseGrid" || section.type === "teacherGrid") &&
      key === "showAll" &&
      value === true
    ) {
      const idKey = section.type === "courseGrid" ? "courseIds" : "teacherIds";
      const fetcher = section.type === "courseGrid" ? fetchCourses : fetchTeachers;
      fetcher().then(({ data }) => {
        if (data && data.length > 0) {
          onChange({ ...section.data, [key]: value, [idKey]: data.map((c) => c.id) });
        } else {
          onChange({ ...section.data, [key]: value });
        }
      });
      return;
    }
    onChange({ ...section.data, [key]: value });
  };

  // Auto-sync courseIds/teacherIds when showAll is true and IDs are stale
  useEffect(() => {
    if (section.type === "courseGrid" && section.data?.showAll) {
      fetchCourses().then(({ data }) => {
        if (data && data.length > 0) {
          const currentIds = (section.data.courseIds as string[]) || [];
          const allIds = data.map((c) => c.id);
          const hasNew = allIds.some((id) => !currentIds.includes(id));
          const hasRemoved = currentIds.some((id) => !allIds.includes(id));
          if (hasNew || hasRemoved) {
            onChange({ ...section.data, courseIds: allIds });
          }
        }
      });
    }
    if (section.type === "teacherGrid" && section.data?.showAll) {
      fetchTeachers().then(({ data }) => {
        if (data && data.length > 0) {
          const currentIds = (section.data.teacherIds as string[]) || [];
          const allIds = data.map((t) => t.id);
          const hasNew = allIds.some((id) => !currentIds.includes(id));
          const hasRemoved = currentIds.some((id) => !allIds.includes(id));
          if (hasNew || hasRemoved) {
            onChange({ ...section.data, teacherIds: allIds });
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.type, section.data?.showAll]);

  return (
    <div className="space-y-4 px-4 py-4 bg-bg-subtle border-t border-border">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[6px] border border-border bg-white p-3">
        <div className="inline-flex items-center gap-2">
          <span className="text-[12px] font-medium text-ink-soft">Show on desktop</span>
          <Toggle
            checked={section.desktopVisible !== false}
            onChange={(checked) => onVisibilityChange?.({ desktopVisible: checked }) }
          />
        </div>
        <div className="inline-flex items-center gap-2 ml-auto">
          <span className="text-[12px] font-medium text-ink-soft">Show on mobile</span>
          <Toggle
            checked={section.mobileVisible !== false}
            onChange={(checked) => onVisibilityChange?.({ mobileVisible: checked }) }
          />
        </div>
      </div>

      {/* Custom editor for resourceLibrary blocks */}
      {section.type === "resourceLibrary" ? (
        <ResourceLibraryEditor
          data={section.data as any}
          onChange={(data) => onChange(data as Record<string, unknown>)}
        />
      ) : (
        <>
          {def.fields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              value={section.data[field.key]}
              onChange={(val) => updateField(field.key, val)}
            />
          ))}
          {/* Show course data preview for courseGrid blocks */}
          {section.type === "courseGrid" && section.data?.courseIds && (
            <CourseDataPreview courseIds={section.data.courseIds as string[]} showAll={Boolean(section.data?.showAll)} />
          )}
        </>
      )}
    </div>
  );
}
