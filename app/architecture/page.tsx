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
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
