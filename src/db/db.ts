import Dexie, { type EntityTable } from 'dexie'

export interface Category {
  id?: number
  name: string
  icon: string
  color: string
  order: number
}

export interface Transaction {
  id?: number
  description: string
  amount: number // Armazenado em centavos (ex: R$ 15,50 -> 1550) para evitar erros de float
  type: 'expense' | 'income'
  categoryId: number
  date: string // YYYY-MM-DD
  createdAt: number
}

export class FinanceDatabase extends Dexie {
  categories!: EntityTable<Category, 'id'>
  transactions!: EntityTable<Transaction, 'id'>

  constructor(dbName = 'FinancasOfflineDB') {
    super(dbName)
    this.version(1).stores({
      categories: '++id, name, order',
      transactions: '++id, type, categoryId, date, createdAt'
    })
  }
}

export const db = new FinanceDatabase()

export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Alimentação', icon: 'Utensils', color: 'bg-emerald-500', order: 1 },
  { name: 'Transporte', icon: 'Car', color: 'bg-blue-500', order: 2 },
  { name: 'Moradia', icon: 'Home', color: 'bg-amber-500', order: 3 },
  { name: 'Lazer', icon: 'Gamepad2', color: 'bg-purple-500', order: 4 },
  { name: 'Saúde', icon: 'HeartPulse', color: 'bg-rose-500', order: 5 },
  { name: 'Educação', icon: 'GraduationCap', color: 'bg-indigo-500', order: 6 },
  { name: 'Salário', icon: 'Banknote', color: 'bg-green-600', order: 7 },
  { name: 'Outros', icon: 'MoreHorizontal', color: 'bg-slate-500', order: 8 }
]

export async function initDefaultCategories(database: FinanceDatabase = db) {
  const count = await database.categories.count()
  if (count === 0) {
    await database.categories.bulkAdd(DEFAULT_CATEGORIES)
  }
}
