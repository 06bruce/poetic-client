import React, { useMemo } from 'react'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { FiHeart, FiCopy } from 'react-icons/fi'
import { useMoodTheme } from '../hooks/useMoodTheme'
import Typewriter from './Typewriter'

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

function formatDate(date) {
  const d = new Date(date)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

function isEditableWindow(createdAt) {
  const now = new Date()
  const created = new Date(createdAt)
  const diffInMinutes = (now - created) / (1000 * 60)
  return diffInMinutes <= 10
}

export default function PoemCard({ poem, extraActions, onEdit, onDelete, currentUserId, isReadOnly = false, onLike, onUnlike, currentUserLiked = false, isNew = false }) {
  const navigate = useNavigate()
  const moodTheme = useMoodTheme(poem.mood)

  const bg = useMemo(() => {
    if (moodTheme.bg) {
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${moodTheme.bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }
    return { background: `linear-gradient(135deg, ${randomDimColor(poem._id || poem.id)}, rgba(255,255,255,0.02))` }
  }, [poem._id, poem.id, moodTheme.bg])

  const isAuthor = currentUserId && poem.author && (
    currentUserId === poem.author._id || currentUserId === poem.author
  )
  const canEdit = isAuthor && isEditableWindow(poem.createdAt) && !isReadOnly

  const poemContent = poem.content || (Array.isArray(poem.lines) ? poem.lines.join('\n') : '')
  const authorName = poem.authorName || poem.author?.username || 'Anonymous'
  const likeCount = poem.likes?.length || 0

  return (
    <article
      id={`poem-card-${poem._id || poem.id}`}
      className={clsx('relative p-4 xs:p-5 md:p-6 rounded-2xl glass mb-4 transition-transform transform hover:-translate-y-1 hover:scale-[1.01] overflow-hidden')}
    >
      {moodTheme.bg && (
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${moodTheme.bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.6)'
          }}
        />
      )}
      {!moodTheme.bg && <div className="absolute inset-0 -z-10" style={bg} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-3">
        <div className="w-full">
          <h3 className="font-medium text-base xs:text-lg">{poem.title}</h3>
          <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-2 gap-y-1 items-center">
            <button
              onClick={() => navigate(`/profile/${authorName}`)}
              className="text-indigo-400 hover:text-indigo-300 transition font-semibold truncate max-w-[120px] xs:max-w-[160px]"
            >
              @{authorName}
            </button>
            <span className="hidden xs:inline">•</span>
            <span className={clsx("font-semibold uppercase tracking-wider text-[10px]", moodTheme.colors.primary)}>
              {poem.mood || 'neutral'}
            </span>
            <span className="hidden xs:inline">•</span>
            <span>{poem.theme || 'general'}</span>
            {poem.createdAt && (
              <>
                <span className="hidden xs:inline">•</span>
                <span title={formatDate(poem.createdAt)}>
                  {new Date(poem.createdAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative mt-3 min-h-[100px]">
        {isNew ? (
          <div className="text-base xs:text-lg leading-relaxed font-serif break-words">
            <Typewriter
              lines={poemContent.split('\n')}
              lineDelay={300}
              charDelay={20}
            />
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-base xs:text-lg leading-relaxed font-serif break-words">
            {poemContent}
          </pre>
        )}
      </div>

      <div className="mt-4 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-0">
        <div className="flex items-center gap-3 xs:gap-4">
          {!isAuthor && (onLike || onUnlike) && (
            <button
              onClick={() => currentUserLiked ? onUnlike?.(poem._id) : onLike?.(poem._id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${currentUserLiked
                ? 'bg-pink-600/30 border border-pink-500/50 text-pink-300'
                : 'bg-gray-700/30 border border-gray-600/50 text-gray-400 hover:text-pink-300'
                }`}
            >
              <FiHeart size={16} fill={currentUserLiked ? 'currentColor' : 'none'} />
              {likeCount}
            </button>
          )}
          {isAuthor && likeCount > 0 && (
            <div className="flex items-center gap-1 px-3 py-1 text-sm text-pink-300">
              <FiHeart size={16} fill="currentColor" />
              {likeCount} like{likeCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(poemContent)
              if (typeof window !== 'undefined' && window.toast) {
                window.toast.success('Copied!')
              }
            }}
            className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition"
            title="Copy"
          >
            <FiCopy />
          </button>
          {extraActions}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {canEdit && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(poem)}
              className="px-3 py-1 text-sm rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(poem._id)}
              className="px-3 py-1 text-sm rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 transition"
            >
              Delete
            </button>
          </div>
        )}
        {isAuthor && !canEdit && !isReadOnly && (
          <div className="text-xs text-gray-400 italic mt-2">
            Edit window expired. Poems can only be edited within 10 minutes of creation.
          </div>
        )}
      </div>
    </article>
  )
}
