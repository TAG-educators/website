// Extracts the video id from the YouTube link formats admins commonly paste:
// /shorts/ID, /watch?v=ID, youtu.be/ID, /embed/ID, /live/ID (query strings ignored).
export function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\.|^m\./, '');
    let id: string | null = null;
    if (host === 'youtu.be') {
      id = u.pathname.split('/')[1] ?? null;
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      id = u.searchParams.get('v');
      if (!id) {
        const m = u.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?#]+)/);
        id = m ? m[1] : null;
      }
    }
    return id && /^[\w-]{6,20}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function youTubeThumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&controls=0&rel=0&playsinline=1&modestbranding=1&enablejsapi=1`;
}
