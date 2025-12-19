import React, { useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import PoemGenerator from './components/PoemGenerator'
import PoemList from './components/PoemList'
import { loadSaved, saveSaved } from './utils/storage'
import Snowfall from './components/Snowfall'

export default function App() {
  const [saved, setSaved] = useState(() => loadSaved())
  const [showSnow, setShowSnow] = useState(true)
  const newestRef = useRef(null)

  useEffect(() => saveSaved(saved), [saved])

  function handleSave(poem) {
    setSaved(prev => [poem, ...prev])
    // scroll to top/newest later via ref in PoemList
  }

  function handleToggleSnow() {
    setShowSnow(s => !s)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Header onToggleSnow={handleToggleSnow} showSnow={showSnow} />
      <main className="max-w-5xl mx-auto">
        <PoemGenerator onSave={handleSave} />
        <PoemList refForNewest={newestRef} saved={saved} setSaved={setSaved} />
      </main>
      {showSnow && <Snowfall />}
    </div>
  )
}
