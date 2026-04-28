/**
 * Demo pipeline replay data — real FinCEN PPSI Fact Sheet processed by distillcore.
 *
 * Source: https://www.fincen.gov/system/files/2026-04/FactSheet-PPSI-program-NPRM.pdf
 * Processed with: distillcore-agents v0.2.0 (distillcore v0.7.0), generic preset, 300 target tokens
 * Result: 14 chunks, 99% structuring, 100% e2e coverage
 */

import type { AgentEvent, ChunkInfo, PipelineResult } from './types';
import fincenChunks from './demo-chunks-fincen.json';

export interface DemoEvent {
  event: AgentEvent;
  delayMs: number;
}

export const DEMO_EVENTS: DemoEvent[] = [
  // Pipeline started
  { delayMs: 0, event: { event_type: 'started', data: {}, timestamp: 0 } },
  // Triage
  { delayMs: 200, event: { event_type: 'started', data: { agent: 'triage' }, timestamp: 0 } },
  { delayMs: 500, event: { event_type: 'tool_call', data: { agent: 'triage', tool_name: 'preview_document', call_id: 'tc-1', args: { source: 'FactSheet-PPSI-program-NPRM.pdf' } }, timestamp: 0 } },
  { delayMs: 1800, event: { event_type: 'tool_result', data: { agent: 'triage', tool_name: 'preview_document', call_id: 'tc-1', content: '{"page_count": 5, "format": "pdf", "avg_chars": 3200}' }, timestamp: 0 } },
  { delayMs: 2100, event: { event_type: 'tool_call', data: { agent: 'triage', tool_name: 'list_available_presets', call_id: 'tc-2', args: {} }, timestamp: 0 } },
  { delayMs: 2400, event: { event_type: 'tool_result', data: { agent: 'triage', tool_name: 'list_available_presets', call_id: 'tc-2', content: '["generic", "legal"]' }, timestamp: 0 } },
  { delayMs: 2800, event: { event_type: 'completed', data: { agent: 'triage', output: { preset: 'generic', needs_ocr: false } }, timestamp: 0 } },
  // Processing
  { delayMs: 3100, event: { event_type: 'started', data: { agent: 'processing' }, timestamp: 0 } },
  { delayMs: 3400, event: { event_type: 'tool_call', data: { agent: 'processing', tool_name: 'process_document', call_id: 'tc-3', args: { source: 'FactSheet-PPSI-program-NPRM.pdf', preset: 'generic' } }, timestamp: 0 } },
  { delayMs: 9500, event: { event_type: 'tool_result', data: { agent: 'processing', tool_name: 'process_document', call_id: 'tc-3', content: '{"chunks": 14, "coverage": 1.00, "sections": 6}' }, timestamp: 0 } },
  { delayMs: 9800, event: { event_type: 'tool_call', data: { agent: 'processing', tool_name: 'save_result', call_id: 'tc-4', args: {} }, timestamp: 0 } },
  { delayMs: 10200, event: { event_type: 'tool_result', data: { agent: 'processing', tool_name: 'save_result', call_id: 'tc-4', content: '{"saved": true, "document_id": "doc-fincen-ppsi-001"}' }, timestamp: 0 } },
  { delayMs: 10500, event: { event_type: 'completed', data: { agent: 'processing', output: { document_type: 'factsheet', chunk_count: 14 } }, timestamp: 0 } },
  // QA
  { delayMs: 10800, event: { event_type: 'started', data: { agent: 'qa' }, timestamp: 0 } },
  { delayMs: 11100, event: { event_type: 'tool_call', data: { agent: 'qa', tool_name: 'check_coverage', call_id: 'tc-5', args: {} }, timestamp: 0 } },
  { delayMs: 11800, event: { event_type: 'tool_result', data: { agent: 'qa', tool_name: 'check_coverage', call_id: 'tc-5', content: '{"end_to_end_coverage": 1.00}' }, timestamp: 0 } },
  { delayMs: 12100, event: { event_type: 'tool_call', data: { agent: 'qa', tool_name: 'check_chunks', call_id: 'tc-6', args: {} }, timestamp: 0 } },
  { delayMs: 12700, event: { event_type: 'tool_result', data: { agent: 'qa', tool_name: 'check_chunks', call_id: 'tc-6', content: '{"empty_chunks": 0, "missing_topics": 0}' }, timestamp: 0 } },
  { delayMs: 13000, event: { event_type: 'completed', data: { agent: 'qa', output: { verified: true } }, timestamp: 0 } },
  // Pipeline completed
  { delayMs: 13300, event: { event_type: 'completed', data: {}, timestamp: 0 } },
];

export const DEMO_RESULT: PipelineResult = {
  triage: {
    preset: 'generic',
    needs_ocr: false,
    target_tokens: 300,
    chunk_strategy: 'paragraph',
    min_tokens: 0,
    reasoning: 'Government fact sheet with structured sections covering proposed regulations. No legal case numbers or court filings detected. Generic preset is appropriate.',
  },
  processing: {
    document_type: 'factsheet',
    chunk_count: 14,
    end_to_end_coverage: 1.0,
    document_id: 'doc-fincen-ppsi-001',
  },
  qa: {
    verified: true,
    structuring_coverage: 0.99,
    chunking_coverage: 1.0,
    end_to_end_coverage: 1.0,
    recommendations: [],
  },
  chunks: fincenChunks as ChunkInfo[],
};
