import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Smartphone,
  Monitor,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Bell,
  Headphones,
  BarChart3,
  ShieldCheck,
  Zap,
  Eye,
  Brain,
} from 'lucide-react'
import PhoneApp from '../phone-demo/PhoneApp'

function CopilotShowcase() {
  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-indigo-500/10 blur-3xl rounded-3xl" />

      <div className="relative glass rounded-2xl p-1 max-w-[640px] mx-auto">
        <div className="bg-slate-900/90 rounded-xl overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-[10px] text-slate-400 font-mono ml-2">easefinancials Agent Copilot</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-mono">12:34</span>
            </div>
          </div>

          {/* Three-panel layout */}
          <div className="flex min-h-[320px]">
            {/* Left panel */}
            <div className="w-[160px] border-r border-white/5 p-3 space-y-3">
              <div>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Customer</p>
                <p className="text-xs font-semibold text-white">James Patterson</p>
                <p className="text-[10px] text-slate-400">Auto Loan • ****7234</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">Balance</span>
                  <span className="font-mono text-white">$18,450</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">DPD</span>
                  <span className="font-mono text-amber-400">47</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">Risk</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/20 text-amber-400">MEDIUM</span>
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 space-y-1.5">
                <p className="text-[9px] text-slate-500 uppercase tracking-wider">Financial</p>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">Income</span>
                  <span className="font-mono text-emerald-400">$4.2K</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">DTI</span>
                  <span className="font-mono text-amber-400">68%</span>
                </div>
              </div>
            </div>

            {/* Center panel */}
            <div className="flex-1 p-3 border-r border-white/5">
              <div className="space-y-2 mb-3">
                <div className="flex gap-2">
                  <span className="text-[9px] text-indigo-400 font-semibold w-12 flex-shrink-0 pt-0.5">Agent</span>
                  <p className="text-[10px] text-slate-300 bg-white/5 rounded-lg px-2 py-1.5">
                    Hi James, I can see you're going through a tough time. Let me help.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[9px] text-amber-400 font-semibold w-12 flex-shrink-0 pt-0.5">James</span>
                  <p className="text-[10px] text-slate-300 bg-white/5 rounded-lg px-2 py-1.5">
                    My hours got cut. I can pay something but not the full amount.
                  </p>
                </div>
              </div>

              {/* AI Suggestion */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-2.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Brain className="w-3 h-3 text-indigo-400" />
                  <span className="text-[9px] font-semibold text-indigo-400">AI SUGGESTION</span>
                  <span className="ml-auto text-[8px] text-indigo-400/60">87% confidence</span>
                </div>
                <p className="text-[10px] text-slate-300 mb-2">
                  "I hear you, James. Based on your situation, I can offer a reduced payment plan..."
                </p>
                <div className="flex gap-1.5">
                  <button className="px-2 py-1 rounded text-[9px] font-semibold bg-indigo-500 text-white">Use</button>
                  <button className="px-2 py-1 rounded text-[9px] font-semibold bg-white/5 text-slate-400">Edit</button>
                  <button className="px-2 py-1 rounded text-[9px] font-semibold text-slate-500">Skip</button>
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="w-[160px] p-3 space-y-3">
              <div>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Scores</p>
                <div className="flex justify-around">
                  {[
                    { label: 'ABL', val: 38, color: '#FBBF24' },
                    { label: 'INT', val: 72, color: '#34D399' },
                    { label: 'RSK', val: 65, color: '#818CF8' },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <svg width="36" height="36" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15" fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round"
                          strokeDasharray={`${(s.val / 100) * 94.2} 94.2`}
                          transform="rotate(-90 18 18)"
                          style={{ filter: `drop-shadow(0 0 4px ${s.color}40)` }}
                        />
                        <text x="18" y="21" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono, monospace">{s.val}</text>
                      </svg>
                      <p className="text-[8px] text-slate-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
                <span className="text-[8px] font-bold text-emerald-400">RECOMMENDED</span>
                <p className="text-xs font-bold font-mono text-white mt-0.5">$290/mo</p>
                <p className="text-[9px] text-emerald-400">Payment reduction</p>
              </div>

              <div className="space-y-1">
                <p className="text-[9px] text-slate-500 uppercase tracking-wider">Compliance</p>
                {['FFIEC Logged', 'Consent', 'Documented'].map((item, i) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-sm flex items-center justify-center ${i < 2 ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                      {i < 2 && <Check className="w-2 h-2 text-emerald-400" />}
                    </div>
                    <span className="text-[9px] text-slate-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Check(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

const mobileFeatures = [
  { icon: MessageSquare, text: 'Natural AI chat' },
  { icon: CreditCard, text: 'One-tap bank connect' },
  { icon: TrendingUp, text: 'Plan tracking' },
  { icon: Bell, text: 'Smart reminders' },
]

const copilotFeatures = [
  { icon: Headphones, text: 'Real-time transcription' },
  { icon: Brain, text: 'AI-suggested responses' },
  { icon: BarChart3, text: 'Live scoring dashboard' },
  { icon: ShieldCheck, text: 'Compliance guardrails' },
]

export default function Products() {
  const { ref: mobileRef, inView: mobileInView } = useInView({ threshold: 0.1, triggerOnce: true })
  const { ref: copilotRef, inView: copilotInView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="products" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-sm font-semibold text-indigo-400 tracking-wider uppercase mb-4 block">
            Two Products, One Platform
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Built for <span className="gradient-text">everyone involved</span>
          </h2>
        </div>

        {/* Mobile App */}
        <div ref={mobileRef} className="mb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={mobileInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 mb-6">
                <Smartphone className="w-4 h-4 text-sky-400" />
                <span className="text-sm font-semibold text-sky-400">Customer App</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-bold mb-6">
                Self-serve hardship
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">from their pocket</span>
              </h3>

              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Customers resolve hardship cases from their phone — no hold times, no transfers.
                Connect their bank, chat with AI, accept an offer, and track their plan. All in under 5 minutes.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {mobileFeatures.map((f) => (
                  <div key={f.text} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                    <f.icon className="w-5 h-5 text-sky-400" />
                    <span className="text-sm text-slate-300">{f.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={mobileInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <PhoneApp scale={0.62} />
            </motion.div>
          </div>
        </div>

        {/* Agent Copilot */}
        <div ref={copilotRef}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={copilotInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1"
            >
              <CopilotShowcase />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={copilotInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                <Monitor className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-semibold text-violet-400">Agent Copilot</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-bold mb-6">
                Your agents'
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400">AI superpower</span>
              </h3>

              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                For phone-based interactions, the copilot gives agents real-time AI assistance.
                Suggested responses, live financial insights, scoring, and compliance tracking — all in one dark-mode dashboard.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {copilotFeatures.map((f) => (
                  <div key={f.text} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
                    <f.icon className="w-5 h-5 text-violet-400" />
                    <span className="text-sm text-slate-300">{f.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
