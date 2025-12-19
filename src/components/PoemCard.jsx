import React, { useMemo } from 'react'
import clsx from 'clsx'

function hashStringToNum(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function randomDimColor(seed) {
  const n = typeof seed === 'number' ? seed : hashStringToNum(String(seed))
  const h = Math.floor((n * 137.5) % 360)
  const s = 22 + Math.floor(((n * 53) % 28))
  const l = 8 + Math.floor(((n * 97) % 14))
  return `hsl(${h} ${s}% ${l}%)`
}

export default function PoemCard({ poem, extraActions }) {
  const bg = useMemo(() => ({ background: `linear-gradient(135deg, ${randomDimColor(poem.id)}, rgba(255,255,255,0.02))` }), [poem.id])

  return (
    <article
      id={`poem-card-${poem.id}`}
      className={clsx('p-6 rounded-2xl glass mb-4 transition-transform transform hover:-translate-y-1 hover:scale-[1.01]')}
      style={{ ...bg }}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-medium text-lg">{poem.title}</h3>
          <div className="text-xs text-gray-400 mt-1">{poem.source} • {poem.mood} • {poem.theme}</div>
        </div>
      </div>

      <pre className="whitespace-pre-wrap text-lg mt-4 leading-relaxed font-serif">{poem.lines.join('\n')}</pre>

      {extraActions}
    </article>
  )
}
