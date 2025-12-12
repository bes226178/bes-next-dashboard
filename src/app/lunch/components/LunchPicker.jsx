'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Shuffle } from 'lucide-react'

const DEFAULT_RESTAURANTS = [
  { id: 1, name: '滷肉飯', emoji: '🍚' },
  { id: 2, name: '牛肉麵', emoji: '🍜' },
  { id: 3, name: '便當', emoji: '🍱' },
  { id: 4, name: '水餃', emoji: '🥟' },
  { id: 5, name: '炒飯', emoji: '🍛' },
  { id: 6, name: '義大利麵', emoji: '🍝' },
  { id: 7, name: '拉麵', emoji: '🍜' },
  { id: 8, name: '漢堡', emoji: '🍔' },
  { id: 9, name: '披薩', emoji: '🍕' },
  { id: 10, name: '壽司', emoji: '🍣' },
  { id: 11, name: '雞排', emoji: '🍗' },
  { id: 12, name: '排骨飯', emoji: '🍖' },
]

export default function LunchPicker() {
  const [restaurants, setRestaurants] = useState([])
  const [newRestaurant, setNewRestaurant] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)

  // 從 localStorage 載入餐廳列表
  useEffect(() => {
    const saved = localStorage.getItem('lunchRestaurants')
    if (saved) {
      setRestaurants(JSON.parse(saved))
    } else {
      setRestaurants(DEFAULT_RESTAURANTS)
    }
  }, [])

  // 儲存餐廳列表到 localStorage
  useEffect(() => {
    if (restaurants.length > 0) {
      localStorage.setItem('lunchRestaurants', JSON.stringify(restaurants))
    }
  }, [restaurants])

  const handleAddRestaurant = () => {
    if (newRestaurant.trim()) {
      const newId = Math.max(...restaurants.map(r => r.id), 0) + 1
      const emojis = ['🍽️', '🥘', '🍲', '🥗', '🌮', '🌯', '🥙', '🍴']
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
      
      setRestaurants([
        ...restaurants,
        { id: newId, name: newRestaurant.trim(), emoji: randomEmoji }
      ])
      setNewRestaurant('')
    }
  }

  const handleDeleteRestaurant = (id) => {
    setRestaurants(restaurants.filter(r => r.id !== id))
    if (selectedRestaurant?.id === id) {
      setSelectedRestaurant(null)
    }
  }

  const handlePickRandom = () => {
    if (restaurants.length === 0) return
    
    setIsSpinning(true)
    setSelectedRestaurant(null)

    // 快速切換效果
    let count = 0
    const maxCount = 20
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * restaurants.length)
      setSelectedRestaurant(restaurants[randomIndex])
      count++
      
      if (count >= maxCount) {
        clearInterval(interval)
        setIsSpinning(false)
      }
    }, 100)
  }

  const handleResetToDefault = () => {
    setRestaurants(DEFAULT_RESTAURANTS)
    setSelectedRestaurant(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 結果顯示卡片 */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">今天吃什麼？</CardTitle>
          <CardDescription>點擊下方按鈕隨機選擇</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 選擇結果 */}
          <div className="flex flex-col items-center justify-center min-h-[200px] bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg p-8">
            {selectedRestaurant ? (
              <div className={`text-center transition-all duration-300 ${isSpinning ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
                <div className="text-8xl mb-4 animate-bounce">
                  {selectedRestaurant.emoji}
                </div>
                <div className="text-4xl font-bold text-gray-800">
                  {selectedRestaurant.name}
                </div>
                {!isSpinning && (
                  <div className="mt-4 text-green-600 font-semibold text-xl">
                    就決定是你了！
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">🤔</div>
                <div className="text-xl">準備好了嗎？</div>
              </div>
            )}
          </div>

          {/* 操作按鈕 */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handlePickRandom}
              disabled={isSpinning || restaurants.length === 0}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8"
            >
              <Shuffle className="mr-2 h-5 w-5" />
              {isSpinning ? '抽選中...' : '隨機選擇'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 餐廳列表管理 */}
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>餐廳列表</span>
            <Badge variant="secondary" className="text-sm">
              共 {restaurants.length} 個選項
            </Badge>
          </CardTitle>
          <CardDescription>管理你的午餐選項</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 新增餐廳 */}
          <div className="flex gap-2">
            <Input
              placeholder="輸入餐廳名稱..."
              value={newRestaurant}
              onChange={(e) => setNewRestaurant(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRestaurant()}
              className="flex-1"
            />
            <Button onClick={handleAddRestaurant} className="shrink-0">
              <Plus className="h-4 w-4 mr-1" />
              新增
            </Button>
          </div>

          {/* 餐廳列表 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto p-2">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="flex items-center justify-between bg-white border-2 rounded-lg p-3 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{restaurant.emoji}</span>
                  <span className="font-medium text-sm">{restaurant.name}</span>
                </div>
                <button
                  onClick={() => handleDeleteRestaurant(restaurant.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                  title="刪除"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {restaurants.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="mb-4">還沒有餐廳選項，請先新增一些！</p>
            </div>
          )}

          {/* 重置按鈕 */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleResetToDefault}
              variant="outline"
              size="sm"
            >
              重置為預設列表
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
