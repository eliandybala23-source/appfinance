import { describe, it, expect, beforeEach } from 'vitest'
import { FinanceDatabase, initDefaultCategories } from '../src/db/db'

describe('Offline Finance Database (Dexie.js / IndexedDB)', () => {
  let testDb: FinanceDatabase

  beforeEach(async () => {
    testDb = new FinanceDatabase('TestFinancasDB_' + Math.random())
    await testDb.open()
  })

  it('deve inicializar categorias padrão se o banco estiver vazio', async () => {
    await initDefaultCategories(testDb)
    const count = await testDb.categories.count()
    expect(count).toBe(8)
    
    const alimentacao = await testDb.categories.where('name').equals('Alimentação').first()
    expect(alimentacao).toBeDefined()
    expect(alimentacao?.color).toBe('bg-emerald-500')
  })

  it('deve cadastrar uma transação e recuperar pelo tipo', async () => {
    const id = await testDb.transactions.add({
      description: 'Almoço Restaurante',
      amount: 3500, // R$ 35,00
      type: 'expense',
      categoryId: 1,
      date: '2026-10-20',
      createdAt: Date.now()
    })

    expect(id).toBeDefined()

    const expenses = await testDb.transactions.where('type').equals('expense').toArray()
    expect(expenses.length).toBe(1)
    expect(expenses[0].amount).toBe(3500)
    expect(expenses[0].description).toBe('Almoço Restaurante')
  })

  it('deve calcular o saldo corretamente entre receitas e despesas', async () => {
    await testDb.transactions.bulkAdd([
      { description: 'Salário', amount: 500000, type: 'income', categoryId: 7, date: '2026-10-01', createdAt: 1 },
      { description: 'Aluguel', amount: 150000, type: 'expense', categoryId: 3, date: '2026-10-05', createdAt: 2 },
      { description: 'Mercado', amount: 45000, type: 'expense', categoryId: 1, date: '2026-10-10', createdAt: 3 }
    ])

    const all = await testDb.transactions.toArray()
    const saldo = all.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount
    }, 0)

    // 5000 - 1500 - 450 = 3050 reais (305000 centavos)
    expect(saldo).toBe(305000)
  })
})
