"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase, MEDIA_BUCKET } from "@/lib/supabase";

interface PhotoUploadProps {
  /** Current photo URL (or null). */
  value: string | null;
  /** Called with the new photo URL after upload completes. */
  onChange: (url: string | null) => void;
  /** Optional label above the uploader. */
  label?: string;
  /** Optional helper text below the uploader. */
  hint?: string;
  /** Square aspect ratio for the preview. Default 1 (square). */
  aspect?: number;
  /** Max file size in MB. Default 5. */
  maxSizeMB?: number;
}

/**
 * Photo upload component.
 *
 * Flow:
 * 1. User clicks "Upload Photo" → native file explorer opens.
 * 2. User picks an image file.
 * 3. File is uploaded to Supabase Storage (TODO: wire real upload).
 *    - For now, a local object URL is used as a placeholder so the preview works.
 * 4. The returned public URL is passed to `onChange`, which sets it on the record.
 * 5. On Save, the record (with the photo URL) is persisted to the DB.
 *
 * When Supabase is wired, replace the `uploadFile` function body with:
 *   const { data, error } = await supabase.storage
 *     .from("media")
 *     .upload(`${folder}/${timestamp}-${file.name}`, file);
 *   const { data: urlData } = supabase.storage
 *     .from("media")
 *     .getPublicUrl(data.path);
 *   return urlData.publicUrl;
 */
export function PhotoUpload({
  value,
  onChange,
  label = "Photo",
  hint,
  aspect = 1,
  maxSizeMB = 5,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // The displayed image: prefer the live local preview during upload,
  // otherwise the persisted value.
  const displaySrc = localPreview ?? value;

  async function uploadFile(file: File): Promise<string> {
    // Build a unique path: <folder>/<timestamp>-<filename>
    const ext = file.name.split(".").pop() || "jpg";
    const path = `teachers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data: urlData } = supabase.storage
      .from(MEDIA_BUCKET)
      .getPublicUrl(path);

    return urlData.publicUrl;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be under ${maxSizeMB}MB.`);
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setLocalPreview(url);
      onChange(url);
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    setError(null);
    onChange(null);
  }

  function openPicker() {
    inputRef.current?.click();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Simulate the change event shape.
      handleFileChange({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  }

  return (
    <div>
      <span className="block text-[12px] font-medium text-ink-soft mb-1.5">{label}</span>

      <div className="flex items-start gap-4 pl-1">
        {/* Preview / drop zone */}
        <div
          onClick={openPicker}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={cn(
            "relative shrink-0 rounded-[8px] border border-dashed border-border-strong bg-bg-muted",
            "flex items-center justify-center cursor-pointer overflow-hidden transition-colors",
            "hover:border-accent hover:bg-accent-soft/40",
            uploading && "opacity-60 pointer-events-none",
          )}
          style={{ width: 96, height: 96 / aspect }}
        >
          {displaySrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displaySrc}
              alt="Photo preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-ink-faint">
              <ImageIcon size={22} />
              <span className="text-[11px]">No photo</span>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 size={18} className="animate-spin text-accent" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 pt-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={openPicker}
            disabled={uploading}
            className={cn(
              "inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium",
              "bg-white border border-border-strong text-ink-soft hover:bg-bg-muted transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <Upload size={13} />
            {uploading ? "Uploading…" : displaySrc ? "Change Photo" : "Upload Photo"}
          </button>

          {displaySrc && !uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] text-danger hover:bg-danger/5 transition-colors"
            >
              <X size={13} /> Remove
            </button>
          )}

          {error && <p className="text-[12px] text-danger">{error}</p>}
          {hint && !error && <p className="text-[12px] text-ink-faint">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
