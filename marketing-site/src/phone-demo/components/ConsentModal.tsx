import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConsentModalProps {
  visible: boolean
  onAccept: () => void
  onDecline: () => void
}

export default function ConsentModal({ visible, onAccept, onDecline }: ConsentModalProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 flex items-end z-50"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full bg-slate-900 rounded-t-3xl p-6 pb-10 max-h-[85%] overflow-y-auto phone-scroll"
          >
            <div className="w-10 h-1 rounded-full bg-slate-600 mx-auto mb-5" />

            <p className="text-5xl text-center mb-3">🏦</p>
            <h2 className="text-white text-[22px] font-extrabold text-center mb-2">
              Connect Your Bank Account
            </h2>
            <p className="text-slate-400 text-[15px] text-center leading-[22px] mb-5">
              To find the best hardship options for you, we need to take a quick peek at your finances.
            </p>

            <div className="bg-slate-800/80 rounded-xl p-4 mb-4">
              <p className="text-white text-sm font-bold mb-3">What we'll access:</p>
              {[
                { icon: '💵', text: 'Income verification (last 3 months)' },
                { icon: '📊', text: 'Monthly spending patterns' },
                { icon: '💳', text: 'Existing debt obligations' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 my-1.5">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-slate-400 text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2.5 border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-3.5 mb-4">
              <span className="text-xl mt-0.5">🔒</span>
              <div>
                <p className="text-emerald-400 font-bold text-sm mb-0.5">Bank-level security</p>
                <p className="text-slate-400 text-xs leading-[18px]">
                  Powered by Plaid. We never store your login credentials. Your data is encrypted end-to-end.
                </p>
              </div>
            </div>

            <button
              onClick={onAccept}
              className="w-full h-[60px] rounded-2xl flex items-center justify-center text-white font-bold text-lg mt-4"
              style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 50%, #8B5CF6 100%)' }}
            >
              🔗 Connect My Bank
            </button>

            <button onClick={onDecline} className="w-full mt-3.5 text-center">
              <span className="text-slate-500 text-sm font-medium">Not now, I'll enter info manually</span>
            </button>

            <p className="text-slate-600 text-[10px] text-center mt-4 leading-[15px]">
              By connecting, you agree to our Privacy Policy and authorize HarborAI to retrieve your financial data for hardship assessment purposes only.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
