'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FloatingSymbols } from '@/components/sections/floating-symbols';
import { usePageSections, findSection, sectionVisibilityClass } from '@/hooks/use-page-sections';
import { getYouTubeId, youTubeThumbnail, youTubeEmbedUrl } from '@/lib/youtube';

type ReelItem = {
  name: string;
  subject: string;
  poster?: string | null;
  videoId: string | null;
};

type ReelData = {
  eyebrow?: string;
  title?: string;
  testimonialIds?: string[];
};

type Testimonial = {
  id: string;
  studentName: string;
  course: string;
  result: string;
  quote: string;
  poster?: string | null;
  videoUrl?: string | null;
};

export function TestimonialsSection() {
  const prefersReducedMotion = useReducedMotion();
  const { rawSections } = usePageSections('home');
  const reelSection = findSection(rawSections, 'testimonialReel');

  const [reelItems, setReelItems] = useState<ReelItem[]>([]);
  // Index of the card whose video is currently loaded; only one plays at a time.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [sectionMeta, setSectionMeta] = useState<{
    eyebrow?: string;
    title?: string;
  }>({});

  useEffect(() => {
    if (reelSection?.data) {
      const data = reelSection.data as ReelData;
      setSectionMeta({
        eyebrow: data.eyebrow,
        title: data.title,
      });

      if (data.testimonialIds && data.testimonialIds.length > 0) {
        fetch('/api/testimonials')
          .then((r) => r.json())
          .then((allTestimonials: Testimonial[]) => {
            if (allTestimonials && allTestimonials.length > 0) {
              const selected = data.testimonialIds!
                .map((id) => allTestimonials.find((t) => t.id === id))
                .filter(Boolean) as Testimonial[];
              if (selected.length > 0) {
                setReelItems(
                  selected.map((t) => ({
                    name: t.studentName,
                    subject: [t.course, t.result].filter(Boolean).join(' '),
                    poster: t.poster,
                    videoId: getYouTubeId(t.videoUrl),
                  }))
                );
              }
            }
          })
          .catch(() => {});
      }
    }
  }, [reelSection]);

  const eyebrow = sectionMeta.eyebrow || 'Student Voices';
  const title = sectionMeta.title || 'Hear It From Our Students';

  if (reelSection?.hidden || reelItems.length === 0) return null;
  const visibilityClass = sectionVisibilityClass(reelSection);

  return (
    <section className={`relative py-16 pb-8 md:py-28 md:pb-28 ${visibilityClass}`.trim()} data-header-theme="dark">
      <FloatingSymbols />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p
            className="text-[0.78rem] font-semibold uppercase tracking-[0.16em]"
            style={{ color: '#b472cc' }}
          >
            {eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
            {title}
          </h2>
        </motion.div>
      </div>

      <div
        className="reel-scroll mt-12 flex gap-4 overflow-x-auto pb-2"
        style={{
          scrollbarWidth: 'none',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          overflowY: 'hidden',
          padding: '0 max(24px, calc((100vw - 1200px) / 2 + 24px))',
        }}
      >
        {reelItems.map((item, i) => (
          <ReelCard
            key={item.name + i}
            item={item}
            index={i}
            reduceMotion={!!prefersReducedMotion}
            active={activeIndex === i}
            onActivate={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}

function ReelCard({
  item,
  index,
  reduceMotion,
  active,
  onActivate,
}: {
  item: ReelItem;
  index: number;
  reduceMotion: boolean;
  active: boolean;
  onActivate: () => void;
}) {
  const [posterFailed, setPosterFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const youtubeThumb = item.videoId ? youTubeThumbnail(item.videoId) : null;
  // A bad poster link (e.g. a share page rather than an image) falls back to the YouTube thumbnail.
  const imageSrc = item.poster && !posterFailed ? item.poster : youtubeThumb;
  const playable = !!item.videoId;

  // Another card was started: this one goes back to its thumbnail.
  useEffect(() => {
    if (!active) {
      setPlaying(false);
      setLoading(false);
    }
  }, [active]);

  // Keep the spinner until YouTube reports the video is actually playing
  // (state 1). The timeout stops it spinning forever if autoplay is blocked.
  useEffect(() => {
    if (!active || !loading) return;
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      try {
        const d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        const state = d?.event === 'onStateChange' ? d.info : d?.info?.playerState;
        if (state === 1) setLoading(false);
      } catch {
        // ignore non-JSON messages
      }
    };
    window.addEventListener('message', onMessage);
    const timeout = setTimeout(() => setLoading(false), 8000);
    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(timeout);
    };
  }, [active, loading]);

  const sendCommand = (func: 'playVideo' | 'pauseVideo') => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: '' }),
      '*'
    );
  };

  const handleTap = () => {
    if (!playable) return;
    if (!active) {
      onActivate(); // loads the video with autoplay
      setPlaying(true);
      setLoading(true);
    } else if (playing) {
      sendCommand('pauseVideo');
      setPlaying(false);
    } else {
      sendCommand('playVideo');
      setPlaying(true);
    }
  };

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`reel-card-mobile relative flex-none overflow-hidden rounded-2xl border border-border bg-white shadow-premium ${playable ? 'cursor-pointer' : ''}`}
      style={{
        width: '200px',
        height: '356px',
        scrollSnapAlign: 'start',
        background: imageSrc ? undefined : 'linear-gradient(135deg, #6b2f78, #a855c4)',
      }}
      onClick={handleTap}
      role={playable ? 'button' : undefined}
      tabIndex={playable ? 0 : undefined}
      aria-label={playable ? `${playing ? 'Pause' : 'Play'} video: ${item.name}` : undefined}
      onKeyDown={
        playable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTap();
              }
            }
          : undefined
      }
    >
      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setPosterFailed(true)}
        />
      )}

      {active && item.videoId && (
        <iframe
          ref={iframeRef}
          src={youTubeEmbedUrl(item.videoId)}
          title={`${item.name} video`}
          // Taps are handled by the card so they toggle play/pause instead of reaching YouTube.
          className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          allow="autoplay; encrypted-media; picture-in-picture"
          onLoad={() =>
            // Ask YouTube to send player state events so we know when playback starts.
            iframeRef.current?.contentWindow?.postMessage(
              JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }),
              '*'
            )
          }
        />
      )}

      {active && loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30" role="status" aria-label="Loading video">
          <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
        </div>
      )}

      {playable && !active && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-white" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
      )}

      {/* Name overlay (gone once the video has been started so it never covers it) */}
      {!active && (
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            padding: '40px 16px 14px',
            background: 'linear-gradient(to top, rgba(21, 12, 27, 0.92), transparent)',
          }}
        >
          <p className="text-[0.92rem] font-semibold text-white">{item.name}</p>
          <p className="text-[0.78rem]" style={{ color: '#d4a0e8' }}>
            {item.subject}
          </p>
        </div>
      )}
    </motion.div>
  );
}
