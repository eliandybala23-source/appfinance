import { useEffect, useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { db, initDefaultCategories, Category, Transaction } from './db/db'
import { Header } from './components/Header'
import { TransactionList } from './components/TransactionList'
import { TransactionModal } from './components/TransactionModal'
import { MonthlySummary } from './components/MonthlySummary'

export function App() {
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Monitora conectividade para o selo offline
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

  // Carrega categorias e transações do IndexedDB local
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

  // Cálculos de saldo
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-slate-900 text-slate-100 shadow-2xl relative">
      {/* Cabeçalho Fixo com Saldo e Status Offline */}
      <Header
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        isOnline={isOnline}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        <MonthlySummary transactions={transactions} />
        <TransactionList
          transactions={transactions}
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
