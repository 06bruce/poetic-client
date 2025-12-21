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
import Snowfall from './components/Snowfall'
import UserSearch from './components/UserSearch'

function MainContent() {
  const [showSnow, setShowSnow] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const poemListRef = useRef(null)

  function handleToggleSnow() {
    setShowSnow(s => !s)
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
        onToggleSnow={handleToggleSnow} 
        showSnow={showSnow}
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
            <>
              <UserSearch />
              <PoemGenerator 
                onSave={handlePoemSaved} 
                showAuthForm={() => setShowAuth(true)}
              />
              <PoemList ref={poemListRef} refreshTrigger={refreshTrigger} />
            </>
          } />
          <Route path="/profile/:username" element={<UserProfile />} />
        </Routes>
      </main>
      <Notifications isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      {showSnow && <Snowfall />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <MainContent />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
