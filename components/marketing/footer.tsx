import Link from 'next/link'
import { Layers } from 'lucide-react'

const columns = [
  {
    title: 'Library',
    links: [
      { label: 'Getting Started', href: '/docs/getting-started' },
      { label: 'Configuration', href: '/docs/configuration' },
      { label: 'API Reference', href: '/docs/api' },
      { label: 'Extractors', href: '/docs/extractors' },
    ],
  },
  {
    title: 'Agents',
    links: [
      { label: 'Agent Overview', href: '/docs/agents' },
      { label: 'Orchestrator', href: '/docs/agents/orchestrator' },
      { label: 'Architecture', href: '/architecture' },
      { label: 'Agent Playground', href: '/agent' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'distillcore', href: 'https://github.com/mfbaig35r/distillcore', external: true },
      { label: 'distillcore-agents', href: 'https://github.com/mfbaig35r/distillcore-agents', external: true },
      { label: 'PyPI', href: 'https://pypi.org/project/distillcore/', external: true },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...('external' in link ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers size={20} className="text-purple-400" />
            <span className="font-bold text-white">distillcore</span>
          </div>
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} distillcore &mdash; MIT License &mdash; A{' '}
            <a
              href="https://cognitionkernel.agency"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Cognition Kernel
            </a>{' '}
            project
          </p>
        </div>
      </div>
    </footer>
  )
}
