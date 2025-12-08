import { tables } from '@/lib/tables'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token 參數不存在' }, { status: 400 })
    }

    // 先查詢 token 是否存在（不考慮過期時間）
    const tokenExistsQuery = `
      SELECT TOKEN, EXPIRES_AT, DATEADD(HOUR, 8, GETUTCDATE()) as CURRENT_TIME_UTC8
      FROM SYS_ACCESS_TOKEN
      WHERE TOKEN = @token
    `
    const tokenExistsResult = await tables.sysAccessToken.stageDb.query(tokenExistsQuery, { token })

    // 檢查 token 是否存在
    if (!tokenExistsResult || tokenExistsResult.length === 0) {
      // Token 不存在，導向到 token 失效頁面
      return NextResponse.redirect(new URL('/token-expired', request.url))
    }

    // 檢查 token 是否已過期
    const expiresAt = tokenExistsResult[0].EXPIRES_AT
    const currentTime = tokenExistsResult[0].CURRENT_TIME_UTC8

    if (new Date(currentTime) >= new Date(expiresAt)) {
      // Token 已過期，導向到 token 失效頁面
      return NextResponse.redirect(new URL('/token-expired', request.url))
    }

    // 再執行原本的驗證查詢
    const result = await tables.sysAccessToken.validateToken(token)

    if (result && result.length > 0) {
      return NextResponse.json({
        isValid: true,
        message: 'Token 驗證成功',
        debugInfo: {
          token: token,
          expiresAt: expiresAt,
          currentTime: currentTime,
        },
      })
    } else {
      // Token 驗證失敗，提供詳細資訊
      const debugInfo = {
        token: token,
        tokenExists: tokenExistsResult && tokenExistsResult.length > 0,
        expiresAt: expiresAt || 'Token 不存在',
        currentTime: currentTime || '無法取得時間',
        isExpired: expiresAt ? new Date(currentTime) >= new Date(expiresAt) : '無法判斷',
      }

      return NextResponse.json(
        {
          isValid: false,
          error: 'Token 無效或已過期',
          debugInfo: debugInfo,
        },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Token 驗證失敗:', error)
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    return NextResponse.json(
      {
        isValid: false,
        error: `Token 驗證失敗: ${error.message}`,
        debugInfo: {
          token: token,
          errorDetails: error.message,
        },
      },
      { status: 500 }
    )
  }
}
