import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  empty?: React.ReactNode;
}) {
  if (rows.length === 0 && empty) {
    return <div className="py-12 text-center text-ink-muted text-sm">{empty}</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "text-left font-medium text-ink-muted text-[12px] uppercase tracking-wide px-4 py-2.5",
                  c.className,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border-subtle last:border-0 hover:bg-bg-muted transition-colors"
            >
              {columns.map((c) => (
                <td key={c.key} className={cn("px-4 py-3 text-ink-soft", c.className)}>
                  {c.render ? c.render(row) : (row as Record<string, React.ReactNode>)[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
