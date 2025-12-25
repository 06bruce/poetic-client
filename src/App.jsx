import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import Header from './components/Header'
import PoemGenerator from './components/PoemGenerator'
import PoemList from './components/PoemList'
import UserProfile from './components/UserProfile'
import Notifications from './components/Notifications'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import WeatherEffect from './components/WeatherEffect'
import UserSearch from './components/UserSearch'
import TrendingUsers from './components/TrendingUsers'

function MainContent() {
  const [mood, setMood] = useState('neutral')
  const [showWeather, setShowWeather] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const poemListRef = useRef(null)

  function handleToggleWeather() {
    setShowWeather(s => !s)
  }

  const handleAuthSuccess = () => {
    setShowAuth(false)
    setIsSigningUp(true)
    setRefreshTrigger(prev => prev + 1)
  }

  const handlePoemSaved = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const toggleAuthForm = () => {
    setIsSigningUp(!isSigningUp)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Header
        onToggleSnow={handleToggleWeather}
        showSnow={showWeather}
        onAuthClick={() => setShowAuth(true)}
        onNotificationsClick={() => setShowNotifications(true)}
      />
      <main className="max-w-5xl mx-auto">
        {showAuth && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-2xl p-1 max-h-[90vh] overflow-y-auto">
              {isSigningUp ? (
                <SignUp
                  onSuccess={handleAuthSuccess}
                  onToggleForm={toggleAuthForm}
                />
              ) : (
                <SignIn
                  onSuccess={handleAuthSuccess}
                  onToggleForm={toggleAuthForm}
                />
              )}
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-8">
                <UserSearch />
                <PoemGenerator
                  onSave={handlePoemSaved}
                  showAuthForm={() => setShowAuth(true)}
                  setGlobalMood={setMood}
                />
                <PoemList ref={poemListRef} refreshTrigger={refreshTrigger} />
              </div>
              <aside className="hidden lg:block lg:col-span-1 sticky top-24 self-start space-y-6">
                <TrendingUsers />
                <div className="p-4 rounded-xl glass border border-gray-700/50 text-xs text-gray-500">
                  <p>© 2025 Poem Studio</p>
                  <p className="mt-1 italic">"Poetry is the rhythmical creation of beauty in words."</p>
                </div>
              </aside>
            </div>
          } />
          <Route path="/profile/:username" element={<UserProfile />} />
        </Routes>
      </main>
      <Notifications isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      {showWeather && <WeatherEffect mood={mood} />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <AuthProvider>
          <MainContent />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
