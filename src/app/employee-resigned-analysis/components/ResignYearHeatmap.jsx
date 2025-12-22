'use client'

import { useMemo } from 'react'

import ReactECharts from 'echarts-for-react'
import { Box, Typography } from '@mui/material'

export default function ResignYearHeatmap({ employees = [] }) {
  // 處理資料並計算每個離職年度和職等組合的平均在職年資
  const heatmapData = useMemo(() => {
    if (!employees || employees.length === 0) return null

    // 取得所有不重複的離職年度和職等
    const resignYears = new Set()
    const gradeMap = new Map() // 使用 Map 來儲存職等名稱和對應的 GRADE_ID

    employees.forEach(emp => {
      // 確保 DATE_RESIGN_YEAR 是有效的數字
      const resignYear =
        typeof emp.DATE_RESIGN_YEAR === 'number'
          ? emp.DATE_RESIGN_YEAR
          : typeof emp.DATE_RESIGN_YEAR === 'string' && !isNaN(Number(emp.DATE_RESIGN_YEAR))
            ? Number(emp.DATE_RESIGN_YEAR)
            : null
      if (resignYear != null && !isNaN(resignYear)) {
        resignYears.add(resignYear)
      }

      // 確保 GRADE_ID 是有效的數字
      const gradeId =
        typeof emp.GRADE_ID === 'number'
          ? emp.GRADE_ID
          : typeof emp.GRADE_ID === 'string' && !isNaN(Number(emp.GRADE_ID))
            ? Number(emp.GRADE_ID)
            : null
      if (emp.GRADE_NAME && gradeId != null && !isNaN(gradeId)) {
        // 如果該職等還沒有記錄，或找到更大的 GRADE_ID，則更新
        if (!gradeMap.has(emp.GRADE_NAME) || gradeMap.get(emp.GRADE_NAME) < gradeId) {
          gradeMap.set(emp.GRADE_NAME, gradeId)
        }
      }
    })

    const sortedYears = Array.from(resignYears).sort((a, b) => a - b)
    // 依 GRADE_ID 由大到小排序職等
    const sortedGrades = Array.from(gradeMap.entries())
      .sort((a, b) => b[1] - a[1]) // 由大到小排序
      .map(([gradeName]) => gradeName)

    // 計算每個組合的平均年資、人數、最小年資、最大年資
    const dataMap = new Map()

    employees.forEach(emp => {
      // 確保年份是有效的數字
      const year =
        typeof emp.DATE_RESIGN_YEAR === 'number'
          ? emp.DATE_RESIGN_YEAR
          : typeof emp.DATE_RESIGN_YEAR === 'string' && !isNaN(Number(emp.DATE_RESIGN_YEAR))
            ? Number(emp.DATE_RESIGN_YEAR)
            : null
      const grade = emp.GRADE_NAME
      const tenure =
        typeof emp.TENURE_YEARS === 'number'
          ? emp.TENURE_YEARS
          : typeof emp.TENURE_YEARS === 'string' && !isNaN(Number(emp.TENURE_YEARS))
            ? Number(emp.TENURE_YEARS)
            : typeof emp.YEARS_IN_OFFICE === 'number'
              ? emp.YEARS_IN_OFFICE
              : typeof emp.YEARS_IN_OFFICE === 'string' && !isNaN(Number(emp.YEARS_IN_OFFICE))
                ? Number(emp.YEARS_IN_OFFICE)
                : typeof emp.EMPLOYEE_SENIORITY === 'number'
                  ? emp.EMPLOYEE_SENIORITY
                  : typeof emp.EMPLOYEE_SENIORITY === 'string' &&
                      !isNaN(Number(emp.EMPLOYEE_SENIORITY))
                    ? Number(emp.EMPLOYEE_SENIORITY)
                    : 0

      if (
        year != null &&
        !isNaN(year) &&
        grade &&
        typeof grade === 'string' &&
        !isNaN(tenure) &&
        tenure > 0
      ) {
        const key = `${year}-${grade}`
        if (!dataMap.has(key)) {
          dataMap.set(key, {
            year,
            grade,
            totalTenure: 0,
            count: 0,
            minTenure: Infinity,
            maxTenure: -Infinity,
            tenures: [],
          })
        }
        const stats = dataMap.get(key)
        stats.totalTenure += tenure
        stats.count++
        stats.tenures.push(tenure)
        if (tenure < stats.minTenure) stats.minTenure = tenure
        if (tenure > stats.maxTenure) stats.maxTenure = tenure
      }
    })

    // 建立熱力圖資料陣列
    const heatmapDataArray = []
    const values = []
    const detailMap = new Map() // 儲存詳細資訊

    sortedYears.forEach((year, yearIndex) => {
      sortedGrades.forEach((grade, gradeIndex) => {
        const key = `${year}-${grade}`
        const stats = dataMap.get(key)
        const avgTenure = stats && stats.count > 0 ? stats.totalTenure / stats.count : null

        if (avgTenure !== null) {
          const roundedAvg = Math.round(avgTenure * 100) / 100
          const roundedMin = Math.round(stats.minTenure * 100) / 100
          const roundedMax = Math.round(stats.maxTenure * 100) / 100

          heatmapDataArray.push([yearIndex, gradeIndex, roundedAvg])
          values.push(roundedAvg)

          // 儲存詳細資訊
          detailMap.set(`${yearIndex}-${gradeIndex}`, {
            count: stats.count,
            minTenure: roundedMin,
            maxTenure: roundedMax,
            avgTenure: roundedAvg,
          })
        }
      })
    })

    return {
      years: sortedYears,
      grades: sortedGrades,
      data: heatmapDataArray,
      values: values.length > 0 ? values : [0],
      detailMap: detailMap,
    }
  }, [employees])

  if (!heatmapData || heatmapData.data.length === 0) {
    return (
      <Box sx={{ mt: 0 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '24px',
            letterSpacing: '-0.3px',
          }}
        >
          離職年度與職等平均在職年資熱力圖
        </Typography>
        <Box
          sx={{
            p: 3,
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            暫無資料
          </Typography>
        </Box>
      </Box>
    )
  }

  const minValue = Math.min(...heatmapData.values)
  const maxValue = Math.max(...heatmapData.values)

  // ECharts 熱力圖配置
  const option = {
    title: {
      text: '離職年度與職等平均在職年資熱力圖',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 600,
        color: '#1e293b',
      },
    },
    tooltip: {
      position: 'top',
      formatter: function (params) {
        const year = heatmapData.years[params.data[0]]
        const grade = heatmapData.grades[params.data[1]]
        const detailKey = `${params.data[0]}-${params.data[1]}`
        const detail = heatmapData.detailMap.get(detailKey)

        if (detail) {
          return `離職年度: ${year}年<br/>職等: ${grade}<br/>人數: ${detail.count} 人<br/>平均在職年資: ${detail.avgTenure} 年<br/>最小年資: ${detail.minTenure} 年<br/>最大年資: ${detail.maxTenure} 年`
        }
        return `離職年度: ${year}年<br/>職等: ${grade}<br/>平均在職年資: ${params.data[2]} 年`
      },
    },
    grid: {
      height: '60%',
      top: '15%',
      left: '15%',
      right: '10%',
    },
    xAxis: {
      type: 'category',
      data: heatmapData.years.map(year => `${year}年`),
      splitArea: {
        show: true,
      },
      axisLabel: {
        rotate: 45,
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'category',
      data: heatmapData.grades,
      splitArea: {
        show: true,
      },
      axisLabel: {
        fontSize: 12,
      },
    },
    visualMap: {
      min: minValue,
      max: maxValue,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      inRange: {
        color: ['#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#667eea', '#4f46e5'],
      },
      text: ['高', '低'],
      textStyle: {
        color: '#000',
      },
    },
    series: [
      {
        name: '平均在職年資',
        type: 'heatmap',
        data: heatmapData.data,
        label: {
          show: true,
          formatter: function (params) {
            return params.data[2].toFixed(1)
          },
          fontSize: 10,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }

  return (
    <Box sx={{ mt: 0 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '24px',
          letterSpacing: '-0.3px',
        }}
      >
        離職年度與職等平均在職年資熱力圖
      </Typography>
      <Box
        sx={{
          p: 3,
          background: 'rgba(255, 255, 255, 0.6)',
          borderRadius: '12px',
          border: '1px solid rgba(102, 126, 234, 0.1)',
        }}
      >
        <div style={{ width: '100%', height: '600px' }}>
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
        </div>
        <Box
          sx={{
            mt: 3,
            p: 2.5,
            background:
              'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            borderRadius: '8px',
            border: '1px solid rgba(102, 126, 234, 0.15)',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: '#1e293b',
              mb: 1,
              fontSize: '14px',
            }}
          >
            🎯 分析洞察
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#475569',
              lineHeight: 1.7,
              fontSize: '13px',
            }}
          >
            此熱力圖以離職年度與職等交叉分析平均在職年資，識別特定年度與職等組合的離職模式。深色區域表示該組合的平均服務年資較長，可能反映資深員工在特定年度的離職集中現象，需檢視該年度是否發生組織變革、策略調整或市場環境變化；淺色區域則顯示低年資離職，可能與新進人員適應不良或早期離職有關。若特定離職年度出現多職等同時離職且年資較高，可能與組織層級事件相關；若特定職等在多個年度持續呈現低年資離職，則需檢視該職等的職涯發展、薪酬結構或工作內容設計。建議結合離職原因分析，制定預防性留才策略。
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
