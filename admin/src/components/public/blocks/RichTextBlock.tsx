interface RichTextData {
  body?: string;
}

export function RichTextBlock({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as RichTextData;
  if (!d.body) return null;

  return (
    <section className="public-section richtext-block">
      <div className="wrap">
        <div
          className="richtext-body"
          dangerouslySetInnerHTML={{ __html: d.body }}
        />
      </div>
    </section>
  );
}
