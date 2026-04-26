'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Book,
  Cpu,
  FileText,
  Tag,
  LayoutList,
  Scissors,
  Sparkles,
  Binary,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'

const quickLinks = [
  { href: '/docs/getting-started', label: 'Get Started', icon: Book },
  { href: '/agent', label: 'Agent Playground', icon: Cpu },
]

const pipelineStages = [
  { label: 'extract', icon: FileText },
  { label: 'classify', icon: Tag },
  { label: 'structure', icon: LayoutList },
  { label: 'chunk', icon: Scissors },
  { label: 'enrich', icon: Sparkles },
  { label: 'embed', icon: Binary },
  { label: 'validate', icon: ShieldCheck },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 pt-28 pb-16 md:pt-36 md:pb-20">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-block bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full px-3 py-1 text-xs font-medium mb-6">
            Intelligent Document Processing
          </span>
        </motion.div>

        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          Document processing{' '}
          <span className="text-purple-400">powered by AI agents</span>
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-neutral-400 max-w-2xl mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          A 7-stage pipeline that extracts, classifies, structures, chunks, enriches,
          embeds, and validates documents. An autonomous 4-agent layer handles triage,
          processing, quality assurance, and research.
        </motion.p>

        {/* Install commands */}
        <motion.div
          className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mb-8 max-w-2xl overflow-x-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <pre className="text-sm font-mono leading-relaxed">
            <span className="text-neutral-500">$</span> <span className="text-emerald-400">pip install</span> <span className="text-purple-400">distillcore</span>          <span className="text-neutral-600"># core library</span>
            {'\n'}
            <span className="text-neutral-500">$</span> <span className="text-emerald-400">pip install</span> <span className="text-purple-400">distillcore-agents</span>  <span className="text-neutral-600"># optional agent layer (early)</span>
          </pre>
        </motion.div>

        <motion.p
          className="text-xs text-neutral-500 mb-8 -mt-5 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          MIT licensed &middot; open source &middot; self-hosted
        </motion.p>

        {/* Animated pipeline diagram */}
        <motion.div
          className="mb-10 max-w-3xl overflow-x-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center gap-1 min-w-max">
            {pipelineStages.map((stage, i) => (
              <motion.div
                key={stage.label}
                className="flex items-center"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
              >
                <div className="flex flex-col items-center gap-1.5 bg-neutral-900/80 border border-neutral-800 rounded-lg px-3 py-2.5 min-w-[72px]">
                  <stage.icon size={16} className="text-purple-400" />
                  <span className="text-[11px] text-neutral-300 font-mono">{stage.label}</span>
                </div>
                {i < pipelineStages.length - 1 && (
                  <ArrowRight size={14} className="text-neutral-600 mx-1 shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div
          className="grid grid-cols-2 gap-3 max-w-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-neutral-300 hover:text-white transition-colors"
            >
              <link.icon size={16} className="text-purple-400 shrink-0" />
              {link.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
