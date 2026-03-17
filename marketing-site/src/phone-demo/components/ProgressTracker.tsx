import React from 'react'

interface Payment {
  id: string
  date: string
  amount: string
  status: 'completed' | 'upcoming' | 'overdue' | 'current'
}

interface ProgressTrackerProps {
  totalPayments: number
  completedPayments: number
  payments: Payment[]
  totalAmount: string
  paidAmount: string
}

export default function ProgressTracker({
  totalPayments,
  completedPayments,
  payments,
  totalAmount,
  paidAmount,
}: ProgressTrackerProps) {
  const progress = totalPayments > 0 ? completedPayments / totalPayments : 0

  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/50 shadow-lg">
      <h3 className="text-white text-lg font-bold mb-4">Payment Progress</h3>

      {/* Progress bar */}
      <div className="h-2.5 rounded-full bg-slate-700/50 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #0EA5E9 0%, #6366F1 50%, #8B5CF6 100%)',
          }}
        />
      </div>

      <div className="flex justify-between mt-2 mb-4">
        <span className="text-slate-400 text-[13px] font-medium">
          {completedPayments} of {totalPayments} payments
        </span>
        <span className="text-indigo-400 text-[13px] font-bold">
          {Math.round(progress * 100)}%
        </span>
      </div>

      {/* Amount summary */}
      <div className="flex items-center py-3 mb-5">
        <div className="flex-1 text-center">
          <p className="text-slate-500 text-xs font-medium mb-1">Paid</p>
          <p className="text-emerald-400 text-[22px] font-extrabold">{paidAmount}</p>
        </div>
        <div className="w-px h-10 bg-slate-700" />
        <div className="flex-1 text-center">
          <p className="text-slate-500 text-xs font-medium mb-1">Total</p>
          <p className="text-white text-[22px] font-extrabold">{totalAmount}</p>
        </div>
      </div>

      {/* Timeline */}
      <div>
        {payments.map((payment, index) => {
          const isLast = index === payments.length - 1
          const dotColorClass =
            payment.status === 'completed'
              ? 'bg-emerald-400'
              : payment.status === 'current'
              ? 'bg-indigo-400'
              : payment.status === 'overdue'
              ? 'bg-rose-400'
              : 'bg-slate-600'

          const lineColorClass =
            payment.status === 'completed' ? 'bg-emerald-400' : 'bg-slate-700'

          return (
            <div key={payment.id} className="flex">
              <div className="flex flex-col items-center w-8">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${dotColorClass} ${
                    payment.status === 'current' ? 'ring-[3px] ring-indigo-400/30 w-6 h-6' : ''
                  }`}
                >
                  {payment.status === 'completed' && (
                    <span className="text-white text-[10px] font-extrabold">✓</span>
                  )}
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-[24px] ${lineColorClass}`} />
                )}
              </div>
              <div className="flex-1 pb-5 pl-3">
                <p className="text-slate-400 text-[13px] font-medium">{payment.date}</p>
                <p className="text-white text-base font-bold mt-0.5">{payment.amount}</p>
                {payment.status === 'current' && (
                  <span className="inline-block bg-indigo-500/20 text-indigo-400 text-[11px] font-bold rounded-md px-2 py-0.5 mt-1">
                    Next up
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
