'use client'

import { fmNoUnit } from '@/utils/fm'
import { useMemo, useState, useEffect, useCallback } from 'react'

import { red } from '@mui/material/colors'
import { DataGrid } from '@mui/x-data-grid'
import {
  Box,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'

import MetricCards from './MetricCards'
import EnsureTypeChip from './EnsureTypeChip'
export default function EnsureTable({ data = [], descData = [] }) {
  // 篩選狀態
  const [siteFilter, setSiteFilter] = useState('')
  const [warrantyStatusFilter, setWarrantyStatusFilter] = useState('all') // 'all', 'released', 'notReleased'
  const [ensureTypeFilter, setEnsureTypeFilter] = useState(undefined) // undefined 表示未點擊，null 表示點擊整體，字符串表示點擊特定種類
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 處理卡片點擊事件：設置保固金種類篩選並重設工務所篩選為全部
  const handleCardClick = useCallback(ensureType => {
    setEnsureTypeFilter(ensureType)
    setSiteFilter('') // 點擊卡片時，將工務所篩選重設為全部
  }, [])

  // 獲取所有不重複的工務所名稱，依照 ORD_NO 排序
  const uniqueSites = useMemo(() => {
    // 建立 Map 來儲存每個工務所對應的最小 ORD_NO
    const siteOrdNoMap = new Map()

    data.forEach(row => {
      const site = row.SITE_CNAME
      const ordNo = row.ORD_NO

      if (site && site.trim() !== '' && ordNo != null) {
        // 如果該工務所還沒有記錄，或找到更小的 ORD_NO，則更新
        if (!siteOrdNoMap.has(site) || siteOrdNoMap.get(site) > ordNo) {
          siteOrdNoMap.set(site, ordNo)
        }
      }
    })

    // 轉換為陣列並依照 ORD_NO 排序
    return Array.from(siteOrdNoMap.entries())
      .sort((a, b) => {
        // 比較 ORD_NO（數字或字串）
        const ordNoA = a[1]
        const ordNoB = b[1]

        // 如果都是數字，進行數值比較
        if (typeof ordNoA === 'number' && typeof ordNoB === 'number') {
          return ordNoA - ordNoB
        }

        // 否則進行字串比較
        return String(ordNoA).localeCompare(String(ordNoB), undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      })
      .map(([site]) => site) // 只提取工務所名稱
  }, [data])

  // 篩選後的數據，並添加行號
  const filteredData = useMemo(() => {
    let result = data
    if (siteFilter) {
      result = data.filter(row => row.SITE_CNAME === siteFilter)
    }
    // 根據保固金種類篩選（點擊卡片時）
    // ensureTypeFilter 為 undefined 表示未點擊卡片（初始狀態）
    // ensureTypeFilter 為 null 表示點擊了"整體未解除保固狀況"卡片
    // ensureTypeFilter 為字符串表示點擊了特定保固金種類卡片
    if (ensureTypeFilter !== undefined) {
      // 當點擊卡片時，只顯示沒有保固解除日的資料
      if (ensureTypeFilter === null) {
        // 點擊"整體未解除保固狀況"卡片：只顯示沒有保固解除日的資料
        result = result.filter(row => row.STOP_ENSURE_DATE == null || row.STOP_ENSURE_DATE === '')
      } else {
        // 點擊特定保固金種類卡片：只顯示該種類且沒有保固解除日的資料
        result = result.filter(
          row =>
            row.ENSURE_CH === ensureTypeFilter &&
            (row.STOP_ENSURE_DATE == null || row.STOP_ENSURE_DATE === '')
        )
      }
    } else {
      // 沒有點擊卡片時，使用保固狀態篩選
      if (warrantyStatusFilter === 'released') {
        // 已解除：保固解除日有日期
        result = result.filter(row => row.STOP_ENSURE_DATE != null && row.STOP_ENSURE_DATE !== '')
      } else if (warrantyStatusFilter === 'notReleased') {
        // 未解除：保固解除日沒有日期
        result = result.filter(row => row.STOP_ENSURE_DATE == null || row.STOP_ENSURE_DATE === '')
      }
    }
    // 為每一行添加行號
    return result.map((row, index) => ({
      ...row,
      rowNumber: index + 1,
    }))
  }, [data, siteFilter, warrantyStatusFilter, ensureTypeFilter])

  // 篩選 descData 中符合當前選擇工務所的數據
  const filteredDescData = useMemo(() => {
    if (!siteFilter || !descData || descData.length === 0) {
      return []
    }
    return descData.filter(row => row.BI_PROJECT_NAME === siteFilter)
  }, [descData, siteFilter])

  // 欄位定義（依照提供的 schema 順序）
  const columns = [
    {
      field: 'rowNumber',
      headerName: '項次',
      type: 'number',
      width: 40,
      resizable: false,
      disableColumnMenu: true,
      sortable: false,
      filterable: false,
      align: 'right',
      headerAlign: 'left',
    },
    {
      field: 'BI_PROJECT_NAME',
      headerName: '工務所',
      minWidth: 80,

      disableColumnMenu: true,
    },
    { field: 'ORD_CH', headerName: '工程名稱', minWidth: 120, disableColumnMenu: true },
    {
      field: 'ITEM_NO',
      headerName: '保固項次',
      type: 'number',
      resizable: false,
      width: 80,
      headerAlign: 'left',
      disableColumnMenu: true,
    },
    { field: 'ENSURE_DESC', headerName: '保固內容', minWidth: 120, disableColumnMenu: true },
    {
      field: 'ENSURE_YEARS',
      headerName: '保固年數',
      type: 'number',
      align: 'right',
      headerAlign: 'left',
      resizable: false,
      width: 80,
      disableColumnMenu: true,
    },
    {
      field: 'ENSURE_END_DATE',
      headerName: '保固訖日',
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: 'DAYS_SINCE_ENSURE_END_DATE',
      headerName: '過保天數',
      type: 'number',
      resizable: false,
      width: 80,
      headerAlign: 'left',
      disableColumnMenu: true,
      valueFormatter: value => {
        if (value < 0) {
          return ''
        }
        return fmNoUnit(value)
      },
    },
    {
      field: 'ENSURE_CH',
      headerName: '保固金種類',
      resizable: false,
      disableColumnMenu: true,
      width: 120,
      renderCell: params => <EnsureTypeChip type={params.value} />,
    },
    {
      field: 'ENSURE_AMOUNT',
      headerName: '保固金額',
      type: 'number',
      resizable: false,
      align: 'right',
      headerAlign: 'left',
      valueFormatter: value => {
        if (value == null || value === '') {
          return ''
        }
        return fmNoUnit(value)
      },
      disableColumnMenu: true,
    },
    {
      field: 'STOP_ENSURE_DATE',
      headerName: '保固解除日',
      resizable: false,
      disableColumnMenu: true,
    },
    { field: 'ENSURE_PROCESSING', headerName: '處理情形', minWidth: 120, disableColumnMenu: true },
    { field: 'REMARK', headerName: '備註', minWidth: 120, disableColumnMenu: true },
    { field: 'ENSURE_ID', headerName: '保固ID', resizable: false, disableColumnMenu: true },
    { field: 'MNG', headerName: '主管部門ID', resizable: false, disableColumnMenu: true },
    {
      field: 'MNG_CNAME',
      headerName: '主管部門',
      minWidth: 140,
      resizable: false,
      disableColumnMenu: true,
    },
    {
      field: 'ENSURE_KND',
      headerName: '保固金種類編號',
      resizable: false,
      minWidth: 140,
      disableColumnMenu: true,
    },
    {
      field: 'CLOSE_AMOUNT',
      headerName: '結算金額',
      type: 'number',
      minWidth: 120,
      align: 'right',
      headerAlign: 'left',
      valueFormatter: value => {
        if (value == null || value === '') {
          return ''
        }
        return fmNoUnit(value)
      },
      disableColumnMenu: true,
    },
    {
      field: 'EST_ENSURE_AMOUNT',
      headerName: '提列保固金',
      type: 'number',
      minWidth: 120,
      align: 'right',
      headerAlign: 'left',
      valueFormatter: value => {
        if (value == null || value === '') {
          return ''
        }
        return fmNoUnit(value)
      },
      disableColumnMenu: true,
    },
    {
      field: 'ENSURE_START_DATE',
      headerName: '保固起日',
      resizable: false,
      disableColumnMenu: true,
    },
    { field: 'PROJECT_ID', headerName: '專案ID', resizable: false, disableColumnMenu: true },
    { field: 'ORD_NO', headerName: '工令', resizable: false, disableColumnMenu: true },
    { field: 'DIV', headerName: '工務所ID', resizable: false, disableColumnMenu: true },
    { field: 'SITE_CNAME', headerName: '工務所全稱', minWidth: 140, disableColumnMenu: true },
    {
      field: 'IS_EXPIRED',
      headerName: '是否過保',
      resizable: false,
      disableColumnMenu: true,
      valueFormatter: value => {
        if (value == null || value === '') {
          return ''
        }
        return value == 'Y' ? '是' : '否'
      },
    },
  ]

  if (!mounted) {
    return (
      <Stack direction="column" gap={2}>
        {/* 指標卡片區域 */}
        <MetricCards
          data={data}
          siteFilter={siteFilter}
          onCardClick={handleCardClick}
          selectedEnsureType={ensureTypeFilter}
        />
        {/* 下拉選單 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 'fit-content' }}>
            <InputLabel>篩選工務所</InputLabel>
            <Select
              value={siteFilter}
              label="篩選工務所"
              onChange={e => {
                setSiteFilter(e.target.value)
                // 當下拉選單變更時，重設卡片篩選條件
                setEnsureTypeFilter(undefined)
              }}
              sx={{
                minWidth: 120,
                width: 'auto',
                '& .MuiSelect-select': {
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                },
              }}
            >
              <MenuItem value="">
                <em>全部</em>
              </MenuItem>
              {uniqueSites.map(site => (
                <MenuItem key={site} value={site}>
                  {site}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* 保固狀態按鈕群組 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
              保固狀態：
            </Typography>
            <ToggleButtonGroup
              value={warrantyStatusFilter}
              exclusive
              onChange={(e, newValue) => {
                if (newValue !== null) {
                  setWarrantyStatusFilter(newValue)
                  // 當點擊保固狀態按鈕時，解除卡片點擊狀態
                  setEnsureTypeFilter(undefined)
                }
              }}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  px: 2,
                },
              }}
            >
              <ToggleButton value="all">全部資料</ToggleButton>
              <ToggleButton value="notReleased">未解除</ToggleButton>
              <ToggleButton value="released">已解除</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          {/* ORD_CH 按鈕區域 */}
          {/* {filteredDescData.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {filteredDescData.map((item, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    minWidth: 'auto',
                    fontSize: '0.75rem',
                  }}
                >
                  {item.ORD_CH || '無名稱'}
                </Button>
              ))}
            </Box>
          )} */}
        </Box>
        {/* 表格 */}
        <DataGrid
          suppressHydrationWarning
          rows={filteredData || []}
          columns={columns}
          getRowClassName={params => {
            return params.row.IS_EXPIRED === 'Y' ? 'expired-row' : ''
          }}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f5f5f5',
            },
            '& .expired-row': {
              backgroundColor: red[100],
            },
          }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                // 預設隱藏的欄位
                ENSURE_ID: false,
                MNG: false,
                MNG_CNAME: false,
                ENSURE_KND: false,
                CLOSE_AMOUNT: false,
                EST_ENSURE_AMOUNT: false,
                ENSURE_START_DATE: false,
                PROJECT_ID: false,
                ORD_NO: false,
                DIV: false,
                SITE_CNAME: false,
                IS_EXPIRED: false,
                // 項次欄位預設顯示
                rowNumber: true,
              },
            },
            pagination: {
              paginationModel: {
                pageSize: 100,
              },
            },
          }}
          density="compact"
          // showToolbar
          pageSizeOptions={[100]}
          getRowId={row => {
            if (row && row.ENSURE_ID != null && row.ENSURE_ID !== '') return row.ENSURE_ID
            const a = row && row.PROJECT_ID != null ? String(row.PROJECT_ID) : ''
            const b = row && row.ITEM_NO != null ? String(row.ITEM_NO) : ''
            const c = row && row.ORD_NO != null ? String(row.ORD_NO) : ''
            const d = row && row.ENSURE_KND != null ? String(row.ENSURE_KND) : ''
            const composite = `${a}-${b}-${c}-${d}`
            if (composite && composite !== '---') return composite
            try {
              return JSON.stringify(row)
            } catch (error) {
              // 使用穩定的 ID 生成，避免 hydration 錯誤
              const fallbackId = `row-${a}-${b}-${c}-${d}`
              return fallbackId || 'fallback-row'
            }
          }}
        />
      </Stack>
    )
  }

  return (
    <Stack direction="column" gap={2}>
      {/* 指標卡片區域 */}
      <MetricCards
        data={data}
        siteFilter={siteFilter}
        onCardClick={handleCardClick}
        selectedEnsureType={ensureTypeFilter}
      />
      {/* 下拉選單 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 'fit-content' }}>
          <InputLabel>篩選工務所</InputLabel>
          <Select
            value={siteFilter}
            label="篩選工務所"
            onChange={e => {
              setSiteFilter(e.target.value)
              // 當下拉選單變更時，重設卡片篩選條件
              setEnsureTypeFilter(undefined)
            }}
            sx={{
              minWidth: 120,
              width: 'auto',
              '& .MuiSelect-select': {
                whiteSpace: 'nowrap',
                overflow: 'visible',
              },
            }}
          >
            <MenuItem value="">
              <em>全部</em>
            </MenuItem>
            {uniqueSites.map(site => (
              <MenuItem key={site} value={site}>
                {site}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* 保固狀態按鈕群組 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
            保固狀態：
          </Typography>
          <ToggleButtonGroup
            value={warrantyStatusFilter}
            exclusive
            onChange={(e, newValue) => {
              if (newValue !== null) {
                setWarrantyStatusFilter(newValue)
                // 當點擊保固狀態按鈕時，解除卡片點擊狀態
                setEnsureTypeFilter(undefined)
              }
            }}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                px: 2,
              },
            }}
          >
            <ToggleButton value="all">全部資料</ToggleButton>
            <ToggleButton value="notReleased">未解除</ToggleButton>
            <ToggleButton value="released">已解除</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {/* ORD_CH 按鈕區域 */}
        {/* {filteredDescData.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filteredDescData.map((item, index) => (
              <Tooltip
                key={index}
                title={
                  item.WARRANTY_PERIOD ? `保固期間: ${item.WARRANTY_PERIOD}` : '無保固期間資訊'
                }
                arrow
              >
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    minWidth: 'auto',
                    fontSize: '0.75rem',
                  }}
                >
                  {item.ORD_CH || '無名稱'}
                </Button>
              </Tooltip>
            ))}
          </Box>
        )} */}
      </Box>
      {/* 表格 */}
      <DataGrid
        rows={filteredData || []}
        columns={columns}
        getRowClassName={params => {
          return params.row.IS_EXPIRED === 'Y' ? 'expired-row' : ''
        }}
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f5f5f5',
          },
          '& .expired-row': {
            backgroundColor: red[100],
          },
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              // 預設隱藏的欄位
              ENSURE_ID: false,
              MNG: false,
              MNG_CNAME: false,
              ENSURE_KND: false,
              CLOSE_AMOUNT: false,
              EST_ENSURE_AMOUNT: false,
              ENSURE_START_DATE: false,
              STOP_ENSURE_DATE: true,
              PROJECT_ID: false,
              ORD_NO: false,
              DIV: false,
              SITE_CNAME: false,
              IS_EXPIRED: false,
              // 項次欄位預設顯示
              rowNumber: true,
            },
          },
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        density="compact"
        // showToolbar
        pageSizeOptions={[100]}
        getRowId={row => {
          if (row && row.ENSURE_ID != null && row.ENSURE_ID !== '') return row.ENSURE_ID
          const a = row && row.PROJECT_ID != null ? String(row.PROJECT_ID) : ''
          const b = row && row.ITEM_NO != null ? String(row.ITEM_NO) : ''
          const c = row && row.ORD_NO != null ? String(row.ORD_NO) : ''
          const d = row && row.ENSURE_KND != null ? String(row.ENSURE_KND) : ''
          const composite = `${a}-${b}-${c}-${d}`
          if (composite && composite !== '---') return composite
          try {
            return JSON.stringify(row)
          } catch (error) {
            // 使用穩定的 ID 生成，避免 hydration 錯誤
            const fallbackId = `row-${a}-${b}-${c}-${d}`
            return fallbackId || 'fallback-row'
          }
        }}
      />
    </Stack>
  )
}
