import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MessageCircle, Link2, Brain, Gift } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MessageCircle,
    title: 'Start a Conversation',
    description:
      'Customer opens the app or calls in. Our AI greets them warmly and begins understanding their situation through natural conversation — no rigid dropdown menus.',
    visual: (
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex-shrink-0" />
          <div className="bg-indigo-500/10 rounded-xl rounded-tl-sm px-3 py-2 text-xs text-slate-300">
            Hey! Tell me what's been going on.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-xl rounded-tr-sm px-3 py-2 text-xs text-slate-300 max-w-[180px]">
            I lost my job 2 months ago...
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '02',
    icon: Link2,
    title: 'Connect Financial Data',
    description:
      'With one tap, customers securely connect their bank via Plaid. We see real income, expenses, and assets — no more guessing.',
    visual: (
      <div className="space-y-2">
        {[
          { label: 'Monthly Income', value: '$2,400', color: 'text-emerald-400' },
          { label: 'Expenses', value: '$2,250', color: 'text-amber-400' },
          { label: 'Disposable', value: '$150', color: 'text-sky-400' },
        ].map((item) => (
          <div key={item.label} className="flex justify-between items-center px-3 py-1.5 rounded-lg bg-white/5 text-xs">
            <span className="text-slate-400">{item.label}</span>
            <span className={`font-mono font-bold ${item.color}`}>{item.value}</span>
          </div>
        ))}
        <div className="text-center text-[10px] text-emerald-400/60 pt-1">Verified via Plaid</div>
      </div>
    ),
  },
  {
    number: '03',
    icon: Brain,
    title: 'AI Analyzes & Scores',
    description:
      'Our decision engine combines conversation signals + verified financials + account risk into a composite score that determines the best path forward.',
    visual: (
      <div className="flex items-center justify-center gap-4">
        {[
          { label: 'Ability', score: 42, color: '#FBBF24' },
          { label: 'Intent', score: 78, color: '#34D399' },
          { label: 'Risk', score: 55, color: '#818CF8' },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke={item.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(item.score / 100) * 150.8} 150.8`}
                transform="rotate(-90 28 28)"
                style={{ filter: `drop-shadow(0 0 6px ${item.color}40)` }}
              />
              <text x="28" y="32" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="JetBrains Mono, monospace">
                {item.score}
              </text>
            </svg>
            <p className="text-[10px] text-slate-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '04',
    icon: Gift,
    title: 'Personalized Offers',
    description:
      'Customer receives tailored options — settlements, payment plans, or counseling referrals — each explained clearly with total savings and timelines.',
    visual: (
      <div className="space-y-2">
        <div className="px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">BEST MATCH</span>
          </div>
          <p className="text-sm font-bold font-mono text-white">$2,100 <span className="text-xs font-normal text-emerald-400">settlement</span></p>
        </div>
        <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5">
          <p className="text-xs font-semibold text-slate-300">$85/mo x 12 months</p>
          <p className="text-[10px] text-slate-500">Payment plan at 6.25% APR</p>
        </div>
      </div>
    ),
  },
]

export default function HowItWorks() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="how-it-works" ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-semibold text-indigo-400 tracking-wider uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            From distress to resolution
            <br />
            <span className="gradient-text">in 4 simple steps</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] right-[-40px] h-px bg-gradient-to-r from-white/10 to-transparent" />
              )}

              <div className="text-center">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 mb-6">
                  <span className="text-sm font-bold font-mono gradient-text">{step.number}</span>
                </div>

                {/* Visual card */}
                <div className="glass-light rounded-2xl p-5 mb-6 min-h-[140px] flex items-center justify-center">
                  {step.visual}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
