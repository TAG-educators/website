'use client';

import { motion, useReducedMotion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { AnimatedSection } from './animated-section';

type IconBlockProps = {
  icon: string;
  title: string;
  description: string;
  className?: string;
  variant?: 'default' | 'dark' | 'glass';
};

export function IconBlock({ icon, title, description, className, variant = 'default' }: IconBlockProps) {
  const prefersReducedMotion = useReducedMotion();
  const IconComponent = Icons[icon as keyof typeof Icons] as Icons.LucideIcon | undefined;
  const FallbackIcon = Icons.Sparkles;

  const variantStyles = {
    default: 'bg-white border-border',
    dark: 'bg-white border-border',
    glass: 'glass border-white/12',
  };

  const iconBgStyles = {
    default: 'bg-ocean/10 text-ocean',
    dark: 'bg-ocean/10 text-ocean',
    glass: 'bg-white/15 text-white',
  };

  const titleStyles = {
    default: 'text-foreground',
    dark: 'text-foreground',
    glass: 'text-white',
  };

  const descStyles = {
    default: 'text-muted-foreground',
    dark: 'text-muted-foreground',
    glass: 'text-white/70',
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`group relative rounded-2xl border p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 ${variantStyles[variant]} ${className ?? ''}`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${iconBgStyles[variant]}`}>
        {IconComponent ? (
          <IconComponent className="h-6 w-6" strokeWidth={1.8} />
        ) : (
          <FallbackIcon className="h-6 w-6" strokeWidth={1.8} />
        )}
      </div>
      <h3 className={`mt-5 font-display text-lg font-bold ${titleStyles[variant]}`}>{title}</h3>
      <p className={`mt-2 text-sm leading-relaxed ${descStyles[variant]}`}>{description}</p>
      </div>
    </motion.div>
  );
}

export { AnimatedSection };
