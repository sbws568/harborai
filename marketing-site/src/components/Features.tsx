import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  MessageSquareHeart,
  BrainCircuit,
  Landmark,
  ShieldCheck,
  Smartphone,
  Monitor,
} from 'lucide-react'

const features = [
  {
    icon: MessageSquareHeart,
    title: 'Empathetic AI Conversations',
    description:
      'Natural, warm conversations powered by Claude AI that understand emotional context — not scripted questionnaires that feel like interrogations.',
    color: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/20',
  },
  {
    icon: Landmark,
    title: 'Verified Financial Data',
    description:
      'Connect to real bank data via Plaid and Finicity. See actual income, expenses, and assets — not self-reported guesswork.',
    color: 'from-sky-500 to-cyan-500',
    glow: 'shadow-sky-500/20',
  },
  {
    icon: BrainCircuit,
    title: 'AI Decision Engine',
    description:
      'Three-factor scoring model combines Ability + Intent + Risk into a composite score that determines the optimal offer — personalized for every customer.',
    color: 'from-indigo-500 to-violet-500',
    glow: 'shadow-indigo-500/20',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance by Design',
    description:
      'FFIEC, CFPB, UDAAP, FCRA, and ECOA guardrails baked into every AI decision. Full audit trail. Disparate impact testing built in.',
    color: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
  },
  {
    icon: Smartphone,
    title: 'Self-Serve Mobile App',
    description:
      'Customers resolve hardship cases from their phone in under 5 minutes. No hold times, no transfers, no stress.',
    color: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/20',
  },
  {
    icon: Monitor,
    title: 'Agent Copilot',
    description:
      'Real-time AI assistant for phone agents. Suggested responses, live scoring, compliance checklist — all in one panel.',
    color: 'from-violet-500 to-purple-500',
    glow: 'shadow-violet-500/20',
  },
]

export default function Features() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="features" ref={ref} className="relative py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-indigo-400 tracking-wider uppercase mb-4 block">
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
            Everything you need to
            <br />
            <span className="gradient-text">transform hardship assistance</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            From AI-powered conversations to verified financial data — easefinancials gives lending
            institutions the tools to help customers when they need it most.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-8 rounded-2xl glass-light hover:bg-white/[0.06] transition-all duration-300 cursor-default"
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${feature.glow} shadow-2xl`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
