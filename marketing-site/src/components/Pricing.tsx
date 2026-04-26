import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check, Sparkles, Building2, Rocket } from 'lucide-react'

const tiers = [
  {
    name: 'Starter',
    icon: Rocket,
    price: '$2',
    unit: '/ account',
    description: 'For institutions testing AI-powered hardship workflows.',
    features: [
      'Up to 500 accounts/month',
      'Customer self-serve app',
      'Basic AI conversation engine',
      'Plaid integration',
      'Standard offer templates',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
    color: 'from-sky-500 to-cyan-500',
  },
  {
    name: 'Professional',
    icon: Sparkles,
    price: '$3.50',
    unit: '/ account',
    description: 'Full platform with copilot for operations teams.',
    features: [
      'Unlimited accounts',
      'Customer self-serve app',
      'Agent Copilot (up to 50 seats)',
      'Advanced AI scoring engine',
      'Plaid + Finicity + IRS verification',
      'Custom offer rules engine',
      'A/B testing framework',
      'Priority support + SLA',
      'Compliance dashboard',
    ],
    cta: 'Get Started',
    popular: true,
    color: 'from-indigo-500 to-violet-500',
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: 'Custom',
    unit: '',
    description: 'For large institutions with complex requirements.',
    features: [
      'Everything in Professional',
      'Unlimited agent seats',
      'On-premise / VPC deployment',
      'Custom LLM fine-tuning',
      'Dedicated success manager',
      'Custom integrations',
      'SSO / LDAP / SAML',
      'Uptime SLA (99.99%)',
      'Quarterly business reviews',
    ],
    cta: 'Contact Sales',
    popular: false,
    color: 'from-amber-500 to-orange-500',
  },
]

export default function Pricing({ onContact }: { onContact: (subject?: string) => void }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="pricing" ref={ref} className="relative py-16">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-indigo-400 tracking-wider uppercase mb-4 block">
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Pay per account entering your hardship workflow. No hidden fees, no long-term contracts.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative p-8 rounded-2xl transition-all ${
                tier.popular
                  ? 'glass glow-indigo scale-105'
                  : 'glass-light hover:bg-white/[0.04]'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-xs font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-5`}>
                <tier.icon className="w-5 h-5 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
              <p className="text-sm text-slate-400 mb-6">{tier.description}</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold font-mono text-white">{tier.price}</span>
                <span className="text-slate-400">{tier.unit}</span>
              </div>

              <div className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onContact(
                  tier.name === 'Enterprise'
                    ? 'Contact Sales — easefinancials'
                    : 'Book a Demo — easefinancials'
                )}
                className={`block w-full text-center py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  tier.popular
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Success fee note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-slate-500 mt-8"
        >
          Optional success-based pricing available: 0.5-1% of recovered amount on settlements.
        </motion.p>
      </div>
    </section>
  )
}
