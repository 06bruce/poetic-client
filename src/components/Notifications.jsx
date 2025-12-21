import React, { useEffect, useState } from 'react'
import { FiX, FiLoader, FiAlertCircle, FiHeart } from 'react-icons/fi'
import { userAPI } from '../utils/api'
import { useNavigate } from 'react-router-dom'

export default function Notifications({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await userAPI.getNotifications()
      setNotifications(response.data)
    } catch (err) {
      setError('Failed to load notifications')
      console.error('Notifications fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await userAPI.markNotificationAsRead(notificationId)
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      )
    } catch (err) {
      console.error('Mark as read error:', err)
    }
  }

  const handleNavigateToPoemAuthor = (actorName, notificationId) => {
    handleMarkAsRead(notificationId)
    navigate(`/profile/${actorName}`)
    onClose()
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-full sm:w-96 bg-gray-900 border-l border-gray-700 shadow-2xl transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 xs:p-4 border-b border-gray-700">
            <h2 className="text-lg xs:text-xl font-bold text-white">Notifications</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-md transition"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <FiLoader className="animate-spin text-2xl text-indigo-500" />
              </div>
            ) : error ? (
              <div className="p-4">
                <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/50 flex items-center gap-2 text-red-200">
                  <FiAlertCircle size={18} />
                  {error}
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-center">
                <span className="text-2xl xs:text-3xl mb-2">🔔</span>
                <div className="text-sm xs:text-base">No notifications yet</div>
                <div className="text-xs text-gray-500 mt-1">
                  You’ll see likes and other activity here.
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-800/50 cursor-pointer transition ${
                      !notification.read ? 'bg-gray-800/30' : ''
                    }`}
                    onClick={() =>
                      handleNavigateToPoemAuthor(
                        notification.actorName,
                        notification._id
                      )
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        {notification.type === 'like' && (
                          <FiHeart className="text-pink-500" size={18} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">
                          <span className="font-semibold">
                            {notification.actorName}
                          </span>{' '}
                          liked your poem
                        </p>
                        <p className="text-sm text-indigo-400 truncate">
                          "{notification.poemTitle}"
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
