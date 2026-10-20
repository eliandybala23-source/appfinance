import { useEffect, useState, useCallback } from 'react'
import { Plus, Download, FileSpreadsheet } from 'lucide-react'
import { db, initDefaultCategories, Category, Transaction } from './db/db'
import { Header } from './components/Header'
import { TransactionList } from './components/TransactionList'
import { TransactionModal } from './components/TransactionModal'
import { MonthlySummary } from './components/MonthlySummary'
import { MonthFilter } from './components/MonthFilter'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { BudgetAlert } from './components/BudgetAlert'
import { exportToCSV, exportToJSON } from './utils/exportData'

export function App() {
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7))
  const [monthlyLimitCents] = useState(300000) // R$ 3.000,00 de teto padrão

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadData = useCallback(async () => {
    await initDefaultCategories()
    const allCategories = await db.categories.orderBy('order').toArray()
    const allTransactions = await db.transactions.reverse().sortBy('createdAt')

    setCategories(allCategories)
    setTransactions(allTransactions)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Filtra transações pelo mês selecionado
  const monthTransactions = transactions.filter((t) => t.date.startsWith(currentMonth))

  // Cálculos baseados no mês selecionado
  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)

  const totalExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-slate-900 text-slate-100 shadow-2xl relative">
      {/* Cabeçalho Fixo */}
      <Header
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        isOnline={isOnline}
      />

      {/* Conteúdo Principal com todas as novidades autônomas */}
      <main className="flex-1 p-4 pb-28 overflow-y-auto">
        {/* Navegador de Meses */}
        <MonthFilter currentMonth={currentMonth} onMonthChange={setCurrentMonth} />

        {/* Alerta de Orçamento (Teto Mensal) */}
        <BudgetAlert totalSpentCents={totalExpense} monthlyLimitCents={monthlyLimitCents} />

        {/* Resumo Mensal */}
        <MonthlySummary transactions={monthTransactions} />

        {/* Barras de Gastos por Categoria */}
        <CategoryBreakdown transactions={monthTransactions} categories={categories} />

        {/* Botões de Ação Rápida de Backup e Exportação */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => exportToCSV(transactions, categories)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 transition active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Exportar CSV
          </button>
          <button
            onClick={() => exportToJSON(transactions, categories)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 transition active:scale-95"
          >
            <Download className="w-4 h-4 text-blue-400" />
            Backup JSON
          </button>
        </div>

        {/* Listagem de Transações Filtradas */}
        <TransactionList
          transactions={monthTransactions}
          categories={categories}
          onDeleteSuccess={loadData}
        />
      </main>

      {/* Botão Flutuante de Adicionar */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-auto sm:left-1/2 sm:translate-x-32 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-950/60 transition duration-200"
          aria-label="Nova Anotação"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* Modal de Criação */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onSuccess={loadData}
      />
    </div>
  )
}

export default App
