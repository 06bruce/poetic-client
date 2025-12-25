import React, { useEffect, useState } from 'react'
import { FiUserPlus, FiLoader } from 'react-icons/fi'
import { userAPI } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'

export default function TrendingUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchTrending()
    }, [])

    const fetchTrending = async () => {
        setLoading(true)
        try {
            const response = await userAPI.getTrending()
            setUsers(response.data)
        } catch (err) {
            console.error('Failed to fetch trending users:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="flex justify-center p-4"><FiLoader className="animate-spin" /></div>
    if (!users.length) return null

    return (
        <div className="bg-gray-800/30 rounded-2xl p-4 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-4">Active Poets</h3>
            <div className="space-y-4">
                {users.map(user => (
                    <div key={user._id} className="flex items-center justify-between group">
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => navigate(`/profile/${user.username}`)}
                        >
                            <Avatar src={user.avatar} alt={user.username} size={32} />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium hover:text-indigo-400 transition">@{user.username}</span>
                                <span className="text-[10px] text-gray-500 truncate max-w-[100px]">{user.bio || 'New poet'}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/profile/${user.username}`)}
                            className="p-1.5 rounded-full bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition"
                        >
                            <FiUserPlus size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
