/**
 * Types for distillcore Agent Architecture Graph
 */

export type AgentId = 'triage' | 'processing' | 'qa' | 'research';

export type ApiId =
  | 'extract'
  | 'process_document_async'
  | 'list_presets'
  | 'compute_coverage'
  | 'store_save'
  | 'store_search'
  | 'store_get_document'
  | 'store_stats';

export interface AgentInfo {
  id: AgentId;
  label: string;
  description: string;
  model: string;
  toolCount: number;
  color: string;
}

export interface ToolInfo {
  id: string;
  label: string;
  description: string;
  agent: AgentId;
  api: ApiId | null;
}

export interface ApiInfo {
  id: ApiId;
  label: string;
  description: string;
  color: string;
}

export const AGENT_COLORS: Record<AgentId, string> = {
  triage: '#8b5cf6',
  processing: '#3b82f6',
  qa: '#10b981',
  research: '#f59e0b',
};

export const API_COLORS: Record<ApiId, string> = {
  extract: '#059669',
  process_document_async: '#2563eb',
  list_presets: '#7c3aed',
  compute_coverage: '#0891b2',
  store_save: '#dc2626',
  store_search: '#d97706',
  store_get_document: '#6366f1',
  store_stats: '#0d9488',
};
