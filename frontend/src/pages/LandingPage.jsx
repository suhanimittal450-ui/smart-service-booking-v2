import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import AIWidget from '../components/AIWidget'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 md:pt-32">
        <Hero />
        <Services />
        <HowItWorks />
        <Features />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <AIWidget />
    </>
  )
}
