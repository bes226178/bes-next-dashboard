import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, ExternalLink, Calendar, Building2, FileText, DollarSign } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

// 取得標案公告資料
async function getTenderAnnouncement(id) {
  const { data, error } = await supabase
    .from('gcc_tender_announcement')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('取得標案公告失敗:', error)
    return null
  }

  return data
}

// 取得標案詳細資料
async function getTenderDetail(announcementId) {
  const { data, error } = await supabase
    .from('gcc_tender_detail')
    .select(
      `
      *,
      gcc_committee_list_info (
        procurement_level,
        org_name,
        tender_name,
        is_public_committee
      )
    `
    )
    .eq('announcement_id', announcementId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('取得標案詳細資料失敗:', error)
    return null
  }

  return data
}

// 取得欄位對應表
async function getFieldMapping() {
  const { data, error } = await supabase
    .from('gcc_tender_detail_field_mapping')
    .select('*')
    .order('category', { ascending: true })
    .order('field_code', { ascending: true })

  if (error) {
    console.error('取得欄位對應表失敗:', error)
    return []
  }

  return data
}

// 取得評審委員
async function getEvaluationCommittee(detailId) {
  if (!detailId) return []

  const { data, error } = await supabase
    .from('gcc_evaluation_committee')
    .select('*')
    .eq('tender_detail_id', detailId)
    .order('seq_no', { ascending: true })

  if (error) {
    console.error('取得評審委員失敗:', error)
    return []
  }

  return data
}

// 類別名稱對應
const CATEGORY_NAMES = {
  A: '機關資料',
  B: '採購資料',
  C: '招標資料',
  D: '領投開標資料',
  E: '其他資料',
}

// 採購級距 Badge
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

// 詳細資料區塊
function DetailSection({ title, fields, detail, fieldMapping }) {
  const categoryFields = fieldMapping.filter(f => f.category === title)

  if (categoryFields.length === 0) return null

  const validFields = categoryFields.filter(f => {
    const value = detail?.[f.field_code]
    return value !== null && value !== undefined && value !== ''
  })

  if (validFields.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p>此類別無資料</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {validFields.map(field => (
        <div
          key={field.field_code}
          className="grid grid-cols-1 gap-2 border-b border-slate-100 py-2 last:border-0 sm:grid-cols-3"
        >
          <dt className="text-sm font-medium text-slate-600">{field.field_name}</dt>
          <dd className="break-words text-sm text-slate-900 sm:col-span-2">
            {field.field_code === 'c2_1' && detail[field.field_code] ? (
              <a
                href={detail[field.field_code]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                查看連結 <ExternalLink className="h-3 w-3" />
              </a>
            ) : field.field_code === 'd1_7' && detail[field.field_code] ? (
              <a
                href={detail[field.field_code]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                下載投標須知 <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              detail[field.field_code]
            )}
          </dd>
        </div>
      ))}
    </div>
  )
}

// 評審委員表格
function CommitteeTable({ committee }) {
  if (!committee || committee.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p>尚無評審委員資料</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50">
            <th className="px-3 py-2 text-left font-medium text-slate-600">序號</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">姓名</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">職業</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">服務機關</th>
            <th className="px-3 py-2 text-left font-medium text-slate-600">職稱</th>
          </tr>
        </thead>
        <tbody>
          {committee.map((member, index) => (
            <tr key={member.id} className="border-b last:border-0 hover:bg-slate-50">
              <td className="px-3 py-2">{member.seq_no || index + 1}</td>
              <td className="px-3 py-2 font-medium">{member.member_name || '-'}</td>
              <td className="px-3 py-2">{member.occupation || '-'}</td>
              <td className="px-3 py-2">{member.organization || '-'}</td>
              <td className="px-3 py-2">{member.job_title || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default async function TenderDetailPage({ params }) {
  const { id } = await params

  const [announcement, fieldMapping] = await Promise.all([
    getTenderAnnouncement(id),
    getFieldMapping(),
  ])

  if (!announcement) {
    notFound()
  }

  const detail = await getTenderDetail(id)
  const committee = detail?.id ? await getEvaluationCommittee(detail.id) : []
  const procurementLevel = detail?.gcc_committee_list_info?.[0]?.procurement_level

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto space-y-6 px-4 py-6">
        {/* 返回按鈕 */}
        <div>
          <Button variant="ghost" asChild className="cursor-pointer">
            <Link href="/gcc-tender" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回列表
            </Link>
          </Button>
        </div>

        {/* 標案摘要卡片 */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl leading-relaxed">
                  {announcement.tender_name}
                </CardTitle>
                {announcement.tender_no && (
                  <CardDescription>案號：{announcement.tender_no}</CardDescription>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getProcurementLevelBadge(procurementLevel)}
                {announcement.detail_url && (
                  <Button variant="outline" size="sm" asChild className="cursor-pointer">
                    <a href={announcement.detail_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-4 w-4" />
                      政府採購網
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* 機關名稱 */}
              <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                <Building2 className="mt-0.5 h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">機關名稱</p>
                  <p className="text-sm font-medium text-slate-900">
                    {announcement.org_name || '-'}
                  </p>
                </div>
              </div>

              {/* 公告日期 */}
              <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                <Calendar className="mt-0.5 h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">公告日期</p>
                  <p className="text-sm font-medium text-slate-900">
                    {announcement.announcement_date || '-'}
                  </p>
                </div>
              </div>

              {/* 截止日期 */}
              <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                <FileText className="mt-0.5 h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">截止投標</p>
                  <p className="text-sm font-medium text-slate-900">
                    {announcement.deadline || '-'}
                  </p>
                </div>
              </div>

              {/* 預算金額 */}
              <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                <DollarSign className="mt-0.5 h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">預算金額</p>
                  <p className="text-sm font-medium text-slate-900">
                    {announcement.budget ? `NT$ ${announcement.budget}` : '-'}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-slate-500">招標方式</p>
                <p className="font-medium">{announcement.tender_method || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500">採購性質</p>
                <p className="font-medium">{announcement.procurement_nature || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500">傳輸次數</p>
                <p className="font-medium">{announcement.transmission_count || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500">是否更正</p>
                <p className="font-medium">{announcement.is_correction ? '是' : '否'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 詳細資料標籤頁 */}
        {detail && (
          <Card>
            <CardHeader>
              <CardTitle>詳細資料</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="A" className="w-full">
                <TabsList className="mb-4 grid w-full grid-cols-3 sm:grid-cols-6">
                  {Object.entries(CATEGORY_NAMES).map(([key, name]) => (
                    <TabsTrigger key={key} value={key} className="cursor-pointer">
                      {name}
                    </TabsTrigger>
                  ))}
                  <TabsTrigger value="committee" className="cursor-pointer">
                    評審委員
                  </TabsTrigger>
                </TabsList>

                {Object.keys(CATEGORY_NAMES).map(category => (
                  <TabsContent key={category} value={category}>
                    <DetailSection
                      title={category}
                      fields={fieldMapping}
                      detail={detail}
                      fieldMapping={fieldMapping}
                    />
                  </TabsContent>
                ))}

                <TabsContent value="committee">
                  <CommitteeTable committee={committee} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* 沒有詳細資料時的提示 */}
        {!detail && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <h3 className="mb-2 text-lg font-medium text-slate-900">尚無詳細資料</h3>
              <p className="text-sm text-slate-500">此標案的詳細資料尚未被爬取</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const announcement = await getTenderAnnouncement(id)

  if (!announcement) {
    return {
      title: '標案不存在',
    }
  }

  return {
    title: `${announcement.tender_name} - 政府採購標案`,
    description: `${announcement.org_name} - ${announcement.tender_name}`,
  }
}
