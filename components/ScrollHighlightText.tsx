'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollHighlightTextProps {
  text: string;
  className?: string;
}

export function ScrollHighlightText({ text, className }: ScrollHighlightTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = containerRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const start = window.innerHeight;
      const end = window.innerHeight * 0.3 - rect.height;
      const nextProgress = (start - rect.top) / (start - end);

      setProgress(Math.max(0, Math.min(1, nextProgress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const words = text.split(' ');

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, i) => {
        const transitionWidth = 1.5 / words.length;
        const wordStart = i / words.length;
        const wordAlpha = (progress - wordStart) / transitionWidth;
        const opacity = Math.max(0.15, Math.min(1, wordAlpha));

        return (
          <span
            key={i}
            style={{
              color: `rgba(255,255,255,${opacity})`,
              transition: 'color 0.08s linear',
            }}
          >
            {word}{i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </p>
  );
}
