'use client';

import { Fragment } from 'react';
import { Loader2 } from 'lucide-react';
import { useLiveDuration } from '@/lib/agent/use-live-duration';
import { AgentStageNode } from './agent-stage-node';
import { DagEdge, deriveStageEdgeState } from './dag-edge';
import { ResultNode } from './result-node';
import type { PipelineRunState } from '@/lib/agent/types';

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    running: 'bg-blue-500/20 text-blue-300',
    completed: 'bg-emerald-500/20 text-emerald-300',
    error: 'bg-red-500/20 text-red-300',
    pending: 'bg-neutral-500/20 text-neutral-400',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full ${colors[status] || colors.pending}`}>
      {status}
    </span>
  );
}

export function DagCanvas({ run }: { run: PipelineRunState }) {
  const elapsed = useLiveDuration(run.startedAt, run.completedAt);
  const hasStages = run.stages.length > 0;
  const isRunning = run.status === 'running';
  const isCompleted = run.status === 'completed';

  return (
    <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden">
      {/* Dotted background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.06) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-4 py-3 border-b border-neutral-800">
        <span className="text-sm text-neutral-300 truncate max-w-[200px]">{run.source}</span>
        <StatusBadge status={run.status} />
        {elapsed && <span className="text-xs text-neutral-500 ml-auto tabular-nums">{elapsed}</span>}
      </div>

      {/* Error */}
      {run.errorMessage && (
        <div className="relative z-10 px-4 py-2 text-xs text-red-400 bg-red-500/5 border-b border-red-500/20">
          {run.errorMessage}
        </div>
      )}

      {/* DAG */}
      <div className="relative z-10 p-4 overflow-x-auto">
        <div className="flex items-start gap-0 min-w-max">
          {hasStages ? (
            <>
              {run.stages.map((stage, i) => (
                <Fragment key={stage.agent}>
                  {i > 0 && (
                    <DagEdge state={deriveStageEdgeState(run.stages[i - 1].status, stage.status)} />
                  )}
                  <AgentStageNode stage={stage} index={i} />
                </Fragment>
              ))}
              {isCompleted && run.result && (
                <>
                  <DagEdge state="active" />
                  <ResultNode result={run.result} />
                </>
              )}
            </>
          ) : isRunning ? (
            <div className="flex items-center gap-2 text-sm text-neutral-500 py-8 px-4">
              <Loader2 size={16} className="animate-spin" />
              Starting pipeline...
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
