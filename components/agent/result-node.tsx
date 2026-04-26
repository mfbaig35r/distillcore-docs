'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import type { PipelineResult } from '@/lib/agent/types';
import { STAGE_META } from '@/lib/agent/tool-meta';

export function ResultNode({ result }: { result: PipelineResult }) {
  return (
    <motion.div
      className="bg-neutral-900/80 border border-emerald-500/30 rounded-xl p-4 min-w-[260px] max-w-[320px] flex-shrink-0 snap-center space-y-3"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <CheckCircle size={16} className="text-emerald-400" />
        <span className="text-sm font-semibold text-white">Result</span>
      </div>

      {/* Triage */}
      <ResultSection agent="triage">
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge label="Preset" value={result.triage.preset} />
          <Badge label="OCR" value={result.triage.needs_ocr ? 'yes' : 'no'} />
          <Badge label="Tokens" value={String(result.triage.target_tokens)} />
        </div>
        <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">{result.triage.reasoning}</p>
      </ResultSection>

      {/* Processing */}
      <ResultSection agent="processing">
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge label="Type" value={result.processing.document_type} />
          <Badge label="Chunks" value={String(result.processing.chunk_count)} />
          <Badge label="Coverage" value={`${(result.processing.end_to_end_coverage * 100).toFixed(0)}%`} />
        </div>
        <p className="text-[10px] text-neutral-500 mt-1 font-mono">{result.processing.document_id}</p>
      </ResultSection>

      {/* QA */}
      <ResultSection agent="qa">
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge
            label="Verified"
            value={result.qa.verified ? 'yes' : 'no'}
            color={result.qa.verified ? 'text-emerald-400' : 'text-red-400'}
          />
          <Badge label="Coverage" value={`${(result.qa.structuring_coverage * 100).toFixed(0)}/${(result.qa.chunking_coverage * 100).toFixed(0)}/${(result.qa.end_to_end_coverage * 100).toFixed(0)}%`} />
        </div>
        {result.qa.recommendations.length > 0 && (
          <p className="text-[10px] text-amber-400 mt-1">{result.qa.recommendations.length} recommendations</p>
        )}
      </ResultSection>
    </motion.div>
  );
}

function ResultSection({ agent, children }: { agent: string; children: React.ReactNode }) {
  const meta = STAGE_META[agent];
  return (
    <div className={`rounded-lg p-2 ${meta?.bgColor || 'bg-neutral-800/50'} border ${meta?.borderColor || 'border-neutral-700'}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meta?.color || '#525252' }} />
        <span className="text-[11px] font-medium text-neutral-300">{meta?.label || agent}</span>
      </div>
      {children}
    </div>
  );
}

function Badge({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-neutral-800 rounded px-1.5 py-0.5">
      <span className="text-neutral-500">{label}:</span>
      <span className={color || 'text-neutral-200'}>{value}</span>
    </span>
  );
}
