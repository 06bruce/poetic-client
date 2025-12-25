import React, { useState, useEffect } from 'react'
import { FiSun, FiMoon, FiLogOut, FiBell, FiUser } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { userAPI } from '../utils/api'

export default function Header({ onToggleSnow, showSnow, onAuthClick, onNotificationsClick }) {
  const { user, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000) // Poll every 30 seconds
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchUnreadCount = async () => {
    try {
      const response = await userAPI.getUnreadCount()
      setUnreadCount(response.data.unreadCount)
    } catch (err) {
      console.error('Failed to fetch unread count:', err)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0 px-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl xs:text-2xl md:text-3xl font-semibold leading-tight">Poem Studio</h1>
        <p className="text-xs xs:text-sm text-gray-400 leading-tight">Create, share, and discover poems</p>
      </div>
      <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
        {user ? (
          <>
            <div className="text-xs xs:text-sm px-3 py-1 rounded-lg bg-gray-800/50 border border-gray-700 whitespace-nowrap">
              <p className="font-medium truncate max-w-[120px] xs:max-w-[160px]">Welcome, {user.username}</p>
            </div>
            <button
              aria-label="profile"
              onClick={() => navigate(`/profile/${user.username}`)}
              className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition border border-gray-700"
              title="My Profile"
            >
              <FiUser />
            </button>
            <button
              aria-label="notifications"
              onClick={onNotificationsClick}
              className="p-2 rounded-md bg-indigo-900/30 hover:bg-indigo-900/50 transition border border-indigo-700/50 relative"
              title="Notifications"
            >
              <FiBell />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button
              aria-label="logout"
              onClick={handleLogout}
              className="p-2 rounded-md bg-red-900/30 hover:bg-red-900/50 transition border border-red-700/50"
              title="Logout"
            >
              <FiLogOut />
            </button>
          </>
        ) : (
          <button
            onClick={onAuthClick}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-medium transition-all text-xs xs:text-sm"
          >
            Sign In
          </button>
        )}
        <button
          aria-label="toggle weather"
          onClick={onToggleSnow}
          className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition"
          title="Toggle weather effects"
        >
          {showSnow ? <FiMoon /> : <FiSun />}
        </button>
      </div>

    </header>
  )
}

