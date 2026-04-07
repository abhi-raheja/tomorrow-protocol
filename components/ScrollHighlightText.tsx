'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface ScrollHighlightTextProps {
  text: string;
  style?: React.CSSProperties;
  className?: string;
}

export function ScrollHighlightText({ text, style, className }: ScrollHighlightTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Track progress across the full element height for a slower reveal.
    // Start when the element's top enters the viewport bottom,
    // finish when the element's bottom reaches the viewport center.
    const start = windowHeight;
    const end = windowHeight * 0.3 - rect.height;
    const rawProgress = (start - rect.top) / (start - end);
    setProgress(Math.max(0, Math.min(1, rawProgress)));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const words = text.split(' ');

  return (
    <p ref={containerRef} style={style} className={className}>
      {words.map((word, i) => {
        // Each word's highlight window starts exactly at its position in the sequence.
        // transitionWidth is narrow (1.5 word-slots) so the lit "wave" moves
        // sharply through the text word-by-word as the user scrolls.
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
