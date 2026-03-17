import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Comparison from './components/Comparison'
import Products from './components/Products'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import CTA from './components/CTA'
import Footer from './components/Footer'
import DemoModal from './components/DemoModal'

export default function App() {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-white noise-bg">
      <Navbar onWatchDemo={() => setDemoOpen(true)} />
      <Hero onWatchDemo={() => setDemoOpen(true)} />
      <Stats />
      <Features />
      <HowItWorks />
      <Comparison />
      <Products />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  )
}
