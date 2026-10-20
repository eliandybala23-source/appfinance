import React from 'react'
import { PieChart } from 'lucide-react'
import { Transaction, Category } from '../db/db'

interface CategoryBreakdownProps {
  transactions: Transaction[]
  categories: Category[]
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ transactions, categories }) => {
  const categoryMap = new Map(categories.map(c => [c.id, c]))
  const despesas = transactions.filter(t => t.type === 'expense')
  const totalDespesas = despesas.reduce((acc, t) => acc + t.amount, 0)

  const gastosPorCategoria: Record<number, number> = {}
  despesas.forEach(t => {
    gastosPorCategoria[t.categoryId] = (gastosPorCategoria[t.categoryId] || 0) + t.amount
  })

  return (
    <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-4">
      <div className="flex items-center gap-2 text-slate-400 mb-3">
        <PieChart className="w-4 h-4 text-emerald-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider">Gastos por Categoria</h3>
      </div>
      <div className="space-y-3">
        {Object.entries(gastosPorCategoria).map(([catId, amount]) => {
          const cat = categoryMap.get(Number(catId))
          const percent = totalDespesas > 0 ? Math.round((amount / totalDespesas) * 100) : 0
          return (
            <div key={catId}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">{cat?.name || 'Outros'}</span>
                <span className="text-slate-400 font-bold">{percent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${cat?.color || 'bg-emerald-500'}`} 
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default CategoryBreakdown