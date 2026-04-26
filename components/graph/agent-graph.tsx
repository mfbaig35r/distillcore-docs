'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Database, ChevronDown, ChevronRight, Bot, Table2, Hexagon } from 'lucide-react';
import { GraphViewer, GraphViewerRef, HighlightData, ForceConfig } from './graph-viewer';
import type { GraphNode, GraphData } from '@/lib/graph/types';
import type { AgentId, ApiId } from '@/lib/graph/agent-types';
import { AGENT_COLORS, API_COLORS } from '@/lib/graph/agent-types';
import { AGENTS, TOOLS, APIS, buildAgentGraphData } from '@/lib/graph/agent-data';
import { loadApiIconsWhite } from '@/lib/graph/agent-icons';

const ALL_AGENTS = new Set<AgentId>(AGENTS.map(a => a.id));

const AGENT_FORCE_CONFIG: ForceConfig = {
  chargeStrength: -80,
  linkDistance: 50,
  centerStrength: 0.15,
};

export function AgentGraph() {
  const graphRef = useRef<GraphViewerRef | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleAgents, setVisibleAgents] = useState<Set<AgentId>>(new Set(ALL_AGENTS));
  const [showApis, setShowApis] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [graphWidth, setGraphWidth] = useState(800);
  const [iconMap, setIconMap] = useState<Map<string, HTMLImageElement> | null>(null);

  useEffect(() => {
    loadApiIconsWhite().then(setIconMap);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateWidth = () => setGraphWidth(container.offsetWidth);
    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const graphData = useMemo(
    () => buildAgentGraphData(visibleAgents, showApis),
    [visibleAgents, showApis]
  );

  const highlightData = useMemo<HighlightData>(() => {
    const connectedNodeIds = new Set<string>();
    if (selectedNode) {
      graphData.links.forEach(link => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
        const targetId = typeof link.target === 'string' ? link.target : link.target.id;
        if (sourceId === selectedNode.id) connectedNodeIds.add(targetId);
        if (targetId === selectedNode.id) connectedNodeIds.add(sourceId);
      });
    }
    return { connectedNodeIds };
  }, [selectedNode, graphData]);

  const toggleAgent = useCallback((agentId: AgentId) => {
    setVisibleAgents(prev => {
      const next = new Set(prev);
      if (next.has(agentId)) {
        if (next.size === 1) return prev;
        next.delete(agentId);
      } else {
        next.add(agentId);
      }
      return next;
    });
    setSelectedNode(null);
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node);
  }, []);

  const handleZoomIn = () => graphRef.current?.zoom(1.5, 300);
  const handleZoomOut = () => graphRef.current?.zoom(0.67, 300);
  const handleFit = () => graphRef.current?.zoomToFit(400, 50);

  const selectedInfo = useMemo(() => {
    if (!selectedNode) return null;

    if (selectedNode.id.startsWith('agent:')) {
      const agentId = selectedNode.id.replace('agent:', '') as AgentId;
      const agent = AGENTS.find(a => a.id === agentId);
      if (!agent) return null;
      const agentTools = TOOLS.filter(t => t.agent === agentId);
      return { type: 'agent' as const, agent, tools: agentTools };
    }

    if (selectedNode.id.startsWith('tool:')) {
      const toolId = selectedNode.id.replace('tool:', '');
      const tool = TOOLS.find(t => t.id === toolId);
      if (!tool) return null;
      const toolAgent = AGENTS.find(a => a.id === tool.agent);
      const api = tool.api ? APIS.find(a => a.id === tool.api) : null;
      return { type: 'tool' as const, tool, agent: toolAgent, api };
    }

    if (selectedNode.id.startsWith('api:')) {
      const apiId = selectedNode.id.replace('api:', '') as ApiId;
      const api = APIS.find(a => a.id === apiId);
      if (!api) return null;
      const apiTools = TOOLS.filter(t => t.api === apiId && visibleAgents.has(t.agent));
      return { type: 'api' as const, api, tools: apiTools };
    }

    return null;
  }, [selectedNode, visibleAgents]);

  const visibleToolCount = useMemo(() => {
    return TOOLS.filter(t => visibleAgents.has(t.agent)).length;
  }, [visibleAgents]);

  const activeIconMap = showApis && iconMap ? iconMap : undefined;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex flex-wrap gap-1.5">
            {AGENTS.map(agent => (
              <button
                key={agent.id}
                onClick={() => toggleAgent(agent.id)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  visibleAgents.has(agent.id)
                    ? 'border-transparent text-white'
                    : 'border-neutral-600 text-neutral-500 bg-transparent'
                }`}
                style={{
                  backgroundColor: visibleAgents.has(agent.id) ? agent.color : undefined,
                }}
              >
                {agent.label}
              </button>
            ))}
            <button
              onClick={() => { setShowApis(prev => !prev); setSelectedNode(null); }}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors inline-flex items-center gap-1 ${
                showApis
                  ? 'border-transparent text-white bg-cyan-700'
                  : 'border-neutral-600 text-neutral-500 bg-transparent'
              }`}
            >
              <Database size={12} />
              APIs
            </button>
          </div>
          <div className="text-sm text-neutral-400">
            {visibleAgents.size} agents, {visibleToolCount} tools
            {showApis && <>, {graphData.nodes.filter(n => n.level === 'api').length} APIs</>}
            , {graphData.links.length} connections
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleZoomOut} className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300" title="Zoom out">
            <ZoomOut size={18} />
          </button>
          <button onClick={handleZoomIn} className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300" title="Zoom in">
            <ZoomIn size={18} />
          </button>
          <button onClick={handleFit} className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300" title="Fit to view">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* Graph */}
      <div ref={containerRef}>
        <GraphViewer
          ref={graphRef}
          graphData={graphData}
          selectedNodeId={selectedNode?.id}
          highlightData={highlightData}
          onNodeClick={handleNodeClick}
          width={graphWidth}
          height={560}
          forceConfig={AGENT_FORCE_CONFIG}
          nodeIconMap={activeIconMap}
        />
      </div>

      {/* Detail panel */}
      {selectedInfo && (
        <div className="p-4 rounded-lg bg-neutral-800/50 border border-neutral-700 space-y-3">
          {selectedInfo.type === 'agent' && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedInfo.agent.color }} />
                <h3 className="text-lg font-medium text-neutral-100">{selectedInfo.agent.label}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-400">{selectedInfo.agent.model}</span>
              </div>
              <p className="text-sm text-neutral-400">{selectedInfo.agent.description}</p>
              <div>
                <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wide mb-1.5">
                  Tools ({selectedInfo.tools.length})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedInfo.tools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        const node = graphData.nodes.find(n => n.id === `tool:${tool.id}`);
                        if (node) handleNodeClick(node);
                      }}
                      className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-md bg-neutral-700/50 hover:bg-neutral-700 text-neutral-300 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: AGENT_COLORS[tool.agent] }} />
                      {tool.id}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedInfo.type === 'tool' && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: AGENT_COLORS[selectedInfo.tool.agent] }} />
                <h3 className="text-lg font-medium text-neutral-100 font-mono">{selectedInfo.tool.id}</h3>
              </div>
              <p className="text-sm text-neutral-400">{selectedInfo.tool.description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                {selectedInfo.agent && (
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wide mb-1.5">Agent</label>
                    <button
                      onClick={() => {
                        const node = graphData.nodes.find(n => n.id === `agent:${selectedInfo.agent!.id}`);
                        if (node) handleNodeClick(node);
                      }}
                      className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-md hover:bg-neutral-700 text-neutral-300 transition-colors"
                      style={{ backgroundColor: selectedInfo.agent.color + '30' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: selectedInfo.agent.color }} />
                      {selectedInfo.agent.label}
                    </button>
                  </div>
                )}
                {selectedInfo.api && (
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wide mb-1.5">API</label>
                    <button
                      onClick={() => {
                        const node = graphData.nodes.find(n => n.id === `api:${selectedInfo.api!.id}`);
                        if (node) handleNodeClick(node);
                      }}
                      className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-md hover:bg-neutral-700 text-neutral-300 transition-colors"
                      style={{ backgroundColor: selectedInfo.api.color + '30' }}
                    >
                      <Database size={10} className="flex-shrink-0" />
                      {selectedInfo.api.label}
                    </button>
                  </div>
                )}
                {!selectedInfo.api && selectedInfo.tool.api === null && (
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wide mb-1.5">API</label>
                    <span className="text-xs text-neutral-500 italic">None (pure inspection)</span>
                  </div>
                )}
              </div>
            </>
          )}

          {selectedInfo.type === 'api' && (
            <>
              <div className="flex items-center gap-3">
                <Database size={14} style={{ color: selectedInfo.api.color }} />
                <h3 className="text-lg font-medium text-neutral-100">{selectedInfo.api.label}</h3>
              </div>
              <p className="text-sm text-neutral-400">{selectedInfo.api.description}</p>
              <div>
                <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wide mb-1.5">
                  Tools ({selectedInfo.tools.length})
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedInfo.tools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        const node = graphData.nodes.find(n => n.id === `tool:${tool.id}`);
                        if (node) handleNodeClick(node);
                      }}
                      className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-md bg-neutral-700/50 hover:bg-neutral-700 text-neutral-300 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: AGENT_COLORS[tool.agent] }} />
                      {tool.id}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Reference: Tools Table */}
      <div className="rounded-lg bg-neutral-800/50 border border-neutral-700 overflow-hidden">
        <CollapsibleSection icon={<Table2 size={16} className="text-neutral-400" />} title="Tools" count={`${visibleToolCount} tools`}>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-neutral-800 z-10">
                <tr className="text-xs text-neutral-400 uppercase tracking-wide">
                  <th className="px-4 py-2 text-left">Tool</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Agent</th>
                  <th className="px-4 py-2 text-left">API</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700/50">
                {TOOLS.filter(t => visibleAgents.has(t.agent)).map(tool => (
                  <tr
                    key={tool.id}
                    className={`hover:bg-neutral-700/30 cursor-pointer transition-colors ${selectedNode?.id === `tool:${tool.id}` ? 'bg-purple-500/10' : ''}`}
                    onClick={() => {
                      const node = graphData.nodes.find(n => n.id === `tool:${tool.id}`);
                      if (node) handleNodeClick(node);
                    }}
                  >
                    <td className="px-4 py-1.5 font-mono text-purple-400">{tool.id}</td>
                    <td className="px-4 py-1.5 text-neutral-300">{tool.description}</td>
                    <td className="px-4 py-1.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: AGENT_COLORS[tool.agent] }} />
                        <span className="text-neutral-400">{AGENTS.find(a => a.id === tool.agent)?.label}</span>
                      </span>
                    </td>
                    <td className="px-4 py-1.5 text-neutral-400 font-mono text-xs">{tool.api ? APIS.find(a => a.id === tool.api)?.label : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>
      </div>

      {/* Reference: Agents */}
      <div className="rounded-lg bg-neutral-800/50 border border-neutral-700 overflow-hidden">
        <CollapsibleSection icon={<Bot size={16} className="text-neutral-400" />} title="Agents" count={`${visibleAgents.size} agents`}>
          <div className="divide-y divide-neutral-700/50">
            {AGENTS.filter(a => visibleAgents.has(a.id)).map(agent => (
              <button
                key={agent.id}
                onClick={() => {
                  const node = graphData.nodes.find(n => n.id === `agent:${agent.id}`);
                  if (node) handleNodeClick(node);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-neutral-700/30 transition-colors ${selectedNode?.id === `agent:${agent.id}` ? 'bg-purple-500/10' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: agent.color }} />
                  <span className="text-sm font-medium text-neutral-100">{agent.label}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-400">{agent.model}</span>
                  <span className="text-xs text-neutral-500 ml-auto tabular-nums">{agent.toolCount} tools</span>
                </div>
                <p className="mt-1 text-sm text-neutral-400">{agent.description}</p>
              </button>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      {/* Reference: APIs */}
      <div className="rounded-lg bg-neutral-800/50 border border-neutral-700 overflow-hidden">
        <CollapsibleSection icon={<Hexagon size={16} className="text-neutral-400" />} title="APIs" count={`${APIS.length} functions`}>
          <div className="divide-y divide-neutral-700/50">
            {APIS.map(api => {
              const apiTools = TOOLS.filter(t => t.api === api.id && visibleAgents.has(t.agent));
              return (
                <div key={api.id} className={`px-4 py-2 ${selectedNode?.id === `api:${api.id}` ? 'bg-purple-500/10' : ''}`}>
                  <button
                    onClick={() => {
                      const node = graphData.nodes.find(n => n.id === `api:${api.id}`);
                      if (node) handleNodeClick(node);
                    }}
                    className="w-full flex items-center gap-2 text-left text-sm"
                  >
                    <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 14 14">
                      <polygon points="7,0.5 13,3.5 13,10.5 7,13.5 1,10.5 1,3.5" fill={api.color} />
                    </svg>
                    <span className="font-mono text-neutral-100">{api.label}</span>
                    <span className="text-xs text-neutral-500 ml-auto">{apiTools.length} tools</span>
                  </button>
                  <p className="mt-1 text-xs text-neutral-400">{api.description}</p>
                </div>
              );
            })}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

function CollapsibleSection({ icon, title, count, children }: { icon: React.ReactNode; title: string; count: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-700/30 transition-colors"
      >
        {isOpen ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
        {icon}
        <span className="text-sm font-medium text-neutral-200">{title}</span>
        <span className="text-xs text-neutral-500 tabular-nums">{count}</span>
      </button>
      {isOpen && <div className="border-t border-neutral-700">{children}</div>}
    </>
  );
}
