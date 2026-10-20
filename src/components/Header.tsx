import React from 'react'
import { Wallet, TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react'

interface HeaderProps {
  totalIncome: number
  totalExpense: number
  isOnline: boolean
}

export const Header: React.FC<HeaderProps> = ({ totalIncome, totalExpense, isOnline }) => {
  const balance = totalIncome - totalExpense
  const formatMoney = (cents: number) => {
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/60 p-4 sticky top-0 z-30 pt-safe">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-medium text-slate-400">Finanças PWA</h1>
            <p className="text-xl font-bold tracking-tight text-white">{formatMoney(balance)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/60 border border-slate-700">
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300">Offline</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/40 border border-slate-700/40 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Receitas</p>
            <p className="text-sm font-semibold text-emerald-400">{formatMoney(totalIncome)}</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-700/40 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Despesas</p>
            <p className="text-sm font-semibold text-rose-400">{formatMoney(totalExpense)}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
