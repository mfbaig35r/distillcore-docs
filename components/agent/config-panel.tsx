'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useAgentStore } from '@/lib/agent/store';
import { ConnectionStatusDot } from './connection-status';
import type { ConnectionStatus } from '@/lib/agent/types';

export function ConfigPanel({
  connectionStatus,
  onConnect,
  onDisconnect,
  demoMode,
  onToggleDemo,
}: {
  connectionStatus: ConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
  demoMode: boolean;
  onToggleDemo: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { apiUrl, apiKey, setApiUrl, setApiKey } = useAgentStore();
  const isConnected = connectionStatus === 'connected';

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      {/* Collapsed row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <ConnectionStatusDot status={demoMode ? 'connected' : connectionStatus} />
        {!demoMode && (
          <span className="text-xs text-neutral-500 font-mono truncate max-w-[200px]">{apiUrl}</span>
        )}
        {demoMode && (
          <span className="text-xs text-amber-400">Demo Mode</span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onToggleDemo}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
              demoMode
                ? 'bg-amber-600 border-transparent text-white'
                : 'border-neutral-600 text-neutral-400 hover:text-white'
            }`}
          >
            Demo
          </button>
          {!demoMode && (
            <button
              onClick={isConnected ? onDisconnect : onConnect}
              className={`text-xs px-3 py-1 rounded-md transition-colors ${
                isConnected
                  ? 'bg-red-600/20 text-red-300 hover:bg-red-600/30'
                  : 'bg-purple-600 text-white hover:bg-purple-500'
              }`}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-neutral-400 hover:text-white"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Expanded config */}
      {expanded && !demoMode && (
        <div className="border-t border-neutral-800 px-4 py-3 space-y-3">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">API URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={e => setApiUrl(e.target.value)}
              disabled={isConnected}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500/50 rounded-lg px-3 py-1.5 text-sm text-neutral-200 font-mono disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              disabled={isConnected}
              placeholder="Optional — cleared on disconnect"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500/50 rounded-lg px-3 py-1.5 text-sm text-neutral-200 disabled:opacity-50"
            />
            <p className="text-[10px] text-neutral-600 mt-1">Memory only — never stored or sent in URLs</p>
          </div>
        </div>
      )}
    </div>
  );
}
