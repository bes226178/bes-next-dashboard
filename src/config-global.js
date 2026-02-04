export const CONFIG = {
  API_HOST: process.env.NEXT_PUBLIC_API_HOST,
  MSSQL_USER: process.env.MSSQL_USER,
  MSSQL_PASSWORD: process.env.MSSQL_PASSWORD,
  MSSQL_DATABASE: process.env.MSSQL_DATABASE,
  MSSQL_SERVER: process.env.MSSQL_SERVER,
  MSSQL_PORT: Number(process.env.MSSQL_PORT),
  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
}

export const COLOR = {
  CHANGE: '#FFF7D1',
  HEADER: '#2C3E50',
  HEADER1: '#3498DB',
  HEADER2: '#18BC9C',
  BGCOLOR: '#EEEEEE',
  WARN_COLOR1: '#F93827', //原本顏色#AD2D37
  WARN_COLOR2: '#FB6F92',
  ALERTCOLOR: '#00796b',
  ALERTRED: '#F93827',
  NAVBTNHIGHLIGHT: '#3498DB',
}

export const SIZE = {
  TITLE: 'h6',
  TEXT: 'h6',
}

export const BORDER_STYLE = '1px solid #E0E0E0'
export const BORDER_RADIUS = 2
export const OFFSET = '-40px'
export const ICCC_URL = 'http://spf.bes.com.tw:8080/webroot/decision#?activeTab=dec-tabs-homepage'
