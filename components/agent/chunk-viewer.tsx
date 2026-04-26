'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Layers, Tag, BarChart3 } from 'lucide-react';
import type { ChunkInfo } from '@/lib/agent/types';

const RELEVANCE_COLORS: Record<string, string> = {
  high: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  medium: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  low: 'bg-neutral-500/15 text-neutral-400 border-neutral-500/25',
};

function ChunkCard({ chunk }: { chunk: ChunkInfo }) {
  const [expanded, setExpanded] = useState(false);
  const relevanceClass = RELEVANCE_COLORS[chunk.relevance || 'low'] || RELEVANCE_COLORS.low;

  return (
    <motion.div
      className="bg-neutral-900/60 border border-neutral-800 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: chunk.chunk_index * 0.03 }}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-neutral-800/40 transition-colors"
      >
        <span className="text-[10px] text-neutral-600 font-mono w-5 text-right shrink-0">
          {chunk.chunk_index}
        </span>

        <span className="text-xs text-neutral-300 truncate flex-1">
          {chunk.topic || chunk.section_heading || chunk.text.slice(0, 60)}
        </span>

        {chunk.section_type && (
          <span className="text-[10px] text-neutral-600 shrink-0">
            {chunk.section_type}
          </span>
        )}

        {chunk.relevance && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${relevanceClass}`}>
            {chunk.relevance}
          </span>
        )}

        <span className="text-[10px] text-neutral-600 tabular-nums shrink-0">
          ~{chunk.token_estimate}t
        </span>

        <ChevronDown
          size={12}
          className={`text-neutral-600 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2 border-t border-neutral-800/50">
              {/* Key concepts */}
              {chunk.key_concepts && chunk.key_concepts.length > 0 && (
                <div className="flex items-start gap-2 pt-2">
                  <Tag size={10} className="text-neutral-600 mt-0.5 shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {chunk.key_concepts.map((concept) => (
                      <span
                        key={concept}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Chunk text */}
              <div className="text-xs text-neutral-400 leading-relaxed bg-neutral-950/50 rounded p-2 max-h-[200px] overflow-y-auto font-mono whitespace-pre-wrap">
                {chunk.text}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ChunkViewer({ chunks }: { chunks: ChunkInfo[] }) {
  const [collapsed, setCollapsed] = useState(false);

  const highCount = chunks.filter((c) => c.relevance === 'high').length;
  const mediumCount = chunks.filter((c) => c.relevance === 'medium').length;
  const lowCount = chunks.filter((c) => c.relevance === 'low').length;
  const totalTokens = chunks.reduce((sum, c) => sum + c.token_estimate, 0);

  return (
    <motion.div
      className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-3 px-4 py-3 border-b border-neutral-800 hover:bg-neutral-900/50 transition-colors"
      >
        <Layers size={14} className="text-purple-400" />
        <span className="text-sm font-medium text-neutral-200">
          Chunks
        </span>
        <span className="text-xs text-neutral-500">
          {chunks.length} chunks
        </span>
        <span className="text-[10px] text-neutral-600">
          ~{totalTokens} tokens
        </span>

        {/* Relevance summary */}
        <div className="flex items-center gap-2 ml-auto">
          {highCount > 0 && (
            <span className="text-[10px] text-emerald-400">{highCount} high</span>
          )}
          {mediumCount > 0 && (
            <span className="text-[10px] text-amber-400">{mediumCount} med</span>
          )}
          {lowCount > 0 && (
            <span className="text-[10px] text-neutral-500">{lowCount} low</span>
          )}
          <ChevronDown
            size={14}
            className={`text-neutral-600 transition-transform ${collapsed ? '' : 'rotate-180'}`}
          />
        </div>
      </button>

      {/* Chunk list */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-1 max-h-[500px] overflow-y-auto">
              {chunks.map((chunk) => (
                <ChunkCard key={chunk.chunk_index} chunk={chunk} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
