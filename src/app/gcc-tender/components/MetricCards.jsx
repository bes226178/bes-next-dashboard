'use client'

import { useMemo } from 'react'
import { parseISO, isThisWeek, startOfWeek, endOfWeek } from 'date-fns'
import { FileText, TrendingUp, Calendar, Filter } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

// 格式化金額
function formatAmount(amount) {
  if (!amount || amount === 0) return '0'

  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)} 億`
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)} 萬`
  }
  return amount.toLocaleString()
}

// 計算統計數據
function useMetrics(data, filteredData) {
  return useMemo(() => {
    // 總標案數
    const totalCount = data.length
    const filteredCount = filteredData.length

    // 巨額標案數
    const hugeCount = data.filter(item => item.procurement_level === '巨額').length
    const filteredHugeCount = filteredData.filter(item => item.procurement_level === '巨額').length

    // 本週新增數
    const thisWeekCount = data.filter(item => {
      if (!item.announcement_date) return false
      try {
        const date = parseISO(item.announcement_date)
        return isThisWeek(date, { weekStartsOn: 1 })
      } catch {
        return false
      }
    }).length

    // 總預算金額
    const totalBudget = filteredData.reduce((sum, item) => {
      if (!item.budget) return sum
      const num = parseFloat(String(item.budget).replace(/,/g, ''))
      return isNaN(num) ? sum : sum + num
    }, 0)

    return {
      totalCount,
      filteredCount,
      hugeCount,
      filteredHugeCount,
      thisWeekCount,
      totalBudget,
    }
  }, [data, filteredData])
}

// 單一指標卡片
function MetricCard({ icon: Icon, label, value, subValue, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold tabular-nums text-slate-900">{value}</p>
            {subValue && <p className="mt-0.5 text-xs text-slate-400">{subValue}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MetricCards({ data = [], filteredData = [] }) {
  const metrics = useMetrics(data, filteredData)
  const isFiltered = filteredData.length !== data.length

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* 總標案數 */}
      <MetricCard
        icon={FileText}
        label={isFiltered ? '篩選結果' : '總標案數'}
        value={metrics.filteredCount}
        subValue={isFiltered ? `共 ${metrics.totalCount} 筆` : null}
        color="blue"
      />

      {/* 巨額標案 */}
      <MetricCard
        icon={TrendingUp}
        label="巨額標案"
        value={isFiltered ? metrics.filteredHugeCount : metrics.hugeCount}
        subValue={
          isFiltered && metrics.filteredHugeCount !== metrics.hugeCount
            ? `共 ${metrics.hugeCount} 筆`
            : null
        }
        color="amber"
      />

      {/* 本週新增 */}
      <MetricCard
        icon={Calendar}
        label="本週新增"
        value={metrics.thisWeekCount}
        subValue="依公告日期"
        color="green"
      />

      {/* 預算總額 */}
      <MetricCard
        icon={Filter}
        label={isFiltered ? '篩選預算總額' : '預算總額'}
        value={formatAmount(metrics.totalBudget)}
        subValue="NT$"
        color="purple"
      />
    </div>
  )
}
