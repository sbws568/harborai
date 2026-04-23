import { motion } from 'framer-motion'
import { ArrowRight, Play, Shield, Zap, Heart } from 'lucide-react'

export default function Hero({ onWatchDemo }: { onWatchDemo: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-sky-500/20 blur-[128px] animate-float" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/15 blur-[128px] animate-float-delayed" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[128px] animate-float-slow" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-slate-300">Now in private beta for lending institutions</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-8 text-balance"
        >
          Hardship assistance
          <br />
          <span className="gradient-text">reimagined with AI</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 text-balance leading-relaxed"
        >
          Replace rigid questionnaires with empathetic AI conversations.
          Verify income with real data. Deliver personalized offers in under 5 minutes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <a
            href="#contact"
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 font-semibold text-lg shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            Request a Demo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <button
            onClick={onWatchDemo}
            className="group px-8 py-4 rounded-full glass font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            </div>
            Watch It Work
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>SOC 2 Type II</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>CFPB Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>5-min resolution</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-400" />
            <span>4.8/5 customer rating</span>
          </div>
        </motion.div>

        {/* Hero visual — Chat mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 relative max-w-4xl mx-auto"
        >
          {/* Glow behind */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-violet-500/20 blur-3xl rounded-3xl" />

          {/* Main card */}
          <div className="relative glass rounded-3xl p-1">
            <div className="bg-slate-900/80 rounded-[22px] overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-lg bg-white/5 text-xs text-slate-500 font-mono">
                    app.easefinancials.com
                  </div>
                </div>
              </div>

              {/* Chat mockup */}
              <div className="p-6 sm:p-10 space-y-5">
                {/* AI message */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                  className="flex gap-3 max-w-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold">E</span>
                  </div>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl rounded-tl-md px-5 py-3.5">
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                      Hey Sarah! I'm here to help figure out the best path forward for your account.
                      No judgment, no pressure — just real options that work for your situation.
                    </p>
                  </div>
                </motion.div>

                {/* User message */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                  className="flex justify-end"
                >
                  <div className="bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 rounded-2xl rounded-tr-md px-5 py-3.5 max-w-sm">
                    <p className="text-sm sm:text-base leading-relaxed">
                      I lost my job two months ago. I've been doing gig work but it's not enough.
                    </p>
                  </div>
                </motion.div>

                {/* AI response with offer */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                  className="flex gap-3 max-w-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold">E</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl rounded-tl-md px-5 py-3.5">
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                        I hear you — that's a tough spot. Based on your financial snapshot, here's what I can do:
                      </p>
                    </div>
                    {/* Mini offer card */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">RECOMMENDED</span>
                      </div>
                      <p className="text-lg font-bold text-white font-mono">$2,100 <span className="text-sm font-normal text-emerald-400">one-time settlement</span></p>
                      <p className="text-sm text-emerald-400 mt-1">You save $2,100 (50% off)</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
