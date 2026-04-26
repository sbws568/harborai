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
import ContactModal from './components/ContactModal'

export default function App() {
  const [demoOpen, setDemoOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [contactSubject, setContactSubject] = useState('Book a Demo — easefinancials')

  const openContact = (subject?: string) => {
    setContactSubject(subject ?? 'Book a Demo — easefinancials')
    setContactOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white noise-bg">
      <Navbar onWatchDemo={() => setDemoOpen(true)} onContact={openContact} />
      <Hero onWatchDemo={() => setDemoOpen(true)} onContact={openContact} />
      <Stats />
      <Features />
      <HowItWorks />
      <Comparison />
      <Products />
      <Testimonials />
      <Pricing onContact={openContact} />
      <CTA onContact={openContact} />
      <Footer />
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} defaultSubject={contactSubject} />
    </div>
  )
}
