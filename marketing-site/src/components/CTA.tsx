import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Calendar, Mail } from 'lucide-react'

export default function CTA() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section id="contact" ref={ref} className="relative py-16 overflow-hidden">
      {/* Massive gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-slate-300">Limited beta spots available</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-balance">
            Ready to reimagine
            <br />
            <span className="gradient-text">hardship assistance?</span>
          </h2>

          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-12 text-balance">
            Join leading lending institutions that are replacing rigid questionnaires with
            AI-powered empathy. See easefinancials in action with your own data.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="mailto:demo@easefinancials.com"
              className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 font-semibold text-lg shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              <Calendar className="w-5 h-5" />
              Book a Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="mailto:hello@easefinancials.com"
              className="group w-full sm:w-auto px-8 py-4 rounded-2xl glass font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <Mail className="w-5 h-5" />
              Contact Sales
            </a>
          </div>

          {/* Trust elements */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
            <span>No credit card required</span>
            <span className="hidden sm:inline">·</span>
            <span>14-day free pilot</span>
            <span className="hidden sm:inline">·</span>
            <span>Setup in 48 hours</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
