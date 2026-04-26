'use client'

import { motion } from 'framer-motion'
import { Github, Mail } from 'lucide-react'
import { MarketingHeader } from '@/components/marketing/header'
import { MarketingFooter } from '@/components/marketing/footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <MarketingHeader />

      <main className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              About
            </h1>
            <p className="text-neutral-400 max-w-2xl mb-12">
              distillcore is built and maintained by Fahad Baig.
            </p>
          </motion.div>

          {/* Author card */}
          <motion.div
            className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 md:p-8 max-w-2xl mb-12"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-start gap-5">
              <div className="bg-purple-500/10 rounded-full p-4 shrink-0">
                <span className="text-2xl font-bold text-purple-400">FB</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  Fahad Baig
                </h2>
                <p className="text-sm text-neutral-400 mb-4">
                  Builder & maintainer of distillcore
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://github.com/mfbaig35r"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg px-3 py-2 transition-colors"
                  >
                    <Github size={14} />
                    GitHub
                  </a>
                  <a
                    href="mailto:mfbaig35r@gmail.com"
                    className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg px-3 py-2 transition-colors"
                  >
                    <Mail size={14} />
                    Email
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              The ecosystem
            </h2>

            <div className="grid gap-4 max-w-2xl">
              <ProjectCard
                name="distillcore"
                description="Universal document processing library. 7-stage pipeline: extract, classify, structure, chunk, enrich, embed, validate. 8 file formats, 4 embedding providers, SQLite storage."
                href="https://github.com/mfbaig35r/distillcore"
                pypi="https://pypi.org/project/distillcore/"
                version="v0.4.0"
              />
              <ProjectCard
                name="distillcore-agents"
                description="Pydantic-AI agent layer. 4-agent sequential pipeline (Triage, Processing, QA, Research) that autonomously configures and validates the distillcore pipeline."
                href="https://github.com/mfbaig35r/distillcore-agents"
                version="v0.1.0"
              />
              <ProjectCard
                name="distillcore-docs"
                description="This site. Next.js documentation with interactive agent playground, real-time execution DAG, and force-directed architecture graph."
                href="https://github.com/mfbaig35r/distillcore-docs"
              />
            </div>
          </motion.div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}

function ProjectCard({
  name,
  description,
  href,
  pypi,
  version,
}: {
  name: string
  description: string
  href: string
  pypi?: string
  version?: string
}) {
  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="font-semibold text-white text-sm">{name}</h3>
        {version && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
            {version}
          </span>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {pypi && (
            <a
              href={pypi}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              PyPI
            </a>
          )}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <Github size={14} />
          </a>
        </div>
      </div>
      <p className="text-xs text-neutral-400 leading-relaxed">{description}</p>
    </div>
  )
}
