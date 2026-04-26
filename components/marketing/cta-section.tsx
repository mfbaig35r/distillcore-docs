import Link from 'next/link'
import { Section } from './section'

export function CTASection() {
  return (
    <Section className="border-t border-neutral-800">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Ready to get started?
        </h2>
        <p className="text-neutral-400 mb-8">
          Install distillcore and process your first document in under a minute.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/docs/getting-started"
            className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/agent"
            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
          >
            Try the Agent Playground
          </Link>
        </div>
      </div>
    </Section>
  )
}
