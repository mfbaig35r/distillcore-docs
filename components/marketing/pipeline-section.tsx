'use client'

import { motion } from 'framer-motion'
import {
  FileText,
  Tag,
  LayoutList,
  Scissors,
  Sparkles,
  Binary,
  ShieldCheck,
} from 'lucide-react'

const stages = [
  {
    icon: FileText,
    name: 'Extract',
    description: 'Pull text from PDF, DOCX, HTML, TXT, and Markdown files. OCR fallback for scanned documents.',
  },
  {
    icon: Tag,
    name: 'Classify',
    description: 'Identify document type, title, author, and domain-specific metadata using LLM analysis.',
  },
  {
    icon: LayoutList,
    name: 'Structure',
    description: 'Parse document structure into hierarchical sections with headings, body text, and tables.',
  },
  {
    icon: Scissors,
    name: 'Chunk',
    description: 'Split into semantic chunks with configurable target size and character overlap for retrieval.',
  },
  {
    icon: Sparkles,
    name: 'Enrich',
    description: 'Add topic labels, key concepts, and relevance scores to each chunk via LLM enrichment.',
  },
  {
    icon: Binary,
    name: 'Embed',
    description: 'Generate vector embeddings with OpenAI, Ollama, local sentence-transformers, or Cohere.',
  },
  {
    icon: ShieldCheck,
    name: 'Validate',
    description: 'Verify text coverage, chunk completeness, and end-to-end quality at each stage boundary.',
  },
]

export function PipelineSection() {
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
          7-stage pipeline
        </h2>
        <p className="text-neutral-400 max-w-xl">
          Each stage validates its output before passing to the next. Coverage
          thresholds ensure nothing is lost in translation.
        </p>
      </motion.div>

      <div className="grid gap-4 max-w-2xl">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.name}
            className="flex items-start gap-4 bg-neutral-900/50 border border-neutral-800 rounded-xl p-4"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <div className="bg-purple-500/10 rounded-lg p-2.5 shrink-0">
              <stage.icon size={18} className="text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-neutral-500">{i + 1}</span>
                <h3 className="font-semibold text-white">{stage.name}</h3>
              </div>
              <p className="text-sm text-neutral-400">{stage.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  )
}
