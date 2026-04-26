'use client';

import type { ConnectionStatus } from '@/lib/agent/types';

const STATUS_CONFIG: Record<ConnectionStatus, { color: string; label: string; pulse: boolean }> = {
  connected: { color: 'bg-emerald-400', label: 'Connected', pulse: false },
  connecting: { color: 'bg-amber-400', label: 'Connecting', pulse: true },
  disconnected: { color: 'bg-neutral-500', label: 'Disconnected', pulse: false },
  error: { color: 'bg-red-400', label: 'Error', pulse: false },
};

export function ConnectionStatusDot({ status }: { status: ConnectionStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        {cfg.pulse && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${cfg.color} opacity-75 animate-ping`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.color}`} />
      </span>
      <span className="text-xs text-neutral-400">{cfg.label}</span>
    </span>
  );
}
