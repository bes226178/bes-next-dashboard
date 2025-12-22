import Link from 'next/link'
import { Button, Box } from '@mui/material'
import { tables } from '@/lib/tables'

import EmployeeResignedAnalysisClient from './components/EmployeeResignedAnalysisClient'

export default async function EmployeeResignedAnalysis() {
  // 直接從資料庫查詢離職人員資料
  let employees = []
  let allEmployeesForHeatmap = []

  try {
    employees = await tables.frEmployee.getResignedEmployeesWithTenure()
    // 查詢所有員工資料用於熱力圖分析
    allEmployeesForHeatmap = await tables.frEmployee.getAllEmployeesForHeatmap()
  } catch (error) {
    console.error('取得離職人員資料失敗:', error)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '32px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
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
            員工持股信託分析
          </Button>
          <Button
            component={Link}
            href="/employee-resigned-analysis"
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              },
            }}
          >
            離職人員服務年資分析
          </Button>
        </Box>

        {/* 頁面標題區塊 */}
        <div
          style={{
            marginBottom: '40px',
            padding: '32px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
            }}
          >
            離職人員服務年資分析
          </h1>
          <p
            style={{
              margin: '12px 0 0 0',
              fontSize: '16px',
              color: '#64748b',
              fontWeight: 400,
            }}
          >
            深入分析離職人員的服務年資分佈與趨勢，提供數據驅動的洞察
          </p>
        </div>

        {/* 客戶端組件處理篩選和顯示 */}
        <EmployeeResignedAnalysisClient
          initialEmployees={employees}
          initialAllEmployeesForHeatmap={allEmployeesForHeatmap}
        />
      </div>
    </div>
  )
}
