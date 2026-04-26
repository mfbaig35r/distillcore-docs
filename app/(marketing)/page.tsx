import { Hero } from '@/components/marketing/hero'
import { PipelineSection } from '@/components/marketing/pipeline-section'
import { FeaturesSection } from '@/components/marketing/features-section'
import { CTASection } from '@/components/marketing/cta-section'

export default function HomePage() {
  return (
    <>
      <Hero />
      <PipelineSection />
      <FeaturesSection />
      <CTASection />
    </>
  )
}
