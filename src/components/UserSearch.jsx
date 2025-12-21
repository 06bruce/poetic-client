import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { userAPI } from '../utils/api'

export default function UserSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await userAPI.searchUsers(query)
      setResults(res.data)
    } catch (err) {
      setError('No users found')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex gap-2 items-center">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search users by username..."
          className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none w-full max-w-xs"
        />
        <button type="submit" className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white">
          <FiSearch />
        </button>
      </form>
      {loading && <div className="mt-2 text-sm text-gray-400">Searching...</div>}
      {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
      {results.length > 0 && (
        <div className="mt-3 bg-gray-800 rounded-lg p-2 divide-y divide-gray-700">
          {results.map(user => (
            <div
              key={user._id}
              className="py-2 px-1 cursor-pointer hover:bg-gray-700 rounded transition flex items-center gap-2"
              onClick={() => navigate(`/profile/${user.username}`)}
            >
              <span className="font-semibold text-indigo-300">@{user.username}</span>
              <span className="text-xs text-gray-400">joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
