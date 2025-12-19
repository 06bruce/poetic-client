import React from 'react'
import logo from '../logo.jpg'
import { FiSun, FiMoon } from 'react-icons/fi'

export default function Header({ onToggleSnow, showSnow }) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <img src={logo} alt="Poem Studio Logo" className="w-12 h-12 rounded-xl object-cover shadow-lg border border-gray-700" />
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Poem Studio</h1>
          <p className="text-sm text-gray-400">Famous & hidden-gem poems inspired by books and life</p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <button
          aria-label="toggle snowfall"
          onClick={onToggleSnow}
          className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition"
          title="Toggle snowfall"
        >
          {showSnow ? <FiMoon /> : <FiSun />}
        </button>
      </div>
    </header>
  )
}
