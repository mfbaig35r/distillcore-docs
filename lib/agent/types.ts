/**
 * Wire protocol types for distillcore agent pipeline visualization
 */

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type ToolStepStatus = 'calling' | 'completed' | 'error';

export type AgentStageStatus = 'pending' | 'running' | 'completed' | 'error';

export type PipelineRunStatus = 'pending' | 'running' | 'completed' | 'error';

export type AgentName = 'triage' | 'processing' | 'qa' | 'research';

// Individual tool call within a stage
export interface ToolStep {
  callId: string;
  toolName: string;
  args: Record<string, unknown>;
  status: ToolStepStatus;
  result?: string;
  startedAt: number;
  completedAt?: number;
}

// Agent stage containing its tool calls
export interface AgentStage {
  agent: AgentName;
  status: AgentStageStatus;
  steps: ToolStep[];
  startedAt?: number;
  completedAt?: number;
  output?: Record<string, unknown>;
}

// Full pipeline run
export interface PipelineRunState {
  id: string;
  source: string;
  status: PipelineRunStatus;
  stages: AgentStage[];
  startedAt: number;
  completedAt?: number;
  result?: PipelineResult;
  errorMessage?: string;
}

// A processed chunk
export interface ChunkInfo {
  chunk_index: number;
  text: string;
  token_estimate: number;
  section_type?: string;
  section_heading?: string;
  topic?: string;
  key_concepts?: string[];
  relevance?: string;
}

// Final pipeline result
export interface PipelineResult {
  triage: {
    preset: string;
    needs_ocr: boolean;
    target_tokens: number;
    reasoning: string;
  };
  processing: {
    document_type: string;
    chunk_count: number;
    end_to_end_coverage: number;
    document_id: string;
  };
  qa: {
    verified: boolean;
    structuring_coverage: number;
    chunking_coverage: number;
    end_to_end_coverage: number;
    recommendations: string[];
  };
  research?: Record<string, unknown>;
  chunks?: ChunkInfo[];
}

// Agent event from server
export interface AgentEvent {
  event_type: 'started' | 'tool_call' | 'tool_result' | 'completed' | 'error';
  data: {
    agent?: AgentName;
    tool_name?: string;
    call_id?: string;
    args?: Record<string, unknown>;
    content?: string;
    output?: Record<string, unknown>;
    error?: string;
  };
  timestamp: number;
}

// Client → Server messages
export type ClientMessage =
  | { type: 'auth'; api_key: string }
  | { type: 'process'; id: string; source: string }
  | { type: 'process_text'; id: string; text: string }
  | { type: 'cancel'; id: string }
  | { type: 'ping' };

// Server → Client messages
export type ServerMessage =
  | { type: 'auth_ok' }
  | { type: 'auth_failed'; error: string }
  | { type: 'agent_event'; id: string; event: AgentEvent }
  | { type: 'result'; id: string; output: PipelineResult }
  | { type: 'error'; id: string; error: { type: string; message: string } }
  | { type: 'pong' }
  | { type: 'cancelled'; id: string };
