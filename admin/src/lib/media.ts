import { supabase, MEDIA_BUCKET } from "./supabase";

/** Metadata for a file uploaded to the media storage bucket. */
export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  alt: string;
  sizeKb: number;
  width: number;
  height: number;
  updatedAt: string;
}

interface MediaAssetRow {
  id: string;
  name: string;
  url: string;
  alt: string;
  size_kb: number;
  width: number;
  height: number;
  updated_at: string;
}

const TABLE = "media_assets";

function rowToMedia(r: MediaAssetRow): MediaAsset {
  return {
    id: r.id,
    name: r.name,
    url: r.url,
    alt: r.alt,
    sizeKb: r.size_kb,
    width: r.width,
    height: r.height,
    updatedAt: r.updated_at,
  };
}

export async function fetchMediaAssets(): Promise<{
  data: MediaAsset[] | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: (data as MediaAssetRow[]).map(rowToMedia), error: null };
}

export async function createMediaAsset(payload: Omit<MediaAsset, "id" | "updatedAt">): Promise<{
  data: MediaAsset | null;
  error: string | null;
}> {
  const row = {
    name: payload.name,
    url: payload.url,
    alt: payload.alt,
    size_kb: payload.sizeKb,
    width: payload.width,
    height: payload.height,
  };
  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select("*")
    .single();

  if (error) return { data: null, error: error.message };
  return { data: rowToMedia(data as MediaAssetRow), error: null };
}

export async function updateMediaAsset(
  id: string,
  payload: Partial<Pick<MediaAsset, "alt" | "name">>,
): Promise<{ error: string | null }> {
  const row: Record<string, unknown> = {};
  if (payload.name !== undefined) row.name = payload.name;
  if (payload.alt !== undefined) row.alt = payload.alt;

  const { error } = await supabase
    .from(TABLE)
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteMediaAsset(id: string): Promise<{ error: string | null }> {
  // First fetch the row to get the storage path
  const { data, error: fetchErr } = await supabase
    .from(TABLE)
    .select("url")
    .eq("id", id)
    .single();

  if (fetchErr) return { error: fetchErr.message };

  // Try to remove from storage (best-effort — row delete is the source of truth)
  if (data?.url) {
    const url = data.url as string;
    // Extract path after the bucket name in the public URL
    const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx !== -1) {
      const path = url.slice(idx + marker.length);
      await supabase.storage.from(MEDIA_BUCKET).remove([path]);
    }
  }

  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  return { error: error?.message ?? null };
}

/**
 * Upload a file to the media bucket and return its public URL + size.
 * Does NOT create a media_assets row — caller does that via createMediaAsset.
 */
export async function uploadMediaFile(file: File): Promise<{
  url: string;
  sizeKb: number;
  width: number;
  height: number;
}> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `media/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

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

  // Get dimensions if it's an image
  let width = 0;
  let height = 0;
  if (file.type.startsWith("image/")) {
    const dims = await new Promise<{ w: number; h: number }>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve({ w: 0, h: 0 });
      img.src = urlData.publicUrl;
    });
    width = dims.w;
    height = dims.h;
  }

  return {
    url: urlData.publicUrl,
    sizeKb: Math.round(file.size / 1024),
    width,
    height,
  };
}
