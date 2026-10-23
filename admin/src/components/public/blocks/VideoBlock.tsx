"use client";

import { useState } from "react";

interface VideoBlockData {
  title?: string;
  url?: string;
}

function toEmbedUrl(url: string): string | null {
  // YouTube
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  // Vimeo
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;

  return null;
}

function toThumbUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`;
  return null;
}

/**
 * Video block with a click-to-play facade: shows a thumbnail + play button
 * first, and only loads the iframe when clicked. This keeps the page light
 * and avoids loading third-party JS until the user wants it. Mirrors the
 * static site's main.js lazy-load behaviour.
 */
export function VideoBlock({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as VideoBlockData;
  const [playing, setPlaying] = useState(false);

  if (!d.url) return null;
  const embed = toEmbedUrl(d.url);
  if (!embed) return null;
  const thumb = toThumbUrl(d.url);

  return (
    <section className="public-section video-block">
      <div className="wrap">
        {d.title && (
          <div className="section-head">
            <h2>{d.title}</h2>
          </div>
        )}
        <div className="video-wrap">
          {playing ? (
            <iframe
              src={`${embed}?autoplay=1&rel=0`}
              title={d.title ?? "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              className="video-facade"
              onClick={() => setPlaying(true)}
              aria-label={`Play video: ${d.title ?? "Video"}`}
              style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
            >
              <span className="video-play" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
