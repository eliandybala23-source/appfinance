import { Transaction, Category } from '../db/db'

export function exportToCSV(transactions: Transaction[], categories: Category[]): void {
  const categoryMap = new Map(categories.map(c => [c.id, c.name]))
  const headers = ['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor (R$)']
  const rows = transactions.map(t => [
    t.date,
    t.type === 'income' ? 'Receita' : 'Despesa',
    t.description,
    categoryMap.get(t.categoryId) || 'Geral',
    (t.amount / 100).toFixed(2).replace('.', ',')
  ])
  const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'financas.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function exportToJSON(transactions: Transaction[], categories: Category[]): void {
  const data = JSON.stringify({ transactions, categories }, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'backup_financas.json'
  a.click()
  URL.revokeObjectURL(url)
}