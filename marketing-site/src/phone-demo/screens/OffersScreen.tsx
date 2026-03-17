import React, { useState } from 'react'
import { motion } from 'framer-motion'
import OfferCard from '../components/OfferCard'

interface OffersScreenProps {
  navigate: (tab: 'home' | 'chat' | 'offers' | 'plan' | 'settings') => void
}

export default function OffersScreen({ navigate }: OffersScreenProps) {
  const [, setAccepted] = useState(false)

  const handleAccept = (offerType: string) => {
    if (confirm(`Are you sure you want to accept the ${offerType}? This will start your hardship program.`)) {
      setAccepted(true)
      alert("You're all set! 🎉 Your hardship plan is now active.")
      navigate('plan')
    }
  }

  return (
    <div className="h-full overflow-y-auto phone-scroll bg-slate-950">
      {/* Header gradient */}
      <div
        className="p-7 pt-5 flex flex-col items-center"
        style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 50%, #8B5CF6 100%)' }}
      >
        <span className="text-[40px] mb-2">🎯</span>
        <h2 className="text-white text-[22px] font-extrabold text-center mb-2">
          Your Personalized Offers
        </h2>
        <p className="text-white/80 text-sm text-center leading-5">
          Based on your financial situation, here are the best options we've found for you.
        </p>
      </div>

      <div className="px-4 pb-8">
        {/* Savings bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2.5 p-3.5 mt-4 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
        >
          <span className="text-xl">💰</span>
          <p className="text-emerald-400 text-sm font-medium flex-1">
            You could save up to <span className="font-extrabold text-base">$5,602</span> on your balance!
          </p>
        </motion.div>

        {/* Settlement offer (recommended) */}
        <OfferCard
          title="One-Time Settlement"
          type="settlement"
          recommended
          amount="$6,847"
          savings="$5,603 (45%)"
          timeline="Pay within 60 days"
          bulletPoints={[
            'Biggest savings — nearly half off your balance',
            'Account resolved in one payment',
            'Reported as "settled" to credit bureaus',
            'No more collection calls or late fees',
          ]}
          onAccept={() => handleAccept('settlement offer')}
          onLearnMore={() => {}}
          delay={0.2}
        />

        {/* Payment plan */}
        <OfferCard
          title="6-Month Payment Plan"
          type="payment_plan"
          amount="$1,556/mo"
          savings="$3,114 (25%)"
          timeline="6 monthly payments"
          bulletPoints={[
            'Spread payments over 6 months',
            'Fixed monthly amount — no surprises',
            '0% interest during the plan',
            'Account marked as "in hardship program"',
          ]}
          onAccept={() => handleAccept('payment plan')}
          onLearnMore={() => {}}
          delay={0.3}
        />

        {/* Credit counseling */}
        <OfferCard
          title="Credit Counseling Referral"
          type="counseling"
          timeline="Free consultation"
          bulletPoints={[
            'Speak with a certified credit counselor',
            'Get a comprehensive debt management plan',
            'May help negotiate with all your creditors',
            'Free and confidential — no obligation',
          ]}
          onLearnMore={() => alert('We partner with NFCC-certified counselors who can help you create a holistic debt management plan.')}
          delay={0.4}
        />

        {/* Disclaimer */}
        <div className="bg-slate-800/60 rounded-xl p-4 mt-2">
          <p className="text-slate-400 text-sm font-semibold mb-1.5">ℹ️ Important Information</p>
          <p className="text-slate-500 text-xs leading-[18px]">
            Settlement offers may impact your credit score. Forgiven debt over $600 may be reported as
            taxable income (1099-C). We recommend consulting a tax professional. Offers are valid for 14
            days from today.
          </p>
        </div>
      </div>
    </div>
  )
}
