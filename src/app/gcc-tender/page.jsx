import { supabase } from '@/lib/supabase'
import TenderListClient from './components/TenderListClient'

// 取得標案公告資料（含採購級距）
async function getTenderData() {
  const { data, error } = await supabase
    .from('gcc_tender_announcement')
    .select(`
      *,
      gcc_tender_detail!left (
        id,
        gcc_committee_list_info!left (
          procurement_level
        )
      )
    `)
    .order('announcement_date', { ascending: false })

  if (error) {
    console.error('取得標案資料失敗:', error)
    return []
  }

  // 扁平化資料結構，將 procurement_level 提取到主層級
  return data.map(item => ({
    ...item,
    procurement_level: item.gcc_tender_detail?.[0]?.gcc_committee_list_info?.[0]?.procurement_level || null,
    detail_id: item.gcc_tender_detail?.[0]?.id || null,
  }))
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

export default async function GccTenderPage() {
  const [tenderData, fieldMapping] = await Promise.all([
    getTenderData(),
    getFieldMapping(),
  ])

  return (
    <div className="min-h-screen bg-slate-50">
      <TenderListClient 
        initialData={tenderData} 
        fieldMapping={fieldMapping}
      />
    </div>
  )
}

export const metadata = {
  title: '政府採購標案查詢',
  description: '政府電子採購網標案資料檢視系統',
}
