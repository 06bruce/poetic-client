import React, { useEffect, useRef, useState } from 'react'
import PoemCard from './PoemCard'
import { FiTrash2, FiShare2, FiLoader, FiAlertCircle } from 'react-icons/fi'
import { poemAPI } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import { toast } from '../contexts/ToastContext'
import html2canvas from 'html2canvas'

const PoemList = React.forwardRef(({ refreshTrigger }, ref) => {
  const { user } = useAuth()
  const [poems, setPoems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sharingId, setSharingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', content: '' })
  const [feedType, setFeedType] = useState('explore') // 'explore' or 'following'
  const listRef = useRef(null)

  // Fetch poems on mount and when user changes or refreshTrigger/feedType changes
  useEffect(() => {
    fetchPoems()
  }, [user, refreshTrigger, feedType])

  const fetchPoems = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = feedType === 'following' && user
        ? await poemAPI.getFollowingFeed()
        : await poemAPI.getAll()
      setPoems(response.data)
    } catch (err) {
      setError('Failed to load poems')
      console.error('Fetch poems error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (poemId) => {
    try {
      const response = await poemAPI.like(poemId)
      setPoems(poems.map(p => p._id === poemId ? response.data : p))
      toast.success('Liked!')
    } catch (err) {
      console.error('Like error:', err)
      const errorMsg = err.response?.data?.error
      if (errorMsg) {
        toast.error(errorMsg)
      }
    }
  }

  const handleUnlike = async (poemId) => {
    try {
      const response = await poemAPI.unlike(poemId)
      setPoems(poems.map(p => p._id === poemId ? response.data : p))
      toast.success('Unliked')
    } catch (err) {
      console.error('Unlike error:', err)
      toast.error('Failed to unlike')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this poem?')) return

    try {
      await poemAPI.delete(id)
      setPoems(poems.filter(p => p._id !== id))
      toast.success('Poem deleted')
    } catch (err) {
      setError('Failed to delete poem')
      toast.error('Failed to delete poem')
      console.error('Delete error:', err)
    }
  }

  const handleEditStart = (poem) => {
    setEditingId(poem._id)
    setEditForm({ title: poem.title, content: poem.content })
  }

  const handleEditSave = async (id) => {
    try {
      await poemAPI.update(id, editForm.title, editForm.content)
      setPoems(poems.map(p =>
        p._id === id ? { ...p, ...editForm } : p
      ))
      setEditingId(null)
      setEditForm({ title: '', content: '' })
      toast.success('Poem updated!')
    } catch (err) {
      setError('Failed to update poem')
      toast.error('Failed to update poem')
      console.error('Update error:', err)
    }
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditForm({ title: '', content: '' })
  }

  async function handleShare(poem) {
    const cardElement = document.getElementById(`poem-card-${poem._id}`)
    if (!cardElement) return

    setSharingId(poem._id)
    try {
      const canvas = await html2canvas(cardElement, {
        scale: 3,
        backgroundColor: '#111827',
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedCard = clonedDoc.getElementById(`poem-card-${poem._id}`)
          if (clonedCard) {
            clonedCard.style.backdropFilter = 'none'
            clonedCard.style.webkitBackdropFilter = 'none'
            clonedCard.style.backgroundColor = 'rgba(17, 24, 39, 0.8)'
            clonedCard.style.border = '1px solid rgba(255, 255, 255, 0.1)'
          }
        }
      })

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setSharingId(null)
          return
        }

        const file = new File([blob], `poem-${poem._id}.png`, { type: 'image/png' })
        const canShare = navigator.canShare && navigator.canShare({ files: [file] })

        if (canShare) {
          try {
            await navigator.share({
              files: [file],
              title: 'My AI Poem',
              text: 'Check out this poem from Poem Studio!',
            })
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error('Error sharing:', error)
              downloadBlob(blob, poem._id)
            }
          }
        } else {
          downloadBlob(blob, poem._id)
          alert('Share menu not supported. Poem image downloaded!')
        }
        setSharingId(null)
      }, 'image/png')
    } catch (err) {
      console.error('Failed to capture poem card:', err)
      setSharingId(null)
    }
  }

  function downloadBlob(blob, id) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `poem-${id}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading && poems.length === 0) {
    return (
      <section className="mt-8">
        <div className="p-8 rounded-2xl glass text-center flex items-center justify-center gap-2">
          <FiLoader className="animate-spin" />
          <p>Loading poems...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mt-8">
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-500/50 flex items-center gap-2 text-red-200">
          <FiAlertCircle size={18} />
          {error}
          <button onClick={fetchPoems} className="ml-auto px-3 py-1 rounded bg-red-600 hover:bg-red-700">
            Retry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-6 px-1 xs:px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl xs:text-2xl font-bold">Poem Collection</h2>
        <div className="flex bg-gray-800/50 p-1 rounded-lg border border-gray-700">
          <button
            onClick={() => setFeedType('explore')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${feedType === 'explore' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Explore
          </button>
          <button
            onClick={() => {
              if (!user) {
                toast.error('Sign in to follow poets')
                return
              }
              setFeedType('following')
            }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${feedType === 'following' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
          >
            Following
          </button>
        </div>
      </div>

      {loading && poems.length === 0 ? (
        <div className="p-12 rounded-2xl glass text-center flex flex-col items-center justify-center gap-4 border border-gray-700/50">
          <FiLoader className="animate-spin text-3xl text-indigo-500" />
          <p className="text-gray-400 animate-pulse">Curating your poetic experience...</p>
        </div>
      ) : feedType === 'following' && poems.length === 0 ? (
        <div className="p-12 rounded-2xl glass text-center flex flex-col items-center justify-center gap-4 border border-gray-700/50 bg-indigo-900/10">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-2">
            <FiUserPlus className="text-3xl text-indigo-400" />
          </div>
          <h4 className="text-xl font-bold text-white">Your Feed is Quiet</h4>
          <p className="text-gray-400 max-w-md mx-auto">
            You haven't followed any poets yet. Switch to <strong>Explore</strong> to discover amazing work and start building your circle!
          </p>
          <button
            onClick={() => setFeedType('explore')}
            className="mt-2 px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition font-semibold"
          >
            Start Exploring
          </button>
        </div>
      ) : !poems || poems.length === 0 ? (
        <div className="p-12 rounded-2xl glass text-center flex flex-col items-center justify-center gap-4 border border-gray-700/50">
          <span className="text-5xl mb-2">🐚</span>
          <h4 className="text-xl font-bold text-white">The collection is currently empty</h4>
          <p className="text-gray-400">Be the first to fill this space with your poetry!</p>
        </div>
      ) : (
        <div ref={listRef} className="space-y-4">
          {poems.map((poem) => (
            <div key={poem._id}>
              {editingId === poem._id ? (
                <div className="p-6 rounded-2xl glass mb-4 bg-gray-800/50">
                  <h3 className="font-bold mb-4">Edit Poem</h3>
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Content</label>
                      <textarea
                        value={editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                        rows="8"
                        className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSave(poem._id)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <PoemCard
                  poem={poem}
                  currentUserId={user?.id}
                  onEdit={handleEditStart}
                  onDelete={handleDelete}
                  onLike={handleLike}
                  onUnlike={handleUnlike}
                  currentUserLiked={poem.likes?.some(like => like.userId === user?.id) || false}
                  extraActions={
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleShare(poem)}
                        disabled={sharingId === poem._id}
                        className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
                        title="Share"
                      >
                        {sharingId === poem._id ? (
                          <FiLoader className="animate-spin" />
                        ) : (
                          <FiShare2 />
                        )}
                      </button>
                    </div>
                  }
                />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
});

PoemList.displayName = 'PoemList';
export default PoemList;
