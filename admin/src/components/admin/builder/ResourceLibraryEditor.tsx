"use client";

import { useState } from "react";
import { Plus, X, Trash2, FileText, ChevronDown, ChevronRight, Upload, Pencil } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";

// ---------- Types ----------
type Pdf = {
  title: string;
  url: string;
  description?: string;
};

type Topic = {
  topic: string;
  pdfs: Pdf[];
};

type Level = {
  level: string;
  topics: Topic[];
};

export type ResourceLibraryData = {
  eyebrow?: string;
  title?: string;
  levels: Level[];
};

// ---------- Topic Dialog ----------
function TopicDialog({
  open,
  onClose,
  onAdd,
  levels,
  editIndex,
  editTopic,
  editLevelIndex,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (levelIndex: number, topic: Topic) => void;
  levels: Level[];
  editIndex?: number;
  editTopic?: Topic;
  editLevelIndex?: number;
}) {
  const [topicName, setTopicName] = useState(editTopic?.topic ?? "");
  const [selectedLevel, setSelectedLevel] = useState<string>(
    editLevelIndex !== undefined ? levels[editLevelIndex]?.level ?? "" : levels[0]?.level ?? ""
  );
  const [pdfs, setPdfs] = useState<Pdf[]>(editTopic?.pdfs ?? []);
  const [error, setError] = useState<string | null>(null);

  function addPdf() {
    setPdfs([...pdfs, { title: "", url: "", description: "" }]);
  }

  function updatePdf(index: number, key: keyof Pdf, value: string) {
    setPdfs(pdfs.map((p, i) => (i === index ? { ...p, [key]: value } : p)));
  }

  function removePdf(index: number) {
    setPdfs(pdfs.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!topicName.trim()) {
      setError("Please enter a topic name.");
      return;
    }
    if (!selectedLevel) {
      setError("Please select a level.");
      return;
    }
    const levelIndex = levels.findIndex((l) => l.level === selectedLevel);
    if (levelIndex === -1) {
      setError("Selected level not found.");
      return;
    }
    // Filter out PDFs without a URL
    const validPdfs = pdfs.filter((p) => p.url && p.title.trim());
    onAdd(levelIndex, { topic: topicName.trim(), pdfs: validPdfs });
    handleClose();
  }

  function handleClose() {
    setTopicName("");
    setSelectedLevel(levels[0]?.level ?? "");
    setPdfs([]);
    setError(null);
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="w-[560px] max-w-[calc(100vw-2rem)] max-h-[85vh] rounded-[10px] bg-white border border-border shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-subtle">
          <div>
            <span className="text-[14px] font-semibold text-ink block">
              {editTopic ? "Edit Topic" : "Create Topic"}
            </span>
            <span className="text-[11px] text-ink-faint">
              Add a topic to a level and attach PDFs
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-ink-faint hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[6px] px-3 py-2">
              {error}
            </div>
          )}

          {/* Topic name */}
          <div>
            <Label>Topic Name <span className="text-danger">*</span></Label>
            <Input
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="e.g. Mechanics & Motion"
            />
          </div>

          {/* Level selector */}
          <div>
            <Label>Select Level <span className="text-danger">*</span></Label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full h-9 px-3 rounded-[6px] border border-border bg-white text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            >
              {levels.map((l) => (
                <option key={l.level} value={l.level}>{l.level}</option>
              ))}
            </select>
          </div>

          {/* PDFs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>PDFs / Resources</Label>
              <button
                type="button"
                onClick={addPdf}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:text-accent-hover"
              >
                <Plus size={14} /> Add PDF
              </button>
            </div>

            {pdfs.length === 0 && (
              <p className="text-[12px] text-ink-faint italic">No PDFs added yet. Click "Add PDF" to upload one.</p>
            )}

            {pdfs.map((pdf, i) => (
              <div key={i} className="rounded-[6px] border border-border bg-bg-subtle p-3 space-y-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide">
                    PDF {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePdf(i)}
                    className="text-ink-faint hover:text-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div>
                  <Label className="text-[11px]">Title</Label>
                  <Input
                    value={pdf.title}
                    onChange={(e) => updatePdf(i, "title", e.target.value)}
                    placeholder="e.g. Motion & Forces — Notes"
                  />
                </div>
                <div>
                  <Label className="text-[11px]">Upload / Link</Label>
                  <FileUpload
                    value={pdf.url}
                    onChange={(url) => updatePdf(i, "url", url || "")}
                    maxSizeMB={10}
                  />
                </div>
                <div>
                  <Label className="text-[11px]">Description (optional)</Label>
                  <Textarea
                    value={pdf.description ?? ""}
                    onChange={(e) => updatePdf(i, "description", e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-bg-subtle">
          <Button variant="ghost" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {editTopic ? "Update Topic" : "Create Topic"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Resource Library Editor ----------
export function ResourceLibraryEditor({
  data,
  onChange,
}: {
  data: ResourceLibraryData;
  onChange: (data: ResourceLibraryData) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editLevelIndex, setEditLevelIndex] = useState<number | undefined>(undefined);
  const [editTopicIndex, setEditTopicIndex] = useState<number | undefined>(undefined);
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([0]));

  const levels = data.levels ?? [];

  function toggleLevel(idx: number) {
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  function handleAddTopic(levelIndex: number, topic: Topic) {
    const newLevels = [...levels];
    if (editTopicIndex !== undefined && editLevelIndex !== undefined) {
      // Editing existing topic
      newLevels[editLevelIndex].topics[editTopicIndex] = topic;
    } else {
      // Adding new topic
      newLevels[levelIndex].topics.push(topic);
    }
    onChange({ ...data, levels: newLevels });
    setEditLevelIndex(undefined);
    setEditTopicIndex(undefined);
  }

  function deleteTopic(levelIndex: number, topicIndex: number) {
    if (!confirm("Delete this topic and all its PDFs?")) return;
    const newLevels = [...levels];
    newLevels[levelIndex].topics.splice(topicIndex, 1);
    onChange({ ...data, levels: newLevels });
  }

  function deleteLevel(levelIndex: number) {
    if (!confirm("Delete this level and all its topics?")) return;
    const newLevels = levels.filter((_, i) => i !== levelIndex);
    onChange({ ...data, levels: newLevels });
  }

  function addLevel() {
    const name = prompt("Enter level name (e.g. O Level, A Level):");
    if (!name?.trim()) return;
    const newLevels = [...levels, { level: name.trim(), topics: [] }];
    onChange({ ...data, levels: newLevels });
  }

  function openCreateDialog() {
    setEditLevelIndex(undefined);
    setEditTopicIndex(undefined);
    setDialogOpen(true);
  }

  function openEditDialog(levelIndex: number, topicIndex: number) {
    setEditLevelIndex(levelIndex);
    setEditTopicIndex(topicIndex);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      {/* Eyebrow + Title */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>Eyebrow</Label>
          <Input
            value={data.eyebrow ?? ""}
            onChange={(e) => onChange({ ...data, eyebrow: e.target.value })}
            placeholder="By Level"
          />
        </div>
        <div>
          <Label>Section Title</Label>
          <Input
            value={data.title ?? ""}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="Biology Resource Library"
          />
        </div>
      </div>

      {/* Levels with topics */}
      <div className="space-y-2">
        {levels.map((level, li) => {
          const expanded = expandedLevels.has(li);
          return (
            <div key={li} className="rounded-[8px] border border-border bg-white overflow-hidden">
              {/* Level header */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-bg-subtle border-b border-border">
                <button
                  type="button"
                  onClick={() => toggleLevel(li)}
                  className="text-ink-faint hover:text-ink"
                >
                  {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                <span className="text-[13px] font-semibold text-ink flex-1">{level.level}</span>
                <span className="text-[11px] text-ink-faint">
                  {level.topics.length} topic{level.topics.length !== 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  onClick={() => deleteLevel(li)}
                  className="text-ink-faint hover:text-danger p-1"
                  title="Delete level"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Topics list */}
              {expanded && (
                <div className="p-3 space-y-2">
                  {level.topics.length === 0 && (
                    <p className="text-[12px] text-ink-faint italic">No topics yet. Click "Create Topic" to add one.</p>
                  )}
                  {level.topics.map((topic, ti) => (
                    <div
                      key={ti}
                      className="flex items-start gap-2 rounded-[6px] border border-border bg-bg-subtle p-2.5"
                    >
                      <FileText size={15} className="text-accent mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-ink">{topic.topic}</div>
                        <div className="text-[11px] text-ink-faint">
                          {topic.pdfs.length} PDF{topic.pdfs.length !== 1 ? "s" : ""}
                          {topic.pdfs.length > 0 && (
                            <span className="ml-1.5">
                              · {topic.pdfs.map((p) => p.title).filter(Boolean).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openEditDialog(li, ti)}
                        className="text-ink-faint hover:text-accent p-1"
                        title="Edit topic"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTopic(li, ti)}
                        className="text-ink-faint hover:text-danger p-1"
                        title="Delete topic"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Add level button */}
        <button
          type="button"
          onClick={addLevel}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted hover:text-accent"
        >
          <Plus size={14} /> Add Level
        </button>
      </div>

      {/* Create Topic button */}
      <div className="pt-2 border-t border-border">
        <button
          type="button"
          onClick={openCreateDialog}
          className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-[8px] border border-dashed border-accent text-accent text-sm font-medium hover:bg-accent-soft transition-colors"
        >
          <Plus size={18} /> Create Topic
        </button>
      </div>

      {/* Topic Dialog */}
      <TopicDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditLevelIndex(undefined);
          setEditTopicIndex(undefined);
        }}
        onAdd={handleAddTopic}
        levels={levels}
        editLevelIndex={editLevelIndex}
        editTopic={editLevelIndex !== undefined && editTopicIndex !== undefined ? levels[editLevelIndex]?.topics[editTopicIndex] : undefined}
      />
    </div>
  );
}
