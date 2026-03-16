import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "Our settlement acceptance rate jumped from 38% to 57% in the first quarter. HarborAI's personalized offers actually match what customers can afford.",
    name: 'Rebecca Chen',
    role: 'VP Collections Strategy',
    company: 'Regional Credit Union ($4B AUM)',
    avatar: 'RC',
    rating: 5,
    color: 'from-sky-500 to-indigo-500',
  },
  {
    quote: "The agent copilot cut our average handle time in half. New agents ramp up in days instead of weeks because the AI guides every conversation.",
    name: 'Marcus Williams',
    role: 'Director of Operations',
    company: 'Mid-size Bank (Top 50)',
    avatar: 'MW',
    rating: 5,
    color: 'from-indigo-500 to-violet-500',
  },
  {
    quote: "I was scared to call about my debt. But using the app felt like texting a friend who actually understood my situation. I got a plan I can actually stick to.",
    name: 'Sarah M.',
    role: 'Customer',
    company: 'Credit card holder',
    avatar: 'SM',
    rating: 5,
    color: 'from-violet-500 to-pink-500',
  },
  {
    quote: "Compliance was our biggest concern. HarborAI's built-in guardrails and audit trail made our legal team comfortable from day one. FFIEC sign-off was smooth.",
    name: 'David Park',
    role: 'Chief Compliance Officer',
    company: 'Digital Lending Platform',
    avatar: 'DP',
    rating: 5,
    color: 'from-emerald-500 to-teal-500',
  },
]

export default function Testimonials() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-indigo-400 tracking-wider uppercase mb-4 block">
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Loved by <span className="gradient-text">institutions & customers</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-light rounded-2xl p-8 hover:bg-white/[0.04] transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-6">
                <Quote className="absolute -top-2 -left-1 w-8 h-8 text-white/5" />
                <p className="text-slate-300 leading-relaxed pl-4">{t.quote}</p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
