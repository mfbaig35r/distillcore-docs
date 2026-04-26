'use client';

import { useState } from 'react';
import { Loader2, Check, AlertTriangle, ChevronDown } from 'lucide-react';
import { useLiveDuration } from '@/lib/agent/use-live-duration';
import { getToolMeta } from '@/lib/agent/tool-meta';
import type { ToolStep } from '@/lib/agent/types';

export function ToolNode({ step }: { step: ToolStep }) {
  const [expanded, setExpanded] = useState(false);
  const duration = useLiveDuration(step.startedAt, step.completedAt);
  const meta = getToolMeta(step.toolName);
  const Icon = meta.icon;

  const isCalling = step.status === 'calling';
  const isCompleted = step.status === 'completed';
  const isError = step.status === 'error';
  const canToggle = isCompleted || isError;

  let StatusIcon = Icon;
  let statusIconClass = meta.textColor;
  if (isCalling) { StatusIcon = Loader2; statusIconClass = `${meta.textColor} animate-spin`; }
  else if (isCompleted) { StatusIcon = Check; statusIconClass = 'text-emerald-400'; }
  else if (isError) { StatusIcon = AlertTriangle; statusIconClass = 'text-red-400'; }

  const borderClass = isCalling
    ? `${meta.activeBorder} ${meta.activeGlow}`
    : isError
      ? 'border-red-500/30'
      : meta.completedBorder;

  return (
    <div className={`bg-neutral-900 border ${borderClass} rounded-lg p-3 min-w-[180px] transition-all`}>
      <button
        className="flex items-center gap-2 w-full text-left"
        onClick={() => canToggle && setExpanded(!expanded)}
        disabled={!canToggle}
      >
        <div className={`${meta.iconBg} rounded p-1`}>
          <StatusIcon size={14} className={statusIconClass} />
        </div>
        <span className={`text-xs font-medium ${meta.textColor}`}>{meta.label}</span>
        {duration && (
          <span className="text-[10px] text-neutral-500 ml-auto tabular-nums">{duration}</span>
        )}
        {canToggle && (
          <ChevronDown size={12} className={`text-neutral-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        )}
      </button>

      {expanded && step.result && (
        <div className="mt-2 text-[11px] text-neutral-400 font-mono bg-neutral-950 rounded p-2 max-h-32 overflow-y-auto break-all">
          {step.result.length > 200 ? step.result.slice(0, 200) + '...' : step.result}
        </div>
      )}
    </div>
  );
}
