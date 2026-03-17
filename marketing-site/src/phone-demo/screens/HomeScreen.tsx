import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, BarChart3, Calendar, Settings } from 'lucide-react'

interface HomeScreenProps {
  navigate: (tab: 'home' | 'chat' | 'offers' | 'plan' | 'settings') => void
}

const MOCK_USER = {
  firstName: 'Alex',
  accountNumber: '****4829',
  product: 'Platinum Credit Card',
  balance: '$12,450.00',
  minPayment: '$375.00',
  dpd: 62,
  dueDate: 'Mar 1, 2026',
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function HomeScreen({ navigate }: HomeScreenProps) {
  const quickActions = [
    { icon: MessageCircle, label: 'Chat', tab: 'chat' as const, emoji: '💬' },
    { icon: BarChart3, label: 'Offers', tab: 'offers' as const, emoji: '📊' },
    { icon: Calendar, label: 'My Plan', tab: 'plan' as const, emoji: '📅' },
    { icon: Settings, label: 'Settings', tab: 'settings' as const, emoji: '⚙️' },
  ]

  return (
    <div className="h-full overflow-y-auto phone-scroll bg-slate-950">
      <div className="px-5 pt-4 pb-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-slate-400 text-sm font-medium">{getGreeting()} 👋</p>
            <h1 className="text-white text-[28px] font-extrabold mt-0.5">{MOCK_USER.firstName}</h1>
          </div>
          <button
            onClick={() => navigate('settings')}
            className="w-11 h-11 rounded-full bg-indigo-500 flex items-center justify-center"
          >
            <span className="text-white text-lg font-bold">A</span>
          </button>
        </div>

        {/* Account Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/80 rounded-2xl p-5 mb-5 shadow-lg border border-slate-700/50"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-[15px] font-semibold">{MOCK_USER.product}</p>
              <p className="text-slate-500 text-[13px] mt-0.5">{MOCK_USER.accountNumber}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-rose-500/10 rounded-full px-2.5 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="text-rose-500 text-xs font-bold">{MOCK_USER.dpd} days past due</span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-slate-400 text-[13px] font-medium mb-1">Outstanding Balance</p>
            <p className="text-white text-[32px] font-extrabold tracking-tight">{MOCK_USER.balance}</p>
          </div>

          <div className="h-px bg-slate-700/50 mb-4" />

          <div className="flex">
            <div className="flex-1">
              <p className="text-slate-500 text-xs font-medium mb-0.5">Min. Payment</p>
              <p className="text-white text-base font-bold">{MOCK_USER.minPayment}</p>
            </div>
            <div className="flex-1">
              <p className="text-slate-500 text-xs font-medium mb-0.5">Due Date</p>
              <p className="text-rose-400 text-base font-bold">{MOCK_USER.dueDate}</p>
            </div>
          </div>
        </motion.div>

        {/* Hardship CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[20px] overflow-hidden mb-5 shadow-xl"
        >
          <div
            className="p-6 flex flex-col items-center"
            style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 50%, #8B5CF6 100%)' }}
          >
            <span className="text-[40px] mb-3">🌊</span>
            <h2 className="text-white text-xl font-extrabold text-center mb-2">
              Going through a tough time?
            </h2>
            <p className="text-white/80 text-sm text-center leading-5 mb-5">
              We're here to help. Chat with Harbor AI to explore options that work for your situation.
            </p>
            <button
              onClick={() => navigate('chat')}
              className="bg-white rounded-[14px] px-7 py-3.5 active:scale-95 transition-transform"
            >
              <span className="text-indigo-500 font-bold text-base">Get Help Now  →</span>
            </button>
          </div>
        </motion.div>

        {/* No Active Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/80 rounded-2xl p-6 mb-5 flex flex-col items-center border border-slate-700/50"
        >
          <span className="text-[32px] mb-2">💡</span>
          <h3 className="text-white text-base font-bold mb-1.5">No active plans yet</h3>
          <p className="text-slate-400 text-[13px] text-center leading-5">
            Start a chat with Harbor AI to explore settlement and payment options tailored to you.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <h3 className="text-white text-lg font-bold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2.5">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              onClick={() => navigate(action.tab)}
              className="bg-slate-800/80 rounded-2xl p-4 flex flex-col items-center border border-slate-700/50 active:scale-95 transition-transform"
            >
              <span className="text-2xl mb-1.5">{action.emoji}</span>
              <span className="text-slate-400 text-xs font-semibold">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
