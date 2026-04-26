import { useState, useEffect } from 'react';

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function useLiveDuration(startedAt?: number, completedAt?: number): string {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!startedAt || completedAt) return;
    const interval = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(interval);
  }, [startedAt, completedAt]);

  if (!startedAt) return '';
  const elapsed = (completedAt || now) - startedAt;
  return formatDuration(elapsed);
}
