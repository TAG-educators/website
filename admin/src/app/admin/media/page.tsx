"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Image as ImageIcon, Trash2, Loader2, Check } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  fetchMediaAssets,
  createMediaAsset,
  updateMediaAsset,
  deleteMediaAsset,
  uploadMediaFile,
  type MediaAsset,
} from "@/lib/media";

export default function MediaPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [savingAlt, setSavingAlt] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    const { data, error } = await fetchMediaAssets();
    if (error) setError(error);
    setMedia(data ?? []);
    setLoading(false);
  }

  const filtered = media.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.alt.toLowerCase().includes(query.toLowerCase()),
  );

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { url, sizeKb, width, height } = await uploadMediaFile(file);
      const { error } = await createMediaAsset({
        name: file.name,
        url,
        alt: "",
        sizeKb,
        width,
        height,
      });
      if (error) throw new Error(error);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function startEditAlt(m: MediaAsset) {
    setEditingId(m.id);
    setAltDraft(m.alt);
  }

  async function saveAlt(id: string) {
    setSavingAlt(true);
    const { error } = await updateMediaAsset(id, { alt: altDraft });
    if (error) setError(error);
    else {
      setMedia((prev) =>
        prev.map((m) => (m.id === id ? { ...m, alt: altDraft } : m)),
      );
      setEditingId(null);
    }
    setSavingAlt(false);
  }

  async function handleDelete(m: MediaAsset) {
    if (!confirm(`Delete "${m.name}"? This removes the file from storage.`)) return;
    setDeletingId(m.id);
    const { error } = await deleteMediaAsset(m.id);
    if (error) setError(error);
    else setMedia((prev) => prev.filter((x) => x.id !== m.id));
    setDeletingId(null);
  }

  return (
    <>
      <PageHeader
        title="Media Library"
        description="Images and assets used across your site."
        action={
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
            <Button
              variant="primary"
              size="md"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Uploading…
                </>
              ) : (
                <>
                  <Plus size={15} /> Upload
                </>
              )}
            </Button>
          </>
        }
      />

      {error && (
        <div className="mb-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-4 py-3">
          {error}
        </div>
      )}

      <Card>
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border">
          <SearchInput value={query} onChange={setQuery} placeholder="Search media…" />
          <div className="ml-auto text-[12px] text-ink-faint">
            {filtered.length} of {media.length}
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-[13px] text-ink-faint">Loading media…</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No media found"
            description={query ? "Try adjusting your search." : "Upload your first image to get started."}
          />
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((m) => (
                <div
                  key={m.id}
                  className="group rounded-[8px] border border-border overflow-hidden bg-bg-subtle hover:border-accent hover:shadow-sm transition-all"
                >
                  {/* Preview */}
                  <div className="aspect-video bg-bg-muted flex items-center justify-center relative">
                    {m.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.url}
                        alt={m.alt || m.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <ImageIcon size={28} className="text-ink-faint" />
                    )}
                    <button
                      onClick={() => handleDelete(m)}
                      disabled={deletingId === m.id}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-[6px] bg-white/90 border border-border flex items-center justify-center text-danger hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === m.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  </div>
                  {/* Info */}
                  <div className="p-2.5">
                    <div className="text-[13px] font-medium text-ink truncate">{m.name}</div>
                    <div className="text-[11px] text-ink-faint mt-0.5">
                      {m.width > 0 ? `${m.width}×${m.height}` : "—"} · {m.sizeKb} KB
                    </div>
                    {editingId === m.id ? (
                      <div className="mt-1.5 flex items-center gap-1">
                        <input
                          value={altDraft}
                          onChange={(e) => setAltDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveAlt(m.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          placeholder="Alt text…"
                          className="flex-1 text-[11px] px-1.5 py-1 border border-border rounded-[4px] focus:outline-none focus:border-accent"
                          autoFocus
                        />
                        <button
                          onClick={() => saveAlt(m.id)}
                          disabled={savingAlt}
                          className="w-6 h-6 rounded-[4px] bg-accent text-white flex items-center justify-center hover:bg-accent-hover disabled:opacity-50"
                          title="Save"
                        >
                          {savingAlt ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : (
                            <Check size={11} />
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditAlt(m)}
                        className="text-[11px] text-ink-muted mt-1 truncate italic text-left w-full hover:text-accent"
                      >
                        {m.alt ? `"${m.alt}"` : "Add alt text…"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
