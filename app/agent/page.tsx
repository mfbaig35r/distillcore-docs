'use client'

import { MarketingHeader } from '@/components/marketing/header'
import { MarketingFooter } from '@/components/marketing/footer'
import { AgentWorkspace } from '@/components/agent/workspace'

export default function AgentPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <MarketingHeader />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-3">Agent Pipeline</h1>
          <p className="text-neutral-400 mb-8 max-w-2xl">
            Real-time visualization of the 4-agent document processing pipeline.
            Triage assesses the document, Processing runs the pipeline, and QA validates quality.
          </p>
          <AgentWorkspace />
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
