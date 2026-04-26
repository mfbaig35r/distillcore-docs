/**
 * Static data for distillcore Agent Architecture Graph
 *
 * Mirrors the Python agent code in distillcore-agents.
 */

import type { GraphData, GraphNode, GraphLink } from '@/lib/graph/types';
import type { AgentId, AgentInfo, ToolInfo, ApiId, ApiInfo } from './agent-types';
import { AGENT_COLORS, API_COLORS } from './agent-types';

// ── Agent definitions ──────────────────────────────────────────────

export const AGENTS: AgentInfo[] = [
  {
    id: 'triage',
    label: 'Triage',
    description: 'Assesses documents, picks preset and config',
    model: '5.4-mini',
    toolCount: 2,
    color: AGENT_COLORS.triage,
  },
  {
    id: 'processing',
    label: 'Processing',
    description: 'Executes distillcore pipeline with triage config',
    model: '5.4-mini',
    toolCount: 2,
    color: AGENT_COLORS.processing,
  },
  {
    id: 'qa',
    label: 'QA',
    description: 'Validates coverage thresholds and chunk quality',
    model: '5.4-mini',
    toolCount: 2,
    color: AGENT_COLORS.qa,
  },
  {
    id: 'research',
    label: 'Research',
    description: 'Searches stored documents, synthesizes answers with citations',
    model: '5.4-mini',
    toolCount: 3,
    color: AGENT_COLORS.research,
  },
];

// ── Tool definitions ──────────────────────────────────────────────

export const TOOLS: ToolInfo[] = [
  { id: 'preview_document', agent: 'triage', api: 'extract', label: 'Preview Document', description: 'Extract first page for triage assessment' },
  { id: 'list_available_presets', agent: 'triage', api: 'list_presets', label: 'List Presets', description: 'Get available domain presets' },
  { id: 'process_document', agent: 'processing', api: 'process_document_async', label: 'Process Document', description: 'Run full distillcore pipeline' },
  { id: 'save_result', agent: 'processing', api: 'store_save', label: 'Save Result', description: 'Persist ProcessingResult to Store' },
  { id: 'check_coverage', agent: 'qa', api: 'compute_coverage', label: 'Check Coverage', description: 'Validate text preservation' },
  { id: 'check_chunks', agent: 'qa', api: null, label: 'Check Chunks', description: 'Inspect chunk quality (pure inspection, no API call)' },
  { id: 'search_store', agent: 'research', api: 'store_search', label: 'Search Store', description: 'Semantic similarity search' },
  { id: 'get_document_info', agent: 'research', api: 'store_get_document', label: 'Get Document', description: 'Retrieve document metadata' },
  { id: 'get_store_stats', agent: 'research', api: 'store_stats', label: 'Store Stats', description: 'Aggregate store statistics' },
];

// ── API definitions ───────────────────────────────────────────────

export const APIS: ApiInfo[] = [
  { id: 'extract', label: 'extract()', description: 'File text extraction (PDF, DOCX, HTML, TXT, MD)', color: API_COLORS.extract },
  { id: 'process_document_async', label: 'process_document_async()', description: 'Full async 7-stage pipeline', color: API_COLORS.process_document_async },
  { id: 'list_presets', label: 'list_presets()', description: 'Available domain presets', color: API_COLORS.list_presets },
  { id: 'compute_coverage', label: 'compute_coverage()', description: 'Word-level coverage metric (0-1)', color: API_COLORS.compute_coverage },
  { id: 'store_save', label: 'Store.save()', description: 'Persist ProcessingResult to SQLite', color: API_COLORS.store_save },
  { id: 'store_search', label: 'Store.search()', description: 'Cosine similarity vector search', color: API_COLORS.store_search },
  { id: 'store_get_document', label: 'Store.get_document()', description: 'Retrieve document by ID', color: API_COLORS.store_get_document },
  { id: 'store_stats', label: 'Store.stats()', description: 'Document/chunk/search counts', color: API_COLORS.store_stats },
];

// ── Graph data builder ────────────────────────────────────────────

export function buildAgentGraphData(
  visibleAgents: Set<AgentId>,
  showApis: boolean,
): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // Agent nodes — outer ring
  const visibleAgentList = AGENTS.filter(a => visibleAgents.has(a.id));
  visibleAgentList.forEach((agent, i) => {
    const angle = (2 * Math.PI * i) / visibleAgentList.length - Math.PI / 2;
    nodes.push({
      id: `agent:${agent.id}`,
      label: agent.label,
      title: agent.description,
      level: 'agent',
      group: 'agents',
      size: 14,
      color: agent.color,
      x: Math.cos(angle) * 250,
      y: Math.sin(angle) * 200,
    });
  });

  // Visible tools (connected to at least one visible agent)
  const visibleTools = TOOLS.filter(t => visibleAgents.has(t.agent));

  // Tool nodes — middle ring
  visibleTools.forEach((tool, i) => {
    const angle = (2 * Math.PI * i) / visibleTools.length;
    nodes.push({
      id: `tool:${tool.id}`,
      label: tool.label,
      title: tool.description,
      level: 'tool',
      group: 'tools',
      size: 7,
      color: AGENT_COLORS[tool.agent],
      x: Math.cos(angle) * 120,
      y: Math.sin(angle) * 100,
    });
  });

  // Agent → Tool links
  for (const tool of visibleTools) {
    links.push({
      source: `agent:${tool.agent}`,
      target: `tool:${tool.id}`,
      value: 1,
      color: AGENT_COLORS[tool.agent] + '50',
      relationshipType: 'hierarchy',
      confidence: 1,
    });
  }

  // API nodes and Tool → API links
  if (showApis) {
    const visibleApiIds = new Set<ApiId>();
    for (const tool of visibleTools) {
      if (tool.api) visibleApiIds.add(tool.api);
    }

    const visibleApiList = APIS.filter(api => visibleApiIds.has(api.id));
    visibleApiList.forEach((api, i) => {
      const toolCount = visibleTools.filter(t => t.api === api.id).length;
      const angle = (2 * Math.PI * i) / visibleApiList.length + Math.PI / 6;
      nodes.push({
        id: `api:${api.id}`,
        label: api.label,
        title: api.description,
        level: 'api',
        group: 'apis',
        shape: 'hexagon',
        size: 8 + Math.min(toolCount, 6),
        color: api.color,
        x: Math.cos(angle) * 40,
        y: Math.sin(angle) * 40,
      });
    });

    // Tool → API links
    for (const tool of visibleTools) {
      if (tool.api && visibleApiIds.has(tool.api)) {
        links.push({
          source: `tool:${tool.id}`,
          target: `api:${tool.api}`,
          value: 1,
          color: API_COLORS[tool.api] + '40',
          relationshipType: 'hierarchy',
          confidence: 0.6,
        });
      }
    }
  }

  return { nodes, links };
}
