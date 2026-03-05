'use client';

import { useWaitlist } from '@/components/WaitlistProvider';

interface WaitlistButtonProps {
  className?: string;
  children: React.ReactNode;
}

export function WaitlistButton({ className, children }: WaitlistButtonProps) {
  const { open } = useWaitlist();
  return (
    <button onClick={open} className={className}>
      {children}
    </button>
  );
}
