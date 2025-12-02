'use client';
import { useState, useEffect } from 'react'

export function useTokenValidation(token) {
    const [isValid, setIsValid] = useState(null) // null = 未驗證, true = 有效, false = 無效
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [debugInfo, setDebugInfo] = useState(null)

    useEffect(() => {
        if (!token) {
            setIsValid(false)
            setError(null) // 不設置錯誤，由上層組件處理
            setDebugInfo(null)
            return
            }

        const validateToken = async () => {
            setLoading(true)
            setError(null)
            setDebugInfo(null)

            try {
                const response = await fetch(`/api/token-validation?token=${encodeURIComponent(token)}`)
                const result = await response.json()

                // 設置 debugInfo
                setDebugInfo(result.debugInfo || null)

                if (!response.ok) {
                    throw new Error(result.error || 'Token 驗證失敗')
                }

                if (result.isValid) {
                    setIsValid(true)
                } else {
                    setIsValid(false)
                    setError(result.error || 'Token 無效或已過期')
                }
            } catch (err) {
                setIsValid(false)
                setError(`Token 驗證失敗: ${err.message}`)
            } finally {
                setLoading(false)
            }
        }

        validateToken()
    }, [token])

    return {
        isValid,
        loading,
        error,
        debugInfo,
    }



}
