import React from 'react'

interface FinancialSnapshotProps {
  monthlyIncome: string
  monthlyExpenses: string
  disposableIncome: string
  debtToIncome: string
  creditScore?: string
}

export default function FinancialSnapshot({
  monthlyIncome,
  monthlyExpenses,
  disposableIncome,
  debtToIncome,
  creditScore,
}: FinancialSnapshotProps) {
  const ratio = parseFloat(debtToIncome)
  const dtiColor = ratio < 36 ? 'text-emerald-400' : ratio < 50 ? 'text-amber-400' : 'text-rose-400'

  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/50 shadow-lg my-2">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📊</span>
        <h3 className="text-white text-[17px] font-bold">Your Financial Snapshot</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-slate-700/50 rounded-xl p-3.5">
          <p className="text-slate-400 text-xs font-medium mb-1">Monthly Income</p>
          <p className="text-emerald-400 text-xl font-extrabold">{monthlyIncome}</p>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-3.5">
          <p className="text-slate-400 text-xs font-medium mb-1">Monthly Expenses</p>
          <p className="text-rose-400 text-xl font-extrabold">{monthlyExpenses}</p>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-3.5">
          <p className="text-slate-400 text-xs font-medium mb-1">Disposable Income</p>
          <p className="text-indigo-400 text-xl font-extrabold">{disposableIncome}</p>
        </div>
        <div className="bg-slate-700/50 rounded-xl p-3.5">
          <p className="text-slate-400 text-xs font-medium mb-1">Debt-to-Income</p>
          <p className={`text-xl font-extrabold ${dtiColor}`}>{debtToIncome}%</p>
        </div>
      </div>

      {creditScore && (
        <div className="bg-slate-700/50 rounded-xl p-3.5 mt-1 flex justify-between items-center">
          <span className="text-slate-400 text-[13px] font-medium">Estimated Credit Score</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-amber-400 text-2xl font-extrabold">{creditScore}</span>
            <span className="text-slate-500 text-sm font-medium">/ 850</span>
          </div>
        </div>
      )}

      <p className="text-slate-500 text-[11px] text-center mt-3">
        Based on your connected bank account data. Updated just now.
      </p>
    </div>
  )
}
