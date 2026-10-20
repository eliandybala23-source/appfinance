import React, { useState } from 'react'
import { X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { Category, db } from '../db/db'
import { CategoryPicker } from './CategoryPicker'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  onSuccess: () => void
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSuccess
}) => {
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [description, setDescription] = useState('')
  const [amountInput, setAmountInput] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(categories[0]?.id || 1)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amountInput || !description || !categoryId) return

    setIsSubmitting(true)
    try {
      // Normaliza vírgula para ponto e converte para centavos inteiros
      const cleanAmount = parseFloat(amountInput.replace(',', '.'))
      if (isNaN(cleanAmount) || cleanAmount <= 0) return

      const cents = Math.round(cleanAmount * 100)

      await db.transactions.add({
        description,
        amount: cents,
        type,
        categoryId,
        date,
        createdAt: Date.now()
      })

      // Reset e fecha
      setDescription('')
      setAmountInput('')
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Erro ao salvar transação offline:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-700/60 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto pb-safe"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">Nova Anotação</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Seletor Tipo: Despesa vs Receita */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownCircle className="w-4 h-4" />
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              Receita
            </button>
          </div>

          {/* Campo Valor em destaque com moeda */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Valor (R$)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-base">
                R$
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white text-lg font-bold placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Descrição</label>
            <input
              type="text"
              placeholder="Ex: Almoço, Supermercado, Salário..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-3.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Carrossel de Categorias */}
          <CategoryPicker
            categories={categories}
            selectedId={categoryId}
            onSelect={(id) => setCategoryId(id)}
          />

          {/* Data */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Botão de Salvar Visível */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Anotação'}
          </button>
        </form>
      </div>
    </div>
  )
}
