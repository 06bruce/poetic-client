import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FiPlay, FiSave, FiHeart, FiCopy, FiLoader, FiAlertCircle, FiEdit2 } from 'react-icons/fi'
import { generatePoem } from '../data/poems'
import { fetchPoem, poemAPI } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import { toast } from '../contexts/ToastContext'
import PoemCard from './PoemCard'

export default function PoemGenerator({ onSave, showAuthForm, setGlobalMood }) {
  const { user } = useAuth()
  const [mode, setMode] = useState('generate') // 'generate' or 'create'
  const [category, setCategory] = useState('underrated')
  const [current, setCurrent] = useState(null)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '', theme: 'general', mood: 'neutral' })
  const mountedRef = useRef(false)

  const getPoem = useCallback(async (cat) => {
    setLoading(true)
    setError(null)
    try {
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
  }, [])

  const handleGenerate = useCallback(() => {
    setLiked(false)
    getPoem(category)
  }, [category, getPoem])

  // Sync mood with global app
  useEffect(() => {
    const activeMood = mode === 'create' ? formData.mood : current?.mood;
    if (activeMood && typeof setGlobalMood === 'function') {
      setGlobalMood(activeMood)
    }
  }, [mode, formData.mood, current?.mood, setGlobalMood])

  const handleSave = useCallback(async () => {
    if (!user) {
      showAuthForm()
      return
    }

    if (mode === 'create') {
      if (!formData.title.trim() || !formData.content.trim()) {
        toast.error('Title and content are required')
        return
      }
    } else if (!current) {
      toast.error('Generate a poem first')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const poemData = mode === 'create' ? formData : {
        title: current.title,
        content: Array.isArray(current.lines)
          ? current.lines.join('\n')
          : current.content || '',
        theme: current.theme || 'general',
        mood: current.mood || 'neutral',
        source: current.source || 'external'
      }

      const result = await poemAPI.create(
        poemData.title,
        poemData.content,
        poemData.theme,
        poemData.mood,
        poemData.source || 'user'
      )

      onSave(result.data || poemData)

      if (mode === 'create') {
        setFormData({ title: '', content: '', theme: 'general', mood: 'neutral' })
      } else {
        setCurrent(null)
        setLiked(false)
      }

      toast.success('Poem saved successfully!')
      setError(null)
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to save poem'
      setError(errorMsg)
      toast.error(errorMsg)
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }, [current, user, mode, formData, onSave, showAuthForm])

  const handleLike = useCallback(() => {
    setLiked(l => !l)
  }, [])

  const handleCancel = useCallback(() => {
    setFormData({ title: '', content: '', theme: 'general', mood: 'neutral' })
    setError(null)
    setMode('generate')
  }, [])

  return (
    <section className="mb-8 px-1 xs:px-2 sm:px-0">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (mode === 'generate') handleGenerate();
              else setMode('generate');
              setError(null);
            }}
            disabled={loading && mode === 'generate'}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${mode === 'generate' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {loading ? <FiLoader className="animate-spin" /> : <FiPlay size={16} />}
            {mode === 'generate' ? 'Generate New' : 'Generate'}
          </button>
          <button
            onClick={() => { setMode('create'); setError(null); }}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${mode === 'create' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <FiEdit2 size={16} />
            Create
          </button>
        </div>

      </div>

      {!user && (
        <div className="mb-4 p-3 rounded-lg bg-blue-900/30 border border-blue-500/50 flex items-center gap-2 text-blue-200">
          <FiAlertCircle size={18} />
          Sign in to save your poems
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/50 flex items-center gap-2 text-red-200">
          <FiAlertCircle size={18} />
          {error}
        </div>
      )}

      {mode === 'generate' ? (
        <>
          <div className="flex gap-2 mb-4 justify-center">
            <button
              onClick={() => { setCategory('famous'); handleGenerate(); }}
              className={`px-4 py-1.5 rounded-full border transition-all text-xs font-semibold ${category === 'famous' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'}`}
            >
              Famous
            </button>
            <button
              onClick={() => { setCategory('underrated'); handleGenerate(); }}
              className={`px-4 py-1.5 rounded-full border transition-all text-xs font-semibold ${category === 'underrated' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'}`}
            >
              Underrated
            </button>
          </div>

          {current ? (
            <PoemCard
              poem={current}
              isNew={true}
              extraActions={
                <div className="flex gap-2 mt-3">
                  <button onClick={handleLike} className={`p-2 rounded-md transition ${liked ? 'bg-pink-600' : 'bg-gray-800 hover:bg-gray-700'}`} title="Like">
                    <FiHeart />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        Array.isArray(current.lines) ? current.lines.join('\n') : current.content
                      )
                      toast.success('Copied!')
                    }}
                    className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition"
                    title="Copy"
                  >
                    <FiCopy />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !user}
                    className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              }
            />
          ) : (
            <div className="p-6 rounded-xl glass text-center text-gray-300">
              No poem yet — click "Generate Poem" to get started.
            </div>
          )}
        </>
      ) : (
        <div className="p-6 rounded-xl glass">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Poem Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter poem title"
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your poem here..."
              rows="8"
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
              <select
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
              >
                <option value="general">General</option>
                <option value="love">Love</option>
                <option value="nature">Nature</option>
                <option value="life">Life</option>
                <option value="loss">Loss</option>
                <option value="hope">Hope</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none"
              >
                <option value="neutral">Neutral</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
                <option value="contemplative">Contemplative</option>
                <option value="romantic">Romantic</option>
              </select>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-sm text-gray-300">
            {formData.title && formData.content && (
              <div className="text-green-400">✓ Ready to save</div>
            )}
            {(!formData.title || !formData.content) && (
              <div className="text-yellow-400">Please fill in title and content</div>
            )}
          </div>

          <div className="mt-4 flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.title.trim() || !formData.content.trim() || saving || !user}
              className={`px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2 transition ${(!formData.title.trim() || !formData.content.trim() || saving) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
