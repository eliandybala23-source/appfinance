import React from 'react'
import { Calendar, AlertCircle, ArrowUpRight } from 'lucide-react'
import { Transaction } from '../db/db'

interface MonthlySummaryProps {
  transactions: Transaction[]
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({ transactions }) => {
  const totalDespesasCentavos = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)

  const formatMoney = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const totalReceitasCentavos = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)

  const totalSaldoCentavos = totalReceitasCentavos - totalDespesasCentavos

  return (
    <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-4">
      <div className="flex items-center gap-2 text-slate-400 mb-2">
        <Calendar className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-semibold uppercase tracking-wider">Resumo do Mês</span>
      </div>
      <div className="flex items-center gap-2 text-2xl font-bold text-white">
        <span>{formatMoney(totalReceitasCentavos)}</span>
        <span>-</span>
        <span>{formatMoney(totalDespesasCentavos)}</span>
      </div>
      <p className="text-2xl font-bold text-white">{formatMoney(totalSaldoCentavos)}</p>
      <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
        <ArrowUpRight className="w-3.5 h-3.5" />
        <span>Total em despesas registradas</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
        <ArrowUpRight className="w-3.5 h-3.5" />
        <span>Total em receitas registradas</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Saldo do Mês</span>
      </div>
    </div>
  )
}
export default MonthlySummary