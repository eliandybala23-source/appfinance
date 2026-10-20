import React from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

interface MonthFilterProps {
  currentMonth: string // formato YYYY-MM
  onMonthChange: (newMonth: string) => void
}

export const MonthFilter: React.FC<MonthFilterProps> = ({ currentMonth, onMonthChange }) => {
  const handlePrev = () => {
    const [year, month] = currentMonth.split('-').map(Number)
    const prevDate = new Date(year, month - 2, 1)
    const formatted = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`
    onMonthChange(formatted)
  }

  const handleNext = () => {
    const [year, month] = currentMonth.split('-').map(Number)
    const nextDate = new Date(year, month, 1)
    const formatted = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`
    onMonthChange(formatted)
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-4">
      <button 
        onClick={handlePrev} 
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-2 text-sm font-bold text-white">
        <Calendar className="w-4 h-4 text-emerald-400" />
        <span>{currentMonth}</span>
      </div>
      <button 
        onClick={handleNext} 
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
export default MonthFilter