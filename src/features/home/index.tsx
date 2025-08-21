import LandingLayout from '@/components/layouts/landing/layout'
import Wrapper from './components/global/wrapper'
// import Analysis from './components/marketing/analysis'
// import Companies from './components/marketing/companies'
import CTA from './components/marketing/cta'
// import Features from './components/marketing/features'
import Hero from './components/marketing/hero'
// import Integration from './components/marketing/integration'
// import LanguageSupport from './components/marketing/lang-support'
// import Pricing from './components/marketing/pricing'

const Home = () => {
  return (
    <LandingLayout>
      <div className='min-h-screen bg-background text-foreground antialiased font-heading overflow-x-hidden !scrollbar-hide'>
        <Wrapper className='py-20 relative'>
          <Hero />
          {/* <Companies />
          <Features />
          <Analysis />
          <Integration />
          <Pricing />
          <LanguageSupport /> */}
          <CTA />
        </Wrapper>
      </div>
    </LandingLayout>
  )
}

export default Home
