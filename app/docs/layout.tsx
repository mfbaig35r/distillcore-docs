import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import { MarketingHeader } from '@/components/marketing/header'

const navbar = (
  <Navbar
    logo={<span />}
    projectLink="https://github.com/mfbaig35r/distillcore"
  />
)

const footer = (
  <Footer>
    <div className="flex flex-col items-center gap-2 text-sm">
      <p>&copy; {new Date().getFullYear()} distillcore &mdash; MIT License</p>
      <p className="text-neutral-500">
        A{' '}
        <a
          href="https://cognitionkernel.agency"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          Cognition Kernel
        </a>
        {' '}project
      </p>
    </div>
  </Footer>
)

export default async function DocsLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pageMap = await getPageMap('/docs')

  return (
    <>
      <MarketingHeader />
      <div className="pt-16">
        <Layout
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/mfbaig35r/distillcore-docs/tree/main"
          footer={footer}
          editLink="Edit this page on GitHub"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          toc={{ backToTop: true }}
          darkMode={false}
        >
          {children}
        </Layout>
      </div>
    </>
  )
}
