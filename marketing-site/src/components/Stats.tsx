import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'

const stats = [
  { value: 5, suffix: 'min', label: 'Average time to offer', sublabel: 'Down from 25 min phone calls' },
  { value: 85, suffix: '%', label: 'First-contact resolution', sublabel: 'Up from 62% industry average' },
  { value: 55, suffix: '%', label: 'Settlement acceptance', sublabel: 'vs 38% with legacy process' },
  { value: 65, suffix: '%', label: '90-day plan adherence', sublabel: 'vs 44% without AI matching' },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [current, setCurrent] = useState(0)
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      setCurrent(Math.min(Math.round(increment * step), value))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <span ref={ref} className="font-mono font-bold">
      {current}
      <span className="gradient-text">{suffix}</span>
    </span>
  )
}

export default function Stats() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Numbers that <span className="gradient-text">speak volumes</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Real results from institutions that switched from rule-based questionnaires to AI-powered conversations.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl glass-light hover:bg-white/[0.06] transition-colors group"
            >
              <div className="text-5xl sm:text-6xl mb-3 group-hover:scale-110 transition-transform">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm font-semibold text-slate-200 mb-1">{stat.label}</p>
              <p className="text-xs text-slate-500">{stat.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
