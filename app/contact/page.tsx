'use client'

import { MarketingHeader } from '@/components/marketing/header'
import { MarketingFooter } from '@/components/marketing/footer'
import { ExternalLink } from 'lucide-react'

const channels = [
  {
    title: 'distillcore Issues',
    description: 'Bug reports and feature requests for the core library',
    href: 'https://github.com/mfbaig35r/distillcore/issues',
  },
  {
    title: 'distillcore-agents Issues',
    description: 'Bug reports and feature requests for the agent layer',
    href: 'https://github.com/mfbaig35r/distillcore-agents/issues',
  },
  {
    title: 'PyPI — distillcore',
    description: 'Package page with version history and install instructions',
    href: 'https://pypi.org/project/distillcore/',
  },
  {
    title: 'Documentation',
    description: 'Full documentation with API reference and guides',
    href: '/docs',
    internal: true,
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <MarketingHeader />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-3">Contact & Support</h1>
          <p className="text-neutral-400 mb-8">
            Get help, report bugs, or request features through these channels.
          </p>
          <div className="grid gap-4">
            {channels.map(ch => (
              <a
                key={ch.title}
                href={ch.href}
                {...(ch.internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                className="flex items-center justify-between bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl p-4 transition-colors group"
              >
                <div>
                  <h3 className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{ch.description}</p>
                </div>
                {!ch.internal && <ExternalLink size={14} className="text-neutral-600 group-hover:text-neutral-400 shrink-0" />}
              </a>
            ))}
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  )
}
