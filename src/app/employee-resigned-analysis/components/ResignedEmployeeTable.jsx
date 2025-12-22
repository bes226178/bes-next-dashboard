'use client'

import { useMemo, useState, useEffect } from 'react'

import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'

export default function ResignedEmployeeTable({ employees = [] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 準備表格資料，添加行號
  const rows = useMemo(() => {
    return employees.map((emp, index) => {
      const tenure = emp.TENURE_YEARS || emp.YEARS_IN_OFFICE || emp.EMPLOYEE_SENIORITY || 0
      return {
        id: emp.EMPLOYEE_ID || index,
        rowNumber: index + 1,
        employeeId: emp.EMPLOYEE_ID,
        employeeName: emp.EMPLOYEE_NAME || '',
        departmentName: emp.DEPARTMENT_NAME || emp.DEPARTMENT_NAME_WITHOUT_STATION || '',
        dateStart: emp.DATE_START || '',
        dateResign: emp.DATE_RESIGN || '',
        tenureYears: Math.round(tenure * 100) / 100,
        jobName: emp.JOB_NAME || '',
        gradeName: emp.GRADE_NAME || '',
        dateResignYear: emp.DATE_RESIGN_YEAR || null,
        dateResignMonth: emp.DATE_RESIGN_MONTH || null,
      }
    })
  }, [employees])

  // 欄位定義
  const columns = [
    {
      field: 'rowNumber',
      headerName: '項次',
      type: 'number',
      width: 60,
      resizable: false,
      disableColumnMenu: true,
      sortable: false,
      filterable: false,
      align: 'right',
      headerAlign: 'left',
    },
    {
      field: 'employeeId',
      headerName: '員工編號',
      minWidth: 100,
      filterable: true,
    },
    {
      field: 'employeeName',
      headerName: '姓名',
      minWidth: 100,
      filterable: true,
    },
    {
      field: 'departmentName',
      headerName: '部門',
      minWidth: 150,
      filterable: true,
    },
    {
      field: 'jobName',
      headerName: '職稱',
      minWidth: 120,
      filterable: true,
    },
    {
      field: 'gradeName',
      headerName: '職等',
      minWidth: 80,
      filterable: true,
    },
    {
      field: 'dateStart',
      headerName: '入職日期',
      minWidth: 110,
      resizable: false,
      filterable: true,
    },
    {
      field: 'dateResign',
      headerName: '離職日期',
      minWidth: 110,
      resizable: false,
      filterable: true,
    },
    {
      field: 'tenureYears',
      headerName: '服務年資',
      type: 'number',
      minWidth: 100,
      align: 'right',
      headerAlign: 'left',
      resizable: false,
      filterable: true,
      valueFormatter: value => {
        if (value == null || value === '') {
          return ''
        }
        return `${value.toFixed(2)} 年`
      },
    },
  ]

  if (!mounted) {
    return (
      <Box sx={{ width: '100%', mt: 0 }} suppressHydrationWarning>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '24px',
            letterSpacing: '-0.3px',
          }}
        >
          離職人員列表
        </Typography>
        <Box
          sx={{
            p: 3,
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(102, 126, 234, 0.1)',
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25 },
              },
            }}
            disableRowSelectionOnClick
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                fontSize: '14px',
                color: '#475569',
                borderColor: 'rgba(102, 126, 234, 0.1)',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'rgba(102, 126, 234, 0.08)',
                fontWeight: 600,
                fontSize: '14px',
                color: '#1e293b',
                borderColor: 'rgba(102, 126, 234, 0.1)',
              },
            }}
          />
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', mt: 0 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '24px',
          letterSpacing: '-0.3px',
        }}
      >
        離職人員列表
      </Typography>
      <Box
        sx={{
          p: 3,
          background: 'rgba(255, 255, 255, 0.6)',
          borderRadius: '12px',
          border: '1px solid rgba(102, 126, 234, 0.1)',
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
            sorting: {
              sortModel: [{ field: 'dateResign', sort: 'desc' }],
            },
          }}
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              fontSize: '14px',
              color: '#475569',
              borderColor: 'rgba(102, 126, 234, 0.1)',
              '&:focus': {
                outline: 'none',
              },
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(102, 126, 234, 0.08)',
              fontWeight: 600,
              fontSize: '14px',
              color: '#1e293b',
              borderColor: 'rgba(102, 126, 234, 0.1)',
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.04)',
              },
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: 'rgba(102, 126, 234, 0.1)',
            },
            '& .MuiDataGrid-toolbarContainer': {
              padding: '12px',
              '& .MuiButton-root': {
                color: '#667eea',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                },
              },
            },
          }}
        />
      </Box>
    </Box>
  )
}
