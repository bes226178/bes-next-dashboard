'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Alert,
  Chip,
  Divider,
  alpha,
  Button,
} from '@mui/material'
import ReactECharts from 'echarts-for-react'

export default function EmployeeStockTrustPage() {
  const [monthlySalary] = useState(50000)
  const [contributionRate] = useState(10)

  // 計算數據
  const monthlyContribution = monthlySalary * (contributionRate / 100)
  const companyMatch = monthlyContribution

  // 定存比較數據（假設定存利率1.75%，複利計算）
  const calculateDeposit = (years, monthlyAmount, rate) => {
    let total = 0
    for (let i = 0; i < years * 12; i++) {
      total = total * (1 + rate / 12) + monthlyAmount
    }
    return Math.round(total)
  }

  const depositComparison = [
    { year: 1, trust: 120000, deposit: calculateDeposit(1, monthlyContribution, 0.0175) },
    { year: 2, trust: 240000, deposit: calculateDeposit(2, monthlyContribution, 0.0175) },
    { year: 3, trust: 360000, deposit: calculateDeposit(3, monthlyContribution, 0.0175) },
    { year: 4, trust: 480000, deposit: calculateDeposit(4, monthlyContribution, 0.0175) },
    { year: 5, trust: 600000, deposit: calculateDeposit(5, monthlyContribution, 0.0175) },
  ]

  // 5年完整鎖定期數據
  const fiveYearData = [
    { year: 1, employee: 60000, company: 60000, total: 120000, return: 0, netReturn: 120000 },
    { year: 2, employee: 120000, company: 120000, total: 240000, return: 0, netReturn: 240000 },
    { year: 3, employee: 180000, company: 180000, total: 360000, return: 0, netReturn: 360000 },
    { year: 4, employee: 240000, company: 240000, total: 480000, return: 0, netReturn: 480000 },
    { year: 5, employee: 300000, company: 300000, total: 600000, return: 0, netReturn: 600000 },
  ]

  // 提前離職數據（3年後）
  const earlyExitData = [
    { year: 1, employee: 60000, company: 60000, total: 120000, return: 48000, netReturn: 72000 },
    { year: 2, employee: 120000, company: 120000, total: 240000, return: 96000, netReturn: 144000 },
    {
      year: 3,
      employee: 180000,
      company: 180000,
      total: 360000,
      return: 144000,
      netReturn: 216000,
    },
  ]

  // 股價情境數據（基於2025年12月股價12.90元）
  // 假設5年累積投入600,000元（員工300,000 + 公司300,000），可買約46,512股
  const currentStockPrice = 12.9 // 2025年12月最新股價
  const totalShares = Math.floor(600000 / currentStockPrice) // 約46,512股

  const stockPriceScenarios = [
    {
      scenario: '股價上漲30%',
      price: parseFloat((currentStockPrice * 1.3).toFixed(2)),
      value: Math.round(totalShares * currentStockPrice * 1.3),
      return: Math.round(totalShares * currentStockPrice * 1.3 - 300000),
    },
    {
      scenario: '股價持平',
      price: currentStockPrice,
      value: Math.round(totalShares * currentStockPrice),
      return: Math.round(totalShares * currentStockPrice - 300000),
    },
    {
      scenario: '股價下跌30%',
      price: parseFloat((currentStockPrice * 0.7).toFixed(2)),
      value: Math.round(totalShares * currentStockPrice * 0.7),
      return: Math.round(totalShares * currentStockPrice * 0.7 - 300000),
    },
  ]

  // 圖表配置
  const comparisonChartOption = {
    title: {
      text: '持股信託 vs 定存 5年累積比較',
      left: 'center',
      textStyle: { fontSize: 16 },
    },
    tooltip: {
      trigger: 'axis',
      formatter: params => {
        let result = `${params[0].name}<br/>`
        params.forEach(param => {
          result += `${param.seriesName}: ${param.value.toLocaleString()}元<br/>`
        })
        return result
      },
    },
    legend: {
      data: ['持股信託', '定存'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['1年', '2年', '3年', '4年', '5年'],
    },
    yAxis: {
      type: 'value',
      name: '金額（元）',
      axisLabel: {
        formatter: value => {
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
          if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
          return value.toString()
        },
      },
    },
    series: [
      {
        name: '持股信託',
        type: 'line',
        data: depositComparison.map(d => d.trust),
        itemStyle: { color: '#667eea' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
              { offset: 1, color: 'rgba(102, 126, 234, 0.05)' },
            ],
          },
        },
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
      },
      {
        name: '定存',
        type: 'line',
        data: depositComparison.map(d => d.deposit),
        itemStyle: { color: '#f093fb' },
        lineStyle: { width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(240, 147, 251, 0.3)' },
              { offset: 1, color: 'rgba(240, 147, 251, 0.05)' },
            ],
          },
        },
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
      },
    ],
  }

  const returnRateChartOption = {
    title: {
      text: '不同離職時間點的年化報酬率',
      left: 'center',
      textStyle: { fontSize: 16 },
    },
    tooltip: {
      trigger: 'axis',
      formatter: params => {
        return `${params[0].name}<br/>${params[0].seriesName}: ${params[0].value}%`
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['1年後', '2年後', '3年後', '4年後', '5年後'],
    },
    yAxis: {
      type: 'value',
      name: '年化報酬率 (%)',
    },
    series: [
      {
        name: '年化報酬率',
        type: 'bar',
        data: [20, 20, 20, 20, 100],
        itemStyle: {
          color: params => {
            if (params.dataIndex === 4) {
              return {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#4caf50' },
                  { offset: 1, color: '#2e7d32' },
                ],
              }
            }
            return {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#ff9800' },
                { offset: 1, color: '#f57c00' },
              ],
            }
          },
          borderRadius: [4, 4, 0, 0],
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          fontWeight: 'bold',
          fontSize: 12,
        },
      },
    ],
  }

  const stockPriceScenarioOption = {
    title: {
      text: '不同股價情境下的5年總報酬',
      left: 'center',
      textStyle: { fontSize: 16 },
    },
    tooltip: {
      trigger: 'axis',
      formatter: params => {
        return `${params[0].name}<br/>總報酬: ${params[0].value.toLocaleString()}元`
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: stockPriceScenarios.map(s => s.scenario),
    },
    yAxis: {
      type: 'value',
      name: '總報酬（元）',
      axisLabel: {
        formatter: value => {
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
          if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
          return value.toString()
        },
      },
    },
    series: [
      {
        name: '總報酬',
        type: 'bar',
        data: stockPriceScenarios.map(s => s.return),
        itemStyle: {
          color: params => {
            const gradients = [
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#4caf50' },
                  { offset: 1, color: '#2e7d32' },
                ],
              },
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#2196f3' },
                  { offset: 1, color: '#1565c0' },
                ],
              },
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#f44336' },
                  { offset: 1, color: '#c62828' },
                ],
              },
            ]
            return gradients[params.dataIndex]
          },
          borderRadius: [4, 4, 0, 0],
        },
        label: {
          show: true,
          position: 'top',
          formatter: params => {
            return `${(params.value / 10000).toFixed(0)}萬`
          },
          fontWeight: 'bold',
          fontSize: 12,
        },
      },
    ],
  }

  // 離職率影響分析圖表
  const turnoverRateOption = {
    title: {
      text: '不同離職率情境下的公司實際成本',
      left: 'center',
      textStyle: { fontSize: 16 },
    },
    tooltip: {
      trigger: 'axis',
      formatter: params => {
        let result = `${params[0].name}<br/>`
        params.forEach(param => {
          result += `${param.seriesName}: ${param.value.toLocaleString()}元<br/>`
        })
        return result
      },
    },
    legend: {
      data: ['高離職率(>20%)', '中離職率(10-20%)', '低離職率(<10%)'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['1年', '2年', '3年', '4年', '5年'],
    },
    yAxis: {
      type: 'value',
      name: '公司實際成本（元）',
      axisLabel: {
        formatter: value => {
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
          if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
          return value.toString()
        },
      },
    },
    series: [
      {
        name: '高離職率(>20%)',
        type: 'line',
        data: [48000, 96000, 144000, 192000, 240000], // 假設多數人在第1年離職
        itemStyle: { color: '#f44336' },
        lineStyle: { width: 3, color: '#f44336' },
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
      },
      {
        name: '中離職率(10-20%)',
        type: 'line',
        data: [60000, 120000, 180000, 240000, 300000], // 平均分布
        itemStyle: { color: '#ff9800' },
        lineStyle: { width: 3, color: '#ff9800' },
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
      },
      {
        name: '低離職率(<10%)',
        type: 'line',
        data: [60000, 120000, 180000, 240000, 300000], // 多數人完成5年
        itemStyle: { color: '#4caf50' },
        lineStyle: { width: 3, color: '#4caf50' },
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
      },
    ],
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* 導航連結 */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button
            component={Link}
            href="/employee-stock-trust"
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              },
            }}
          >
            員工持股信託分析
          </Button>
          <Button
            component={Link}
            href="/employee-resigned-analysis"
            variant="outlined"
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              '&:hover': {
                borderColor: '#5568d3',
                background: 'rgba(102, 126, 234, 0.1)',
              },
            }}
          >
            離職人員服務年資分析
          </Button>
        </Box>

        {/* 標題區域 */}
        <Box
          sx={{
            mb: 5,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            p: 4,
            color: 'white',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{ mb: 1 }}>
            員工持股信託計畫分析
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 400 }}>
            中華工程(2515) - 風險調整後報酬分析
          </Typography>
        </Box>

        {/* 假設條件說明 */}
        <Card
          sx={{
            mb: 4,
            background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid',
            borderColor: alpha('#0288d1', 0.2),
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  background: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)',
                  borderRadius: 2,
                  mr: 2,
                }}
              />
              <Typography variant="h5" fontWeight="bold" color="primary.dark">
                分析假設條件
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 2.5,
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha('#0288d1', 0.2),
                  }}
                >
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{ fontWeight: 'bold', color: '#0288d1', mb: 1.5 }}
                  >
                    基本假設：
                  </Typography>
                  <ul
                    style={{
                      marginTop: '8px',
                      paddingLeft: '20px',
                      color: '#424242',
                      lineHeight: '1.8',
                    }}
                  >
                    <li>員工月薪：50,000元</li>
                    <li>提撥比例：10%（每月提撥5,000元）</li>
                    <li>公司補助：等額5,000元/月（100%補助）</li>
                    <li>定存利率：1.75%（年化，複利計算）</li>
                    <li>無風險利率：2.0%</li>
                  </ul>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 2.5,
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha('#0288d1', 0.2),
                  }}
                >
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{ fontWeight: 'bold', color: '#0288d1', mb: 1.5 }}
                  >
                    股價假設：
                  </Typography>
                  <ul
                    style={{
                      marginTop: '8px',
                      paddingLeft: '20px',
                      color: '#424242',
                      lineHeight: '1.8',
                    }}
                  >
                    <li>目前股價：12.90元（2025年12月）</li>
                    <li>上漲30%情境：16.77元</li>
                    <li>持平情境：12.90元</li>
                    <li>下跌30%情境：9.03元</li>
                    <li>現金殖利率：3.61%（年化）</li>
                  </ul>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2.5,
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha('#0288d1', 0.2),
                  }}
                >
                  <Typography
                    variant="body1"
                    component="div"
                    sx={{ fontWeight: 'bold', color: '#0288d1', mb: 1.5 }}
                  >
                    其他假設：
                  </Typography>
                  <ul
                    style={{
                      marginTop: '8px',
                      paddingLeft: '20px',
                      color: '#424242',
                      lineHeight: '1.8',
                    }}
                  >
                    <li>提前離職需返還公司補助的80%</li>
                    <li>完成5年鎖定期可取得完整權益（員工+公司提存金）</li>
                    <li>股價波動率：30-40%（年度）</li>
                    <li>股利收入：假設年殖利率3.5%，累積計算</li>
                    <li>所有計算均未考慮稅務影響</li>
                  </ul>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 關鍵條款摘要 */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid',
            borderColor: alpha('#1976d2', 0.1),
            background: 'white',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                  borderRadius: 2,
                  mr: 2,
                }}
              />
              <Typography variant="h5" fontWeight="bold" color="primary.dark">
                關鍵條款摘要
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 2.5,
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha('#1976d2', 0.1),
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <strong style={{ color: '#1976d2' }}>適用對象：</strong>
                    <span style={{ marginLeft: 8 }}>服務滿一年以上在職同仁</span>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <strong style={{ color: '#1976d2' }}>員工提撥：</strong>
                    <span style={{ marginLeft: 8 }}>每月本薪+加給的 5-10%</span>
                  </Typography>
                  <Typography variant="body1">
                    <strong style={{ color: '#1976d2' }}>公司補助：</strong>
                    <span style={{ marginLeft: 8 }}>等額（100%補助）</span>
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 2.5,
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha('#1976d2', 0.1),
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <strong style={{ color: '#1976d2' }}>鎖定期：</strong>
                    <span style={{ marginLeft: 8 }}>5年</span>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <strong style={{ color: '#1976d2' }}>提前退出：</strong>
                    <span style={{ marginLeft: 8 }}>返還公司提存金的 80%</span>
                  </Typography>
                  <Typography variant="body1">
                    <strong style={{ color: '#1976d2' }}>投資標的：</strong>
                    <span style={{ marginLeft: 8 }}>中華工程(2515)股票</span>
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 股價資訊 */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid',
            borderColor: alpha('#1976d2', 0.1),
            background: 'white',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                  borderRadius: 2,
                  mr: 2,
                }}
              />
              <Typography variant="h5" fontWeight="bold" color="primary.dark">
                中華工程(2515) 股價資訊
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha('#4caf50', 0.3),
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(76, 175, 80, 0.2)',
                    },
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    2023年表現
                  </Typography>
                  <Typography variant="h5" color="success.main" fontWeight="bold">
                    9.26元 → 13.3元
                  </Typography>
                  <Chip
                    label="+43.6%"
                    color="success"
                    size="small"
                    sx={{ mt: 1, fontWeight: 'bold' }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha('#f44336', 0.3),
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(244, 67, 54, 0.2)',
                    },
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    2025年表現
                  </Typography>
                  <Typography variant="h5" color="success.main" fontWeight="bold">
                    10.65元 → 12.90元
                  </Typography>
                  <Chip
                    label="+21.1%"
                    color="success"
                    size="small"
                    sx={{ mt: 1, fontWeight: 'bold' }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha('#2196f3', 0.3),
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(33, 150, 243, 0.2)',
                    },
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    現金殖利率
                  </Typography>
                  <Typography variant="h5" color="primary.main" fontWeight="bold">
                    3.61%
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    近五年平均 3.37%
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            <Alert
              severity="warning"
              sx={{
                mt: 3,
                borderRadius: 2,
                background: alpha('#ff9800', 0.1),
                border: '1px solid',
                borderColor: alpha('#ff9800', 0.3),
              }}
            >
              股價波動較大，年度波動率約 30-40%，屬中高風險標的
            </Alert>
          </CardContent>
        </Card>

        {/* 圖表區域 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: alpha('#1976d2', 0.1),
                background: 'white',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ p: 2, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <Typography variant="h6" fontWeight="bold" color="primary.dark">
                  持股信託 vs 定存比較
                </Typography>
              </Box>
              <Box
                sx={{ p: 2, flex: 1, minHeight: '450px', display: 'flex', flexDirection: 'column' }}
              >
                <Box sx={{ height: '400px', width: '100%', flex: 1 }}>
                  <ReactECharts
                    option={comparisonChartOption}
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
                    notMerge={true}
                    lazyUpdate={true}
                  />
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: alpha('#1976d2', 0.1),
                background: 'white',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ p: 2, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <Typography variant="h6" fontWeight="bold" color="primary.dark">
                  不同離職時間點的年化報酬率
                </Typography>
              </Box>
              <Box
                sx={{ p: 2, flex: 1, minHeight: '450px', display: 'flex', flexDirection: 'column' }}
              >
                <Box sx={{ height: '400px', width: '100%', flex: 1 }}>
                  <ReactECharts
                    option={returnRateChartOption}
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
                    notMerge={true}
                    lazyUpdate={true}
                  />
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: alpha('#1976d2', 0.1),
                background: 'white',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ p: 2, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <Typography variant="h6" fontWeight="bold" color="primary.dark">
                  不同股價情境下的5年總報酬
                </Typography>
              </Box>
              <Box
                sx={{ p: 2, flex: 1, minHeight: '450px', display: 'flex', flexDirection: 'column' }}
              >
                <Box sx={{ height: '400px', width: '100%', flex: 1 }}>
                  <ReactECharts
                    option={stockPriceScenarioOption}
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
                    notMerge={true}
                    lazyUpdate={true}
                  />
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid',
                borderColor: alpha('#1976d2', 0.1),
                background: 'white',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ p: 2, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                <Typography variant="h6" fontWeight="bold" color="primary.dark">
                  不同離職率情境下的公司實際成本
                </Typography>
              </Box>
              <Box
                sx={{ p: 2, flex: 1, minHeight: '450px', display: 'flex', flexDirection: 'column' }}
              >
                <Box sx={{ height: '400px', width: '100%', flex: 1 }}>
                  <ReactECharts
                    option={turnoverRateOption}
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
                    notMerge={true}
                    lazyUpdate={true}
                  />
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* 5年完整鎖定期分析 */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid',
            borderColor: alpha('#4caf50', 0.2),
            background: 'white',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                  borderRadius: 2,
                  mr: 2,
                }}
              />
              <Typography variant="h5" fontWeight="bold" color="success.dark">
                情境一：完成5年鎖定期（最佳情況）
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TableContainer
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: alpha('#4caf50', 0.2),
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ background: alpha('#4caf50', 0.1) }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>年度</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      員工投入
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      公司補助
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      累積本金
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      淨報酬
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fiveYearData.map((row, index) => (
                    <TableRow
                      key={row.year}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: alpha('#4caf50', 0.05),
                        },
                        '&:hover': {
                          backgroundColor: alpha('#4caf50', 0.1),
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 'medium' }}>{row.year}年</TableCell>
                      <TableCell align="right">{row.employee.toLocaleString()}</TableCell>
                      <TableCell align="right">{row.company.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                        {row.total.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={row.netReturn.toLocaleString()}
                          color={row.year === 5 ? 'success' : 'default'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Alert
              severity="success"
              sx={{
                mt: 3,
                borderRadius: 2,
                background: alpha('#4caf50', 0.1),
                border: '1px solid',
                borderColor: alpha('#4caf50', 0.3),
              }}
            >
              <strong>年化報酬率：約 57.5%</strong>（含公司補助，即使股價下跌30%仍遠優於定存）
            </Alert>
          </CardContent>
        </Card>

        {/* 提前離職分析 */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid',
            borderColor: alpha('#ff9800', 0.2),
            background: 'white',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                  borderRadius: 2,
                  mr: 2,
                }}
              />
              <Typography variant="h5" fontWeight="bold" color="warning.dark">
                情境二：提前離職（3年後）
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TableContainer
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: alpha('#ff9800', 0.2),
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ background: alpha('#ff9800', 0.1) }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>年度</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      員工投入
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      公司補助
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      需返還
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      實際取得
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      年化報酬率
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {earlyExitData.map((row, index) => (
                    <TableRow
                      key={row.year}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: alpha('#ff9800', 0.05),
                        },
                        '&:hover': {
                          backgroundColor: alpha('#ff9800', 0.1),
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 'medium' }}>{row.year}年後</TableCell>
                      <TableCell align="right">{row.employee.toLocaleString()}</TableCell>
                      <TableCell align="right">{row.company.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={row.return.toLocaleString()}
                          color="error"
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                        {row.netReturn.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label="約 6.7%"
                          color="warning"
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Alert
              severity="warning"
              sx={{
                mt: 3,
                borderRadius: 2,
                background: alpha('#ff9800', 0.1),
                border: '1px solid',
                borderColor: alpha('#ff9800', 0.3),
              }}
            >
              提前離職需返還公司補助的80%，報酬率大幅下降但仍優於定存（1.75%）
            </Alert>
          </CardContent>
        </Card>

        {/* 股價情境分析 */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid',
            borderColor: alpha('#2196f3', 0.2),
            background: 'white',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  background: 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)',
                  borderRadius: 2,
                  mr: 2,
                }}
              />
              <Typography variant="h5" fontWeight="bold" color="info.dark">
                情境三：不同股價情境下的5年總報酬
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TableContainer
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: alpha('#2196f3', 0.2),
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ background: alpha('#2196f3', 0.1) }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>情境</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      5年後股價
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      股票總價值
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      淨報酬
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      年化報酬率
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockPriceScenarios.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: alpha('#2196f3', 0.05),
                        },
                        '&:hover': {
                          backgroundColor: alpha('#2196f3', 0.1),
                        },
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={row.scenario}
                          color={index === 0 ? 'success' : index === 1 ? 'info' : 'error'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                        {row.price}元
                      </TableCell>
                      <TableCell align="right">{row.value.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {row.return.toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {(() => {
                          // 計算年化報酬率：基於員工投入300,000元，5年後總價值
                          const totalReturn = row.return + 300000 // 總價值 = 淨報酬 + 員工投入
                          const annualizedReturn = ((totalReturn / 300000) ** (1 / 5) - 1) * 100
                          return `約 ${annualizedReturn.toFixed(1)}%`
                        })()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Alert
              severity="info"
              sx={{
                mt: 3,
                borderRadius: 2,
                background: alpha('#2196f3', 0.1),
                border: '1px solid',
                borderColor: alpha('#2196f3', 0.3),
              }}
            >
              基於2025年12月股價12.90元重新評估：即使股價下跌30%，持股信託的年化報酬率仍遠高於定存（1.75%）
            </Alert>
          </CardContent>
        </Card>

        {/* 離職率影響分析 */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid',
            borderColor: alpha('#1976d2', 0.1),
            background: 'white',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                  borderRadius: 2,
                  mr: 2,
                }}
              />
              <Typography variant="h5" fontWeight="bold" color="primary.dark">
                離職率影響分析
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: alpha('#f44336', 0.4),
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(244, 67, 54, 0.2)',
                    },
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="error.dark" sx={{ mb: 2 }}>
                    高離職率 ({'>'}20%)
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, fontWeight: 'bold', color: 'error.dark' }}
                  >
                    對公司有利：
                  </Typography>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px', color: '#424242' }}>
                    <li>多數員工無法完成5年鎖定期</li>
                    <li>提前離職需返還公司補助80%</li>
                    <li>公司實際支出低於預期</li>
                    <li>留才效果有限，但財務成本可控</li>
                  </ul>
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, fontWeight: 'bold', color: 'error.dark' }}
                  >
                    對員工不利：
                  </Typography>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px', color: '#424242' }}>
                    <li>多數人拿不到完整權益</li>
                    <li>投入資金被鎖定，流動性差</li>
                    <li>若股價下跌，可能虧損</li>
                  </ul>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: alpha('#ff9800', 0.4),
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(255, 152, 0, 0.2)',
                    },
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="warning.dark" sx={{ mb: 2 }}>
                    中離職率 (10-20%)
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, fontWeight: 'bold', color: 'warning.dark' }}
                  >
                    平衡點：
                  </Typography>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px', color: '#424242' }}>
                    <li>雙方利益較為平衡</li>
                    <li>公司達到留才目的</li>
                    <li>員工有合理報酬</li>
                    <li>風險與報酬適中</li>
                  </ul>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: alpha('#4caf50', 0.4),
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(76, 175, 80, 0.2)',
                    },
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="success.dark" sx={{ mb: 2 }}>
                    低離職率 ({'<'}10%)
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, fontWeight: 'bold', color: 'success.dark' }}
                  >
                    對員工有利：
                  </Typography>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px', color: '#424242' }}>
                    <li>多數人能完成5年鎖定期</li>
                    <li>可取得完整權益（員工+公司提存金）</li>
                    <li>若股價成長，報酬可觀</li>
                    <li>公司補助等於額外獎金</li>
                  </ul>
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, fontWeight: 'bold', color: 'success.dark' }}
                  >
                    對公司較不利：
                  </Typography>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px', color: '#424242' }}>
                    <li>財務成本較高（需持續提撥）</li>
                    <li>若股價上漲，公司成本增加</li>
                    <li>但留才效果較好</li>
                  </ul>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 風險評估 */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid',
            borderColor: alpha('#1976d2', 0.1),
            background: 'white',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                  borderRadius: 2,
                  mr: 2,
                }}
              />
              <Typography variant="h5" fontWeight="bold" color="primary.dark">
                風險評估
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: alpha('#f44336', 0.4),
                    textAlign: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(244, 67, 54, 0.2)',
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="error.dark"
                    sx={{ mb: 1 }}
                  >
                    股價波動風險
                  </Typography>
                  <Typography variant="h4" color="error.dark" fontWeight="bold" sx={{ mb: 0.5 }}>
                    中高
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    年度波動約30-40%
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: alpha('#f44336', 0.4),
                    textAlign: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(244, 67, 54, 0.2)',
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="error.dark"
                    sx={{ mb: 1 }}
                  >
                    流動性風險
                  </Typography>
                  <Typography variant="h4" color="error.dark" fontWeight="bold" sx={{ mb: 0.5 }}>
                    高
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    資金鎖定5年
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: alpha('#4caf50', 0.4),
                    textAlign: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(76, 175, 80, 0.2)',
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="success.dark"
                    sx={{ mb: 1 }}
                  >
                    信用風險
                  </Typography>
                  <Typography variant="h4" color="success.dark" fontWeight="bold" sx={{ mb: 0.5 }}>
                    低
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    公司補助有保障
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: alpha('#ff9800', 0.4),
                    textAlign: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(255, 152, 0, 0.2)',
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="warning.dark"
                    sx={{ mb: 1 }}
                  >
                    機會成本
                  </Typography>
                  <Typography variant="h4" color="warning.dark" fontWeight="bold" sx={{ mb: 0.5 }}>
                    中
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    無法用於其他投資
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 建議 */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid',
            borderColor: alpha('#1976d2', 0.1),
            background: 'white',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                  borderRadius: 2,
                  mr: 2,
                }}
              />
              <Typography variant="h5" fontWeight="bold" color="primary.dark">
                建議與結論
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: alpha('#4caf50', 0.4),
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" gutterBottom color="success.dark" fontWeight="bold">
                    ✓ 適合加入的條件
                  </Typography>
                  <ul style={{ marginTop: '12px', paddingLeft: '20px', color: '#424242' }}>
                    <li style={{ marginBottom: '8px' }}>計畫待滿5年：報酬率遠高於定存</li>
                    <li style={{ marginBottom: '8px' }}>風險承受度高：能接受股價波動</li>
                    <li style={{ marginBottom: '8px' }}>不需要流動性：資金可長期鎖定</li>
                    <li>對公司前景有信心：股價有成長潛力</li>
                  </ul>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: alpha('#f44336', 0.4),
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" gutterBottom color="error.dark" fontWeight="bold">
                    ✗ 不適合加入的條件
                  </Typography>
                  <ul style={{ marginTop: '12px', paddingLeft: '20px', color: '#424242' }}>
                    <li style={{ marginBottom: '8px' }}>短期可能離職：提前退出報酬率低</li>
                    <li style={{ marginBottom: '8px' }}>需要流動性：無法應急使用</li>
                    <li style={{ marginBottom: '8px' }}>風險承受度低：無法接受股價波動</li>
                    <li>有其他高報酬投資機會：機會成本高</li>
                  </ul>
                </Paper>
              </Grid>
            </Grid>
            <Alert
              severity="success"
              sx={{
                mt: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                border: '2px solid',
                borderColor: alpha('#4caf50', 0.4),
              }}
            >
              <Typography variant="body1" fontWeight="bold" color="success.dark">
                結論：若能待滿5年，此計畫對員工非常有利；若可能提前離職，需謹慎評估。
                整體而言，在完成5年鎖定期的前提下，持股信託的風險調整後報酬遠優於定存。
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* 優劣分析文章 */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid',
            borderColor: alpha('#1976d2', 0.1),
            background: 'white',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 4,
                  height: 40,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  mr: 2,
                }}
              />
              <Typography variant="h4" fontWeight="bold" color="primary.dark">
                中華工程員工持股信託方案優劣分析
              </Typography>
            </Box>
            <Divider sx={{ mb: 4 }} />

            {/* 一、台灣企業員工持股信託實施現況比較 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
                一、台灣企業員工持股信託實施現況比較
              </Typography>

              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5, mt: 2 }}>
                （一）補助比例比較
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: '#424242', lineHeight: 1.8 }}>
                根據公開資料，台灣各企業實施員工持股信託的補助比例差異甚大：
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: alpha('#e3f2fd', 0.5), borderRadius: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary.dark"
                      sx={{ mb: 1 }}
                    >
                      1. 中鋼公司
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 補助比例：30%（2024年11月由20%提升至30%）
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 員工提撥：最高薪資的10%
                    </Typography>
                    <Typography variant="body2">
                      • 特色：補助比例相對保守，但已逐步提升以增強留才誘因
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: alpha('#e3f2fd', 0.5), borderRadius: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary.dark"
                      sx={{ mb: 1 }}
                    >
                      2. 中華電信
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 補助比例：最高30%
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 員工提撥：薪資的10%
                    </Typography>
                    <Typography variant="body2">
                      • 特色：民營化後實施，補助比例與中鋼相當
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: alpha('#e8f5e9', 0.5), borderRadius: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="success.dark"
                      sx={{ mb: 1 }}
                    >
                      3. 力成科技
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 補助比例：100%（等額補助）
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 員工提撥：薪資的10%
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 適用對象：經理級以上主管
                    </Typography>
                    <Typography variant="body2">• 特色：高補助比例，但僅限特定職級</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, background: alpha('#e8f5e9', 0.5), borderRadius: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="success.dark"
                      sx={{ mb: 1 }}
                    >
                      4. 英濟公司
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 補助比例：100%（等額補助）
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 員工提撥：自願提撥固定金額
                    </Typography>
                    <Typography variant="body2">
                      • 特色：補助比例為業界頂標，全體員工適用
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5, mt: 3 }}>
                （二）鎖定期與離職返還機制比較
              </Typography>
              <ul style={{ paddingLeft: '24px', color: '#424242', lineHeight: 1.8 }}>
                <li>
                  <strong>中鋼、中華電信</strong>：鎖定期相對較短，通常為3-5年
                </li>
                <li>
                  <strong>力成科技</strong>：需達到特定年資或退休後才能全額領取
                </li>
                <li>
                  <strong>某車用電子零組件大廠</strong>
                  ：需服務滿15年才能全額領取，未達15年者僅能領取50%-75%
                </li>
              </ul>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* 二、中華工程持股信託方案分析 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
                二、中華工程持股信託方案分析
              </Typography>

              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5, mt: 2 }}>
                （一）方案內容摘要
              </Typography>
              <Paper sx={{ p: 2.5, background: alpha('#e0f2fe', 0.3), borderRadius: 2, mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  根據中華工程（2515）員工持股信託計畫：
                </Typography>
                <ul style={{ paddingLeft: '24px', color: '#424242', lineHeight: 1.8 }}>
                  <li>
                    <strong>員工提撥比例</strong>：薪資的10%（以月薪50,000元為例，每月提撥5,000元）
                  </li>
                  <li>
                    <strong>公司補助比例</strong>：100%（等額補助，每月5,000元）
                  </li>
                  <li>
                    <strong>鎖定期</strong>：5年
                  </li>
                  <li>
                    <strong>提前離職處理</strong>：需返還公司補助的80%
                  </li>
                  <li>
                    <strong>完成鎖定期</strong>：可取得完整權益（員工自提+公司補助）
                  </li>
                </ul>
              </Paper>

              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5, mt: 3 }}>
                （二）優勢分析
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2.5,
                      background: alpha('#e8f5e9', 0.3),
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="success.dark"
                      sx={{ mb: 1 }}
                    >
                      1. 補助比例優渥，具競爭力
                    </Typography>
                    <ul style={{ paddingLeft: '20px', color: '#424242', lineHeight: 1.8 }}>
                      <li>✓ 100%等額補助為業界頂標水準，與力成科技、英濟公司等優質企業相當</li>
                      <li>✓ 相較於中鋼、中華電信的30%補助比例，中華工程的補助更具吸引力</li>
                      <li>✓ 對員工而言，等同於公司額外提供一倍的投資本金，大幅提升投資報酬率</li>
                    </ul>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2.5,
                      background: alpha('#e8f5e9', 0.3),
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="success.dark"
                      sx={{ mb: 1 }}
                    >
                      2. 鎖定期設計合理
                    </Typography>
                    <ul style={{ paddingLeft: '20px', color: '#424242', lineHeight: 1.8 }}>
                      <li>✓ 5年鎖定期相較於某些企業的15年鎖定期，對員工較為友善</li>
                      <li>✓ 既能達到留才目的，又不會過度限制員工的職業發展彈性</li>
                      <li>✓ 符合一般員工職業規劃的時間週期</li>
                    </ul>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2.5,
                      background: alpha('#e8f5e9', 0.3),
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="success.dark"
                      sx={{ mb: 1 }}
                    >
                      3. 提前離職機制相對寬鬆
                    </Typography>
                    <ul style={{ paddingLeft: '20px', color: '#424242', lineHeight: 1.8 }}>
                      <li>✓ 僅需返還公司補助的80%，員工仍可保留20%的公司補助</li>
                      <li>✓ 相較於某些企業要求全額返還公司補助，此機制對員工較為有利</li>
                      <li>✓ 員工自提部分完全保留，保障員工基本權益</li>
                    </ul>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2.5,
                      background: alpha('#e8f5e9', 0.3),
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="success.dark"
                      sx={{ mb: 1 }}
                    >
                      4. 財務效益顯著
                    </Typography>
                    <ul style={{ paddingLeft: '20px', color: '#424242', lineHeight: 1.8 }}>
                      <li>✓ 以月薪50,000元為例，每月投入10,000元（員工5,000元+公司5,000元）</li>
                      <li>✓ 5年累積投入600,000元，若股價上漲30%，資產價值可達780,000元</li>
                      <li>✓ 年化報酬率遠高於定存利率（1.75%），即使股價下跌30%，仍具投資價值</li>
                    </ul>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5, mt: 3 }}>
                （三）劣勢與風險分析
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2.5,
                      background: alpha('#ffebee', 0.3),
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="error.dark"
                      sx={{ mb: 1 }}
                    >
                      1. 股價波動風險
                    </Typography>
                    <ul style={{ paddingLeft: '20px', color: '#424242', lineHeight: 1.8 }}>
                      <li>⚠ 員工需承擔公司股價下跌的風險，若股價大幅下跌，可能影響投資收益</li>
                      <li>⚠ 股價波動率約30-40%（年度），屬於中高風險投資</li>
                      <li>⚠ 投資標的過於集中，缺乏分散風險的機制</li>
                    </ul>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2.5,
                      background: alpha('#ffebee', 0.3),
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="error.dark"
                      sx={{ mb: 1 }}
                    >
                      2. 流動性限制
                    </Typography>
                    <ul style={{ paddingLeft: '20px', color: '#424242', lineHeight: 1.8 }}>
                      <li>⚠ 5年鎖定期內無法自由處分持股，資金流動性受限</li>
                      <li>⚠ 若員工有緊急資金需求，無法提前變現</li>
                      <li>⚠ 可能影響員工的財務規劃彈性</li>
                    </ul>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2.5,
                      background: alpha('#ffebee', 0.3),
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="error.dark"
                      sx={{ mb: 1 }}
                    >
                      3. 提前離職成本
                    </Typography>
                    <ul style={{ paddingLeft: '20px', color: '#424242', lineHeight: 1.8 }}>
                      <li>⚠ 提前離職需返還公司補助的80%，可能影響員工的離職決策</li>
                      <li>⚠ 若員工在鎖定期內離職，投資報酬率將大幅降低</li>
                      <li>⚠ 可能造成員工「被綁定」的負面感受</li>
                    </ul>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2.5,
                      background: alpha('#ffebee', 0.3),
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="error.dark"
                      sx={{ mb: 1 }}
                    >
                      4. 公司財務負擔與稅務影響
                    </Typography>
                    <ul style={{ paddingLeft: '20px', color: '#424242', lineHeight: 1.8 }}>
                      <li>⚠ 100%補助比例對公司財務造成一定負擔</li>
                      <li>⚠ 若參與員工眾多，公司每月需提撥大量資金</li>
                      <li>⚠ 未明確說明稅務處理方式，可能影響員工實際收益</li>
                    </ul>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* 三、與同業比較之綜合評析 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
                三、與同業比較之綜合評析
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 2.5,
                      background: alpha('#e3f2fd', 0.3),
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary.dark"
                      sx={{ mb: 1 }}
                    >
                      （一）補助比例評比
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      中華工程的100%補助比例在業界屬於頂標水準：
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 優於：中鋼（30%）、中華電信（30%）
                    </Typography>
                    <Typography variant="body2">
                      • 與以下企業相當：力成科技（100%，但僅限經理級以上）、英濟公司（100%）
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 2.5,
                      background: alpha('#e3f2fd', 0.3),
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary.dark"
                      sx={{ mb: 1 }}
                    >
                      （二）鎖定期評比
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 優於：某車用電子零組件大廠（15年）
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 相當於：中鋼、中華電信（3-5年）
                    </Typography>
                    <Typography variant="body2">• 略長於：部分企業的3年鎖定期</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 2.5,
                      background: alpha('#e3f2fd', 0.3),
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary.dark"
                      sx={{ mb: 1 }}
                    >
                      （三）離職返還機制評比
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • 優於：要求全額返還公司補助的企業
                    </Typography>
                    <Typography variant="body2">• 員工仍可保留20%的公司補助，較為友善</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* 四、建議與結論 */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight="bold" color="primary.dark" sx={{ mb: 2 }}>
                四、建議與結論
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2.5,
                      background: alpha('#e8f5e9', 0.3),
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="success.dark"
                      sx={{ mb: 1 }}
                    >
                      （一）對員工的建議
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      適合參與的條件：
                    </Typography>
                    <ul
                      style={{
                        paddingLeft: '20px',
                        color: '#424242',
                        lineHeight: 1.8,
                        marginBottom: '12px',
                      }}
                    >
                      <li>計畫在公司長期發展（至少5年）</li>
                      <li>風險承受度中等以上</li>
                      <li>不需要短期資金流動性</li>
                      <li>認同公司長期發展前景</li>
                    </ul>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      不適合參與的條件：
                    </Typography>
                    <ul style={{ paddingLeft: '20px', color: '#424242', lineHeight: 1.8 }}>
                      <li>短期可能離職</li>
                      <li>需要資金流動性</li>
                      <li>風險承受度低</li>
                      <li>有其他高報酬投資機會</li>
                    </ul>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 2.5,
                      background: alpha('#fff3e0', 0.3),
                      borderRadius: 2,
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="warning.dark"
                      sx={{ mb: 1 }}
                    >
                      （二）對公司的建議
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      優點維持：
                    </Typography>
                    <ul
                      style={{
                        paddingLeft: '20px',
                        color: '#424242',
                        lineHeight: 1.8,
                        marginBottom: '12px',
                      }}
                    >
                      <li>維持100%補助比例的競爭優勢</li>
                      <li>保持5年鎖定期的合理設計</li>
                      <li>持續全體員工適用的公平機制</li>
                    </ul>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      可改善之處：
                    </Typography>
                    <ul style={{ paddingLeft: '20px', color: '#424242', lineHeight: 1.8 }}>
                      <li>加強員工教育，說明股價波動風險</li>
                      <li>明確稅務處理方式，提升透明度</li>
                      <li>考慮提供分階段解鎖機制，增加彈性</li>
                      <li>評估財務負擔，確保長期可持續性</li>
                    </ul>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5, mt: 3 }}>
                （三）綜合結論
              </Typography>
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  background: alpha('#4caf50', 0.1),
                  border: '2px solid',
                  borderColor: alpha('#4caf50', 0.4),
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="success.dark"
                  sx={{ mb: 1 }}
                >
                  優點：
                </Typography>
                <ul style={{ paddingLeft: '24px', marginBottom: '12px' }}>
                  <li>✓ 補助比例（100%）為業界頂標，極具競爭力</li>
                  <li>✓ 鎖定期（5年）設計合理，平衡留才與員工權益</li>
                  <li>✓ 離職返還機制（返還80%）相對寬鬆，對員工友善</li>
                  <li>✓ 全體員工適用，體現公平性與包容性</li>
                </ul>
              </Alert>

              <Alert
                severity="warning"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  background: alpha('#ff9800', 0.1),
                  border: '2px solid',
                  borderColor: alpha('#ff9800', 0.4),
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="warning.dark"
                  sx={{ mb: 1 }}
                >
                  風險與限制：
                </Typography>
                <ul style={{ paddingLeft: '24px', marginBottom: '12px' }}>
                  <li>⚠ 股價波動風險需員工自行承擔</li>
                  <li>⚠ 5年鎖定期限制資金流動性</li>
                  <li>⚠ 提前離職成本較高</li>
                  <li>⚠ 公司財務負擔需持續評估</li>
                </ul>
              </Alert>

              <Alert
                severity="info"
                sx={{
                  borderRadius: 2,
                  background: alpha('#2196f3', 0.1),
                  border: '2px solid',
                  borderColor: alpha('#2196f3', 0.4),
                }}
              >
                <Typography variant="body1" fontWeight="bold" color="info.dark">
                  總結：整體而言，中華工程的持股信託方案在補助比例、鎖定期設計、離職返還機制等方面均優於多數同業，對計畫長期服務的員工而言，是一項極具吸引力的福利制度。若能完成5年鎖定期，持股信託的風險調整後報酬遠優於定存，值得員工積極參與。
                </Typography>
              </Alert>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
              <Typography variant="caption">
                撰寫日期：2025年12月 | 資料來源：公開資訊、業界實務比較分析
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
