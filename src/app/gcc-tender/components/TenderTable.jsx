'use client'

import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, FileText } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'

// 格式化金額
function formatBudget(budget) {
  if (!budget) return '-'
  const num = parseFloat(String(budget).replace(/,/g, ''))
  if (isNaN(num)) return budget

  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(2)} 億`
  }
  if (num >= 10000) {
    return `${(num / 10000).toFixed(0)} 萬`
  }
  return num.toLocaleString()
}

// 採購級距 Badge 顏色
function getProcurementLevelBadge(level) {
  if (!level) {
    return (
      <Badge variant="outline" className="text-slate-400">
        未分類
      </Badge>
    )
  }
  if (level === '巨額') {
    return <Badge className="bg-amber-500 text-white hover:bg-amber-600">巨額</Badge>
  }
  if (level.includes('查核金額')) {
    return <Badge className="bg-blue-500 text-white hover:bg-blue-600">查核金額以上</Badge>
  }
  return <Badge variant="secondary">{level}</Badge>
}

// 排序圖示
function SortIcon({ column, sortConfig }) {
  if (sortConfig.key !== column) {
    return <ArrowUpDown className="ml-1 h-4 w-4 text-slate-300" />
  }
  return sortConfig.direction === 'asc' ? (
    <ArrowUp className="ml-1 h-4 w-4 text-blue-600" />
  ) : (
    <ArrowDown className="ml-1 h-4 w-4 text-blue-600" />
  )
}

// 表頭元件
function SortableHeader({ column, label, sortConfig, onSort, className }) {
  return (
    <TableHead className={className}>
      <button
        onClick={() => onSort(column)}
        className="flex cursor-pointer items-center transition-colors hover:text-blue-600"
      >
        {label}
        <SortIcon column={column} sortConfig={sortConfig} />
      </button>
    </TableHead>
  )
}

// 分頁元件
function TablePagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // 計算要顯示的頁碼
  const getPageNumbers = () => {
    const pages = []
    const showPages = 5
    let start = Math.max(1, currentPage - Math.floor(showPages / 2))
    let end = Math.min(totalPages, start + showPages - 1)

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1)
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('ellipsis-start')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('ellipsis-end')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={cn('cursor-pointer', currentPage === 1 && 'pointer-events-none opacity-50')}
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={cn(
              'cursor-pointer',
              currentPage === totalPages && 'pointer-events-none opacity-50'
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function TenderTable({
  data = [],
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  sortConfig,
  onSort,
}) {
  const router = useRouter()

  // 點擊標案列導向詳細頁
  const handleRowClick = item => {
    router.push(`/gcc-tender/${item.id}`)
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
        <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
        <h3 className="mb-2 text-lg font-medium text-slate-900">沒有找到符合的標案</h3>
        <p className="text-sm text-slate-500">請嘗試調整篩選條件</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      {/* 表格資訊列 */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <span className="text-sm text-slate-600">
          共 <span className="font-medium text-slate-900">{totalCount}</span> 筆標案
        </span>
        <span className="text-sm text-slate-500">
          第 {currentPage} / {totalPages} 頁
        </span>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <SortableHeader
                  column="tender_name"
                  label="標案名稱"
                  sortConfig={sortConfig}
                  onSort={onSort}
                  className="min-w-[300px]"
                />
                <SortableHeader
                  column="org_name"
                  label="機關名稱"
                  sortConfig={sortConfig}
                  onSort={onSort}
                  className="min-w-[180px]"
                />
                <SortableHeader
                  column="announcement_date"
                  label="公告日期"
                  sortConfig={sortConfig}
                  onSort={onSort}
                  className="min-w-[110px]"
                />
                <TableHead className="min-w-[100px]">截止日期</TableHead>
                <SortableHeader
                  column="budget"
                  label="預算金額"
                  sortConfig={sortConfig}
                  onSort={onSort}
                  className="min-w-[120px] text-right"
                />
                <TableHead className="min-w-[100px]">採購級距</TableHead>
                <TableHead className="min-w-[100px]">招標方式</TableHead>
                <TableHead className="w-[80px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(item => (
                <TableRow
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className="cursor-pointer transition-colors hover:bg-blue-50/50"
                >
                  <TableCell className="font-medium">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="line-clamp-2">{item.tender_name || '-'}</span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-md">
                        <p>{item.tender_name}</p>
                        {item.tender_no && (
                          <p className="mt-1 text-xs text-slate-400">案號：{item.tender_no}</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{item.org_name || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm tabular-nums">
                      {item.announcement_date
                        ? format(new Date(item.announcement_date), 'yyyy/MM/dd')
                        : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{item.deadline || '-'}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm font-medium tabular-nums">
                          {formatBudget(item.budget)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.budget ? `NT$ ${item.budget}` : '未提供'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{getProcurementLevelBadge(item.procurement_level)}</TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{item.tender_method || '-'}</span>
                  </TableCell>
                  <TableCell>
                    {item.detail_url && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={e => {
                              e.stopPropagation()
                              window.open(item.detail_url, '_blank')
                            }}
                            className="h-8 w-8 cursor-pointer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>開啟政府採購網</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>

      {/* 分頁 */}
      <div className="border-t border-slate-100 px-4 py-3">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}
