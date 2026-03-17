import React from 'react'
import { motion } from 'framer-motion'
import ProgressTracker from '../components/ProgressTracker'

const MOCK_PLAN = {
  type: '6-Month Payment Plan',
  status: 'active',
  startDate: 'Jan 15, 2026',
  endDate: 'Jul 15, 2026',
  totalAmount: '$9,336',
  paidAmount: '$3,112',
  monthlyPayment: '$1,556',
  nextPaymentDate: 'Apr 15, 2026',
  totalPayments: 6,
  completedPayments: 2,
  payments: [
    { id: '1', date: 'Jan 15, 2026', amount: '$1,556.00', status: 'completed' as const },
    { id: '2', date: 'Feb 15, 2026', amount: '$1,556.00', status: 'completed' as const },
    { id: '3', date: 'Mar 15, 2026', amount: '$1,556.00', status: 'current' as const },
    { id: '4', date: 'Apr 15, 2026', amount: '$1,556.00', status: 'upcoming' as const },
    { id: '5', date: 'May 15, 2026', amount: '$1,556.00', status: 'upcoming' as const },
    { id: '6', date: 'Jun 15, 2026', amount: '$1,556.00', status: 'upcoming' as const },
  ],
}

interface MyPlanScreenProps {
  navigate: (tab: 'home' | 'chat' | 'offers' | 'plan' | 'settings') => void
}

export default function MyPlanScreen({ navigate }: MyPlanScreenProps) {
  return (
    <div className="h-full overflow-y-auto phone-scroll bg-slate-950" style={{ overscrollBehavior: 'contain' }}>
      {/* Status header */}
      <div
        className="p-6 pt-4 flex flex-col items-center"
        style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)' }}
      >
        <div className="flex items-center gap-2 bg-white/20 rounded-full px-3.5 py-1.5 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-white font-bold text-[13px]">Active Plan</span>
        </div>
        <h2 className="text-white text-[22px] font-extrabold mb-1">{MOCK_PLAN.type}</h2>
        <p className="text-white/70 text-[13px]">
          {MOCK_PLAN.startDate} — {MOCK_PLAN.endDate}
        </p>
      </div>

      <div className="px-4 pb-8">
        {/* Next Payment Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/80 rounded-2xl p-5 mt-4 border border-slate-700/50 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📅</span>
            <span className="text-slate-400 text-sm font-medium">Next Payment Due</span>
          </div>
          <p className="text-white text-[36px] font-extrabold tracking-tight mb-1">
            {MOCK_PLAN.monthlyPayment}
          </p>
          <p className="text-indigo-400 text-[15px] font-semibold mb-4">
            {MOCK_PLAN.nextPaymentDate}
          </p>

          <div className="flex gap-3 mb-4">
            <button
              className="flex-1 h-[52px] rounded-2xl flex items-center justify-center text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 50%, #8B5CF6 100%)' }}
            >
              💳 Make Payment
            </button>
            <button className="flex-1 h-[52px] rounded-2xl border-2 border-indigo-500 flex items-center justify-center text-indigo-400 font-bold">
              Autopay
            </button>
          </div>

          <div className="flex items-center gap-2 bg-amber-500/10 rounded-xl p-3">
            <span className="text-base">⏰</span>
            <p className="text-amber-400 text-xs font-medium flex-1">
              Payment due in 28 days. Set up autopay to never miss one!
            </p>
          </div>
        </motion.div>

        {/* Progress Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <ProgressTracker
            totalPayments={MOCK_PLAN.totalPayments}
            completedPayments={MOCK_PLAN.completedPayments}
            payments={MOCK_PLAN.payments}
            totalAmount={MOCK_PLAN.totalAmount}
            paidAmount={MOCK_PLAN.paidAmount}
          />
        </motion.div>

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <h3 className="text-white text-lg font-bold mb-3">Payment History</h3>
          {MOCK_PLAN.payments
            .filter((p) => p.status === 'completed')
            .reverse()
            .map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center bg-slate-800/80 rounded-xl border border-slate-700/50 p-4 mb-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 font-extrabold text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{payment.date}</p>
                    <p className="text-emerald-400 text-xs font-semibold mt-0.5">Paid</p>
                  </div>
                </div>
                <span className="text-white text-base font-bold">{payment.amount}</span>
              </div>
            ))}
        </motion.div>

        {/* Help section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/80 rounded-2xl p-5 mt-4 flex flex-col items-center border border-slate-700/50"
        >
          <span className="text-[28px] mb-2">🆘</span>
          <h3 className="text-white text-base font-bold mb-1.5">Need to adjust your plan?</h3>
          <p className="text-slate-400 text-[13px] text-center leading-5 mb-4">
            If your situation has changed, chat with Harbor AI to explore modifications.
          </p>
          <button
            onClick={() => navigate('chat')}
            className="border-[1.5px] border-indigo-500 rounded-xl px-5 py-2.5"
          >
            <span className="text-indigo-400 font-semibold text-sm">💬 Chat with Harbor AI</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
