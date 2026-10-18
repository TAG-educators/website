"use client";

import { useRef, useState } from "react";
import { Upload, X, FileText, Loader2, Link as LinkIcon } from "lucide-react";
import { supabase, MEDIA_BUCKET } from "@/lib/supabase";

interface FileUploadProps {
  /** Current file URL (or null). */
  value: string | null;
  /** Called with the new file URL after upload completes. */
  onChange: (url: string | null) => void;
  /** Optional label above the uploader. */
  label?: string;
  /** Optional helper text below the uploader. */
  hint?: string;
  /** Max file size in MB. Default 10. */
  maxSizeMB?: number;
}

/**
 * File upload component for resources (PDFs, docs, etc.).
 *
 * Two modes:
 * 1. Upload a file → stored in Supabase Storage → public URL set.
 * 2. Paste an external link (Google Drive, YouTube, etc.) → URL set directly.
 */
export function FileUpload({
  value,
  onChange,
  label = "File",
  hint,
  maxSizeMB = 10,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState("");

  async function uploadFile(file: File): Promise<string> {
    const ext = file.name.split(".").pop() || "pdf";
    const path = `resources/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage
      .from(MEDIA_BUCKET)
      .getPublicUrl(path);

    return urlData.publicUrl;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be under ${maxSizeMB}MB.`);
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleAddLink() {
    const url = linkInput.trim();
    if (!url) return;
    // Basic validation — allow http/https links
    if (!/^https?:\/\//i.test(url)) {
      setError("Link must start with http:// or https://");
      return;
    }
    setError(null);
    onChange(url);
    setLinkInput("");
  }

  function handleRemove() {
    onChange(null);
    setError(null);
  }

  // Derive a display name from the URL
  const fileName = value ? decodeURIComponent(value.split("/").pop() ?? value) : null;
  const isExternal = value ? !value.includes("supabase.co") : false;

  return (
    <div>
      {label && (
        <label className="block text-[12px] font-medium text-ink-soft mb-1.5">{label}</label>
      )}

      {value ? (
        // Show the attached file/link
        <div className="flex items-center gap-2.5 p-3 rounded-[8px] border border-border bg-bg-muted">
          <div className="w-8 h-8 rounded-[6px] bg-white border border-border flex items-center justify-center shrink-0">
            {isExternal ? (
              <LinkIcon size={15} className="text-accent" />
            ) : (
              <FileText size={15} className="text-ink-soft" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-ink truncate">
              {isExternal ? "External link" : fileName}
            </div>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-accent hover:underline truncate block"
            >
              {value}
            </a>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-[6px] text-ink-muted hover:bg-white hover:text-danger transition-colors"
            title="Remove"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        // Upload + link options
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-[8px] border border-dashed border-border hover:border-accent hover:bg-accent-soft/30 transition-colors text-[13px] text-ink-soft disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <Upload size={15} /> Upload file (PDF, DOC, etc.)
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <input
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="Or paste a link (Google Drive, YouTube…)"
              className="flex-1 h-9 px-3 rounded-[6px] border border-border bg-white text-[13px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
            <button
              type="button"
              onClick={handleAddLink}
              className="h-9 px-3 rounded-[6px] border border-border bg-white text-[13px] text-ink-soft hover:bg-bg-muted transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.mp4,.mov"
      />

      {error && (
        <p className="mt-1.5 text-[12px] text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-[12px] text-ink-faint">{hint}</p>
      )}
    </div>
  );
}
