'use client';

import { useEffect, useRef } from 'react';

interface PaginationTriggerProps {
  onVisible: () => void;
  disabled?: boolean;
}

export default function PaginationTrigger({ onVisible, disabled }: PaginationTriggerProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || disabled) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onVisible();
        }
      });
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [onVisible, disabled]);

  return <div ref={ref} className="h-1 w-full" aria-hidden />;
}
