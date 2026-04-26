'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useLiveDuration } from '@/lib/agent/use-live-duration';
import { STAGE_META } from '@/lib/agent/tool-meta';
import { ToolNode } from './tool-node';
import type { AgentStage } from '@/lib/agent/types';

export function AgentStageNode({ stage, index }: { stage: AgentStage; index: number }) {
  const duration = useLiveDuration(stage.startedAt, stage.completedAt);
  const meta = STAGE_META[stage.agent] || STAGE_META.triage;

  const isRunning = stage.status === 'running';
  const isCompleted = stage.status === 'completed';
  const isError = stage.status === 'error';
  const isPending = stage.status === 'pending';

  const borderColor = isRunning
    ? meta.borderColor.replace('/30', '/60')
    : isError
      ? 'border-red-500/40'
      : isPending
        ? 'border-neutral-800'
        : meta.borderColor;

  return (
    <motion.div
      className={`bg-neutral-900/80 border ${borderColor} rounded-xl p-4 min-w-[220px] max-w-[280px] flex-shrink-0 snap-center`}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: isPending ? '#525252' : meta.color }}
        />
        <span className="text-sm font-semibold text-white">{meta.label}</span>
        {isRunning && <Loader2 size={12} className="text-neutral-400 animate-spin" />}
        {isCompleted && <span className="text-[10px] text-emerald-400">done</span>}
        {isError && <span className="text-[10px] text-red-400">error</span>}
        {duration && (
          <span className="text-[10px] text-neutral-500 ml-auto tabular-nums">{duration}</span>
        )}
      </div>

      {/* Tool steps */}
      <div className="space-y-2">
        {stage.steps.map((step) => (
          <ToolNode key={step.callId} step={step} />
        ))}
        {isRunning && stage.steps.length === 0 && (
          <div className="flex items-center gap-2 text-xs text-neutral-500 py-2">
            <Loader2 size={12} className="animate-spin" />
            Thinking...
          </div>
        )}
        {isPending && (
          <div className="text-xs text-neutral-600 py-2">Waiting...</div>
        )}
      </div>
    </motion.div>
  );
}
