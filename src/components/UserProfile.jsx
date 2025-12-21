import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiLoader, FiAlertCircle, FiEdit2, FiUserPlus, FiUserCheck, FiUsers } from 'react-icons/fi'
import { userAPI } from '../utils/api'
import PoemCard from './PoemCard'
import EditProfileForm from './EditProfileForm'
import Avatar from './Avatar'
import Badges from './Badges'
import FavoritePoems from './FavoritePoems'
import { useAuth } from '../contexts/AuthContext'

export default function UserProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const { user: authUser, updateUser } = useAuth()
  const [showFavorites, setShowFavorites] = useState(false)
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [username])

  const fetchProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await userAPI.getProfile(username)
      setProfile(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load profile')
      console.error('Profile fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const isOwnProfile = authUser && profile && (authUser.username === profile.user.username)
  const isFollowing = authUser && profile && profile.user.followers?.some(f => f._id === authUser._id)

  const handleProfileUpdate = (newUser) => {
    setProfile((prev) => prev ? { ...prev, user: { ...prev.user, ...newUser } } : prev)
    updateUser && updateUser(newUser)
    setEditing(false)
  }

  const handleFollow = async () => {
    if (!authUser || isOwnProfile) return
    setFollowLoading(true)
    try {
      if (isFollowing) {
        await userAPI.unfollow(user.username)
      } else {
        await userAPI.follow(user.username)
      }
      fetchProfile()
    } catch (e) {}
    setFollowLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] xs:min-h-screen">
        <FiLoader className="animate-spin text-2xl text-indigo-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] xs:min-h-screen p-2 xs:p-4 md:p-8">
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
        >
          <FiArrowLeft /> Back
        </button>
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-500/50 flex items-center gap-2 text-red-200">
          <FiAlertCircle size={18} />
          {error}
        </div>
      </div>
    )
  }

  if (!profile) return null

  const { user, poems, poemCount } = profile

  return (
    <div className="min-h-[60vh] xs:min-h-screen p-2 xs:p-4 md:p-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition"
      >
        <FiArrowLeft /> Back to Poems
      </button>

      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8 p-4 xs:p-6 rounded-xl glass border border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="flex flex-col items-center gap-2">
              <Avatar src={user.avatar} alt={user.username} size={80} />
              {isOwnProfile && !editing && (
                <label className="text-xs text-indigo-300 cursor-pointer hover:underline">
                  Change Avatar
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                    const file = e.target.files[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = async ev => {
                      await userAPI.updateProfile({ avatar: ev.target.result })
                      fetchProfile()
                    }
                    reader.readAsDataURL(file)
                  }} />
                </label>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl xs:text-3xl font-bold text-white break-words">@{user.username}</h1>
                {isOwnProfile && !editing && (
                  <button
                    className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 text-indigo-300 flex items-center gap-1"
                    onClick={() => setEditing(true)}
                    title="Edit profile"
                  >
                    <FiEdit2 /> Edit
                  </button>
                )}
                {!isOwnProfile && authUser && (
                  <button
                    className={`p-2 rounded-md border flex items-center gap-1 ${isFollowing ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-gray-800 border-gray-700 text-indigo-300 hover:bg-gray-700'}`}
                    onClick={handleFollow}
                    disabled={followLoading}
                    title={isFollowing ? 'Unfollow' : 'Follow'}
                  >
                    {isFollowing ? <FiUserCheck /> : <FiUserPlus />}
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
              <Badges badges={user.badges} />
              {user.pinnedPoem && (
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-indigo-300 mb-1">Pinned Poem</h4>
                  <PoemCard poem={user.pinnedPoem} isReadOnly />
                </div>
              )}
              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                <button className="hover:underline" onClick={() => setShowFollowers(true)}>
                  <FiUsers className="inline mr-1" /> {user.followers?.length || 0} Followers
                </button>
                <button className="hover:underline" onClick={() => setShowFollowing(true)}>
                  {user.following?.length || 0} Following
                </button>
              </div>
              <p className="mt-2 text-gray-400 text-xs xs:text-sm">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
              {user.bio && (
                <div className="mt-2 text-sm text-gray-200 whitespace-pre-line">{user.bio}</div>
              )}
              {(user.social?.twitter || user.social?.instagram || user.social?.website) && (
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  {user.social?.twitter && <a href={user.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Twitter</a>}
                  {user.social?.instagram && <a href={user.social.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">Instagram</a>}
                  {user.social?.website && <a href={user.social.website} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">Website</a>}
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3 xs:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl xs:text-2xl font-bold text-indigo-400">{poemCount}</span>
                  <span className="text-gray-400">Poem{poemCount !== 1 ? 's' : ''}</span>
                </div>
                {user.favoritePoems && user.favoritePoems.length > 0 && (
                  <button className="ml-2 px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-indigo-300" onClick={() => setShowFavorites(v => !v)}>
                    {showFavorites ? 'Hide' : 'Show'} Favorites
                  </button>
                )}
                {isOwnProfile && (
                  <label className="ml-2 flex items-center gap-1 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={user.notifyOnFollowedPoem}
                      onChange={async e => {
                        await userAPI.updateProfile({ notifyOnFollowedPoem: e.target.checked })
                        fetchProfile()
                      }}
                    />
                    Notify followers when I publish
                  </label>
                )}
              </div>
              {isOwnProfile && editing && (
                <EditProfileForm user={user} onUpdate={handleProfileUpdate} />
              )}
            </div>
          </div>
          {/* Followers Modal */}
          {showFollowers && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setShowFollowers(false)}>
              <div className="bg-gray-900 rounded-xl p-6 max-w-xs w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-3">Followers</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {(user.followers?.length ? user.followers : []).map(f => (
                    <div key={f._id} className="flex items-center gap-2">
                      <Avatar src={f.avatar} alt={f.username} size={32} />
                      <span className="text-indigo-300">@{f.username}</span>
                    </div>
                  ))}
                  {(!user.followers || user.followers.length === 0) && <div className="text-gray-400">No followers yet.</div>}
                </div>
                <button className="mt-4 px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-sm" onClick={() => setShowFollowers(false)}>Close</button>
              </div>
            </div>
          )}
          {/* Following Modal */}
          {showFollowing && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setShowFollowing(false)}>
              <div className="bg-gray-900 rounded-xl p-6 max-w-xs w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-3">Following</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {(user.following?.length ? user.following : []).map(f => (
                    <div key={f._id} className="flex items-center gap-2">
                      <Avatar src={f.avatar} alt={f.username} size={32} />
                      <span className="text-indigo-300">@{f.username}</span>
                    </div>
                  ))}
                  {(!user.following || user.following.length === 0) && <div className="text-gray-400">Not following anyone yet.</div>}
                </div>
                <button className="mt-4 px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-sm" onClick={() => setShowFollowing(false)}>Close</button>
              </div>
            </div>
          )}
        </div>

        {/* Favorite Poems */}
        {showFavorites && user.favoritePoems && (
          <FavoritePoems poems={user.favoritePoems} />
        )}
        {/* User's Poems */}
        <div>
          <h2 className="text-xl xs:text-2xl font-bold text-white mb-4">Poems by {user.username}</h2>
          {poems.length === 0 ? (
            <div className="p-6 xs:p-8 rounded-xl glass text-center text-gray-400">
              <h4 className="text-base xs:text-lg font-medium mb-2">No poems yet</h4>
              <p className="text-xs xs:text-base">{user.username} hasn’t shared any poetry yet. Check back soon or explore other poets!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {poems.map((poem) => (
                <div key={poem._id} className="relative">
                  <PoemCard poem={poem}
                    extraActions={isOwnProfile ? (
                      <>
                        <button
                          className="px-2 py-1 rounded bg-indigo-700 text-xs text-white mr-2"
                          onClick={async () => { await userAPI.pinPoem(poem._id); fetchProfile(); }}
                          disabled={user.pinnedPoem && user.pinnedPoem._id === poem._id}
                        >
                          {user.pinnedPoem && user.pinnedPoem._id === poem._id ? 'Pinned' : 'Pin'}
                        </button>
                        <button
                          className="px-2 py-1 rounded bg-pink-700 text-xs text-white"
                          onClick={async () => { await userAPI.favoritePoem(poem._id); fetchProfile(); }}
                          disabled={user.favoritePoems && user.favoritePoems.some(p => p._id === poem._id)}
                        >
                          {user.favoritePoems && user.favoritePoems.some(p => p._id === poem._id) ? 'Favorited' : 'Favorite'}
                        </button>
                      </>
                    ) : null}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
