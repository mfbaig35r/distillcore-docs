/**
 * React hook for agent pipeline WebSocket connection
 */

import { useRef, useEffect } from 'react';
import { useAgentStore } from './store';
import { AgentWebSocket } from './websocket';

let msgCounter = 0;
function nextId(): string {
  return `msg-${++msgCounter}-${Date.now().toString(36)}`;
}

export function useAgent() {
  const wsRef = useRef<AgentWebSocket | null>(null);
  const store = useAgentStore();

  useEffect(() => {
    return () => {
      wsRef.current?.disconnect();
    };
  }, []);

  const connect = (url: string, apiKey: string) => {
    if (!wsRef.current) {
      wsRef.current = new AgentWebSocket({
        setConnectionStatus: store.setConnectionStatus,
        handleAgentEvent: store.handleAgentEvent,
        setResult: store.setResult,
        setRunError: store.setRunError,
      });
    }
    wsRef.current.connect(url, apiKey);
  };

  const disconnect = () => {
    wsRef.current?.disconnect();
  };

  const processFile = (source: string): string => {
    const id = nextId();
    store.startRun(id, source);
    wsRef.current?.send({ type: 'process', id, source });
    return id;
  };

  const processText = (text: string): string => {
    const id = nextId();
    store.startRun(id, text.slice(0, 50) + (text.length > 50 ? '...' : ''));
    wsRef.current?.send({ type: 'process_text', id, text });
    return id;
  };

  return {
    connectionStatus: store.connectionStatus,
    runs: store.runs,
    connect,
    disconnect,
    processFile,
    processText,
  };
}
