# distillcore-docs — Requirements Document

## Overview

Full documentation site + interactive UI for the distillcore ecosystem. Modeled after two existing reference projects:
- **hts4imc-docs** (`/Users/fbaig/Projects/hts4imc-docs`) — marketing site + Nextra docs + real-time agent DAG via WebSocket
- **hts-docs** (`/Users/fbaig/Projects/hts-docs`) — agent architecture graph (force-directed 3-tier visualization)

New repo: `/Users/fbaig/Projects/distillcore-docs`

---

## Related Projects

| Project | Path | What it is |
|---------|------|------------|
| distillcore | `/Users/fbaig/Projects/distillcore` | PyPI library — document processing pipeline (extract, chunk, enrich, embed, validate) |
| distillcore-agents | `/Users/fbaig/Projects/distillcore-agents` | PyPI library — pydantic-ai agent layer (Triage → Processing → QA → Research) |
| hts4imc-docs | `/Users/fbaig/Projects/hts4imc-docs` | Reference — Next.js 16 docs site with real-time agent DAG WebSocket UI |
| hts-docs | `/Users/fbaig/Projects/hts-docs` | Reference — Next.js site with force-directed agent architecture graph (`lib/graph/`) |

---

## Tech Stack

| Tech | Version | Purpose |
|------|---------|---------|
| Next.js | 16 | App Router |
| React | 19 | UI |
| TypeScript | 5 | Strict mode, path aliases (`@/*`) |
| Tailwind CSS | 4 | PostCSS plugin, dark mode enforced |
| Nextra | 4.6 | MDX documentation with sidebar + search |
| Framer Motion | 12 | Page/component animations |
| Zustand | 5 | Agent WebSocket state management |
| Lucide React | latest | Icons |
| react-force-graph-2d | latest | Agent architecture graph canvas |
| Pagefind | 1.4 | Static site search (postbuild) |

---

## Pages

### 1. Landing Page (`/`)

Marketing landing page with dark-enforced design.

**Sections:**
- **Header** — fixed nav: distillcore logo, Docs, Agent, Architecture links, mobile hamburger
- **Hero** — "Intelligent Document Processing" headline, animated 7-stage pipeline diagram (`extract → classify → structure → chunk → enrich → embed → validate`), install commands (`pip install distillcore`, `pip install distillcore-agents`), quick-start links
- **Pipeline Section** — visual breakdown of the 7 pipeline stages with icons and descriptions
- **Features Section** — 4-column grid:
  - 8 file formats (PDF, DOCX, HTML, TXT, MD, ...)
  - 4 embedding providers (OpenAI, Ollama, local, Cohere)
  - 2 domain presets (generic, legal) + custom
  - SQLite storage with cosine search + tenant isolation
  - Async pipeline + batch processing (max_concurrent)
  - 4-agent autonomous layer (Triage, Processing, QA, Research)
  - Security hardened (path traversal, prompt injection, tenant isolation)
  - 193+ tests, CI/CD, PyPI published
- **CTA Section** — three buttons: Get Started → /docs, Try Agent → /agent, Architecture → /architecture
- **Footer** — links to GitHub repos, PyPI, license

**Reference:** `hts4imc-docs/app/(marketing)/page.tsx` + `components/marketing/`

### 2. Documentation (`/docs/*`)

Nextra-powered MDX documentation site with sidebar navigation.

**Structure:**
```
docs/
  page.mdx                    — Introduction to distillcore ecosystem
  getting-started/page.mdx    — Install, quickstart, first pipeline run
  configuration/page.mdx      — DistillConfig, ChunkConfig, EmbeddingConfig, DomainConfig
  presets/page.mdx             — Generic + legal presets, creating custom presets
  extractors/page.mdx          — PDF, DOCX, HTML, TXT + custom extractor protocol
  storage/page.mdx             — Store class, save/search/get, tenant isolation
  embedding-providers/page.mdx — OpenAI, Ollama, local (sentence-transformers), Cohere
  async-batch/page.mdx         — process_document_async, process_batch, process_batch_sync
  security/page.mdx            — allowed_dirs, prompt hardening, tenant_id, config.validate()
  agents/
    page.mdx                   — Agent layer overview, architecture diagram
    triage/page.mdx            — Triage agent: system prompt, tools, TriageDecision model
    processing/page.mdx        — Processing agent: tools, ProcessingDecision model
    qa/page.mdx                — QA agent: tools, QADecision + QARecommendation models
    research/page.mdx          — Research agent: tools, ResearchResult + Citation models
    orchestrator/page.mdx      — Orchestrator: process_one, process_batch, process_one_stream
  api/
    page.mdx                   — API reference overview
    process-document/page.mdx  — process_document() / process_document_async() signature + examples
    process-text/page.mdx      — process_text() / process_text_async() signature + examples
    extract/page.mdx           — extract() + extractor registry
    store/page.mdx             — Store class full API reference
  _meta.tsx                    — Nextra sidebar navigation order
```

**Reference:** `hts4imc-docs/app/docs/` + Nextra config in `next.config.mjs`

### 3. Agent Playground (`/agent`)

Real-time agent execution visualizer. User provides a file path or text, the system runs the 4-agent pipeline via WebSocket and streams events to a DAG visualization.

**Layout:**
```
┌─────────────────────────────────────────────┐
│ ConfigPanel                                  │
│   API URL: [ws://127.0.0.1:8000        ]    │
│   API Key: [••••••••                   ]    │
│   [Connect] [Disconnect]  ● Connected       │
├─────────────────────────────────────────────┤
│ InputPanel                                   │
│   Mode: [File] [Text]                        │
│   [/path/to/document.pdf              ]     │
│   [Process]                                  │
├─────────────────────────────────────────────┤
│ Pipeline DAG (horizontal scroll)             │
│                                              │
│ ┌──────────┐    ┌────────────┐    ┌────┐    │
│ │ Triage   │───▶│ Processing │───▶│ QA │    │
│ │ ● active │    │ ○ pending  │    │ ○  │    │
│ │          │    │            │    │    │    │
│ │ ┌──────┐ │    │            │    │    │    │
│ │ │prevw │ │    │            │    │    │    │
│ │ │doc   │ │    │            │    │    │    │
│ │ │✓ 1.2s│ │    │            │    │    │    │
│ │ └──────┘ │    │            │    │    │    │
│ │ ┌──────┐ │    │            │    │    │    │
│ │ │list  │ │    │            │    │    │    │
│ │ │prest │ │    │            │    │    │    │
│ │ │⟳ ... │ │    │            │    │    │    │
│ │ └──────┘ │    │            │    │    │    │
│ └──────────┘    └────────────┘    └────┘    │
│                                              │
│ Each stage card contains:                    │
│   - Agent name + status badge               │
│   - Nested tool call cards (calling/done)    │
│   - Duration per tool (live counter)         │
│   - Expandable: tool args + results          │
│                                              │
│ Animated edges with particle flow between    │
│ stages (same as hts4imc-docs dagParticleFlow)│
├─────────────────────────────────────────────┤
│ ResultNode (appears on completion)           │
│                                              │
│ ┌─ Triage ────────────────────────────────┐ │
│ │ Preset: legal  │  OCR: yes  │  Tokens: 800│
│ │ Reasoning: "Contains case numbers..."    │ │
│ └──────────────────────────────────────────┘ │
│ ┌─ Processing ────────────────────────────┐ │
│ │ Type: motion  │  Chunks: 12  │  97% cov │ │
│ │ Document ID: abc-123-def                │ │
│ └──────────────────────────────────────────┘ │
│ ┌─ QA ────────────────────────────────────┐ │
│ │ Verified: ✓  │  Coverage: 97/99/95%     │ │
│ │ Recommendations: none                   │ │
│ └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Key design decisions:**
- **Stage-level grouping**: each agent is a card containing its tool calls (NOT a flat list)
- **Animated edges**: particle flow animation between stages (`@keyframes dagParticleFlow`)
- **Live duration counters**: tool calls show a running timer while active
- **Expandable tool details**: click to see full args/results (truncated to 200 chars by default)
- **Research stage**: only appears if QA fails (conditional 4th stage)

**Reference files to study:**
- `hts4imc-docs/components/agent/workspace.tsx` — main container layout
- `hts4imc-docs/components/agent/dag-canvas.tsx` — horizontal scrolling DAG
- `hts4imc-docs/components/agent/dag-node.tsx` — individual tool step card
- `hts4imc-docs/components/agent/dag-edge.tsx` — animated connection
- `hts4imc-docs/components/agent/result-node.tsx` — final result display
- `hts4imc-docs/lib/agent/types.ts` — wire protocol types
- `hts4imc-docs/lib/agent/websocket.ts` — WebSocket class with auto-reconnect
- `hts4imc-docs/lib/agent/store.ts` — Zustand store for runs + events
- `hts4imc-docs/lib/agent/use-agent.ts` — React hook

### 4. Agent Architecture Graph (`/architecture`)

Static force-directed graph showing the agent ecosystem: 4 agents → 9 tools → 8 distillcore APIs.

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Agent toggles: [Triage] [Processing] [QA] [Research] │
│ [Show APIs] toggle                           │
│ Stats: 4 agents | 9 tools | 8 APIs          │
├─────────────────────────────────────────────┤
│                                              │
│          ┌─ Agent (outer ring) ─┐            │
│         /                        \           │
│   [Triage]                  [Processing]     │
│     │  │                       │   │         │
│     │  └── preview_doc ────────┘   │         │
│     │      list_presets            │         │
│     │                     process_doc        │
│     │                     save_result        │
│                                              │
│   [QA]                      [Research]       │
│     │                          │  │  │       │
│     │── check_coverage         │  │  │       │
│     │── check_chunks           │  │  │       │
│                        search_store │        │
│                        get_doc_info │        │
│                        get_stats    │        │
│                                              │
│         ┌─ API (inner ring, hexagons) ─┐    │
│         │ extract() │ process_async()  │    │
│         │ list_presets() │ coverage()  │    │
│         │ Store.save/search/get/stats  │    │
│         └──────────────────────────────┘    │
│                                              │
├─────────────────────────────────────────────┤
│ Detail Panel (on node click):               │
│   Agent: "Triage"                           │
│   Model: GPT-4o Mini                        │
│   Tools: preview_document, list_presets     │
│   Description: "Assesses documents..."      │
├─────────────────────────────────────────────┤
│ Reference Tables (collapsible):             │
│   Tools: id | agent | API | description     │
│   Agents: expandable with tool breakdown    │
│   APIs: expandable with tool connections    │
└─────────────────────────────────────────────┘
```

**3-tier tripartite graph layout:**
- **Outer ring**: 4 agents (colored circles: purple, blue, emerald, amber)
- **Middle ring**: 9 tools (smaller circles, colored by parent agent)
- **Inner ring**: 8 distillcore API functions (hexagon nodes with icons)

**Links:**
- Agent → Tool: semi-transparent agent color
- Tool → API: semi-transparent API color

**Reference files to study:**
- `hts-docs/lib/graph/agent-types.ts` — type definitions for agents, tools, data sources
- `hts-docs/lib/graph/agent-data.ts` — static data + `buildAgentGraphData()` layout function
- `hts-docs/lib/graph/agent-icons.ts` — SVG icon baking for hexagon nodes
- `hts-docs/lib/graph/types.ts` — GraphNode, GraphLink, GraphData
- `hts-docs/components/graph/agent-graph.tsx` — full agent graph component with toggles + detail panel
- `hts-docs/components/graph/graph-viewer.tsx` — react-force-graph-2d canvas renderer

### 5. Contact Page (`/contact`)

Simple support page with links to:
- GitHub repos (distillcore, distillcore-agents)
- PyPI pages
- Email
- Documentation

---

## Wire Protocol (WebSocket)

The agent playground needs a WebSocket server in the distillcore-agents Python backend. This is a **separate backend task** — the frontend can be built and tested with mock data first.

### Client → Server

```typescript
// Process a file
{ type: 'process', id: string, source: string }

// Process raw text
{ type: 'process_text', id: string, text: string }

// Cancel a running pipeline
{ type: 'cancel', id: string }

// Keepalive
{ type: 'ping' }
```

### Server → Client

```typescript
// Agent event (streamed during pipeline execution)
{
  type: 'agent_event',
  id: string,         // run ID
  event: {
    event_type: 'started' | 'tool_call' | 'tool_result' | 'completed' | 'error',
    data: {
      agent?: 'triage' | 'processing' | 'qa' | 'research',  // which stage
      tool_name?: string,
      args?: Record<string, unknown>,
      content?: string,        // tool result (truncated)
      output?: Record<string, unknown>,  // structured output on completion
    },
    timestamp: number
  }
}

// Final pipeline result
{
  type: 'result',
  id: string,
  output: PipelineResult    // full result from Orchestrator.process_one()
}

// Error
{
  type: 'error',
  id: string,
  error: { type: string, message: string }
}

// Keepalive response
{ type: 'pong' }

// Cancellation confirmation
{ type: 'cancelled', id: string }
```

**Key**: the `agent` field in `event.data` tells the UI which stage card to update. Events without `agent` are pipeline-level (started/completed/error).

---

## Zustand Store

```typescript
interface AgentStore {
  // Connection
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'
  setConnectionStatus: (status: ConnectionStatus) => void
  apiUrl: string
  apiKey: string
  setApiUrl: (url: string) => void
  setApiKey: (key: string) => void

  // Pipeline runs
  runs: Map<string, PipelineRunState>
  startRun: (id: string, source: string) => void
  handleAgentEvent: (id: string, event: AgentEvent) => void
  setResult: (id: string, output: PipelineResult) => void
  setRunError: (id: string, error: string) => void
  clearRuns: () => void
}

interface PipelineRunState {
  id: string
  source: string
  status: 'pending' | 'running' | 'completed' | 'error'
  stages: AgentStage[]
  startedAt: number
  completedAt?: number
  result?: PipelineResult
  errorMessage?: string
}

interface AgentStage {
  agent: 'triage' | 'processing' | 'qa' | 'research'
  status: 'pending' | 'running' | 'completed' | 'error'
  steps: ToolStep[]
  startedAt?: number
  completedAt?: number
  output?: Record<string, unknown>
}

interface ToolStep {
  callId: string
  toolName: string
  args: Record<string, unknown>
  status: 'calling' | 'completed' | 'error'
  result?: string
  startedAt: number
  completedAt?: number
}
```

**Event handling logic in `handleAgentEvent`:**
- `started` with `agent` field → set that stage to `running`, create if not exists
- `tool_call` with `agent` field → append ToolStep to that stage's steps
- `tool_result` with `agent` field → update matching ToolStep to `completed`
- `completed` with `agent` field → set that stage to `completed`
- `completed` without `agent` field → set entire run to `completed`
- `error` → set run or stage to `error`

---

## Agent Architecture Graph Data

Static TypeScript definitions mirroring the Python agent code:

```typescript
// Agent definitions
export const AGENTS = [
  { id: 'triage', label: 'Triage', description: 'Assesses documents, picks preset and config', model: 'GPT-4o Mini', toolCount: 2, color: '#8b5cf6' },
  { id: 'processing', label: 'Processing', description: 'Executes distillcore pipeline with triage config', model: 'GPT-4o Mini', toolCount: 2, color: '#3b82f6' },
  { id: 'qa', label: 'QA', description: 'Validates coverage thresholds and chunk quality', model: 'GPT-4o Mini', toolCount: 2, color: '#10b981' },
  { id: 'research', label: 'Research', description: 'Searches stored documents, synthesizes answers with citations', model: 'GPT-4o Mini', toolCount: 3, color: '#f59e0b' },
]

// Tool definitions with agent and API mappings
export const TOOLS = [
  { id: 'preview_document', agent: 'triage', api: 'extract', label: 'Preview Document', description: 'Extract first page for triage assessment' },
  { id: 'list_available_presets', agent: 'triage', api: 'list_presets', label: 'List Presets', description: 'Get available domain presets' },
  { id: 'process_document', agent: 'processing', api: 'process_document_async', label: 'Process Document', description: 'Run full distillcore pipeline' },
  { id: 'save_result', agent: 'processing', api: 'store_save', label: 'Save Result', description: 'Persist ProcessingResult to Store' },
  { id: 'check_coverage', agent: 'qa', api: 'compute_coverage', label: 'Check Coverage', description: 'Validate text preservation' },
  { id: 'check_chunks', agent: 'qa', api: null, label: 'Check Chunks', description: 'Inspect chunk quality (empty, missing topics)' },
  { id: 'search_store', agent: 'research', api: 'store_search', label: 'Search Store', description: 'Semantic similarity search' },
  { id: 'get_document_info', agent: 'research', api: 'store_get_document', label: 'Get Document', description: 'Retrieve document metadata' },
  { id: 'get_store_stats', agent: 'research', api: 'store_stats', label: 'Store Stats', description: 'Aggregate store statistics' },
]

// distillcore API functions that tools call
export const APIS = [
  { id: 'extract', label: 'extract()', description: 'File text extraction (PDF, DOCX, HTML, TXT, MD)', icon: 'FileText' },
  { id: 'process_document_async', label: 'process_document_async()', description: 'Full async 7-stage pipeline', icon: 'Workflow' },
  { id: 'list_presets', label: 'list_presets()', description: 'Available domain presets', icon: 'List' },
  { id: 'compute_coverage', label: 'compute_coverage()', description: 'Word-level coverage metric (0-1)', icon: 'BarChart' },
  { id: 'store_save', label: 'Store.save()', description: 'Persist ProcessingResult to SQLite', icon: 'Database' },
  { id: 'store_search', label: 'Store.search()', description: 'Cosine similarity vector search', icon: 'Search' },
  { id: 'store_get_document', label: 'Store.get_document()', description: 'Retrieve document by ID', icon: 'FileSearch' },
  { id: 'store_stats', label: 'Store.stats()', description: 'Document/chunk/search counts', icon: 'PieChart' },
]
```

---

## Styling Guide

**Color palette** (dark mode enforced, matches hts4imc-docs):
- Background: `neutral-950` (#0a0a0a)
- Card background: `neutral-900` (#171717)
- Border: `neutral-800` (#262626)
- Text primary: `neutral-100` (#f5f5f5)
- Text secondary: `neutral-400` (#a3a3a3)
- Primary accent: `purple-500` (#a855f7)
- Agent colors: purple (#8b5cf6), blue (#3b82f6), emerald (#10b981), amber (#f59e0b)
- Status: emerald (success), amber (warning), red (error)

**Component patterns:**
- Cards: `bg-neutral-900 border border-neutral-800 rounded-xl p-4`
- Buttons: `bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-4 py-2`
- Inputs: `bg-neutral-950 border border-neutral-800 focus:border-purple-500/50 rounded-lg`
- Badges: `bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full px-2 py-0.5 text-xs`
- Status dots: `w-2 h-2 rounded-full` + green/amber/red bg

**Animation:**
- Framer Motion for page transitions, card appearances
- `@keyframes dagParticleFlow` for active DAG edges (2s infinite)
- Live duration counters on active tool calls

---

## Build Phases

### Phase 1: Scaffold + Landing Page (commits 1-3)
- Next.js 16 project init with all deps
- Tailwind v4 + dark mode + Nextra config
- Marketing components: header, footer, hero, pipeline, features, CTA
- Landing page assembly

### Phase 2: Documentation (commits 4-7)
- Nextra docs layout with sidebar
- 8 core docs pages (getting-started through security)
- 6 agent docs pages (overview + each agent + orchestrator)
- 4 API reference pages

### Phase 3: Agent Architecture Graph (commits 8-10)
- Graph types + agent data definitions
- react-force-graph-2d viewer component
- Architecture page with toggles, detail panel, reference tables

### Phase 4: Real-time Agent DAG (commits 11-15)
- Wire protocol types
- WebSocket client class (auto-reconnect, ping/pong)
- Zustand store (connection + pipeline state + event handling)
- DAG components (workspace, config-panel, input-panel, dag-canvas, agent-stage-node, tool-node, dag-edge, result-node, connection-status)
- Agent playground page

### Phase 5: Polish (commits 16-18)
- Pagefind search integration
- Contact page
- CI/CD (GitHub Actions for build)

---

## Backend Requirements (separate task)

The agent playground requires a WebSocket server endpoint in distillcore-agents. This is NOT part of the frontend build but needed for the real-time DAG to work with live data.

**What's needed in distillcore-agents:**
- FastAPI dependency (`pip install fastapi uvicorn`)
- WebSocket route at `/ws/agent`
- Accept `process` / `process_text` / `cancel` / `ping` messages
- Stream `AgentEvent` objects from `Orchestrator.process_one_stream()` as JSON frames
- Send final `PipelineResult` on completion
- Handle cancellation and errors

**For testing without the backend:**
- The frontend should work with mock data (hardcoded demo run)
- A "demo mode" toggle in ConfigPanel that replays a recorded pipeline execution

---

## Files to Reference During Implementation

### From hts4imc-docs (real-time agent DAG):
- `lib/agent/types.ts` — wire protocol types (adapt for pipeline stages)
- `lib/agent/websocket.ts` — WebSocket class pattern (copy + adapt)
- `lib/agent/store.ts` — Zustand store pattern (extend for stages)
- `lib/agent/use-agent.ts` — React hook pattern
- `lib/agent/tool-meta.ts` — tool color/icon metadata
- `components/agent/workspace.tsx` — main container layout
- `components/agent/config-panel.tsx` — connection config UI
- `components/agent/input-panel.tsx` — input + send button
- `components/agent/dag-canvas.tsx` — horizontal DAG scroll container
- `components/agent/dag-node.tsx` — tool step card (adapt for stage grouping)
- `components/agent/dag-edge.tsx` — animated connection
- `components/agent/result-node.tsx` — final result display
- `app/agent/page.tsx` — page assembly

### From hts-docs (agent architecture graph):
- `lib/graph/types.ts` — GraphNode, GraphLink, GraphData
- `lib/graph/agent-types.ts` — AgentId, ToolInfo, DataSourceInfo types
- `lib/graph/agent-data.ts` — static data + `buildAgentGraphData()` function
- `lib/graph/agent-icons.ts` — SVG icon baking for canvas
- `components/graph/graph-viewer.tsx` — react-force-graph-2d wrapper
- `components/graph/agent-graph.tsx` — full agent graph with toggles + detail panel

### From both (shared patterns):
- `app/layout.tsx` — dark mode forced root layout
- `app/globals.css` — Tailwind v4 imports + dark mode CSS vars + animations
- `next.config.mjs` — Nextra wrapping + CSP headers
- `postcss.config.mjs` — Tailwind v4 PostCSS plugin
- `tailwind.config.js` — source scanning config
- `components/marketing/` — all marketing section components
