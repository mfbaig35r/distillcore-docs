import { Head } from 'nextra/components'
import Script from 'next/script'
import 'nextra-theme-docs/style.css'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'distillcore — Intelligent Document Processing',
    template: '%s | distillcore'
  },
  description: 'Intelligent document processing pipeline with AI agents. Extract, classify, structure, chunk, enrich, embed, and validate documents with a 7-stage pipeline and 4-agent orchestration layer.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'distillcore — Intelligent Document Processing',
    description: 'A 7-stage document processing pipeline with autonomous AI agent orchestration.',
    siteName: 'distillcore',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'distillcore — Intelligent Document Processing',
    description: 'A 7-stage document processing pipeline with autonomous AI agent orchestration.',
  },
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <Head
        color={{
          hue: { dark: 271, light: 271 },
          saturation: { dark: 91, light: 91 },
          lightness: { dark: 65, light: 45 },
        }}
      />
      <body>
        <Script
          id="force-dark-mode"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.remove('light');
              document.documentElement.classList.add('dark');
              document.documentElement.style.colorScheme = 'dark';
              try { localStorage.setItem('theme', 'dark'); } catch(e) {}
            `,
          }}
        />
        {children}
      </body>
    </html>
  )
}
