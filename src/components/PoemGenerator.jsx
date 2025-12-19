import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FiPlay, FiSave, FiHeart, FiCopy, FiLoader } from 'react-icons/fi'
import poemsData, { generatePoem } from '../data/poems'
import { fetchPoem } from '../utils/api'
import PoemCard from './PoemCard'

export default function PoemGenerator({ onSave }) {
  const [category, setCategory] = useState('underrated')
  const [current, setCurrent] = useState(null)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const mountedRef = useRef(false)

  // Helper to get poem (API first, then local)
  const getPoem = useCallback(async (cat) => {
    setLoading(true)
    try {
      // "famous" -> try to get a random classic (no specific filter for now, just random)
      // "underrated" -> also random for now as API doesn't distinguish easily without complex queries
      // For now, we'll just fetch random. 
      // To make it slightly different, maybe we can search by author for "famous"?
      // Let's stick to random for both but keep the architecture open.
      const poem = await fetchPoem()
      setCurrent(poem)
    } catch (err) {
      console.warn('API failed, falling back to local', err)
      setCurrent(generatePoem(cat))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!mountedRef.current) {
      getPoem(category)
      mountedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGenerate = useCallback(() => {
    setLiked(false)
    getPoem(category)
  }, [category, getPoem])

  const handleSave = useCallback(() => {
    if (!current) return
    onSave(current)
  }, [current, onSave])

  const handleLike = useCallback(() => {
    setLiked(l => !l)
  }, [])

  return (
    <section className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setCategory('famous')}
            className={`px-3 py-1 rounded-md ${category === 'famous' ? 'bg-gray-700' : 'bg-gray-800'} transition`}
          >
            Famous
          </button>
          <button
            onClick={() => setCategory('underrated')}
            className={`px-3 py-1 rounded-md ${category === 'underrated' ? 'bg-gray-700' : 'bg-gray-800'} transition`}
          >
            Underrated
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? <FiLoader className="animate-spin" /> : <FiPlay />}
            {loading ? 'Fetching...' : 'Generate'}
          </button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 flex items-center gap-2">
            <FiSave /> Save
          </button>
        </div>
      </div>

      {current ? (
        <PoemCard
          poem={current}
          extraActions={
            <div className="flex gap-2 mt-3">
              <button onClick={handleLike} className={`p-2 rounded-md ${liked ? 'bg-pink-600' : 'bg-gray-800'}`} title="Like">
                <FiHeart />
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(current.lines.join('\n'))}
                className="p-2 rounded-md bg-gray-800"
                title="Copy"
              >
                <FiCopy />
              </button>
            </div>
          }
        />
      ) : (
        <div className="p-6 rounded-xl glass">No poem yet — generate one.</div>
      )}
    </section>
  )
}
