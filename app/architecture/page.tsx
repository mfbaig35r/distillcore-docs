'use client'

import { MarketingHeader } from '@/components/marketing/header'
import { MarketingFooter } from '@/components/marketing/footer'
import { AgentGraph } from '@/components/graph/agent-graph'

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <MarketingHeader />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-3">Agent Architecture</h1>
          <p className="text-neutral-400 mb-8 max-w-2xl">
            Interactive 3-tier visualization of the distillcore-agents ecosystem.
            4 agents orchestrate 9 tools that call 8 distillcore API functions.
            Click nodes to explore connections.
          </p>
          <AgentGraph />
          <noscript>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 mt-4">
              <p className="text-neutral-400 mb-4">
                The interactive graph requires JavaScript. Here is the architecture summary:
              </p>
              <h3 className="text-white font-semibold mb-2">Agents</h3>
              <ul className="text-neutral-400 text-sm mb-4 list-disc list-inside">
                <li>Triage — assesses documents, picks preset and config</li>
                <li>Processing — executes distillcore pipeline with triage config</li>
                <li>QA — validates coverage thresholds and chunk quality</li>
                <li>Research — searches stored documents, synthesizes answers with citations</li>
              </ul>
              <h3 className="text-white font-semibold mb-2">Tools (9)</h3>
              <ul className="text-neutral-400 text-sm mb-4 list-disc list-inside">
                <li>Triage: Preview Document, List Presets</li>
                <li>Processing: Process Document, Save Result</li>
                <li>QA: Check Coverage, Check Chunks</li>
                <li>Research: Search Store, Get Document, Store Stats</li>
              </ul>
              <h3 className="text-white font-semibold mb-2">APIs (8)</h3>
              <ul className="text-neutral-400 text-sm list-disc list-inside">
                <li>extract(), process_document_async(), list_presets(), compute_coverage()</li>
                <li>Store.save(), Store.search(), Store.get_document(), Store.stats()</li>
              </ul>
            </div>
          </noscript>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
