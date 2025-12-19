import React, { useEffect, useMemo, useState } from 'react'

export default function Snowfall() {
  const [flakes, setFlakes] = useState([])

  useEffect(() => {
    const count = 30
    const arr = Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100
      const size = 4 + Math.random() * 6
      const delay = Math.random() * 5
      const duration = 8 + Math.random() * 10
      return { id: i, left, size, delay, duration }
    })
    setFlakes(arr)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {flakes.map(f => (
        <div
          key={f.id}
          className="snowflake"
          style={{
            left: `${f.left}vw`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            opacity: 0.9
          }}
        />
      ))}
    </div>
  )
}
