'use client';

import { Check, Plus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/components/providers/cart-provider';
import { advanceVoyageStage } from '@/components/sections/voyage-tracker';
import { cn } from '@/lib/utils';

type RegisterButtonProps = {
  slug: string;
  name: string;
  levels: string[];
  variant?: 'primary' | 'secondary';
  className?: string;
};

export function RegisterButton({
  slug,
  name,
  levels,
  variant = 'primary',
  className,
}: RegisterButtonProps) {
  const { addItem, hasItem } = useCart();
  const [selectedLevel, setSelectedLevel] = useState('');
  const [justAdded, setJustAdded] = useState(false);
  const itemKey = `${slug}-${selectedLevel}`;
  const alreadyAdded = hasItem(itemKey) || (justAdded && selectedLevel !== '');

  const handleAdd = () => {
    if (alreadyAdded || !selectedLevel) return;
    addItem({ slug, name, levels, selectedLevel });
    setJustAdded(true);
    advanceVoyageStage(3);
  };

  const baseClass =
    'inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-base font-semibold transition-all active:scale-95';

  const variantClass =
    variant === 'primary'
      ? 'text-white shadow-[0_4px_16px_-4px_rgba(107,47,120,0.5)] hover:brightness-110'
      : 'border border-border bg-white text-foreground hover:border-ocean hover:text-ocean';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Level selector */}
      <div className="flex flex-wrap gap-2">
        {levels.map((level) => {
          const isSelected = selectedLevel === level && !alreadyAdded;
          const isAddedLevel = alreadyAdded && selectedLevel === level;
          return (
            <button
              key={level}
              onClick={() => { if (!alreadyAdded) setSelectedLevel(level); }}
              className={cn(
                'inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-semibold transition-all',
                isSelected || isAddedLevel
                  ? 'text-white'
                  : 'border-white/20 bg-white/5 text-white/70 hover:border-[#b472cc]/50 hover:text-white'
              )}
              style={
                isSelected || isAddedLevel
                  ? { background: 'linear-gradient(135deg, #6b2f78, #a855c4)', borderColor: 'transparent' }
                  : {}
              }
            >
              {level}
            </button>
          );
        })}
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        disabled={!selectedLevel && !alreadyAdded}
        className={cn(
          baseClass,
          alreadyAdded
            ? 'border border-[#b472cc]/40 text-[#b472cc]'
            : selectedLevel
              ? cn(variantClass, className)
              : 'border border-white/20 bg-white/5 text-white/40 cursor-not-allowed'
        )}
        style={
          alreadyAdded || !selectedLevel
            ? {}
            : { background: 'linear-gradient(135deg, #6b2f78, #a855c4)' }
        }
      >
        {alreadyAdded ? (
          <>
            <Check className="h-5 w-5" />
            Added to Cart
          </>
        ) : selectedLevel ? (
          <>
            <Plus className="h-5 w-5" />
            Add to Registration
          </>
        ) : (
          'Select a class'
        )}
      </button>
    </div>
  );
}
