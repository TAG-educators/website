'use client';

import { useEffect, useRef, useCallback } from 'react';

type SymbolData = {
  id: number;
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  el: HTMLSpanElement | null;
};

// Symbols grouped by subject
const subjectSymbols: Record<string, string[]> = {
  physics: [
    'F=ma', 'v=λf', 'P=IV', 'Q=mcΔT', 'e=mc²', 'E=½mv²', 'λ', 'μ', 'θ',
    'ω', '∇', '∂', 'Hz', 'W', 'J', 'N', 'Pa', 'V', 'A', 'Ω',
    'v=d/t', 'a=Δv/Δt', 'ρ=m/V', 'F=Gm₁m₂/r²',
  ],
  chemistry: [
    'H₂O', 'CO₂', 'O₂', 'N₂', 'NaCl', 'pH', 'mol', 'C₆H₁₂O₆',
    'H₂SO₄', 'CH₄', 'NaOH', 'HCl', 'Fe', 'Cu', 'Ag', 'Zn',
    'Na', 'Cl', 'H₂', 'NH₃', 'C₂H₅OH', 'KMnO₄',
    'ΔH', 'Kₛₚ', 'M₁V₁=M₂V₂', 'PV=nRT',
  ],
  mathematics: [
    'π', '∑', '∫', '√', '∞', 'sin', 'cos', 'tan', 'log', 'lim',
    'dx', 'dy', 'x²', 'x³', '½', '¼', 'f(x)', '≈', '≠', '≤',
    '≥', '±', '×', '÷', '∠', '⊥', '∥', '≡', '∝', '∈',
    '∀', '∃', 'd/dx', '∫dx', 'Σxᵢ', 'n!', 'C(n,r)', 'P(n,r)',
  ],
  biology: [
    'DNA', 'RNA', 'ATP', 'O₂', 'CO₂', 'H₂O', 'C₆H₁₂O₆',
    'A=T', 'G≡C', 'AUGC', 'tRNA', 'mRNA', 'pH 7.4',
    '₂n', 'N=N', 'Punnett', '×²', 'mitosis', 'meiosis',
  ],
  'computer-science': [
    '0', '1', '1010', 'AND', 'OR', 'XOR', 'NOT', 'if/else',
    'O(n)', 'log(n)', 'O(1)', 'O(n²)', 'byte', 'bit', '8-bit',
    '{ }', '< >', '!=', '==', '++', '--', 'n++', 'i=0',
    'while', 'for', 'return', 'null', 'true', 'false',
  ],
  'business-studies': [
    '$', '£', 'ROI', 'P&L', 'B2B', 'B2C', 'SWOT', 'KPI',
    'USP', 'CRM', 'PEST', '4Ps', 'SOP', 'MOQ', 'SKU',
  ],
  economics: [
    '€', '¥', 'GDP', 'CPI', 'Qd', 'Qs', 'MC', 'MR',
    'AC', 'TC', 'TR', 'AR', 'ΔQ', 'ΔP', 'E_d', 'MPC',
    'MPS', 'APC', 'APS', 'G=I', 'C+I+G', 'AD=AS',
  ],
  accounts: [
    'Dr', 'Cr', 'A=L+E', 'EBITDA', 'ROE', 'ROA',
    'P&L', 'BS', 'CF', 'GP', 'NP', 'EPS', 'PE',
    'Debit', 'Credit', 'T-Acct', 'Journal', 'Ledger',
  ],
};

// All symbols combined (for pages that show all subjects, e.g. home)
const allSymbols = Object.values(subjectSymbols).flat();

const COLORS = [
  'rgba(255, 255, 255, 0.42)',
  'rgba(255, 255, 255, 0.34)',
  'rgba(255, 255, 255, 0.28)',
  'rgba(245, 232, 255, 0.38)',
  'rgba(255, 255, 255, 0.50)',
];

// ── Singleton animation manager ──────────────────────────────────────
// One rAF loop for ALL FloatingSymbols instances on the page.
// Prevents the home page from running 10+ separate animation loops.

type Instance = {
  symbols: SymbolData[];
  container: HTMLDivElement;
  fixed: boolean;
  mouse: { x: number; y: number };
};

class SymbolAnimationManager {
  private instances: Set<Instance> = new Set();
  private rafId: number = 0;
  private running = false;
  private globalMouse = { x: -9999, y: -9999 };
  private _cleanup: (() => void) | null = null;

  add(instance: Instance) {
    this.instances.add(instance);
    this.start();
  }

  remove(instance: Instance) {
    this.instances.delete(instance);
    if (this.instances.size === 0) {
      this.stop();
    }
  }

  private start() {
    if (this.running) return;
    this.running = true;

    const handleMouseMove = (e: MouseEvent) => {
      this.globalMouse = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      this.globalMouse = { x: -9999, y: -9999 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      for (const inst of this.instances) {
        const { container, symbols, fixed, mouse } = inst;
        const w = fixed ? window.innerWidth : container.offsetWidth;
        const h = fixed ? window.innerHeight : container.offsetHeight;

        const rect = container.getBoundingClientRect();
        mouse.x = this.globalMouse.x - rect.left;
        mouse.y = this.globalMouse.y - rect.top;

        const mouseRadius = 100;

        for (const sym of symbols) {
          const dx = sym.x - mouse.x;
          const dy = sym.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius && dist > 0) {
            const force = (mouseRadius - dist) / mouseRadius;
            sym.vx += (dx / dist) * force * 0.15;
            sym.vy += (dy / dist) * force * 0.15;
          }

          sym.vx += (sym.baseVx - sym.vx) * 0.02;
          sym.vy += (sym.baseVy - sym.vy) * 0.02;

          sym.x += sym.vx;
          sym.y += sym.vy;

          if (sym.x < -50) sym.x = w + 50;
          if (sym.x > w + 50) sym.x = -50;
          if (sym.y < -50) sym.y = h + 50;
          if (sym.y > h + 50) sym.y = -50;

          sym.rotation += sym.rotationSpeed;

          if (sym.el) {
            sym.el.style.transform = `translate(${sym.x}px, ${sym.y}px) rotate(${sym.rotation}deg)`;
          }
        }
      }

      this.rafId = requestAnimationFrame(animate);
    };

    this.rafId = requestAnimationFrame(animate);

    this._cleanup = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (this.rafId) cancelAnimationFrame(this.rafId);
    };
  }

  private stop() {
    this.running = false;
    if (this._cleanup) {
      this._cleanup();
      this._cleanup = null;
    }
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}

let manager: SymbolAnimationManager | null = null;
function getManager(): SymbolAnimationManager {
  if (!manager) manager = new SymbolAnimationManager();
  return manager;
}

export function FloatingSymbols({
  fixed = false,
  density = 'default',
  subject,
}: {
  fixed?: boolean;
  density?: 'default' | 'sparse';
  subject?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const symbolsRef = useRef<SymbolData[]>([]);
  const instanceRef = useRef<Instance | null>(null);

  const pool = subject && subjectSymbols[subject] ? subjectSymbols[subject] : allSymbols;

  const initSymbols = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const w = fixed ? window.innerWidth : container.offsetWidth;
    const h = fixed ? window.innerHeight : container.offsetHeight;
    const isMobile = w < 768;
    const count = density === 'sparse'
      ? (isMobile
        ? Math.min(12, Math.max(6, Math.floor((w * h) / 30000)))
        : Math.min(20, Math.max(10, Math.floor((w * h) / 20000))))
      : (isMobile
        ? Math.min(25, Math.max(12, Math.floor((w * h) / 18000)))
        : Math.min(45, Math.max(20, Math.floor((w * h) / 12000))));

    container.innerHTML = '';

    symbolsRef.current = Array.from({ length: count }, (_, i) => {
      const span = document.createElement('span');
      const color = COLORS[i % COLORS.length];
      const size = 18 + Math.random() * 36;
      const opacity = 0.30 + Math.random() * 0.30;
      const rotation = Math.random() * 360;

      span.className = 'floating-symbol';
      span.style.position = 'absolute';
      span.style.fontSize = `${size}px`;
      span.style.setProperty('--symbol-opacity', String(opacity));
      span.style.setProperty('--symbol-start-opacity', String(opacity * 0.55));
      span.style.animationDelay = `${Math.min(i * 12, 720)}ms`;
      span.style.color = color;
      span.style.fontFamily = 'serif';
      span.style.fontWeight = '400';
      span.style.whiteSpace = 'nowrap';
      span.style.userSelect = 'none';
      span.style.willChange = 'transform';
      span.textContent = pool[Math.floor(Math.random() * pool.length)];
      container.appendChild(span);

      const vx = (Math.random() - 0.5) * 0.3;
      const vy = (Math.random() - 0.5) * 0.3;

      return {
        id: i,
        char: span.textContent || '',
        x: Math.random() * w,
        y: Math.random() * h,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        size,
        opacity,
        rotation,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        color,
        el: span,
      };
    });

    if (instanceRef.current) {
      instanceRef.current.symbols = symbolsRef.current;
    }
  }, [pool, fixed, density]);

  useEffect(() => {
    initSymbols();

    const handleResize = () => initSymbols();
    window.addEventListener('resize', handleResize);

    const container = containerRef.current;
    if (container) {
      const inst: Instance = {
        symbols: symbolsRef.current,
        container,
        fixed,
        mouse: { x: -9999, y: -9999 },
      };
      instanceRef.current = inst;
      getManager().add(inst);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (instanceRef.current) {
        getManager().remove(instanceRef.current);
        instanceRef.current = null;
      }
    };
  }, [initSymbols, fixed]);

  return (
    <div
      ref={containerRef}
      className="floating-symbols-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
