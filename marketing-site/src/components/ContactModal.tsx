import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Mail, Phone, Linkedin, Calendar } from 'lucide-react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  defaultSubject?: string
}

const SUBJECTS = [
  'Book a Demo — easefinancials',
  'Contact Sales — easefinancials',
  'Pricing Inquiry — easefinancials',
  'Partnership Inquiry — easefinancials',
  'General Inquiry — easefinancials',
]

const TO = 'contactus@easefinancials.com'

export default function ContactModal({ isOpen, onClose, defaultSubject }: ContactModalProps) {
  const [subject, setSubject] = useState(defaultSubject ?? SUBJECTS[0])
  const [body, setBody] = useState('')

  useEffect(() => {
    if (defaultSubject) setSubject(defaultSubject)
  }, [defaultSubject])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSend = () => {
    const params = new URLSearchParams()
    params.set('subject', subject)
    if (body) params.set('body', body)
    window.location.href = `mailto:${TO}?${params.toString()}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute -top-11 right-0 p-2 text-slate-400 hover:text-white transition-colors group flex items-center gap-2"
            >
              <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">ESC</span>
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl shadow-black/60">
              {/* Header bar */}
              <div className="flex items-center gap-2 px-5 py-3 bg-slate-800/60 border-b border-white/5">
                <div className="flex gap-1.5">
                  <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-lg bg-white/5 text-xs text-slate-500 font-mono">
                    easefinancials — Contact Us
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-[1fr_280px]">
                {/* Left — Form */}
                <div className="p-7 space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Get in touch</h2>
                    <p className="text-sm text-slate-400">We typically respond within a few hours.</p>
                  </div>

                  {/* To */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">To</label>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-slate-300">
                      <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span className="font-mono">{TO}</span>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-slate-200 outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition-all appearance-none"
                      style={{ colorScheme: 'dark' }}
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s} style={{ background: '#0f172a' }}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Message</label>
                    <textarea
                      rows={5}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Tell us about your institution, team size, and what you're hoping to achieve..."
                      className="w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition-all resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSend}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Send Email
                  </button>
                </div>

                {/* Right — Contact card */}
                <div className="border-l border-white/5 bg-white/[0.02] p-7 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-5">Your point of contact</p>

                    {/* Avatar */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-lg font-black text-white shadow-lg shadow-indigo-500/20 flex-shrink-0">
                        SB
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">Shantanu Biswas</p>
                        <p className="text-xs text-slate-400 leading-snug mt-0.5">Sales Enablement &<br />Client Relationship Expert</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <a
                        href="tel:+919172274442"
                        className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span className="font-mono">+91 917 227 4442</span>
                      </a>

                      <a
                        href={`mailto:${TO}`}
                        className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                          <Mail className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span className="truncate text-xs">{TO}</span>
                      </a>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      <span className="text-xs text-slate-500">Response within a few hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                      <span className="text-xs text-slate-500">Limited beta spots available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
