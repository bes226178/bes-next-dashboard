'use client'

import LunchPicker from './components/LunchPicker'

export default function LunchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            🍱 午餐選擇小工具
          </h1>
          <p className="text-gray-600 text-lg">
            讓我幫你決定今天吃什麼！
          </p>
        </div>
        <LunchPicker />
      </div>
    </div>
  )
}
