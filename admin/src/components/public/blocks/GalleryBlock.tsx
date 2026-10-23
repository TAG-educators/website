interface GalleryBlockData {
  title?: string;
  images?: string[];
  columns?: "2" | "3" | "4";
}

export function GalleryBlock({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as GalleryBlockData;
  if (!d.images?.length) return null;

  const cols = d.columns ?? "3";

  return (
    <section className="public-section gallery-block">
      <div className="wrap">
        {d.title && (
          <div className="section-head">
            <h2>{d.title}</h2>
          </div>
        )}
        <div className={`gallery-grid cols-${cols}`}>
          {d.images.map((src, i) => (
            <img key={i} src={src} alt={`Gallery ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
