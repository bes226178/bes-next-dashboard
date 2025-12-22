'use client'

import { useMemo } from 'react'

import ReactECharts from 'echarts-for-react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Box, Typography } from '@mui/material'

export default function TenureCharts({ statistics, employees = [] }) {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))

  // 年資分佈長條圖配置
  const tenureDistributionOption = useMemo(() => {
    if (!statistics?.tenureDistribution) return null

    const distribution = statistics.tenureDistribution
    const categories = ['0-1年', '1-3年', '3-5年', '5-10年', '10年以上']
    const values = [
      distribution['0-1'] || 0,
      distribution['1-3'] || 0,
      distribution['3-5'] || 0,
      distribution['5-10'] || 0,
      distribution['10+'] || 0,
    ]

    return {
      title: {
        text: '年資分佈統計',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 600,
          color: '#1e293b',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: params => {
          const param = params[0]
          return `${param.name}<br/>${param.seriesName}: ${param.value} 人`
        },
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          fontSize: 12,
        },
      },
      yAxis: {
        type: 'value',
        name: '人數',
        axisLabel: {
          formatter: value => value,
          fontSize: 12,
        },
      },
      series: [
        {
          name: '離職人數',
          type: 'bar',
          data: values,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#667eea' },
                { offset: 1, color: '#764ba2' },
              ],
            },
            borderRadius: [8, 8, 0, 0],
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(102, 126, 234, 0.5)',
            },
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            color: '#475569',
            fontWeight: 600,
            fontSize: 12,
          },
        },
      ],
      grid: {
        top: '15%',
        bottom: '10%',
        left: '10%',
        right: '10%',
        containLabel: true,
      },
    }
  }, [statistics])

  // 年資趨勢圖配置（不同年度離職人員的平均服務年資）
  const tenureTrendOption = useMemo(() => {
    if (!statistics?.yearlyStats || statistics.yearlyStats.length === 0) return null

    const yearlyStats = statistics.yearlyStats
    const years = yearlyStats.map(stat => `${stat.year}年`)
    const averageTenures = yearlyStats.map(stat => Math.round(stat.averageTenure * 100) / 100)

    return {
      title: {
        text: '年度平均服務年資趨勢',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 600,
          color: '#1e293b',
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          const param = params[0]
          return `${param.name}<br/>平均服務年資: ${param.value} 年`
        },
      },
      xAxis: {
        type: 'category',
        data: years,
        axisLabel: {
          rotate: 45,
          fontSize: 12,
        },
      },
      yAxis: {
        type: 'value',
        name: '平均年資（年）',
        axisLabel: {
          formatter: value => value,
          fontSize: 12,
        },
      },
      series: [
        {
          name: '平均服務年資',
          type: 'line',
          data: averageTenures,
          smooth: true,
          itemStyle: {
            color: '#06b6d4',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(6, 182, 212, 0.3)' },
                { offset: 1, color: 'rgba(6, 182, 212, 0.05)' },
              ],
            },
          },
          symbol: 'circle',
          symbolSize: 10,
          lineStyle: {
            width: 3,
            color: '#06b6d4',
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(6, 182, 212, 0.5)',
            },
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            color: '#475569',
            fontWeight: 600,
            fontSize: 12,
          },
        },
      ],
      grid: {
        top: '15%',
        bottom: '15%',
        left: '10%',
        right: '10%',
        containLabel: true,
      },
    }
  }, [statistics])

  // 離職人數趨勢圖配置（堆疊長條圖，依年資分布）
  const resignationCountTrendOption = useMemo(() => {
    if (
      !statistics?.yearlyStats ||
      statistics.yearlyStats.length === 0 ||
      !employees ||
      employees.length === 0
    )
      return null

    const yearlyStats = statistics.yearlyStats
    const years = yearlyStats.map(stat => `${stat.year}年`)

    // 年資區間定義（使用優雅的漸變色調）
    const tenureRanges = [
      { key: '0-1', label: '0-1年', min: 0, max: 1, color: '#e0e7ff' }, // 淺紫藍
      { key: '1-3', label: '1-3年', min: 1, max: 3, color: '#c7d2fe' }, // 中淺紫藍
      { key: '3-5', label: '3-5年', min: 3, max: 5, color: '#a5b4fc' }, // 中紫藍
      { key: '5-10', label: '5-10年', min: 5, max: 10, color: '#818cf8' }, // 深紫藍
      { key: '10+', label: '10年以上', min: 10, max: Infinity, color: '#667eea' }, // 最深紫藍
    ]

    // 計算每個年度每個年資區間的人數
    const seriesData = tenureRanges.map(range => {
      const data = yearlyStats.map(stat => {
        const year = stat.year
        // 找出該年度離職且年資在該區間內的員工
        const count = employees.filter(emp => {
          if (emp.DATE_RESIGN_YEAR !== year) return false
          const tenure = emp.TENURE_YEARS || emp.YEARS_IN_OFFICE || emp.EMPLOYEE_SENIORITY || 0
          if (range.max === Infinity) {
            return tenure >= range.min
          }
          return tenure >= range.min && tenure < range.max
        }).length
        return count
      })
      return {
        name: range.label,
        type: 'bar',
        stack: 'total',
        data: data,
        itemStyle: {
          color: range.color,
        },
      }
    })

    return {
      title: {
        text: '年度離職人數趨勢',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 600,
          color: '#1e293b',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: function (params) {
          let result = `${params[0].axisValue}<br/>`
          let total = 0
          params.forEach(param => {
            if (param.value > 0) {
              result += `${param.marker}${param.seriesName}: ${param.value} 人<br/>`
              total += param.value
            }
          })
          result += `<b>總計: ${total} 人</b>`
          return result
        },
      },
      legend: {
        data: tenureRanges.map(range => range.label),
        bottom: '0%',
      },
      xAxis: {
        type: 'category',
        data: years,
        axisLabel: {
          rotate: 45,
          fontSize: 12,
        },
      },
      yAxis: {
        type: 'value',
        name: '離職人數',
        axisLabel: {
          formatter: value => value,
          fontSize: 12,
        },
      },
      series: seriesData,
      grid: {
        top: '15%',
        bottom: '20%',
        left: '10%',
        right: '10%',
        containLabel: true,
      },
    }
  }, [statistics, employees])

  if (!statistics) {
    return null
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
        圖表分析
      </Typography>

      {/* 年資分佈長條圖 */}
      {tenureDistributionOption && (
        <Box
          sx={{
            mb: 5,
            p: 3,
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(102, 126, 234, 0.1)',
          }}
        >
          <div style={{ width: '100%', height: '420px' }}>
            <ReactECharts
              option={tenureDistributionOption}
              style={{ height: '100%', width: '100%' }}
            />
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
              📊 分析洞察
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#475569',
                lineHeight: 1.7,
                fontSize: '13px',
              }}
            >
              此圖表揭示離職人員的年資分佈模式，是評估組織人才流失風險的關鍵指標。若「0-1年」區間佔比過高，可能反映招募篩選、入職適應或企業文化契合度問題；「1-3年」區間若為高峰，通常與職業發展機會、薪酬競爭力或工作滿意度相關；「3-5年」離職可能與晉升瓶頸、職涯規劃或外部機會有關；「5-10年」及「10年以上」的離職則需關注資深人才保留策略，可能涉及組織變革、退休規劃或職業倦怠等深層因素。建議針對高風險年資區間制定針對性的留才措施。
            </Typography>
          </Box>
        </Box>
      )}

      {/* 年資趨勢圖和離職人數趨勢圖並排顯示 */}
      <Box sx={{ display: 'flex', flexDirection: isXs ? 'column' : 'row', gap: 3, mb: 0 }}>
        {tenureTrendOption && (
          <Box
            sx={{
              flex: 1,
              p: 3,
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(6, 182, 212, 0.1)',
            }}
          >
            <div style={{ width: '100%', height: '420px' }}>
              <ReactECharts option={tenureTrendOption} style={{ height: '100%', width: '100%' }} />
            </div>
            <Box
              sx={{
                mt: 3,
                p: 2.5,
                background:
                  'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(8, 145, 178, 0.05) 100%)',
                borderRadius: '8px',
                border: '1px solid rgba(6, 182, 212, 0.15)',
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
                📈 分析洞察
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#475569',
                  lineHeight: 1.7,
                  fontSize: '13px',
                }}
              >
                此趨勢圖追蹤各年度離職人員的平均服務年資變化，反映組織留才能力的時間演進。上升趨勢表示離職者平均年資增加，可能代表組織成功延長人才服務週期，或資深員工流失比例上升；下降趨勢則顯示新進人員離職率提高，需檢視招募品質、入職培訓與早期留才機制。若出現劇烈波動，可能與組織變革、市場環境變化或特定事件相關。建議結合離職人數趨勢進行交叉分析，以全面評估人才流失的質與量。
              </Typography>
            </Box>
          </Box>
        )}

        {resignationCountTrendOption && (
          <Box
            sx={{
              flex: 1,
              p: 3,
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(102, 126, 234, 0.1)',
            }}
          >
            <div style={{ width: '100%', height: '420px' }}>
              <ReactECharts
                option={resignationCountTrendOption}
                style={{ height: '100%', width: '100%' }}
              />
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
                📉 分析洞察
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#475569',
                  lineHeight: 1.7,
                  fontSize: '13px',
                }}
              >
                此堆疊圖呈現各年度離職總人數及其年資結構組成，是評估離職規模與結構變化的核心工具。總體趨勢上升表示離職率惡化，需檢視組織管理、薪酬福利或市場競爭力；下降則顯示留才策略見效。年資結構分析更為關鍵：若淺色區塊（0-3年）佔比擴大，顯示新進人員穩定性不足，應強化招募篩選、入職引導與早期關懷；深色區塊（5年以上）增加則警示資深人才流失風險，可能與組織變革、職涯發展受限或外部誘因有關。建議按年資區間制定差異化留才策略，並追蹤改善成效。
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
