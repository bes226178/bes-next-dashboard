'use client'

import { useState, useMemo, useEffect } from 'react'

import { Box } from '@mui/material'
import MetricCards from './MetricCards'
import ResignedEmployeeTable from './ResignedEmployeeTable'
import TenureCharts from './TenureCharts'
import TenureHeatmap from './TenureHeatmap'
import ResignYearHeatmap from './ResignYearHeatmap'
import DepartmentTypeFilter from './DepartmentTypeFilter'
import StartYearFilter from './StartYearFilter'

export default function EmployeeResignedAnalysisClient({
  initialEmployees = [],
  initialAllEmployeesForHeatmap = [],
  initialStatistics = null,
}) {
  const [departmentTypeFilter, setDepartmentTypeFilter] = useState('all')

  // 計算入職年份範圍
  const startYearRange = useMemo(() => {
    const allEmployees = [...initialEmployees, ...initialAllEmployeesForHeatmap]
    const years = allEmployees
      .map(emp => {
        const startYear =
          typeof emp.START_YEAR === 'number'
            ? emp.START_YEAR
            : typeof emp.START_YEAR === 'string' && !isNaN(Number(emp.START_YEAR))
              ? Number(emp.START_YEAR)
              : null
        return startYear
      })
      .filter(year => year != null && !isNaN(year))

    if (years.length === 0) {
      const currentYear = new Date().getFullYear()
      return [currentYear - 10, currentYear]
    }

    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)
    return [minYear, maxYear]
  }, [initialEmployees, initialAllEmployeesForHeatmap])

  const [startYearRangeFilter, setStartYearRangeFilter] = useState(startYearRange)

  // 當數據載入時，更新入職年份篩選範圍
  useEffect(() => {
    setStartYearRangeFilter(startYearRange)
  }, [startYearRange])

  // 根據篩選條件過濾員工資料
  const filteredEmployees = useMemo(() => {
    let filtered = initialEmployees

    // 部門類型篩選
    if (departmentTypeFilter !== 'all') {
      filtered = filtered.filter(emp => emp.DEPARTMENT_TYPE === departmentTypeFilter)
    }

    // 入職年份篩選
    filtered = filtered.filter(emp => {
      // 嘗試從多個可能的字段獲取入職年份
      let startYear = null

      // 優先使用 START_YEAR
      if (emp.START_YEAR != null) {
        startYear =
          typeof emp.START_YEAR === 'number'
            ? emp.START_YEAR
            : typeof emp.START_YEAR === 'string' && !isNaN(Number(emp.START_YEAR))
              ? Number(emp.START_YEAR)
              : null
      }

      // 如果沒有 START_YEAR，嘗試從 DATE_START 提取年份
      if (startYear == null && emp.DATE_START) {
        try {
          const date = new Date(emp.DATE_START)
          if (!isNaN(date.getTime())) {
            startYear = date.getFullYear()
          }
        } catch (e) {
          // 忽略日期解析錯誤
        }
      }

      // 如果仍然沒有年份，保留該記錄（不進行年份篩選）
      if (startYear == null || isNaN(startYear)) {
        return true
      }

      return startYear >= startYearRangeFilter[0] && startYear <= startYearRangeFilter[1]
    })

    return filtered
  }, [initialEmployees, departmentTypeFilter, startYearRangeFilter])

  // 根據篩選條件過濾熱力圖員工資料
  const filteredAllEmployeesForHeatmap = useMemo(() => {
    let filtered = initialAllEmployeesForHeatmap

    // 部門類型篩選
    if (departmentTypeFilter !== 'all') {
      filtered = filtered.filter(emp => emp.DEPARTMENT_TYPE === departmentTypeFilter)
    }

    // 入職年份篩選
    filtered = filtered.filter(emp => {
      // 嘗試從多個可能的字段獲取入職年份
      let startYear = null

      // 優先使用 START_YEAR
      if (emp.START_YEAR != null) {
        startYear =
          typeof emp.START_YEAR === 'number'
            ? emp.START_YEAR
            : typeof emp.START_YEAR === 'string' && !isNaN(Number(emp.START_YEAR))
              ? Number(emp.START_YEAR)
              : null
      }

      // 如果沒有 START_YEAR，嘗試從 DATE_START 提取年份
      if (startYear == null && emp.DATE_START) {
        try {
          const date = new Date(emp.DATE_START)
          if (!isNaN(date.getTime())) {
            startYear = date.getFullYear()
          }
        } catch (e) {
          // 忽略日期解析錯誤
        }
      }

      // 如果仍然沒有年份，保留該記錄（不進行年份篩選）
      if (startYear == null || isNaN(startYear)) {
        return true
      }

      return startYear >= startYearRangeFilter[0] && startYear <= startYearRangeFilter[1]
    })

    return filtered
  }, [initialAllEmployeesForHeatmap, departmentTypeFilter, startYearRangeFilter])

  // 根據篩選後的資料重新計算統計資料
  const statistics = useMemo(() => {
    if (!filteredEmployees || filteredEmployees.length === 0) {
      return {
        totalCount: 0,
        averageTenure: 0,
        maxTenure: 0,
        minTenure: 0,
        tenureDistribution: {
          '0-1': 0,
          '1-3': 0,
          '3-5': 0,
          '5-10': 0,
          '10+': 0,
        },
        yearlyStats: [],
      }
    }

    const tenures = filteredEmployees
      .map(emp => emp.TENURE_YEARS || emp.YEARS_IN_OFFICE || emp.EMPLOYEE_SENIORITY)
      .filter(tenure => tenure != null && tenure > 0)

    const totalCount = filteredEmployees.length
    const averageTenure =
      tenures.length > 0
        ? Math.round((tenures.reduce((sum, t) => sum + t, 0) / tenures.length) * 100) / 100
        : 0
    const maxTenure = tenures.length > 0 ? Math.round(Math.max(...tenures) * 100) / 100 : 0
    const minTenure = tenures.length > 0 ? Math.round(Math.min(...tenures) * 100) / 100 : 0

    // 年資分佈統計
    const tenureDistribution = {
      '0-1': tenures.filter(t => t < 1).length,
      '1-3': tenures.filter(t => t >= 1 && t < 3).length,
      '3-5': tenures.filter(t => t >= 3 && t < 5).length,
      '5-10': tenures.filter(t => t >= 5 && t < 10).length,
      '10+': tenures.filter(t => t >= 10).length,
    }

    // 按年度統計
    const yearlyStatsMap = new Map()
    filteredEmployees.forEach(emp => {
      const year = emp.DATE_RESIGN_YEAR
      if (year) {
        if (!yearlyStatsMap.has(year)) {
          yearlyStatsMap.set(year, {
            year,
            count: 0,
            totalTenure: 0,
          })
        }
        const stats = yearlyStatsMap.get(year)
        stats.count++
        const tenure = emp.TENURE_YEARS || emp.YEARS_IN_OFFICE || emp.EMPLOYEE_SENIORITY || 0
        stats.totalTenure += tenure
      }
    })

    const yearlyStats = Array.from(yearlyStatsMap.values())
      .map(stats => ({
        year: stats.year,
        count: stats.count,
        averageTenure:
          stats.count > 0 ? Math.round((stats.totalTenure / stats.count) * 100) / 100 : 0,
      }))
      .sort((a, b) => a.year - b.year)

    return {
      totalCount,
      averageTenure,
      maxTenure,
      minTenure,
      tenureDistribution,
      yearlyStats,
    }
  }, [filteredEmployees])

  return (
    <>
      {/* 全局篩選器 */}
      <div
        style={{
          marginBottom: '24px',
          padding: '16px 20px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', lg: 'center' },
            gap: { xs: 2.5, lg: 3 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: { xs: 'none', lg: '0 0 auto' },
            }}
          >
            <DepartmentTypeFilter value={departmentTypeFilter} onChange={setDepartmentTypeFilter} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: { xs: 'none', lg: '1 1 auto' },
              justifyContent: { xs: 'center', lg: 'flex-end' },
              minWidth: { xs: '100%', lg: 'auto' },
            }}
          >
            <StartYearFilter
              value={startYearRangeFilter}
              onChange={setStartYearRangeFilter}
              minYear={startYearRange[0]}
              maxYear={startYearRange[1]}
            />
          </Box>
        </Box>
      </div>

      {/* 指標卡片區塊 */}
      {statistics && <MetricCards statistics={statistics} />}

      {/* 圖表分析區塊 */}
      {statistics && filteredEmployees.length > 0 && (
        <div
          style={{
            marginTop: '32px',
            padding: '32px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <TenureCharts statistics={statistics} employees={filteredEmployees} />
        </div>
      )}

      {/* 熱力圖分析區塊 */}
      {filteredAllEmployeesForHeatmap.length > 0 && (
        <div
          style={{
            marginTop: '32px',
            padding: '32px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <TenureHeatmap employees={filteredAllEmployeesForHeatmap} />
        </div>
      )}

      {filteredEmployees.length > 0 && (
        <div
          style={{
            marginTop: '32px',
            padding: '32px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <ResignYearHeatmap employees={filteredEmployees} />
        </div>
      )}

      {/* 數據表格區塊 */}
      <div
        style={{
          marginTop: '32px',
          padding: '32px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <ResignedEmployeeTable employees={filteredEmployees} />
      </div>
    </>
  )
}
