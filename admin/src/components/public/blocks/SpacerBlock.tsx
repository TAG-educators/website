interface SpacerData {
  size?: "sm" | "md" | "lg" | "xl";
  showDivider?: boolean;
}

export function SpacerBlock({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as SpacerData;
  const size = d.size ?? "md";

  return (
    <div className={`spacer-block ${size}`}>
      {d.showDivider && <div className="divider" />}
    </div>
  );
}
