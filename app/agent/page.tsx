'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react'
import { MarketingHeader } from '@/components/marketing/header'
import { MarketingFooter } from '@/components/marketing/footer'
import { AgentWorkspace } from '@/components/agent/workspace'

const DEMO_SCRIPT = `import asyncio
from distillcore_agents import Orchestrator

PDF_URL = "https://www.fincen.gov/system/files/2026-04/FactSheet-PPSI-program-NPRM.pdf"

async def main():
    async with Orchestrator(openai_api_key="sk-...") as orch:
        result = await orch.process_one(PDF_URL)

        print(f"Preset:   {result.triage.preset}")
        print(f"Chunks:   {result.processing.chunk_count}")
        print(f"Coverage: {result.qa.end_to_end_coverage:.0%}")
        print(f"Verified: {result.qa.verified}")

asyncio.run(main())`

export default function AgentPage() {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(DEMO_SCRIPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <MarketingHeader />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-3">Agent Pipeline</h1>
          <p className="text-neutral-400 mb-8 max-w-2xl">
            Real-time visualization of the 4-agent document processing pipeline.
            Triage assesses the document, Processing runs the pipeline, QA validates quality,
            and Research re-processes if QA fails.
          </p>
          <AgentWorkspace />

          {/* Try it yourself */}
          <div className="mt-6 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-neutral-300 hover:text-white transition-colors"
            >
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span>Try it yourself</span>
              <span className="text-neutral-600 text-xs ml-1">— run the same pipeline locally</span>
            </button>
            {expanded && (
              <div className="border-t border-neutral-800 relative">
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 text-neutral-500 hover:text-white transition-colors p-1"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
                <pre className="p-4 text-sm font-mono text-neutral-300 leading-relaxed overflow-x-auto">
                  {DEMO_SCRIPT}
                </pre>
                <div className="px-4 pb-3">
                  <p className="text-[11px] text-neutral-600">
                    Requires <span className="text-neutral-500">pip install distillcore-agents</span> and an OpenAI API key.
                    The demo above processes this same{' '}
                    <a
                      href="https://www.fincen.gov/system/files/2026-04/FactSheet-PPSI-program-NPRM.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      FinCEN fact sheet
                    </a>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
