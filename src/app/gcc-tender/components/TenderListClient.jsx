'use client'

import { useState, useMemo, useCallback } from 'react'
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns'
import { zhTW } from 'date-fns/locale'

import MetricCards from './MetricCards'
import TenderFilters from './TenderFilters'
import TenderTable from './TenderTable'

export default function TenderListClient({ initialData = [], fieldMapping = [] }) {
  // 篩選狀態
  const [searchTerm, setSearchTerm] = useState('')
  const [procurementLevel, setProcurementLevel] = useState('all')
  const [dateRange, setDateRange] = useState({ from: null, to: null })

  // 分頁狀態
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)

  // 排序狀態
  const [sortConfig, setSortConfig] = useState({ key: 'announcement_date', direction: 'desc' })

  // 處理排序
  const handleSort = useCallback(key => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
    setCurrentPage(1)
  }, [])

  // 篩選後的資料
  const filteredData = useMemo(() => {
    let result = [...initialData]

    // 標案名稱篩選
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase()
      result = result.filter(
        item =>
          item.tender_name?.toLowerCase().includes(lowerSearch) ||
          item.org_name?.toLowerCase().includes(lowerSearch) ||
          item.tender_no?.toLowerCase().includes(lowerSearch)
      )
    }

    // 採購級距篩選
    if (procurementLevel !== 'all') {
      if (procurementLevel === 'null') {
        result = result.filter(item => !item.procurement_level)
      } else {
        result = result.filter(item => item.procurement_level === procurementLevel)
      }
    }

    // 日期範圍篩選
    if (dateRange.from || dateRange.to) {
      result = result.filter(item => {
        if (!item.announcement_date) return false
        const itemDate = parseISO(item.announcement_date)

        if (dateRange.from && dateRange.to) {
          return isWithinInterval(itemDate, {
            start: startOfDay(dateRange.from),
            end: endOfDay(dateRange.to),
          })
        }

        if (dateRange.from) {
          return itemDate >= startOfDay(dateRange.from)
        }

        if (dateRange.to) {
          return itemDate <= endOfDay(dateRange.to)
        }

        return true
      })
    }

    // 排序
    result.sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      // 處理空值
      if (aValue == null) aValue = ''
      if (bValue == null) bValue = ''

      // 數字排序
      if (sortConfig.key === 'budget') {
        aValue = parseFloat(String(aValue).replace(/,/g, '')) || 0
        bValue = parseFloat(String(bValue).replace(/,/g, '')) || 0
      }

      // 日期排序
      if (sortConfig.key === 'announcement_date') {
        aValue = aValue ? new Date(aValue).getTime() : 0
        bValue = bValue ? new Date(bValue).getTime() : 0
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [initialData, searchTerm, procurementLevel, dateRange, sortConfig])

  // 分頁資料
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredData.slice(startIndex, startIndex + pageSize)
  }, [filteredData, currentPage, pageSize])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  // 重設篩選
  const handleResetFilters = useCallback(() => {
    setSearchTerm('')
    setProcurementLevel('all')
    setDateRange({ from: null, to: null })
    setCurrentPage(1)
  }, [])

  // 篩選變更時重設頁碼
  const handleSearchChange = useCallback(value => {
    setSearchTerm(value)
    setCurrentPage(1)
  }, [])

  const handleProcurementLevelChange = useCallback(value => {
    setProcurementLevel(value)
    setCurrentPage(1)
  }, [])

  const handleDateRangeChange = useCallback(range => {
    setDateRange(range)
    setCurrentPage(1)
  }, [])

  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      {/* 頁面標題 */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">政府採購標案查詢</h1>
        <p className="text-sm text-slate-500">政府電子採購網標案資料檢視系統</p>
      </div>

      {/* 統計卡片 */}
      <MetricCards data={initialData} filteredData={filteredData} />

      {/* 篩選器 */}
      <TenderFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        procurementLevel={procurementLevel}
        onProcurementLevelChange={handleProcurementLevelChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onResetFilters={handleResetFilters}
      />

      {/* 表格 */}
      <TenderTable
        data={paginatedData}
        totalCount={filteredData.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
    </div>
  )
}
