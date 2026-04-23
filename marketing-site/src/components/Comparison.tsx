import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { X, Check, ArrowRight } from 'lucide-react'

const beforeItems = [
  { text: 'Rigid 5-question dropdown questionnaire', icon: X },
  { text: 'Self-reported income (often inaccurate)', icon: X },
  { text: 'Same buckets for every customer', icon: X },
  { text: '25-minute average phone call', icon: X },
  { text: 'Agent reads from a script', icon: X },
  { text: 'Binary offer: take it or leave it', icon: X },
  { text: 'No follow-up or progress tracking', icon: X },
]

const afterItems = [
  { text: 'Natural AI conversation that adapts', icon: Check },
  { text: 'Verified data via Plaid & IRS APIs', icon: Check },
  { text: 'Personalized scoring per customer', icon: Check },
  { text: 'Under 5 minutes self-serve resolution', icon: Check },
  { text: 'AI copilot suggests next-best-actions', icon: Check },
  { text: 'Multiple tailored options with explanations', icon: Check },
  { text: 'Active plan tracking with smart reminders', icon: Check },
]

export default function Comparison() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section ref={ref} className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-indigo-400 tracking-wider uppercase mb-4 block">
            Before & After
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            See the <span className="gradient-text">difference</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative p-8 rounded-2xl bg-red-500/[0.03] border border-red-500/10"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Legacy Process</h3>
                <p className="text-xs text-slate-500">Rule-based, one-size-fits-all</p>
              </div>
            </div>

            <div className="space-y-4">
              {beforeItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-400" />
                  </div>
                  <span className="text-sm text-slate-400">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative p-8 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10 glow-emerald"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">With easefinancials</h3>
                <p className="text-xs text-emerald-400">AI-powered, personalized</p>
              </div>
            </div>

            <div className="space-y-4">
              {afterItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-200">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors group"
          >
            See how it works for your institution
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
