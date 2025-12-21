import React, { useState } from 'react'
import { userAPI } from '../utils/api'
import { toast } from '../contexts/ToastContext'

export default function EditProfileForm({ user, onUpdate }) {
  const [form, setForm] = useState({
    username: user.username || '',
    bio: user.bio || '',
    twitter: user.social?.twitter || '',
    instagram: user.social?.instagram || '',
    website: user.social?.website || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await userAPI.updateProfile({
        username: form.username,
        bio: form.bio,
        social: {
          twitter: form.twitter,
          instagram: form.instagram,
          website: form.website,
        },
      })
      toast.success('Profile updated!')
      onUpdate && onUpdate(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl glass border border-gray-700 mt-4">
      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
          maxLength={32}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={3}
          maxLength={300}
          className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
          placeholder="Tell us about yourself..."
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium">Social Links</label>
        <input
          name="twitter"
          value={form.twitter}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
          placeholder="Twitter URL"
        />
        <input
          name="instagram"
          value={form.instagram}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
          placeholder="Instagram URL"
        />
        <input
          name="website"
          value={form.website}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none"
          placeholder="Website URL"
        />
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-medium text-white"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
