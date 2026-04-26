'use client';

import { useState, useCallback, useRef } from 'react';
import { useAgent } from '@/lib/agent/use-agent';
import { useAgentStore } from '@/lib/agent/store';
import { DEMO_EVENTS, DEMO_RESULT } from '@/lib/agent/demo-data';
import { ConfigPanel } from './config-panel';
import { InputPanel } from './input-panel';
import { ChunkViewer } from './chunk-viewer';
import { DagCanvas } from './dag-canvas';

export function AgentWorkspace() {
  const { connectionStatus, runs, connect, disconnect, processFile, processText } = useAgent();
  const store = useAgentStore();
  const [demoMode, setDemoMode] = useState(true);
  const demoTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const isReady = demoMode || connectionStatus === 'connected';

  const handleConnect = () => {
    connect(store.apiUrl, store.apiKey);
  };

  const replayDemo = useCallback((input: string) => {
    // Clear previous demo timers
    demoTimers.current.forEach(clearTimeout);
    demoTimers.current = [];

    const id = `demo-${Date.now()}`;
    const baseTime = Date.now();
    const sourceLabel = input.trim() || 'FactSheet-PPSI-program-NPRM.pdf';
    store.startRun(id, `${sourceLabel} (demo)`);

    for (const { event, delayMs } of DEMO_EVENTS) {
      const timer = setTimeout(() => {
        const timestampedEvent = { ...event, timestamp: baseTime + delayMs };
        store.handleAgentEvent(id, { type: 'agent_event', id, event: timestampedEvent });
      }, delayMs);
      demoTimers.current.push(timer);
    }

    // Send result after last event
    const lastEventDelay = DEMO_EVENTS[DEMO_EVENTS.length - 1]?.delayMs ?? 13000;
    const resultTimer = setTimeout(() => {
      store.setResult(id, DEMO_RESULT);
    }, lastEventDelay + 200);
    demoTimers.current.push(resultTimer);
  }, [store]);

  const handleProcess = useCallback((source: string, mode: 'file' | 'text') => {
    if (demoMode) {
      replayDemo(source);
      return;
    }
    if (mode === 'file') processFile(source);
    else processText(source);
  }, [demoMode, replayDemo, processFile, processText]);

  const runList = Array.from(runs.values()).reverse();
  const latestRun = runList[0];

  return (
    <div className="space-y-4">
      <ConfigPanel
        connectionStatus={connectionStatus}
        onConnect={handleConnect}
        onDisconnect={disconnect}
        demoMode={demoMode}
        onToggleDemo={() => setDemoMode(!demoMode)}
      />

      <InputPanel
        disabled={!isReady}
        demoMode={demoMode}
        onProcess={handleProcess}
      />

      {latestRun ? (
        <>
          <DagCanvas run={latestRun} />
          {latestRun.result?.chunks && latestRun.result.chunks.length > 0 && (
            <ChunkViewer chunks={latestRun.result.chunks} />
          )}
        </>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-12 text-center">
          <p className="text-neutral-500 text-sm">
            {demoMode
              ? 'Click Send to see a real FinCEN fact sheet processed through the agent pipeline'
              : isReady
                ? 'Enter a file path or text to process'
                : 'Connect to the agent server or enable Demo Mode'
            }
          </p>
        </div>
      )}
    </div>
  );
}
