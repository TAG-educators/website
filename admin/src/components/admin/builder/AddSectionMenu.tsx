"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { BLOCK_LIST } from "@/lib/block-schema";
import type { BlockType } from "@/lib/block-schema";

export function AddSectionMenu({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (type: BlockType) => {
    onAdd(type);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-[8px] border border-dashed border-border-strong text-ink-soft text-sm font-medium hover:border-accent hover:text-accent hover:bg-accent-soft transition-colors"
      >
        <Plus size={18} /> Add Section
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-[460px] max-w-[calc(100vw-2rem)] rounded-[10px] bg-white border border-border shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-subtle">
            <div>
              <span className="text-[13px] font-semibold text-ink block">Choose a block type</span>
              <span className="text-[11px] text-ink-faint">Pick one to add it to your page</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-ink-faint hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>
          <div className="max-h-[400px] overflow-y-auto p-2 grid grid-cols-1 gap-1">
            {BLOCK_LIST.map((block) => {
              const Icon = block.icon;
              return (
                <button
                  key={block.type}
                  type="button"
                  onClick={() => handleSelect(block.type)}
                  className="flex items-start gap-3 p-3 rounded-[6px] text-left hover:bg-bg-muted transition-colors"
                >
                  <div className="w-9 h-9 shrink-0 rounded-[6px] bg-accent-soft text-accent flex items-center justify-center">
                    <Icon size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-ink">{block.label}</div>
                    <div className="text-[12px] text-ink-muted">{block.description}</div>
                  </div>
                  <Plus size={14} className="text-ink-faint shrink-0 mt-1" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
