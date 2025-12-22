import { tables } from '@/lib/tables'

export async function GET(request) {
  try {
    // 使用 MCP 查詢離職人員資料（通過 tables.js 封裝的方法）
    const resignedEmployees = await tables.frEmployee.getResignedEmployeesWithTenure()

    if (!resignedEmployees || resignedEmployees.length === 0) {
      return Response.json({
        statistics: {
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
        },
        employees: [],
      })
    }

    // 計算統計資料
    const tenures = resignedEmployees
      .map(emp => emp.TENURE_YEARS || emp.YEARS_IN_OFFICE || emp.EMPLOYEE_SENIORITY)
      .filter(tenure => tenure != null && tenure > 0)

    const totalCount = resignedEmployees.length
    const averageTenure =
      tenures.length > 0 ? tenures.reduce((sum, t) => sum + t, 0) / tenures.length : 0
    const maxTenure = tenures.length > 0 ? Math.max(...tenures) : 0
    const minTenure = tenures.length > 0 ? Math.min(...tenures) : 0

    // 年資分佈統計
    const tenureDistribution = {
      '0-1': 0,
      '1-3': 0,
      '3-5': 0,
      '5-10': 0,
      '10+': 0,
    }

    tenures.forEach(tenure => {
      if (tenure < 1) {
        tenureDistribution['0-1']++
      } else if (tenure < 3) {
        tenureDistribution['1-3']++
      } else if (tenure < 5) {
        tenureDistribution['3-5']++
      } else if (tenure < 10) {
        tenureDistribution['5-10']++
      } else {
        tenureDistribution['10+']++
      }
    })

    // 按年度統計
    const yearlyStatsMap = new Map()
    resignedEmployees.forEach(emp => {
      const year = emp.DATE_RESIGN_YEAR
      if (year) {
        if (!yearlyStatsMap.has(year)) {
          yearlyStatsMap.set(year, {
            year,
            count: 0,
            totalTenure: 0,
            employees: [],
          })
        }
        const stats = yearlyStatsMap.get(year)
        stats.count++
        const tenure = emp.TENURE_YEARS || emp.YEARS_IN_OFFICE || emp.EMPLOYEE_SENIORITY || 0
        stats.totalTenure += tenure
        stats.employees.push(emp)
      }
    })

    const yearlyStats = Array.from(yearlyStatsMap.values())
      .map(stats => ({
        year: stats.year,
        count: stats.count,
        averageTenure: stats.count > 0 ? stats.totalTenure / stats.count : 0,
      }))
      .sort((a, b) => a.year - b.year)

    return Response.json({
      statistics: {
        totalCount,
        averageTenure: Math.round(averageTenure * 100) / 100,
        maxTenure: Math.round(maxTenure * 100) / 100,
        minTenure: Math.round(minTenure * 100) / 100,
        tenureDistribution,
        yearlyStats,
      },
      employees: resignedEmployees,
    })
  } catch (error) {
    console.error('API錯誤:', error)
    return Response.json(
      {
        error: '資料庫查詢失敗',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

