'use client';

import type { AgentStageStatus } from '@/lib/agent/types';

export type EdgeState = 'inactive' | 'activating' | 'active';

export function deriveStageEdgeState(
  leftStatus: AgentStageStatus,
  rightStatus: AgentStageStatus,
): EdgeState {
  if (leftStatus === 'completed' && (rightStatus === 'completed' || rightStatus === 'error')) return 'active';
  if (leftStatus === 'completed' && rightStatus === 'running') return 'activating';
  return 'inactive';
}

export function DagEdge({ state }: { state: EdgeState }) {
  return (
    <div className="flex items-center self-start w-3 md:w-4 shrink-0 mt-[26px]">
      <div className="relative w-full h-px">
        {state === 'inactive' && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #525252 0px, #525252 3px, transparent 3px, transparent 7px)',
            }}
          />
        )}
        {state === 'activating' && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-neutral-500 to-neutral-400 origin-left animate-[scaleX_0.5s_ease-out_forwards]"
            style={{ transform: 'scaleX(0)', animation: 'scaleX 0.5s ease-out forwards' }}
          />
        )}
        {state === 'active' && (
          <>
            <div className="absolute inset-0 bg-neutral-500" />
            <span
              className="absolute top-[-1px] w-1 h-1 rounded-full bg-purple-400"
              style={{ animation: 'dagParticleFlow 2s linear infinite' }}
            />
          </>
        )}
      </div>
    </div>
  );
}
