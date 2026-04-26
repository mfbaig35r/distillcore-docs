/**
 * Zustand store for pipeline state with stage grouping
 */

import { create } from 'zustand';
import type {
  ConnectionStatus,
  PipelineRunState,
  AgentStage,
  AgentName,
  PipelineResult,
  ServerMessage,
} from './types';

interface AgentStore {
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
  apiUrl: string;
  apiKey: string;
  setApiUrl: (url: string) => void;
  setApiKey: (key: string) => void;
  runs: Map<string, PipelineRunState>;
  startRun: (id: string, source: string) => void;
  handleAgentEvent: (id: string, msg: ServerMessage & { type: 'agent_event' }) => void;
  setResult: (id: string, output: PipelineResult) => void;
  setRunError: (id: string, message: string) => void;
  clearRuns: () => void;
}

function findOrCreateStage(stages: AgentStage[], agentName: AgentName): [AgentStage[], AgentStage] {
  const existing = stages.find(s => s.agent === agentName);
  if (existing) return [stages, existing];
  const stage: AgentStage = {
    agent: agentName,
    status: 'pending',
    steps: [],
  };
  return [[...stages, stage], stage];
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  connectionStatus: 'disconnected',
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  apiUrl: 'ws://127.0.0.1:8000/ws/agent',
  apiKey: '',
  setApiUrl: (url) => set({ apiUrl: url }),
  setApiKey: (key) => set({ apiKey: key }),
  runs: new Map(),

  startRun: (id, source) => {
    const runs = new Map(get().runs);
    runs.set(id, {
      id,
      source,
      status: 'pending',
      stages: [],
      startedAt: Date.now(),
    });
    set({ runs });
  },

  handleAgentEvent: (id, msg) => {
    const runs = new Map(get().runs);
    const run = runs.get(id);
    if (!run) return;

    const { event } = msg;
    const agentName = event.data.agent;
    const now = event.timestamp || Date.now();

    const updated = { ...run };

    switch (event.event_type) {
      case 'started': {
        if (agentName) {
          const [stages, stage] = findOrCreateStage(updated.stages, agentName);
          stage.status = 'running';
          stage.startedAt = now;
          updated.stages = stages.map(s => s.agent === agentName ? { ...stage } : s);
        }
        updated.status = 'running';
        break;
      }
      case 'tool_call': {
        if (agentName) {
          const [stages] = findOrCreateStage(updated.stages, agentName);
          updated.stages = stages.map(s => {
            if (s.agent !== agentName) return s;
            return {
              ...s,
              steps: [...s.steps, {
                callId: event.data.call_id || `${event.data.tool_name}-${now}`,
                toolName: event.data.tool_name || 'unknown',
                args: event.data.args || {},
                status: 'calling' as const,
                startedAt: now,
              }],
            };
          });
        }
        break;
      }
      case 'tool_result': {
        if (agentName) {
          updated.stages = updated.stages.map(s => {
            if (s.agent !== agentName) return s;
            return {
              ...s,
              steps: s.steps.map(step => {
                if (step.callId === event.data.call_id ||
                    (step.toolName === event.data.tool_name && step.status === 'calling')) {
                  return { ...step, status: 'completed' as const, result: event.data.content, completedAt: now };
                }
                return step;
              }),
            };
          });
        }
        break;
      }
      case 'completed': {
        if (agentName) {
          updated.stages = updated.stages.map(s => {
            if (s.agent !== agentName) return s;
            return { ...s, status: 'completed', completedAt: now, output: event.data.output };
          });
        } else {
          updated.status = 'completed';
          updated.completedAt = now;
        }
        break;
      }
      case 'error': {
        if (agentName) {
          updated.stages = updated.stages.map(s => {
            if (s.agent !== agentName) return s;
            return { ...s, status: 'error' };
          });
        }
        updated.status = 'error';
        updated.errorMessage = event.data.error || 'Unknown error';
        break;
      }
    }

    runs.set(id, updated);
    set({ runs });
  },

  setResult: (id, output) => {
    const runs = new Map(get().runs);
    const run = runs.get(id);
    if (!run) return;
    runs.set(id, { ...run, status: 'completed', completedAt: Date.now(), result: output });
    set({ runs });
  },

  setRunError: (id, message) => {
    const runs = new Map(get().runs);
    const run = runs.get(id);
    if (!run) return;
    runs.set(id, { ...run, status: 'error', errorMessage: message });
    set({ runs });
  },

  clearRuns: () => set({ runs: new Map() }),
}));
