'use client'

import { motion } from 'framer-motion'
import {
  FileText,
  Binary,
  Palette,
  Database,
  Zap,
  Bot,
  Shield,
  TestTubeDiagonal,
} from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: '5 file formats',
    description: 'PDF, DOCX, HTML, TXT, and Markdown with a pluggable extractor protocol for custom formats.',
  },
  {
    icon: Binary,
    title: '4 embedding providers',
    description: 'OpenAI, Ollama, local sentence-transformers, and Cohere. Bring your own embedding function.',
  },
  {
    icon: Palette,
    title: 'Domain presets',
    description: 'Generic and legal presets out of the box. Create custom presets with your own LLM prompts.',
  },
  {
    icon: Database,
    title: 'SQLite storage',
    description: 'Cosine similarity search, tenant isolation, and full document lifecycle in a single file.',
  },
  {
    icon: Zap,
    title: 'Async & batch',
    description: 'process_document_async, process_batch with configurable max_concurrent for throughput.',
  },
  {
    icon: Bot,
    title: '4-agent layer',
    description: 'Triage, Processing, QA, and Research agents with autonomous orchestration and streaming.',
  },
  {
    icon: Shield,
    title: 'Security hardened',
    description: 'Path traversal prevention, prompt injection hardening, tenant isolation, config validation.',
  },
  {
    icon: TestTubeDiagonal,
    title: 'Tested & published',
    description: 'Comprehensive test suite across both packages with CI/CD pipelines. Published to PyPI.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-28 border-t border-neutral-800">
      <div className="max-w-5xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Built for production
        </h2>
        <p className="text-neutral-400 max-w-xl">
          Everything you need to process documents at scale, from extraction
          to semantic search.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <div className="bg-purple-500/10 rounded-lg p-2 w-fit mb-3">
              <feature.icon size={18} className="text-purple-400" />
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">{feature.title}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  )
}
