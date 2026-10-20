import React from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

interface BudgetAlertProps {
  totalSpentCents: number
  monthlyLimitCents: number
}

export const BudgetAlert: React.FC<BudgetAlertProps> = ({ totalSpentCents, monthlyLimitCents }) => {
  if (monthlyLimitCents <= 0) return null
  const percent = Math.round((totalSpentCents / monthlyLimitCents) * 100)
  const isOver = percent >= 100
  const isWarning = percent >= 80 && !isOver

  return (
    <div className={`p-3.5 rounded-2xl border mb-4 flex items-center gap-3 ${
      isOver 
        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' 
        : isWarning 
        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
        : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
    }`}>
      {isOver || isWarning ? (
        <AlertTriangle className="w-5 h-5 shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 shrink-0" />
      )}
      <div className="text-xs">
        <p className="font-bold">
          {isOver ? 'Orçamento Estourado!' : isWarning ? 'Atenção aos Gastos' : 'Orçamento sob Controle'}
        </p>
        <p className="opacity-80">Você já utilizou {percent}% do limite estipulado para este mês.</p>
      </div>
    </div>
  )
}
export default BudgetAlert