import React from 'react'
import { motion } from 'framer-motion'

interface OfferCardProps {
  title: string
  type: 'settlement' | 'payment_plan' | 'counseling'
  amount?: string
  savings?: string
  timeline?: string
  bulletPoints: string[]
  recommended?: boolean
  onAccept?: () => void
  onLearnMore?: () => void
  delay?: number
}

const typeConfig = {
  settlement: { icon: '💰', color: 'bg-emerald-400', dotColor: 'bg-emerald-400' },
  payment_plan: { icon: '📅', color: 'bg-indigo-400', dotColor: 'bg-indigo-400' },
  counseling: { icon: '🤝', color: 'bg-amber-400', dotColor: 'bg-amber-400' },
}

export default function OfferCard({
  title,
  type,
  amount,
  savings,
  timeline,
  bulletPoints,
  recommended = false,
  onAccept,
  onLearnMore,
  delay = 0,
}: OfferCardProps) {
  const config = typeConfig[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-slate-800/80 rounded-2xl p-5 mb-4 overflow-hidden relative border ${
        recommended ? 'border-indigo-500 border-2' : 'border-slate-700/50'
      }`}
    >
      {recommended && (
        <div
          className="absolute top-0 left-0 right-0 py-2 text-center"
          style={{ background: 'linear-gradient(90deg, #0EA5E9 0%, #6366F1 50%, #8B5CF6 100%)' }}
        >
          <span className="text-white font-bold text-[13px]">⭐ Recommended for you</span>
        </div>
      )}

      <div className={`flex items-center gap-3 ${recommended ? 'mt-7' : ''} mb-4`}>
        <span className="text-[32px]">{config.icon}</span>
        <div>
          <h3 className="text-white text-lg font-bold">{title}</h3>
          {timeline && <p className="text-slate-400 text-[13px] mt-0.5">{timeline}</p>}
        </div>
      </div>

      {(amount || savings) && (
        <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
          {amount && (
            <div className="flex justify-between items-center my-1">
              <span className="text-slate-400 text-sm">Amount</span>
              <span className="text-white text-[22px] font-extrabold">{amount}</span>
            </div>
          )}
          {savings && (
            <div className="flex justify-between items-center my-1">
              <span className="text-slate-400 text-sm">You save</span>
              <span className="text-emerald-400 text-lg font-bold">{savings}</span>
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        {bulletPoints.map((point, i) => (
          <div key={i} className="flex items-start gap-2.5 my-1">
            <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor} mt-[9px] flex-shrink-0`} />
            <span className="text-slate-400 text-sm leading-5">{point}</span>
          </div>
        ))}
      </div>

      <div className="mt-1">
        {onAccept && (
          <button
            onClick={onAccept}
            className="w-full h-12 rounded-[14px] flex items-center justify-center text-white font-bold text-base"
            style={
              recommended
                ? { background: 'linear-gradient(90deg, #0EA5E9 0%, #6366F1 50%, #8B5CF6 100%)' }
                : { background: type === 'settlement' ? '#10B981' : '#6366F1' }
            }
          >
            Accept This Offer
          </button>
        )}
        {onLearnMore && (
          <button onClick={onLearnMore} className="w-full mt-3 text-center">
            <span className="text-indigo-400 font-semibold text-sm">Learn more</span>
          </button>
        )}
      </div>
    </motion.div>
  )
}
