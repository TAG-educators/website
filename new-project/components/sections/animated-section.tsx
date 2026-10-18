'use client';

import { motion, type Variants } from 'framer-motion';
import { type ReactNode, useState, useEffect } from 'react';

type AnimationType = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale';

const variants: Record<AnimationType, Variants> = {
  'fade-up': {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
  },
};

type AnimatedSectionProps = {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
  once?: boolean;
};

export function AnimatedSection({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.75,
  className,
  as = 'div',
  once = true,
}: AnimatedSectionProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const MotionTag = motion[as] as typeof motion.div;

  if (prefersReducedMotion) {
    const Tag = as as 'div';
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={variants[animation]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1, margin: '0px 0px -40px 0px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerGroup({
  children,
  className,
  stagger = 0.1,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  animation = 'fade-up',
}: {
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={variants[animation]}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
