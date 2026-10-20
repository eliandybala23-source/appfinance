import React from 'react'
import { Transaction, Category, db } from '../db/db'
import { Trash2, Tag, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface TransactionListProps {
  transactions: Transaction[]
  categories: Category[]
  onDeleteSuccess: () => void
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  onDeleteSuccess
}) => {
  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  const formatMoney = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    if (confirm('Deseja excluir esta anotação?')) {
      await db.transactions.delete(id)
      onDeleteSuccess()
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
          <Tag className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-300">Nenhuma anotação ainda</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Toque no botão "+" abaixo para registrar seu primeiro gasto ou ganho offline.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-2">
        Histórico Recente ({transactions.length})
      </h2>

      {transactions.map((tx) => {
        const cat = categoryMap.get(tx.categoryId)
        const isIncome = tx.type === 'income'

        return (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/40 hover:border-slate-700 transition"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${
                  cat?.color || (isIncome ? 'bg-emerald-600' : 'bg-slate-700')
                }`}
              >
                {isIncome ? (
                  <ArrowDownLeft className="w-4 h-4 text-emerald-200" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-rose-200" />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-white leading-tight">{tx.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-slate-400">{cat?.name || 'Geral'}</span>
                  <span className="text-[10px] text-slate-600">•</span>
                  <span className="text-[11px] text-slate-500">{tx.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-bold tracking-tight ${
                  isIncome ? 'text-emerald-400' : 'text-slate-200'
                }`}
              >
                {isIncome ? '+' : '-'} {formatMoney(tx.amount)}
              </span>

              <button
                onClick={() => handleDelete(tx.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
